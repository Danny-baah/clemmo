import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9245;

const chromeProc = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  'http://localhost:5174/',
]);

await new Promise((r) => setTimeout(r, 1800));

try {
  const res = await fetch(`http://127.0.0.1:${port}/json`);
  const tabs = await res.json();
  const pageTab = tabs.find((t) => t.type === 'page');

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await new Promise((r) => (ws.onopen = r));

  // Set desktop viewport 1440x900
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await new Promise((r) => setTimeout(r, 1000));

  // Scroll to footer CTA banner
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector('.footer-cta-banner');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      })()
    `,
  });

  await new Promise((r) => setTimeout(r, 1200));

  const snap1 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
  fs.writeFileSync('screenshot_footer_cta.jpg', Buffer.from(snap1.data, 'base64'));
  console.log('Saved screenshot_footer_cta.jpg');

  // Scroll to main footer columns
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector('.footer-main-container');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      })()
    `,
  });

  await new Promise((r) => setTimeout(r, 800));

  const snap2 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
  fs.writeFileSync('screenshot_footer_main.jpg', Buffer.from(snap2.data, 'base64'));
  console.log('Saved screenshot_footer_main.jpg');

  ws.close();
} catch (e) {
  console.error('Error during footer verification:', e);
} finally {
  chromeProc.kill();
  process.exit(0);
}
