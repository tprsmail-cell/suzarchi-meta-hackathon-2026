import { spawn } from 'node:child_process';
import fs from 'node:fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9229;
const APP_URL = 'http://localhost:3000';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\phase7-acceptance-evidence\\screenshots';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function captureGlobalEvidence() {
  console.log('=== STARTING G0–G7 GLOBAL EXPANSION EVIDENCE CAPTURE ===\n');

  const userDataDir = process.env.TEMP + '\\edge-global-' + Date.now();
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--window-size=1280,950',
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
    console.log(`[Captured & Saved]: ${filename} (${buffer.length} bytes)`);
  }

  console.log('1. Waiting for dashboard to hydrate cleanly...');
  await wait(3000);

  // -------------------------------------------------------------
  // G01: Global Settings Popover / Header
  // -------------------------------------------------------------
  console.log('2. Opening Global Settings popover in Header...');
  await evaluate(`(() => {
    const globeBtn = Array.from(document.querySelectorAll('button')).find(b => 
      b.textContent.includes('Language') || b.textContent.includes('INR') || b.textContent.includes('English') || b.querySelector('svg')
    );
    // Find settings button with Globe or currency text
    const allBtns = Array.from(document.querySelectorAll('header button'));
    if (allBtns.length > 0) {
      allBtns[allBtns.length - 1].click();
    }
  })()`);
  await wait(1200);

  console.log('3. Capturing G01: Global Dashboard Header & Locale Popover...');
  await capture('G01-global-dashboard-header.png');

  // Close popover if open
  await evaluate(`window.dispatchEvent(new MouseEvent('click', { bubbles: true }))`);
  await wait(500);

  // -------------------------------------------------------------
  // G02: DPP Technical Overview Modal
  // -------------------------------------------------------------
  console.log('4. Opening Material Passport Detail Modal...');
  await evaluate(`(() => {
    const passportBtn = Array.from(document.querySelectorAll('button')).find(b => 
      b.textContent.includes('View Passport') || b.textContent.includes('Material Passport')
    );
    if (passportBtn) passportBtn.click();
  })()`);
  await wait(1200);

  console.log('5. Capturing G02: DPP Technical Overview with HS Code & Country of Origin...');
  await capture('G02-dpp-technical-overview.png');

  // -------------------------------------------------------------
  // G03: EU DPP Compliance Alignment Check
  // -------------------------------------------------------------
  console.log('6. Switching to DPP Alignment Check tab...');
  await evaluate(`(() => {
    const dppTab = Array.from(document.querySelectorAll('button')).find(b => 
      b.textContent.includes('EU DPP') || b.textContent.includes('Alignment')
    );
    if (dppTab) dppTab.click();
  })()`);
  await wait(1200);

  console.log('7. Capturing G03: DPP Compliance Alignment Tab...');
  await capture('G03-dpp-compliance-alignment.png');

  // Close passport modal
  await evaluate(`(() => {
    const closeBtn = Array.from(document.querySelectorAll('button')).find(b => 
      b.getAttribute('aria-label') === 'Close' || b.textContent.includes('Close')
    );
    if (closeBtn) closeBtn.click();
  })()`);
  await wait(1000);

  // -------------------------------------------------------------
  // G04: Destination Detail with Cross-Border Trade & Basel Assessment
  // -------------------------------------------------------------
  console.log('8. Selecting US or EU market hub to trigger cross-border evaluation...');
  // Open Destination modal for mat-001
  await evaluate(`(() => {
    const destCard = Array.from(document.querySelectorAll('div')).find(d => 
      d.textContent.includes('Rotor Open-End Yarn Spinning') || d.textContent.includes('Match Score')
    );
    if (destCard) destCard.click();
  })()`);
  await wait(1200);

  // Scroll to Cross-Border section
  await evaluate(`(() => {
    const cbHeading = Array.from(document.querySelectorAll('h3')).find(h => 
      h.textContent.includes('Cross-Border Trade') || h.textContent.includes('Regional Corridor')
    );
    if (cbHeading) cbHeading.scrollIntoView({ behavior: 'instant', block: 'center' });
  })()`);
  await wait(1000);

  console.log('9. Capturing G04: Cross-Border Trade & Basel Assessment in Destination Detail...');
  await capture('G04-cross-border-destination-detail.png');

  ws.close();
  edgeProc.kill();
  console.log('\n=== GLOBAL EXPANSION EVIDENCE CAPTURE COMPLETED SUCCESSFULLY ===');
}

captureGlobalEvidence().catch((err) => {
  console.error('FAILED global evidence capture:', err);
  process.exit(1);
});
