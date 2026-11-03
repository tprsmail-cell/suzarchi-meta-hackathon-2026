import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9230;
const APP_URL = 'http://localhost:3000';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\phase8-acceptance-evidence\\screenshots';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function capturePhase8Evidence() {
  console.log('=== STARTING PHASE 8 ENTERPRISE EVIDENCE CAPTURE ===\n');

  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  }

  const userDataDir = process.env.TEMP + '\\edge-p8-' + Date.now();
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

  // 1. Navigate to Traceability & Batches view
  console.log('\n--- Step 1: Navigating to Traceability & Batches View ---');
  await evaluate(`
    const navButtons = Array.from(document.querySelectorAll('aside button, aside div[role="button"], aside a, aside nav button'));
    const traceBtn = navButtons.find(b => b.textContent.includes('Traceability') || b.textContent.includes('Batches') || b.textContent.includes('தொகுதி'));
    if (traceBtn) traceBtn.click();
  `);
  await wait(1500);
  await screenshot('P8-01-traceability-operations-overview.png');

  // 2. Scroll to ISO 17025 Lab Evidence Promotion Desk
  console.log('\n--- Step 2: Capturing ISO 17025 Accredited Laboratory Verification Desk ---');
  await evaluate(`
    const el = Array.from(document.querySelectorAll('h2, h3, h4')).find(h => h.textContent.includes('Laboratory Evidence') || h.textContent.includes('Accredited Laboratory'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  `);
  await wait(1000);
  await screenshot('P8-02-iso17025-lab-verification-desk.png');

  // 3. Click "Promote Evidence to CONFIRMED" button on SITRA report
  console.log('\n--- Step 3: Triggering Evidence Promotion & Audit Logging ---');
  await evaluate(`
    const promoteBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Promote Evidence to CONFIRMED'));
    if (promoteBtn) promoteBtn.click();
  `);
  await wait(1000);
  await screenshot('P8-03-evidence-promoted-audit-log.png');

  // 4. Scroll to Multi-Facility Storage Capacities
  console.log('\n--- Step 4: Capturing Multi-Facility Storage Capacities & Hazardous Segregation ---');
  await evaluate(`
    const el = Array.from(document.querySelectorAll('h2, h3, h4')).find(h => h.textContent.includes('Storage Capacities') || h.textContent.includes('Enterprise Storage'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  `);
  await wait(1000);
  await screenshot('P8-04-multi-facility-capacities-grid.png');

  // 5. Open Batch QR Modal
  console.log('\n--- Step 5: Opening Batch QR Code Modal ---');
  await evaluate(`
    window.scrollTo(0, 0);
    const qrBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('QR Label') || b.textContent.includes('Quick QR'));
    if (qrBtn) qrBtn.click();
  `);
  await wait(1500);
  await screenshot('P8-05-batch-qr-printable-label-modal.png');

  // 6. Switch to Cryptographic Verification tab inside Batch QR Modal
  console.log('\n--- Step 6: Capturing Cryptographic Verification & Tamper Protection ---');
  await evaluate(`
    const tabBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cryptographic Verification'));
    if (tabBtn) tabBtn.click();
  `);
  await wait(1000);
  await screenshot('P8-06-batch-qr-cryptographic-verification.png');

  // 7. Close Batch QR modal and open Material Passport Detail Modal
  console.log('\n--- Step 7: Inspecting Material Passport Detail Modal with Provenant DPP Composition ---');
  await evaluate(`
    const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Done' || b.getAttribute('aria-label') === 'Close');
    if (closeBtn) closeBtn.click();
  `);
  await wait(1000);

  // Navigate back to Dashboard and open Passport Detail
  await evaluate(`
    const dashBtn = Array.from(document.querySelectorAll('aside button, aside div[role="button"]')).find(b => b.textContent.includes('Dashboard'));
    if (dashBtn) dashBtn.click();
  `);
  await wait(1500);

  await evaluate(`
    const viewDppBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('View Digital Product Passport') || b.textContent.includes('Passport Details') || b.textContent.includes('Quick View'));
    if (viewDppBtn) viewDppBtn.click();
  `);
  await wait(1500);

  // Click EU DPP Alignment Check tab
  await evaluate(`
    const dppTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('EU DPP Alignment Check'));
    if (dppTab) dppTab.click();
  `);
  await wait(1000);
  await screenshot('P8-07-passport-dpp-composition-donut.png');

  // Click Chain of Custody & Batch Flow tab
  await evaluate(`
    const batchTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Chain of Custody') || b.textContent.includes('Batch Flow'));
    if (batchTab) batchTab.click();
  `);
  await wait(1000);
  await screenshot('P8-08-passport-provenant-batches-table.png');

  console.log('\n=== ALL PHASE 8 EVIDENCE CAPTURED SUCCESSFULLY ===\n');

  ws.close();
  edgeProc.kill();
}

capturePhase8Evidence().catch((err) => {
  console.error('Evidence capture failed:', err);
  process.exit(1);
});
