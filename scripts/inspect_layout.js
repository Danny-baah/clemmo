import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9226;

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

  const evalExpr = (expression) =>
    new Promise((resolve) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          resolve(data.result?.result?.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression } }));
    });

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  const debugInfo = await evalExpr(`
    JSON.stringify({
      scrollY: window.scrollY,
      header: document.querySelector('.hero-header') ? {
        display: getComputedStyle(document.querySelector('.hero-header')).display,
        visibility: getComputedStyle(document.querySelector('.hero-header')).visibility,
        opacity: getComputedStyle(document.querySelector('.hero-header')).opacity,
        zIndex: getComputedStyle(document.querySelector('.hero-header')).zIndex,
        rect: document.querySelector('.hero-header').getBoundingClientRect()
      } : null,
      canvas: document.querySelector('.hero-canvas') ? {
        width: document.querySelector('.hero-canvas').width,
        height: document.querySelector('.hero-canvas').height,
        rect: document.querySelector('.hero-canvas').getBoundingClientRect()
      } : null,
      heroText: document.querySelector('.hero-text-overlay') ? {
        rect: document.querySelector('.hero-text-overlay').getBoundingClientRect(),
        initBlock: document.querySelector('.hero-text-block--initial') ? {
          opacity: getComputedStyle(document.querySelector('.hero-text-block--initial')).opacity,
          transform: getComputedStyle(document.querySelector('.hero-text-block--initial')).transform,
          rect: document.querySelector('.hero-text-block--initial').getBoundingClientRect()
        } : null
      } : null,
      about: document.querySelector('.about-section') ? {
        rect: document.querySelector('.about-section').getBoundingClientRect(),
        zIndex: getComputedStyle(document.querySelector('.about-section')).zIndex
      } : null
    }, null, 2)
  `);

  console.log('DEBUG INFO:');
  console.log(debugInfo);
} finally {
  chromeProc.kill();
}
