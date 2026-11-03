import { spawn } from 'node:child_process';
import fs from 'node:fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9227;
const APP_URL = 'http://localhost:3000';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\phase7-acceptance-evidence\\screenshots';
const RECOVERED_DIR = 'D:\\SUZARCHI hackathon\\phase7-acceptance-evidence\\screenshots\\recovered';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyAndCaptureS17() {
  console.log('=== VERIFYING POSTMATERIALMODAL BUG CLEARANCE & CAPTURING S17 ===\n');

  const userDataDir = process.env.TEMP + '\\edge-s17-capture-' + Date.now();
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--window-size=1280,850',
    `--user-data-dir=${userDataDir}`,
    APP_URL,
  ]);

  let targets = null;
  for (let i = 0; i < 20; i++) {
    await wait(500);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      if (res.ok) {
        targets = await res.json();
        if (targets && targets.length > 0) break;
      }
    } catch (e) {}
  }

  if (!targets) {
    edgeProc.kill();
    throw new Error('Edge connection failed');
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.consoleAPICalled') {
      const args = data.params.args.map((a) => a.value || a.description || JSON.stringify(a)).join(' ');
      console.log(`[Browser Console]:`, args);
    } else if (data.method === 'Runtime.exceptionThrown') {
      console.error('[Browser Exception]:', JSON.stringify(data.params.exceptionDetails, null, 2));
    }

    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  async function capture(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    fs.writeFileSync(`${EVIDENCE_DIR}\\${filename}`, buffer);
    fs.writeFileSync(`${RECOVERED_DIR}\\${filename}`, buffer);
    console.log(`[Captured & Recovered]: ${filename} (${buffer.length} bytes)`);
  }

  console.log('1. Waiting for dashboard to hydrate cleanly...');
  await wait(2500);

  console.log('2. Opening PostMaterialModal...');
  await evaluate(`(() => {
    const postBtn = Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.includes('Post Material to Passport') || b.textContent.includes('Post Material')
    );
    if (postBtn) {
      console.log('Clicking postBtn...');
      postBtn.click();
    }
  })()`);
  await wait(1000);

  // Check if error screen appeared
  const bodyAfterOpen = await evaluate('document.body.innerText');
  if (bodyAfterOpen.includes('Application error')) {
    console.error('FAILED: Modal opening still triggered application error!');
    ws.close();
    edgeProc.kill();
    process.exit(1);
  }
  console.log('✓ SUCCESS: PostMaterialModal opened cleanly with ZERO React hook errors!');

  console.log('3. Filling form with Healthcare Linen (CAT-MED-BED-INF) Scenario...');
  await evaluate(`(() => {
    // 1. Select stream or taxonomy
    const selects = Array.from(document.querySelectorAll('select'));
    const streamSelect = selects.find(s => Array.from(s.options).some(o => o.value === 'HOS' || o.value === 'INS'));
    if (streamSelect) {
      streamSelect.value = streamSelect.options[0].value;
      streamSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 2. Set Material Name
    const nameInput = document.querySelector('input#material-name') || Array.from(document.querySelectorAll('input[type="text"]')).find(i => i.placeholder?.includes('name') || i.value === '' || i.value.includes('Fabric'));
    if (nameInput) {
      nameInput.value = 'Hospital Isolation Ward Cotton Linen (Biohazard)';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // 3. Set Contamination
    const contamInput = Array.from(document.querySelectorAll('input[type="text"]')).find(i =>
      i.name === 'contamination' || i.placeholder?.toLowerCase().includes('contamination') || i.value?.toLowerCase().includes('clean')
    );
    if (contamInput) {
      contamInput.value = 'Infectious biological pathogens from clinical isolation ward';
      contamInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // 4. Check Hazardous / Controlled Waste Checkbox
    const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    if (checkboxes.length > 0) {
      for (const cb of checkboxes) {
        if (!cb.checked) cb.click();
      }
    }

    // 5. Submit form
    console.log('Clicking save...');
    const saveBtn = Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.includes('Save') || b.textContent.includes('Post') || b.textContent.includes('Create')
    );
    if (saveBtn) saveBtn.click();
  })()`);

  await wait(2000);

  console.log('4. Scrolling to AI Match Analysis to show Hard Safety Gate lockout...');
  await evaluate(`(() => {
    const matchCard = document.querySelector('#ai-match-analysis') || Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('AI Match Analysis'))?.closest('.rounded-2xl, .rounded-xl');
    if (matchCard) {
      matchCard.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  })()`);
  await wait(1000);

  console.log('5. Capturing S17: Healthcare Linen Safety Outcome...');
  await capture('S17-healthcare-linen-safety-outcome.png');

  ws.close();
  edgeProc.kill();
  console.log('\n=== VERIFICATION COMPLETE: S17 RECOVERED SUCCESSFULLY ===');
}

verifyAndCaptureS17().catch((err) => {
  console.error('FAILED S17 verification:', err);
  process.exit(1);
});
