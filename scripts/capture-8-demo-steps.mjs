import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9240;
const APP_URL = 'http://localhost:3000';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\docs\\release\\demo-recording-evidence';

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('=== STARTING 1920x1080 8-STEP DEMONSTRATION CAPTURE ===\n');
  const userDataDir = process.env.TEMP + '\\edge-demo-1080p-' + Date.now();
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--window-size=1920,1080',
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
    throw new Error('Headless Edge connection failed');
  }

  const page = targets.find((t) => t.type === 'page') || targets[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  await send('Page.enable');
  await send('DOM.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await wait(2000);

  async function takeScreenshot(filename) {
    const snap = await send('Page.captureScreenshot', { format: 'png' });
    const p = path.join(EVIDENCE_DIR, filename);
    fs.writeFileSync(p, Buffer.from(snap.data, 'base64'));
    console.log(`[Captured] ${filename} (${fs.statSync(p).size} bytes)`);
    return p;
  }

  async function evalCode(expression) {
    return send('Runtime.evaluate', { expression });
  }

  // PRE-CAPTURE A: Normal Dashboard (Without Demo Mode - Walkthrough completely hidden)
  console.log('Capturing NORMAL-DASHBOARD-no-walkthrough.png from http://localhost:3000/ ...');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await wait(2500);
  await takeScreenshot('NORMAL-DASHBOARD-no-walkthrough.png');

  // PRE-CAPTURE B: Demo Mode Activated (With ?demo=true)
  console.log('Capturing DEMO-MODE-walkthrough-active.png from http://localhost:3000/?demo=true ...');
  await send('Page.navigate', { url: 'http://localhost:3000/?demo=true' });
  await wait(2500);
  await takeScreenshot('DEMO-MODE-walkthrough-active.png');

  // STEP 1: Material Discovery
  console.log('Capturing STEP 1: Material Discovery...');
  await evalCode(`(() => {
    const card = document.getElementById('material-discovery-card');
    if (card) {
      card.scrollIntoView({ behavior: 'instant', block: 'center' });
    } else {
      window.scrollTo({ top: 320, behavior: 'instant' });
    }
  })()`);
  await wait(1200);
  await takeScreenshot('DEMO-STEP-01-material-discovery.png');

  // STEP 2: AI-Assisted Intake
  console.log('Navigating to STEP 2: AI-Assisted Intake...');
  await evalCode(`(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const stepBtns = Array.from(document.querySelectorAll('button'));
    const btn = stepBtns.find(b => b.textContent && b.textContent.includes('Open AI Vision Intake'));
    if (btn) btn.click();
  })()`);
  await wait(1500);
  await takeScreenshot('DEMO-STEP-02-ai-assisted-intake.png');

  // Close AI modal and prepare for STEP 3
  await evalCode(`(() => {
    const closeBtns = Array.from(document.querySelectorAll('button'));
    const closeBtn = closeBtns.find(b => b.textContent && b.textContent.trim() === 'Cancel');
    if (closeBtn) closeBtn.click();
  })()`);
  await wait(1000);

  // STEP 3: Material Passport (Open Detail Modal)
  console.log('Navigating to STEP 3: Material Passport...');
  await evalCode(`(() => {
    // Jump to Step 3 in tour
    const stepBtns = Array.from(document.querySelectorAll('button'));
    const s3 = stepBtns.find(b => b.textContent && b.textContent.includes('Digital Product Passport'));
    if (s3) s3.click();
  })()`);
  await wait(800);
  await evalCode(`(() => {
    const actionBtns = Array.from(document.querySelectorAll('button'));
    const btn = actionBtns.find(b => b.textContent && b.textContent.includes('Open Material Passport'));
    if (btn) btn.click();
  })()`);
  await wait(1500);
  await takeScreenshot('DEMO-STEP-03-material-passport.png');

  // Close Passport modal and prepare for STEP 4
  await evalCode(`(() => {
    const closeBtns = Array.from(document.querySelectorAll('button'));
    const btn = closeBtns.find(b => b.textContent && b.textContent.includes('Close Passport View'));
    if (btn) btn.click();
  })()`);
  await wait(1000);

  // STEP 4: Circular Compatibility
  console.log('Navigating to STEP 4: Circular Compatibility...');
  await evalCode(`(() => {
    const stepBtns = Array.from(document.querySelectorAll('button'));
    const s4 = stepBtns.find(b => b.textContent && b.textContent.includes('Circular Engine'));
    if (s4) s4.click();
    window.scrollTo({ top: 680, behavior: 'instant' });
  })()`);
  await wait(1500);
  await takeScreenshot('DEMO-STEP-04-circular-compatibility.png');

  // Reset scroll and prepare for STEP 5
  await evalCode(`window.scrollTo({ top: 0, behavior: 'instant' });`);
  await wait(500);

  // STEP 5: Laboratory Verification
  console.log('Navigating to STEP 5: Laboratory Verification...');
  await evalCode(`(() => {
    const stepBtns = Array.from(document.querySelectorAll('button'));
    const s5 = stepBtns.find(b => b.textContent && b.textContent.includes('Accredited Lab Desk'));
    if (s5) s5.click();
  })()`);
  await wait(800);
  await evalCode(`(() => {
    const actionBtns = Array.from(document.querySelectorAll('button'));
    const btn = actionBtns.find(b => b.textContent && b.textContent.includes('Go to Lab Verification Desk'));
    if (btn) btn.click();
  })()`);
  await wait(1000);
  await evalCode(`(() => {
    const el = document.getElementById('laboratory-verification-desk');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    else window.scrollTo({ top: 380, behavior: 'instant' });
  })()`);
  await wait(1500);
  await takeScreenshot('DEMO-STEP-05-laboratory-verification.png');

  // STEP 6: Global Intelligence
  console.log('Navigating to STEP 6: Global Intelligence...');
  await evalCode(`(() => {
    const stepBtns = Array.from(document.querySelectorAll('button'));
    const s6 = stepBtns.find(b => b.textContent && (b.textContent.includes('GLOBAL ANALYTICS') || b.textContent.includes('Global Analytics')));
    if (s6) s6.click();
  })()`);
  await wait(800);
  await evalCode(`(() => {
    const actionBtns = Array.from(document.querySelectorAll('button'));
    const btn = actionBtns.find(b => b.textContent && b.textContent.includes('Explore Global Analytics'));
    if (btn) btn.click();
  })()`);
  await wait(1500);
  await takeScreenshot('DEMO-STEP-06-global-intelligence.png');

  // STEP 7: Buyer Opportunities & RFQ
  console.log('Navigating to STEP 7: Buyer Opportunities & RFQ...');
  await evalCode(`(() => {
    const stepBtns = Array.from(document.querySelectorAll('button'));
    const s7 = stepBtns.find(b => b.textContent && b.textContent.includes('B2B Trade Desk'));
    if (s7) s7.click();
  })()`);
  await wait(800);
  await evalCode(`(() => {
    const actionBtns = Array.from(document.querySelectorAll('button'));
    const btn = actionBtns.find(b => b.textContent && b.textContent.includes('Review Local RFQ Draft'));
    if (btn) btn.click();
  })()`);
  await wait(1500);
  await takeScreenshot('DEMO-STEP-07-buyer-opportunities-rfq.png');

  // STEP 8: Circular Scope 3 Impact
  console.log('Navigating to STEP 8: Circular Scope 3 Impact...');
  await evalCode(`(() => {
    const stepBtns = Array.from(document.querySelectorAll('button'));
    const s8 = stepBtns.find(b => b.textContent && b.textContent.includes('GHG Protocol Standard'));
    if (s8) s8.click();
  })()`);
  await wait(800);
  await evalCode(`(() => {
    const actionBtns = Array.from(document.querySelectorAll('button'));
    const btn = actionBtns.find(b => b.textContent && b.textContent.includes('View Modelled Scope 3 Certificate'));
    if (btn) btn.click();
  })()`);
  await wait(1500);
  await takeScreenshot('DEMO-STEP-08-circular-impact.png');

  ws.close();
  edgeProc.kill();
  console.log('\n=== ALL 8 DEMONSTRATION STEPS CAPTURED SUCCESSFULLY (1920x1080) ===');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
