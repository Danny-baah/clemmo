import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9234;

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

  await new Promise((r) => (ws.onopen = r));
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  ws.addEventListener('message', (evt) => {
    const data = JSON.parse(evt.data);
    if (data.method === 'Runtime.consoleAPICalled') {
      console.log('[BROWSER CONSOLE]', ...data.params.args.map((a) => a.value));
    }
  });

  // Wait for React to mount and #prozess to exist
  await send('Runtime.evaluate', {
    expression: `
      new Promise((resolve) => {
        const check = () => {
          if (document.getElementById('prozess')) resolve(true);
          else setTimeout(check, 100);
        };
        check();
      })
    `,
    awaitPromise: true,
  });

  // In Chrome, let's inject a scroll and log what happens
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        try {
          console.log('--- Triggering test scroll ---');
          const el = document.getElementById('prozess');
          const total = el.offsetHeight - window.innerHeight;
          const box = el.getBoundingClientRect();
          const currentScroll = window.scrollY;
          const elAbsoluteTop = box.top + currentScroll;
          const target = elAbsoluteTop + total * 0.35;
          console.log('Calculated target:', target);
          
          window.scrollTo({ top: target, behavior: 'instant' });
          console.log('Scrolled to:', window.scrollY, 'boxTop:', el.getBoundingClientRect().top);
          window.dispatchEvent(new Event('scroll'));
        } catch (err) {
          console.error('ERROR during scroll test:', err.message, err.stack);
        }
      })()
    `,
  });

  await new Promise((r) => setTimeout(r, 1000));
} finally {
  p.kill();
}
