import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9230;

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

  await new Promise((r) => setTimeout(r, 1500));

  const resVal = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const prozess = document.getElementById("prozess");
        const sticky = document.querySelector(".process-sticky-stage");
        const box = prozess.getBoundingClientRect();
        const prozessTop = box.top + window.scrollY;
        
        window.scrollTo({ top: prozessTop + 500, behavior: "instant" });
        window.dispatchEvent(new Event("scroll"));
        
        const stickyRect = sticky.getBoundingClientRect();
        const prozessRect = prozess.getBoundingClientRect();
        
        return {
          prozessTop,
          scrollY: window.scrollY,
          stickyTop: stickyRect.top,
          prozessRectTop: prozessRect.top,
          isStickyPinned: stickyRect.top === 0
        };
      })()
    `,
    returnByValue: true,
  });

  console.log('Sticky check:', resVal.result.value);
} finally {
  p.kill();
}
