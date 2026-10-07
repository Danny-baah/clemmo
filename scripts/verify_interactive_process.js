import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9231;

const chromeProc = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  'http://localhost:5174/',
]);

await new Promise((r) => setTimeout(r, 1500));

try {
  const res = await fetch(`http://127.0.0.1:${port}/json`);
  const tabs = await res.json();
  const pageTab = tabs.find((t) => t.type === 'page');

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await new Promise((r) => (ws.onopen = r));

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await new Promise((r) => setTimeout(r, 2000));

  async function scrollToProgressAndInspect(p, filename) {
    const expr = `
      (() => {
        const el = document.getElementById('prozess');
        const total = el.offsetHeight - window.innerHeight;
        const box = el.getBoundingClientRect();
        const currentScroll = window.scrollY;
        const elAbsoluteTop = box.top + currentScroll;
        const target = elAbsoluteTop + total * ${p};
        window.scrollTo({ top: target, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
        return { target, total, scrollY: window.scrollY };
      })()
    `;
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    
    // Wait 400ms for rAF lerp loop to smoothly complete
    await new Promise((r) => setTimeout(r, 600));

    // Inspect active state and opacities
    const domState = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const texts = Array.from(document.querySelectorAll('.process-step-text')).map((el, i) => ({
            idx: i,
            opacity: parseFloat(window.getComputedStyle(el).opacity).toFixed(2),
            transform: window.getComputedStyle(el).transform,
          }));
          const visuals = Array.from(document.querySelectorAll('.process-visual-item')).map((el, i) => ({
            idx: i,
            opacity: parseFloat(window.getComputedStyle(el).opacity).toFixed(2),
          }));
          const activeNav = document.querySelector('.process-progress-item--active .progress-label')?.innerText;
          const trackWidth = document.querySelector('.progress-track-fill')?.style.width;
          const completionOpacity = document.querySelector('.process-completion-bar') ?
            parseFloat(window.getComputedStyle(document.querySelector('.process-completion-bar')).opacity).toFixed(2) : null;
          return { texts, visuals, activeNav, trackWidth, completionOpacity };
        })()
      `,
      returnByValue: true,
    });

    console.log(`\n=== Milestone p=${p} (${filename}) ===`);
    console.log(JSON.stringify(domState.result.value, null, 2));

    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(filename, Buffer.from(shot.data, 'base64'));
  }

  // 1. Forward scrolling: Step 01 (p = 0.05)
  await scrollToProgressAndInspect(0.05, 'shot_interactive_step1.jpg');

  // 2. Forward scrolling: Step 02 (p = 0.35)
  await scrollToProgressAndInspect(0.35, 'shot_interactive_step2.jpg');

  // 3. Forward scrolling: Step 03 (p = 0.60)
  await scrollToProgressAndInspect(0.60, 'shot_interactive_step3.jpg');

  // 4. Forward scrolling: Step 04 (p = 0.85)
  await scrollToProgressAndInspect(0.85, 'shot_interactive_step4.jpg');

  // 5. Completion banner (p = 0.96)
  await scrollToProgressAndInspect(0.96, 'shot_interactive_complete.jpg');

  // 6. REVERSE SCROLLING: Scroll back up to Step 02 (p = 0.35)
  await scrollToProgressAndInspect(0.35, 'shot_interactive_reverse_step2.jpg');

  // 7. REVERSE SCROLLING: Scroll back up to Step 01 (p = 0.05)
  await scrollToProgressAndInspect(0.05, 'shot_interactive_reverse_step1.jpg');

  console.log('\nAll interactive checks completed successfully!');
} finally {
  chromeProc.kill();
}
