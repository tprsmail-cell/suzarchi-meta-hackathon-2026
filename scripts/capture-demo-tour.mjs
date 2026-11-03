import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9235;
const APP_URL = 'http://localhost:3000';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\docs\\release\\global-experience-evidence';

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('Starting Demo Tour evidence capture...');
  const userDataDir = process.env.TEMP + '\\edge-tour-' + Date.now();
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--window-size=1440,960',
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
    console.error('Failed to connect to headless Edge');
    return;
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

  await wait(2000);

  // Capture 1: Main Dashboard with Demo Walkthrough Tour
  console.log('Capturing DEMO-TOUR-01...');
  const snap1 = await send('Page.captureScreenshot', { format: 'png' });
  const p1 = path.join(EVIDENCE_DIR, 'DEMO-TOUR-01-dashboard-8-step-walkthrough.png');
  fs.writeFileSync(p1, Buffer.from(snap1.data, 'base64'));
  console.log('Saved:', p1);

  // Trigger Step 2: Open AI Vision Intake
  console.log('Triggering AI Intake modal...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const intakeBtn = btns.find(b => b.textContent && b.textContent.includes('Open AI Vision Intake'));
      if (intakeBtn) intakeBtn.click();
    })()`,
  });

  await wait(1500);

  // Capture 2: Meta AI Intake Modal with $150 credit context
  console.log('Capturing DEMO-TOUR-02...');
  const snap2 = await send('Page.captureScreenshot', { format: 'png' });
  const p2 = path.join(EVIDENCE_DIR, 'DEMO-TOUR-02-meta-ai-intake-with-credit-context.png');
  fs.writeFileSync(p2, Buffer.from(snap2.data, 'base64'));
  console.log('Saved:', p2);

  ws.close();
  edgeProc.kill();
  console.log('Demo Tour Evidence Capture Completed successfully!');
}

run().catch(console.error);
