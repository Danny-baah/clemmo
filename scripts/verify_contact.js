import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9240;

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

  // Find scroll position of #kontakt
  const evalResult = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.getElementById('kontakt');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        window.scrollTo({ top: top, behavior: 'instant' });
        return { scrollY: window.scrollY, top: rect.top, height: rect.height };
      })()
    `,
    returnByValue: true,
  });

  console.log('Scrolled to Contact:', evalResult.value);
  await new Promise((r) => setTimeout(r, 1200));

  // Capture desktop screenshot of main contact area
  const snapDesktop1 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
  fs.writeFileSync('screenshot_contact_desktop_top.jpg', Buffer.from(snapDesktop1.data, 'base64'));
  console.log('Saved screenshot_contact_desktop_top.jpg');

  // Scroll down to location panel & final CTA
  await send('Runtime.evaluate', {
    expression: `window.scrollBy({ top: 1200, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 800));

  const snapDesktop2 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
  fs.writeFileSync('screenshot_contact_desktop_cta.jpg', Buffer.from(snapDesktop2.data, 'base64'));
  console.log('Saved screenshot_contact_desktop_cta.jpg');

  // Switch to mobile viewport (390x844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await new Promise((r) => setTimeout(r, 500));

  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.getElementById('kontakt');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      })()
    `,
  });
  await new Promise((r) => setTimeout(r, 1000));

  const snapMobile = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
  fs.writeFileSync('screenshot_contact_mobile.jpg', Buffer.from(snapMobile.data, 'base64'));
  console.log('Saved screenshot_contact_mobile.jpg');

  ws.close();
} catch (e) {
  console.error('Error during verification:', e);
} finally {
  chromeProc.kill();
  process.exit(0);
}
