import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9232;
const APP_URL = 'http://localhost:3000';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\docs\\release\\global-experience-evidence';

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function captureEvidence() {
  console.log('=== STARTING GLOBAL EXPERIENCE EVIDENCE CAPTURE ===\n');

  const userDataDir = process.env.TEMP + '\\edge-global-comp-' + Date.now();
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
    } catch (e) {}
  }

  if (!targets) {
    edgeProc.kill();
    throw new Error('Edge headless browser connection failed');
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
      pending.get(data.id)(data);
      pending.delete(data.id);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('DOM.enable');
  await send('Runtime.enable');

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res?.result?.result?.value;
  }

  async function captureScreenshot(filename, viewport = { width: 1440, height: 960 }) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width < 768,
    });
    await wait(400);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const fullPath = path.join(EVIDENCE_DIR, filename);
    fs.writeFileSync(fullPath, Buffer.from(shot.result.data, 'base64'));
    console.log(`📸 Saved screenshot: ${filename} (${viewport.width}x${viewport.height})`);
  }

  try {
    // Wait for initial page hydration
    await wait(2000);

    // 1. Desktop: Global Language Selector Open (showing all 10 languages)
    console.log('1. Capturing Desktop Language Selector (10 Languages)...');
    await evaluate(`
      const langBtn = Array.from(document.querySelectorAll('button')).find(b => b.getAttribute('aria-label') === 'Language selector' || b.textContent.includes('English') || b.title?.includes('Language'));
      if (langBtn) langBtn.click();
    `);
    await wait(600);
    await captureScreenshot('GCOMP-01-global-language-selector-desktop.png');

    // 2. Desktop: Select Spanish (es) and capture translated UI
    console.log('2. Selecting Spanish (es) and capturing full translated UI...');
    await evaluate(`
      const esBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Español'));
      if (esBtn) esBtn.click();
    `);
    await wait(800);
    await captureScreenshot('GCOMP-02-full-ui-spanish-translation.png');

    // 3. Desktop: Select German (de) and capture translated UI
    console.log('3. Selecting German (de) and capturing full translated UI...');
    await evaluate(`
      const langBtn = Array.from(document.querySelectorAll('button')).find(b => b.getAttribute('aria-label') === 'Language selector' || b.textContent.includes('Español') || b.title?.includes('Language'));
      if (langBtn) langBtn.click();
    `);
    await wait(400);
    await evaluate(`
      const deBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Deutsch'));
      if (deBtn) deBtn.click();
    `);
    await wait(800);
    await captureScreenshot('GCOMP-03-full-ui-german-translation.png');

    // 4. Desktop: Select Simplified Chinese (zh-CN) and capture translated UI
    console.log('4. Selecting Simplified Chinese (zh-CN) and capturing full translated UI...');
    await evaluate(`
      const langBtn = Array.from(document.querySelectorAll('button')).find(b => b.getAttribute('aria-label') === 'Language selector' || b.textContent.includes('Deutsch') || b.title?.includes('Language'));
      if (langBtn) langBtn.click();
    `);
    await wait(400);
    await evaluate(`
      const zhBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('简体中文'));
      if (zhBtn) zhBtn.click();
    `);
    await wait(800);
    await captureScreenshot('GCOMP-04-full-ui-chinese-translation.png');

    // 5. Desktop: Switch back to English and open Circularity Analytics View
    console.log('5. Navigating to Circularity Analytics (Global Corridor Intelligence)...');
    await evaluate(`
      const langBtn = Array.from(document.querySelectorAll('button')).find(b => b.getAttribute('aria-label') === 'Language selector' || b.textContent.includes('简体中文') || b.title?.includes('Language'));
      if (langBtn) langBtn.click();
    `);
    await wait(400);
    await evaluate(`
      const enBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('English'));
      if (enBtn) enBtn.click();
    `);
    await wait(500);

    // Click Analytics nav item in sidebar
    await evaluate(`
      const analyticsBtn = Array.from(document.querySelectorAll('aside button')).find(b => b.textContent.includes('Circularity Metrics') || b.textContent.includes('Analytics'));
      if (analyticsBtn) analyticsBtn.click();
    `);
    await wait(800);
    await captureScreenshot('GCOMP-05-circularity-analytics-all-regions.png');

    // 6. Circularity Analytics: Filter by Europe Region
    console.log('6. Filtering Circularity Analytics by Europe...');
    await evaluate(`
      const europeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Europe');
      if (europeBtn) europeBtn.click();
    `);
    await wait(600);
    await captureScreenshot('GCOMP-06-circularity-analytics-europe-filter.png');

    // 7. Circularity Analytics: Scroll down to Cross-Border Circular Opportunities
    console.log('7. Capturing Cross-Border Circular Opportunities Matrix...');
    await evaluate(`window.scrollTo(0, document.body.scrollHeight);`);
    await wait(600);
    await captureScreenshot('GCOMP-07-circularity-analytics-cross-border-matrix.png');

    // 8. Mobile Viewport (390x844 - iPhone 14): Open mobile menu showing accessible language selector
    console.log('8. Capturing Mobile Menu with Accessible Language Selector...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await wait(500);
    await evaluate(`
      const menuBtn = document.querySelector('button[aria-label="Open menu"]');
      if (menuBtn) menuBtn.click();
    `);
    await wait(800);
    await captureScreenshot('GCOMP-08-mobile-drawer-language-selector.png', { width: 390, height: 844 });

    console.log('\n=== ALL 8 GLOBAL EXPERIENCE SCREENSHOTS CAPTURED SUCCESSFULLY ===');
  } finally {
    ws.close();
    edgeProc.kill();
  }
}

captureEvidence()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal capture error:', err);
    process.exit(1);
  });
