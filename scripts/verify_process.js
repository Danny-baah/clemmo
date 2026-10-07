import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9228;

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

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  // Set desktop viewport 1440x900
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Wait for initial load
  await new Promise((r) => setTimeout(r, 2000));

  // Function to evaluate scroll progress on #prozess
  async function scrollToProcessMilestone(p, filename) {
    const expr = `
      (() => {
        const el = document.getElementById('prozess');
        if (!el) return null;
        const total = el.offsetHeight - window.innerHeight;
        const box = el.getBoundingClientRect();
        const currentScroll = window.scrollY || window.pageYOffset;
        const elAbsoluteTop = box.top + currentScroll;
        const target = elAbsoluteTop + total * ${p};
        window.scrollTo({ top: target, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
        return { total, target, currentScroll: window.scrollY, boxTop: el.getBoundingClientRect().top };
      })()
    `;
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    console.log(`Scrolled to progress ${p}:`, res.result?.value);
    
    // Wait for rAF and DOM update
    await new Promise((r) => setTimeout(r, 1500));

    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(filename, Buffer.from(shot.data, 'base64'));
    console.log(`Saved ${filename}`);
  }

  // 1. Step 01: Idee & Konzept (progress 0.05)
  await scrollToProcessMilestone(0.05, 'screenshot_process_01_idee.jpg');

  // 2. Step 02: Design & Entwicklung (progress 0.33)
  await scrollToProcessMilestone(0.33, 'screenshot_process_02_design.jpg');

  // 3. Step 03: Produktion (progress 0.58)
  await scrollToProcessMilestone(0.58, 'screenshot_process_03_produktion.jpg');

  // 4. Step 04: Lieferung & Support (progress 0.82)
  await scrollToProcessMilestone(0.82, 'screenshot_process_04_lieferung.jpg');

  // 5. Completion State (progress 0.96)
  await scrollToProcessMilestone(0.96, 'screenshot_process_05_complete.jpg');

} finally {
  chromeProc.kill();
}
