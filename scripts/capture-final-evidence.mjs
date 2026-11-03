import { spawn } from 'node:child_process';
import fs from 'node:fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9228;
const APP_URL = 'http://localhost:3000';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\phase7-acceptance-evidence\\screenshots';
const RECOVERED_DIR = 'D:\\SUZARCHI hackathon\\phase7-acceptance-evidence\\screenshots\\recovered';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function captureEvidence() {
  console.log('=== STARTING FINAL PHASE 7 SAFETY & RFQ EVIDENCE CAPTURE ===\n');

  const userDataDir = process.env.TEMP + '\\edge-evidence-' + Date.now();
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
    fs.writeFileSync(`${RECOVERED_DIR}\\${filename}`, buffer);
    console.log(`[Captured & Saved]: ${filename} (${buffer.length} bytes)`);
  }

  console.log('1. Waiting for dashboard to hydrate cleanly...');
  await wait(3000);

  // -------------------------------------------------------------
  // TEST & CAPTURE S16: OILY RAGS (mat-007)
  // -------------------------------------------------------------
  console.log('2. Selecting mat-007 (Workshop Oily Rags)...');
  await evaluate(`(() => {
    // Select via material dropdown or role
    const selects = Array.from(document.querySelectorAll('select'));
    const matSelect = selects.find(s => Array.from(s.options).some(o => o.value === 'mat-007'));
    if (matSelect) {
      matSelect.value = 'mat-007';
      matSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  })()`);
  await wait(1500);

  console.log('3. Scrolling to AI Match Analysis to display all 4 destinations for mat-007...');
  await evaluate(`(() => {
    const matchAnalysis = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('AI Match Analysis'))?.closest('.rounded-2xl, .rounded-xl');
    if (matchAnalysis) {
      matchAnalysis.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  })()`);
  await wait(1000);

  console.log('4. Capturing S16: Oily Rag Safety Outcome (with Solvent Laundry Blocked)...');
  await capture('S16-oily-rag-safety-outcome.png');

  // -------------------------------------------------------------
  // TEST & CAPTURE RFQ MODAL WITH DEMO DATA BADGES
  // -------------------------------------------------------------
  console.log('5. Clicking destination card to open DestinationDetailModal...');
  await evaluate(`(() => {
    // Find the Cement Kiln destination card or first destination card
    const destCards = Array.from(document.querySelectorAll('div')).filter(d => 
      d.textContent.includes('Cement Kiln Co-Processing') || d.textContent.includes('Match Score')
    );
    const clickTarget = destCards[destCards.length - 1] || document.querySelector('.cursor-pointer');
    if (clickTarget) clickTarget.click();
  })()`);
  await wait(1200);

  console.log('6. Clicking "Create Local RFQ Draft for this Route" button...');
  await evaluate(`(() => {
    const rfqBtn = Array.from(document.querySelectorAll('button')).find(b => 
      b.textContent.includes('Local RFQ Draft') || b.textContent.includes('RFQ')
    );
    if (rfqBtn) rfqBtn.click();
  })()`);
  await wait(1200);

  console.log('7. Capturing S18: RFQ Local Draft Modal with DEMO DATA badges...');
  await capture('S18-rfq-local-draft-modal.png');

  // Submit RFQ to test in-memory save feedback
  console.log('8. Submitting RFQ to verify Local Inquiry Draft Created feedback...');
  await evaluate(`(() => {
    const saveBtn = Array.from(document.querySelectorAll('button')).find(b => 
      b.textContent.includes('Save Local Draft') || b.textContent.includes('Submit')
    );
    if (saveBtn) saveBtn.click();
  })()`);
  await wait(1200);

  console.log('9. Capturing S19: RFQ Local Draft Saved Confirmation...');
  await capture('S19-rfq-draft-saved-confirmation.png');

  // Close modal
  await evaluate(`(() => {
    const closeBtn = Array.from(document.querySelectorAll('button')).find(b => 
      b.textContent.includes('Close') || b.getAttribute('aria-label') === 'Close'
    );
    if (closeBtn) closeBtn.click();
  })()`);
  await wait(1000);

  // -------------------------------------------------------------
  // TEST & CAPTURE RESPONSIVE MOBILE VIEW (390px iPhone 14)
  // -------------------------------------------------------------
  console.log('10. Resizing viewport to mobile (390x844)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await wait(1500);

  // Scroll to top to see KPI cards and scrolling categories
  await evaluate(`window.scrollTo(0, 0)`);
  await wait(1000);

  console.log('11. Capturing S20: Mobile Responsive 2-Col KPI Grid & Category Strip...');
  await capture('S20-mobile-responsive-2col-kpis.png');

  ws.close();
  edgeProc.kill();
  console.log('\n=== ALL FINAL EVIDENCE CAPTURED & SAVED SUCCESSFULLY ===');
}

captureEvidence().catch((err) => {
  console.error('FAILED evidence capture:', err);
  process.exit(1);
});
