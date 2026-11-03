import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9224;
const APP_URL = 'http://localhost:3000';
const ARTIFACT_DIR = 'C:\\Users\\Merch\\.gemini\\antigravity\\brain\\bd2de537-0962-45e2-a6f8-f3193ee33f5e';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function captureVisualAcceptance() {
  console.log('Capturing Phase 5 Visual Acceptance Screenshots...');

  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--window-size=1440,900',
    '--user-data-dir=' + process.env.TEMP + '\\edge-cap-' + Date.now(),
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

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
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

  await new Promise((resolve) => ws.onopen = resolve);

  function send(method, params = {}) {
    const id = msgId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result ? res.result.value : undefined;
  }

  async function capture(fileName) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const filePath = path.join(ARTIFACT_DIR, fileName);
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved screenshot: ${fileName}`);
  }

  try {
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: APP_URL });
    await wait(2500);

    // 1. Capture Modal Open showing all 10 roles
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('switch your professional role'));
      if (btn) btn.click();
    })()`);
    await wait(600);
    await capture('phase5_modal_10roles.png');

    // 2. Select Healthcare role and capture safety alert
    await evaluate(`(() => {
      const cards = Array.from(document.querySelectorAll('.fixed .grid > div'));
      const card = cards.find(c => c.textContent.includes('Healthcare'));
      if (card) card.click();
    })()`);
    await wait(600);
    await capture('phase5_role_healthcare_safety.png');

    // 3. Switch to Mechanic role and capture flammability alert
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('switch your professional role'));
      if (btn) btn.click();
    })()`);
    await wait(500);
    await evaluate(`(() => {
      const cards = Array.from(document.querySelectorAll('.fixed .grid > div'));
      const card = cards.find(c => c.textContent.includes('Mechanic'));
      if (card) card.click();
    })()`);
    await wait(600);
    await capture('phase5_role_mechanic_flammability.png');

    // 4. Switch to Tamil UI and capture bilingual dashboard
    await evaluate(`(() => {
      const settingsBtn = document.querySelector('button[title*="Language & Unit Settings"]');
      if (settingsBtn) settingsBtn.click();
    })()`);
    await wait(300);
    await evaluate(`(() => {
      const taBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('தமிழ் (Tamil)'));
      if (taBtn) taBtn.click();
    })()`);
    await wait(600);
    await capture('phase5_bilingual_tamil.png');

    // 5. Switch to Imperial Units and capture
    await evaluate(`(() => {
      const settingsBtn = document.querySelector('button[title*="Language & Unit Settings"]');
      if (settingsBtn) settingsBtn.click();
    })()`);
    await wait(300);
    await evaluate(`(() => {
      const impBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Imperial'));
      if (impBtn) impBtn.click();
    })()`);
    await wait(600);
    await capture('phase5_imperial_units.png');

    console.log('All 5 acceptance screenshots captured successfully.');
  } finally {
    ws.close();
    edgeProc.kill();
  }
}

captureVisualAcceptance().catch(console.error);
