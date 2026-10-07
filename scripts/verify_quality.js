import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9236;

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

  // Desktop viewport 1440x900
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await new Promise((r) => setTimeout(r, 2000));

  // Scroll into #qualitaet
  const scrollRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.getElementById('qualitaet');
        if (!el) return null;
        el.scrollIntoView({ behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
        return {
          scrollY: window.scrollY,
          top: el.getBoundingClientRect().top,
          height: el.offsetHeight
        };
      })()
    `,
    returnByValue: true,
  });

  console.log('Scrolled to Quality:', scrollRes.result.value);

  // Wait for entrance animations and images
  await new Promise((r) => setTimeout(r, 1500));

  // Capture desktop screenshot
  const shotDesktop = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
  fs.writeFileSync('screenshot_quality_desktop.jpg', Buffer.from(shotDesktop.data, 'base64'));
  console.log('Saved screenshot_quality_desktop.jpg');

  // Switch to mobile viewport (390 x 844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.getElementById('qualitaet');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      })()
    `,
  });

  await new Promise((r) => setTimeout(r, 1200));

  const shotMobile = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
  fs.writeFileSync('screenshot_quality_mobile.jpg', Buffer.from(shotMobile.data, 'base64'));
  console.log('Saved screenshot_quality_mobile.jpg');

} finally {
  chromeProc.kill();
}
