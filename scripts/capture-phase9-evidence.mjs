import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9231;
const APP_URL = 'http://localhost:3000';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\phase9-acceptance-evidence\\screenshots';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function capturePhase9Evidence() {
  console.log('=== STARTING PHASE 9 ENTERPRISE EVIDENCE CAPTURE ===\n');

  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  }

  const userDataDir = process.env.TEMP + '\\edge-p9-' + Date.now();
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--window-size=1366,900',
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
    } catch {}
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
    if (data.id && pending.has(data.id)) {
      const resolve = pending.get(data.id);
      pending.delete(data.id);
      resolve(data.result);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res && res.result ? res.result.value : null;
  }

  async function screenshot(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(EVIDENCE_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
  }

  await send('Page.enable');
  await send('DOM.enable');
  await wait(3000);

  // 1. Navigate to Scope 3 GHG Accounting View
  console.log('\n--- Step 1: Navigating to Scope 3 GHG Accounting View ---');
  await evaluate(`
    const navButtons = Array.from(document.querySelectorAll('aside button, aside div[role="button"], aside a'));
    const scopeBtn = navButtons.find(b => b.textContent.includes('Scope 3') || b.textContent.includes('கார்பன்'));
    if (scopeBtn) scopeBtn.click();
  `);
  await wait(1500);
  await screenshot('P9-01-scope3-ghg-accounting-dashboard.png');

  // 2. Open Scope 3 Verification Certificate Modal
  console.log('\n--- Step 2: Opening Scope 3 Verification Certificate Modal ---');
  await evaluate(`
    const certBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Certificate'));
    if (certBtn) certBtn.click();
  `);
  await wait(1000);
  await screenshot('P9-02-scope3-verification-certificate.png');

  // Close Certificate Modal
  await evaluate(`
    const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Close' || b.textContent.trim() === '✕');
    if (closeBtn) closeBtn.click();
  `);
  await wait(800);

  // 3. Navigate to B2B Escrow & Settlement View
  console.log('\n--- Step 3: Navigating to B2B Escrow & Commercial Settlement View ---');
  await evaluate(`
    const navButtons = Array.from(document.querySelectorAll('aside button, aside div[role="button"], aside a'));
    const escrowBtn = navButtons.find(b => b.textContent.includes('B2B Escrow') || b.textContent.includes('எஸ்க்ரோ'));
    if (escrowBtn) escrowBtn.click();
  `);
  await wait(1500);
  await screenshot('P9-03-b2b-escrow-commercial-settlement.png');

  // 4. Progress Lab QC Inspection and Release Escrow Funds
  console.log('\n--- Step 4: Signing Off Lab QC Inspection and Releasing Escrow Funds ---');
  await evaluate(`
    const qcBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sign Off Lab QC'));
    if (qcBtn) qcBtn.click();
  `);
  await wait(800);
  await evaluate(`
    const releaseBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Release Escrow Funds'));
    if (releaseBtn) releaseBtn.click();
  `);
  await wait(1200);
  await screenshot('P9-04-b2b-escrow-settled-funds-released.png');

  // 5. Navigate to Recycler Clearinghouse View
  console.log('\n--- Step 5: Navigating to International Recycler Federation Clearinghouse ---');
  await evaluate(`
    const navButtons = Array.from(document.querySelectorAll('aside button, aside div[role="button"], aside a'));
    const clearBtn = navButtons.find(b => b.textContent.includes('Recycler Clearinghouse') || b.textContent.includes('கூட்டமைப்பு'));
    if (clearBtn) clearBtn.click();
  `);
  await wait(1500);
  await screenshot('P9-05-recycler-clearinghouse-5-continents.png');

  // 6. Open Credentials Dossier Modal on European Recycler (Prato Cluster)
  console.log('\n--- Step 6: Opening Recycler Credentials Dossier (Prato Cluster GRS/OEKO-TEX) ---');
  await evaluate(`
    const inspectBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Inspect Credentials'));
    if (inspectBtn) inspectBtn.click();
  `);
  await wait(1000);
  await screenshot('P9-06-recycler-credentials-dossier-modal.png');

  console.log('\n=== ALL PHASE 9 EVIDENCE CAPTURED SUCCESSFULLY ===\n');

  ws.close();
  edgeProc.kill();
}

capturePhase9Evidence().catch((err) => {
  console.error('Evidence capture failed:', err);
  process.exit(1);
});
