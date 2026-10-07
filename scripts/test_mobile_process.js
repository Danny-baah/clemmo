import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9235;

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

  // Mobile viewport: 390 x 844
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await new Promise((r) => setTimeout(r, 1500));

  async function snapMobile(p, filename) {
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
      })()
    `;
    await send('Runtime.evaluate', { expression: expr });
    await new Promise((r) => setTimeout(r, 600));
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(filename, Buffer.from(shot.data, 'base64'));
  }

  await snapMobile(0.05, 'shot_mobile_step1.jpg');
  await snapMobile(0.35, 'shot_mobile_step2.jpg');
  console.log('Mobile screenshots captured successfully!');
} finally {
  chromeProc.kill();
}
