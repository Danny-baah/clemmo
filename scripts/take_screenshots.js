import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9224;

const chromeProc = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=1440,900',
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

  // Wait for frame 0 and fonts to load
  await new Promise((r) => setTimeout(r, 2500));

  // 1. Initial Hero screenshot
  const shot1 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
  fs.writeFileSync('screenshot_01_hero.jpg', Buffer.from(shot1.data, 'base64'));
  console.log('Saved screenshot_01_hero.jpg');

  // 2. Scroll into About section
  await send('Runtime.evaluate', { expression: 'document.getElementById("ueber-uns").scrollIntoView({ behavior: "instant" })' });
  await new Promise((r) => setTimeout(r, 1200));
  const shot2 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
  fs.writeFileSync('screenshot_02_about.jpg', Buffer.from(shot2.data, 'base64'));
  console.log('Saved screenshot_02_about.jpg');

  // 3. Scroll into Products section
  await send('Runtime.evaluate', { expression: 'document.getElementById("produkte").scrollIntoView({ behavior: "instant" })' });
  await new Promise((r) => setTimeout(r, 1200));
  const shot3 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
  fs.writeFileSync('screenshot_03_products.jpg', Buffer.from(shot3.data, 'base64'));
  console.log('Saved screenshot_03_products.jpg');
} finally {
  chromeProc.kill();
}
