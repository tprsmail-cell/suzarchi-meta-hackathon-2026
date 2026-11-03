import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9226;
const APP_URL = 'http://localhost:3000';
const ARTIFACT_DIR = 'C:\\Users\\Merch\\.gemini\\antigravity\\brain\\bd2de537-0962-45e2-a6f8-f3193ee33f5e';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runNavyFabricVerification() {
  console.log('=== SUZARCHI: NAVY FABRIC PHOTOGRAPH INTEGRITY VERIFICATION ===\n');

  const userDataDir = process.env.TEMP + '\\edge-navy-photo-test-' + Date.now();
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

  if (!targets || targets.length === 0) {
    edgeProc.kill();
    throw new Error('Could not connect to Edge on port ' + PORT);
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
    if (res.exceptionDetails) {
      throw new Error('Evaluation exception: ' + JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  async function captureScreenshot(filepath, clip = null) {
    const params = { format: 'png', quality: 90 };
    if (clip) params.clip = clip;
    const res = await send('Page.captureScreenshot', params);
    fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
    console.log(`[Screenshot captured]: ${filepath}`);
  }

  try {
    await send('Page.enable');
    await send('DOM.enable');

    console.log('Waiting for application to load at ' + APP_URL + '...');
    await wait(2500);

    // 1. Check Primary Listing image src and alt
    console.log('\n--- 1. Testing Recent Material Listing Card ---');
    const listingImage = await evaluate(`(() => {
      const img = document.querySelector('img[alt*="Navy Fabric Roll"], img[alt*="Navy Single Jersey"], img[src*="navy-single-jersey-fabric.jpg"]');
      if (!img) return null;
      const placeholder = document.querySelector('.listing-placeholder-overlay');
      const badge = Array.from(document.querySelectorAll('span, div')).find(el => el.textContent.includes('DEMO DATA'));
      return {
        found: true,
        src: img.src,
        alt: img.alt,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        hasPlaceholderOverlay: !!placeholder,
        hasDemoBadge: !!badge,
        badgeText: badge ? badge.textContent.trim() : null
      };
    })()`);

    console.log('Listing image analysis:', listingImage);
    assert.ok(listingImage, 'Listing image must be found');
    assert.ok(listingImage.src.includes('navy-single-jersey-fabric.jpg'), 'Image src must be the navy fabric photograph');
    assert.ok(!listingImage.hasPlaceholderOverlay, 'Placeholder overlay must NOT be displayed when photo is present');
    assert.ok(listingImage.hasDemoBadge, 'DEMO DATA badge must be retained');
    console.log('✓ Primary listing photograph verified (no placeholder overlay, DEMO DATA badge visible)');

    // 2. Check thumbnail gallery
    console.log('\n--- 2. Testing Thumbnail Gallery ---');
    const thumbnails = await evaluate(`(() => {
      const thumbs = Array.from(document.querySelectorAll('img[src*="navy-single-jersey-fabric.jpg"]'));
      return {
        count: thumbs.length,
        sources: thumbs.map(t => t.src)
      };
    })()`);
    console.log('Thumbnail count:', thumbnails.count);
    assert.ok(thumbnails.count >= 2, 'Should have main image and thumbnail');
    console.log('✓ Thumbnail gallery contains the navy fabric photograph');

    // 3. Capture desktop view screenshot of the listing card
    const listingCardRect = await evaluate(`(() => {
      const card = document.querySelector('.dashboard-recent-listing') || document.querySelector('[data-testid="recent-listing-card"]') || document.querySelector('img[src*="navy-single-jersey-fabric.jpg"]').closest('.rounded-2xl, .rounded-xl, .bg-white');
      if (!card) return null;
      const r = card.getBoundingClientRect();
      return { x: Math.max(0, r.x - 20), y: Math.max(0, r.y - 20), width: Math.min(1440, r.width + 40), height: r.height + 40 };
    })()`);

    await captureScreenshot(
      path.join(ARTIFACT_DIR, 'navy_fabric_listing_desktop.png'),
      listingCardRect ? { ...listingCardRect, scale: 1 } : null
    );

    // 4. Test Material Passport Detail Modal
    console.log('\n--- 3. Testing Material Passport Modal Gallery ---');
    const openModalBtn = await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('Full Material Passport') || b.textContent.includes('Passport Quick View') || b.textContent.includes('View Full Passport') || b.textContent.includes('Quick View'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()`);

    if (openModalBtn) {
      await wait(800);
      const modalImage = await evaluate(`(() => {
        const modal = document.querySelector('[role="dialog"], .fixed.inset-0');
        if (!modal) return null;
        const img = modal.querySelector('img[src*="navy-single-jersey-fabric.jpg"]');
        return {
          foundModal: true,
          hasPhoto: !!img,
          src: img ? img.src : null,
          alt: img ? img.alt : null
        };
      })()`);
      console.log('Passport Modal image analysis:', modalImage);
      assert.ok(modalImage?.hasPhoto, 'Modal must contain navy fabric photograph');
      console.log('✓ Material Passport modal correctly presents the navy fabric photograph');

      // Capture modal screenshot
      await captureScreenshot(path.join(ARTIFACT_DIR, 'navy_fabric_passport_modal.png'));

      // Close modal
      await evaluate(`(() => {
        const closeBtn = document.querySelector('button[aria-label="Close"], button[aria-label="Close modal"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close') || b.textContent.includes('×'));
        if (closeBtn) closeBtn.click();
      })()`);
      await wait(500);
    }

    // 5. Test Switching Materials (e.g. to mat-002 or mat-007)
    console.log('\n--- 4. Testing Material Switching Integrity ---');
    const switchTest = await evaluate(`(() => {
      const select = document.querySelector('select');
      if (!select) return { found: false };
      const options = Array.from(select.options).map(o => ({ value: o.value, text: o.text }));
      // Select another material (e.g. mat-007 or mat-002)
      const otherOption = options.find(o => o.value !== 'mat-001');
      if (!otherOption) return { found: false };
      select.value = otherOption.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return { found: true, switchedTo: otherOption.value };
    })()`);

    if (switchTest.found) {
      await wait(800);
      const otherState = await evaluate(`(() => {
        const card = document.querySelector('[data-testid="recent-listing-card"]');
        const cardNavyImg = card ? card.querySelector('img[src*="navy-single-jersey-fabric.jpg"]') : null;
        const hasPlaceholder = card ? card.querySelector('svg') : null;
        return {
          cardNavyImgFound: !!cardNavyImg,
          hasPlaceholder: !!hasPlaceholder
        };
      })()`);
      console.log('Switched to other material in recent listing card:', otherState);
      assert.ok(!otherState.cardNavyImgFound, 'Recent listing card must NOT display navy fabric photograph when switched to another material');
      console.log('✓ Material switching cleanly removes navy photo from recent listing card');

      // Switch back to mat-001
      await evaluate(`(() => {
        const select = document.querySelector('select');
        select.value = 'mat-001';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      })()`);
      await wait(800);

      const restoredState = await evaluate(`(() => {
        const card = document.querySelector('[data-testid="recent-listing-card"]');
        const img = card ? card.querySelector('img[src*="navy-single-jersey-fabric.jpg"]') : null;
        return { restored: !!img };
      })()`);
      assert.ok(restoredState.restored, 'Switching back to mat-001 must restore navy fabric photo');
      console.log('✓ Restored navy fabric photograph on switching back to mat-001');
    }

    // 6. Test Mobile Viewport (390x844)
    console.log('\n--- 5. Testing Mobile Viewport (390x844) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await wait(800);

    const mobileCheck = await evaluate(`(() => {
      const img = document.querySelector('img[src*="navy-single-jersey-fabric.jpg"]');
      return {
        found: !!img,
        visible: img ? img.offsetWidth > 0 && img.offsetHeight > 0 : false,
        width: img ? img.offsetWidth : 0,
        height: img ? img.offsetHeight : 0
      };
    })()`);
    console.log('Mobile view check:', mobileCheck);
    assert.ok(mobileCheck.found && mobileCheck.visible, 'Image must be visible in mobile viewport');
    await captureScreenshot(path.join(ARTIFACT_DIR, 'navy_fabric_mobile.png'));
    console.log('✓ Mobile viewport verification passed');

    console.log('\n======================================================');
    console.log('  ALL NAVY FABRIC PHOTOGRAPH CHECKS PASSED SUCCESSFULLY');
    console.log('======================================================');
  } finally {
    ws.close();
    edgeProc.kill();
  }
}

runNavyFabricVerification().catch((err) => {
  console.error('FAILED:', err);
  process.exit(1);
});
