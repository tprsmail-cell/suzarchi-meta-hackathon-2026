import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DEBUG_PORT = 9223;
const SCREEN_DIR = 'docs/release/demo-recording-evidence/screens-pink-corduroy';

if (!fs.existsSync(SCREEN_DIR)) {
  fs.mkdirSync(SCREEN_DIR, { recursive: true });
}

console.log('Launching Edge with remote debugging on port', DEBUG_PORT, '...');
const edgeProcess = spawn(EDGE_PATH, [
  '--headless=new',
  `--remote-debugging-port=${DEBUG_PORT}`,
  '--window-size=1920,1080',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  'http://localhost:3000'
]);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://localhost:${DEBUG_PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(300);
  }
  throw new Error('Could not get WebSocket debugger URL from Edge');
}

async function main() {
  const wsUrl = await getWsUrl();
  console.log('Connected to CDP at', wsUrl);

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const pending = new Map();

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise((r) => (ws.onopen = r));

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  async function capture(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(SCREEN_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`[OK] Saved screenshot: ${filename} (${buffer.length} bytes)`);
  }

  async function evaluate(expression) {
    return await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  });

  // 1. Initial Dashboard with Pink Corduroy
  console.log('Loading Dashboard...');
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await sleep(2500);

  // Capture Scene 0: Hero / Overview
  await capture('scene-00-opening.png');

  // Capture Scene 1: Dashboard listing overview
  await capture('scene-01-dashboard.png');

  // 2. Open AI Intake Modal with Pink Corduroy
  console.log('Opening AI Intake Review Modal...');
  await evaluate(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Launch AI Intake'));
      if (btn) btn.click();
    })()
  `);
  await sleep(1500);
  await capture('scene-02-ai-intake.png');

  // Close AI modal
  await evaluate(`
    (() => {
      const closeBtn = document.querySelector('button[aria-label="Close dialog"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Cancel' || b.innerHTML.includes('lucide-x'));
      if (closeBtn) closeBtn.click();
    })()
  `);
  await sleep(1000);

  // 3. Open Material Passport Detail Modal
  console.log('Opening Material Passport Modal...');
  await evaluate(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('View Full Passport'));
      if (btn) btn.click();
    })()
  `);
  await sleep(1500);
  await capture('scene-03-passport.png');

  // Close Passport detail modal
  await evaluate(`
    (() => {
      const closeBtn = document.querySelector('button[aria-label="Close modal"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Close Passport' || b.innerHTML.includes('lucide-x'));
      if (closeBtn) closeBtn.click();
    })()
  `);
  await sleep(1000);

  // 4. Navigate to Compatibility & Destinations Tab
  console.log('Switching to Destinations Tab...');
  await evaluate(`
    (() => {
      const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Compatibility & Destinations'));
      if (tab) tab.click();
    })()
  `);
  await sleep(1500);
  await capture('scene-04-compatibility.png');

  // 5. Navigate to Physical & Lab Tests Tab
  console.log('Switching to Physical & Lab Tests Tab...');
  await evaluate(`
    (() => {
      const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Physical & Lab Tests'));
      if (tab) tab.click();
    })()
  `);
  await sleep(1500);
  await capture('scene-05-lab-workflow.png');

  // 6. Navigate to Global Analytics View
  console.log('Navigating to Global Analytics View...');
  await evaluate(`
    (() => {
      const navBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Global Analytics'));
      if (navBtn) navBtn.click();
    })()
  `);
  await sleep(1500);
  await capture('scene-06-global-analytics.png');

  // 7. Navigate back to Dashboard and open RFQ Modal
  console.log('Navigating back to Dashboard for RFQ...');
  await evaluate(`
    (() => {
      const dashBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Dashboard'));
      if (dashBtn) dashBtn.click();
    })()
  `);
  await sleep(1500);

  await evaluate(`
    (() => {
      const rfqBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Dispatch RFQ') || b.textContent.includes('RFQ Draft') || b.textContent.includes('Request Quote')));
      if (rfqBtn) rfqBtn.click();
    })()
  `);
  await sleep(1500);
  await capture('scene-07-rfq.png');

  // Close RFQ modal
  await evaluate(`
    (() => {
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Cancel' || b.innerHTML.includes('lucide-x'));
      if (closeBtn) closeBtn.click();
    })()
  `);
  await sleep(1000);

  // 8. Navigate to Scope 3 Accounting View
  console.log('Navigating to Scope 3 Accounting View...');
  await evaluate(`
    (() => {
      const scope3Btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Scope 3 Accounting'));
      if (scope3Btn) scope3Btn.click();
    })()
  `);
  await sleep(1500);
  await capture('scene-08-scope3.png');

  // 9. Closing scene
  console.log('Navigating to Closing Screen...');
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await sleep(1500);
  await capture('scene-09-closing.png');

  console.log('All 10 live real application screens captured successfully!');
  ws.close();
  edgeProcess.kill();
  process.exit(0);
}

main().catch((err) => {
  console.error('Capture error:', err);
  edgeProcess.kill();
  process.exit(1);
});
