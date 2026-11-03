import http from 'http';
import { spawn } from 'child_process';
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getWsUrl(port = 9222) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://127.0.0.1:${port}/json`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const targets = JSON.parse(data);
          const pageTarget = targets.find((t) => t.type === 'page');
          if (pageTarget && pageTarget.webSocketDebuggerUrl) {
            resolve(pageTarget.webSocketDebuggerUrl);
          } else {
            reject(new Error('No page target found'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

async function runDiagnostic() {
  console.log('=== STARTING BROWSER CRASH DIAGNOSTIC ===');

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const cdpPort = 9225;

  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${cdpPort}`,
    '--headless=new',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:3000',
  ]);

  await wait(2500);

  let wsUrl;
  for (let i = 0; i < 10; i++) {
    try {
      wsUrl = await getWsUrl(cdpPort);
      if (wsUrl) break;
    } catch {
      await wait(500);
    }
  }

  if (!wsUrl) {
    console.error('Could not get WS debugger URL');
    edgeProc.kill();
    process.exit(1);
  }

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  let msgId = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      const args = msg.params.args.map((a) => a.value || a.description || JSON.stringify(a)).join(' ');
      console.log(`[Browser Console ${msg.params.type}]:`, args);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[Browser Exception]:', JSON.stringify(msg.params.exceptionDetails, null, 2));
    }

    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      cb(msg);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Runtime.enable');
  await send('Page.enable');

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.result?.value;
  }

  console.log('1. Page loaded. Checking initial status...');
  await wait(2000);

  const title = await evaluate('document.title');
  console.log('Title:', title);

  console.log('2. Reproducing step: Creating/Posting Healthcare Linen scenario...');
  // Click "Post Material to Passport"
  await evaluate(`(() => {
    const postBtn = Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.includes('Post Material to Passport') || b.textContent.includes('Post Material')
    );
    if (postBtn) {
      console.log('Clicked postBtn:', postBtn.textContent);
      postBtn.click();
    } else {
      console.log('Post button not found!');
    }
  })()`);
  await wait(1000);

  // Fill form as in capture script
  console.log('3. Filling form inputs...');
  await evaluate(`(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const streamSelect = selects.find(s => Array.from(s.options).some(o => o.value === 'MED'));
    if (streamSelect) {
      console.log('Selecting MED stream');
      streamSelect.value = 'MED';
      streamSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const nameInput = document.querySelector('input[placeholder*="Material name"], input#material-name') || document.querySelectorAll('input[type="text"]')[0];
    if (nameInput) {
      nameInput.value = 'Hospital Isolation Ward Cotton Linen';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    const contamInput = Array.from(document.querySelectorAll('input[type="text"]')).find(i =>
      i.name === 'contamination' || i.placeholder?.toLowerCase().includes('contamination') || i.value?.includes('clean')
    );
    if (contamInput) {
      contamInput.value = 'Potentially infectious biological pathogens from fever ward';
      contamInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    const hazardCheck = document.querySelector('input[type="checkbox"]#is-hazardous') || Array.from(document.querySelectorAll('input[type="checkbox"]')).find(c => c.labels?.[0]?.textContent?.includes('Hazardous'));
    if (hazardCheck && !hazardCheck.checked) {
      hazardCheck.click();
    }

    console.log('Submitting form...');
    const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Save to Passport') || b.textContent.includes('Create Passport'));
    if (saveBtn) {
      console.log('Found saveBtn:', saveBtn.textContent);
      saveBtn.click();
    } else {
      console.log('Save button not found!');
    }
  })()`);

  await wait(2000);

  // Check if error overlay is present
  const bodyText = await evaluate('document.body.innerText');
  if (bodyText.includes('Application error') || bodyText.includes('client-side exception')) {
    console.error('*** CLIENT-SIDE EXCEPTION REPRODUCED! ***');
    console.log('Body Text snippet:', bodyText.slice(0, 300));
  } else {
    console.log('No client-side exception text in body. Length:', bodyText.length);
  }

  ws.close();
  edgeProc.kill();
  console.log('Diagnostic finished.');
}

runDiagnostic().catch(console.error);
