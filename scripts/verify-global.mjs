import { spawn } from 'node:child_process';
import fs from 'node:fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9226;
const APP_URL = 'http://localhost:3000';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\phase7-acceptance-evidence\\screenshots';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyGlobalPlatform() {
  console.log('=== VERIFYING GLOBAL EXPANSION PLATFORM IN LIVE BROWSER ===\n');

  const userDataDir = process.env.TEMP + '\\edge-global-verify-' + Date.now();
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--window-size=1440,900',
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
    console.log(`[Captured]: ${filename} (${buffer.length} bytes)`);
  }

  console.log('1. Waiting for dashboard to hydrate...');
  await wait(3000);

  // Capture global dashboard with new market & currency indicators
  await capture('G01-global-dashboard-header.png');

  console.log('2. Opening Material Passport modal to inspect DPP Alignment tabs...');
  await evaluate(`(() => {
    const viewBtn = Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.includes('View Full Passport') || b.textContent.includes('View Passport')
    );
    if (viewBtn) viewBtn.click();
  })()`);
  await wait(1500);

  // Capture Technical Passport view
  await capture('G02-dpp-technical-overview.png');

  // Switch to DPP Alignment tab
  console.log('3. Switching to EU DPP Alignment Check tab...');
  await evaluate(`(() => {
    const dppTab = Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.includes('EU DPP Alignment')
    );
    if (dppTab) dppTab.click();
  })()`);
  await wait(1000);
  await capture('G03-dpp-compliance-alignment.png');

  // Switch to Traceability tab
  console.log('4. Switching to Chain of Custody & Batch Flow tab...');
  await evaluate(`(() => {
    const traceTab = Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.includes('Chain of Custody')
    );
    if (traceTab) traceTab.click();
  })()`);
  await wait(1000);
  await capture('G04-dpp-chain-of-custody-flow.png');

  ws.close();
  edgeProc.kill();
  console.log('\n=== GLOBAL PLATFORM VERIFICATION COMPLETE ===');
}

verifyGlobalPlatform().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
