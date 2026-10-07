import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9229;

const p = spawn(chromePath, [
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
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await new Promise((r) => setTimeout(r, 2000));

  // Scroll to step 2 (progress 0.33)
  const evalResult = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.getElementById('prozess');
        const total = el.offsetHeight - window.innerHeight;
        const box = el.getBoundingClientRect();
        const currentScroll = window.scrollY;
        const elAbsoluteTop = box.top + currentScroll;
        const target = elAbsoluteTop + total * 0.33;
        window.scrollTo({ top: target, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
        return {
          target,
          scrollY: window.scrollY,
          boxTop: el.getBoundingClientRect().top,
          totalDistance: total,
          calculatedP: -el.getBoundingClientRect().top / total,
        };
      })()
    `,
    returnByValue: true,
  });

  console.log('Immediate evaluate:', evalResult.result.value);

  // Wait 1 second and inspect what React rendered
  await new Promise((r) => setTimeout(r, 1000));

  const afterWait = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const texts = Array.from(document.querySelectorAll('.process-step-text')).map((el, i) => ({
          idx: i,
          title: el.querySelector('.step-label-title')?.innerText,
          opacity: window.getComputedStyle(el).opacity,
          transform: window.getComputedStyle(el).transform,
          display: window.getComputedStyle(el).display,
        }));
        const activeNav = document.querySelector('.process-progress-item--active .progress-label')?.innerText;
        return { texts, activeNav };
      })()
    `,
    returnByValue: true,
  });

  console.log('After wait React state:', JSON.stringify(afterWait.result.value, null, 2));

} finally {
  p.kill();
}
