import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9223;

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

  if (!pageTab) {
    console.log('No page tab found');
    process.exit(1);
  }

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  await new Promise((resolve) => {
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
      setTimeout(resolve, 1000);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.method === 'Runtime.exceptionThrown') {
        console.error('EXCEPTION THROWN:', JSON.stringify(data.params.exceptionDetails, null, 2));
      }
      if (data.method === 'Runtime.consoleAPICalled') {
        console.log('CONSOLE:', data.params.type, data.params.args.map((a) => a.value || a.description).join(' '));
      }
    };
  });

  // Evaluate document.getElementById('root').innerHTML
  await new Promise((resolve) => {
    ws.send(
      JSON.stringify({
        id: 4,
        method: 'Runtime.evaluate',
        params: { expression: "document.getElementById('root').innerHTML.length" },
      })
    );
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 4) {
        console.log('Root innerHTML length:', data.result.result.value);
        resolve();
      }
    };
    ws.addEventListener('message', handler);
  });
} finally {
  chromeProc.kill();
}
