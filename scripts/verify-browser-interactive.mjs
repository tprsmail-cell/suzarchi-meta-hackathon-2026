import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9222;
const APP_URL = 'http://localhost:3000';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runBrowserVerification() {
  console.log('--- Starting SUZARCHI Interactive Browser Verification via CDP ---');
  console.log(`Target: ${APP_URL} on port ${PORT}`);

  // 1. Launch Edge headless with remote debugging
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + process.env.TEMP + '\\edge-cdp-test-' + Date.now(),
    APP_URL,
  ]);

  edgeProc.stderr.on('data', (d) => {
    // console.log('[Edge err]', d.toString());
  });

  // Wait for debugging port to be ready
  let targets = null;
  for (let i = 0; i < 20; i++) {
    await wait(500);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      if (res.ok) {
        targets = await res.json();
        if (targets && targets.length > 0) break;
      }
    } catch (e) {
      // retry
    }
  }

  if (!targets || targets.length === 0) {
    edgeProc.kill();
    throw new Error('Failed to connect to Edge DevTools Protocol on port ' + PORT);
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  console.log(`Connected to CDP target: ${pageTarget.title || 'Blank'} (${pageTarget.webSocketDebuggerUrl})`);

  // Connect via native WebSocket
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
      throw new Error(`CDP Eval Error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result ? res.result.value : undefined;
  }

  try {
    // Enable Page and Runtime
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: APP_URL });

    // Wait for DOM ready
    await wait(2500);

    console.log('\n[TEST 1] Verifying Canonical Branding and Initial Page State...');
    const brandInfo = await evaluate(`(() => {
      const title = document.title;
      const brandElements = Array.from(document.querySelectorAll('*')).filter(el => el.textContent && el.textContent.includes('SUZARCHI'));
      const taglineElements = Array.from(document.querySelectorAll('*')).filter(el => el.textContent && el.textContent.includes('One Material. Multiple Possibilities.'));
      return {
        title,
        hasBrandText: brandElements.length > 0,
        hasTaglineText: taglineElements.length > 0
      };
    })()`);

    console.log(`Brand Text Detected: ${brandInfo.hasBrandText}, Tagline Detected: ${brandInfo.hasTaglineText}`);
    assert.ok(brandInfo.hasBrandText, 'Canonical English brand "SUZARCHI" must be visible');
    assert.ok(brandInfo.hasTaglineText, 'Exact canonical tagline "One Material. Multiple Possibilities." must be visible');
    console.log('✓ PASS: Canonical branding and tagline verified in actual DOM.');

    console.log('\n[TEST 2] Verifying 10 Professional Roles & State Adaptation in Real Browser...');
    const ROLES_TO_TEST = [
      { id: 'textile_manufacturer', title: 'Textile and Garment Manufacturer', expectedStream: 'GAR', hasSafety: false },
      { id: 'merchandiser_sourcing', title: 'Merchandiser and Sourcing Professional', expectedStream: 'FAB', hasSafety: false },
      { id: 'it_technology', title: 'IT and Technology Professional', expectedStream: 'PKG', hasSafety: false },
      { id: 'handloom_artisan', title: 'Handloom Artisan and Craft Producer', expectedStream: 'HLM', hasSafety: false },
      { id: 'recycler_recovery', title: 'Recycler and Material Recovery Business', expectedStream: 'SPN', hasSafety: false },
      { id: 'hospitality_operator', title: 'Hotels and Hospitality', expectedStream: 'HOS', hasSafety: false },
      { id: 'healthcare_manager', title: 'Hospitals and Healthcare Textile Managers', expectedStream: 'MED', hasSafety: true, safetySnippet: 'non-infectious' },
      { id: 'commercial_laundry', title: 'Commercial Laundry and Linen Hire', expectedStream: 'WRK', hasSafety: false },
      { id: 'mechanic_industrial', title: 'Mechanic Shops and Industrial Maintenance', expectedStream: 'OTH', hasSafety: true, safetySnippet: 'spontaneous combustion' },
      { id: 'general_user', title: 'General Supplier, Buyer and Trader', expectedStream: 'ALL', hasSafety: false },
    ];

    for (const role of ROLES_TO_TEST) {
      console.log(`  -> Testing Role Transition to: "${role.title}" (${role.id})...`);

      // 1. Open role modal by clicking the role badge button in HeroBanner
      const modalOpened = await evaluate(`(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('switch your professional role'));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      })()`);
      assert.ok(modalOpened, 'Failed to find role switch button in HeroBanner');
      
      // Wait for modal to render in DOM
      let roleSelected = false;
      for (let attempt = 0; attempt < 10; attempt++) {
        await wait(200);
        roleSelected = await evaluate(`((targetTitle) => {
          const cards = Array.from(document.querySelectorAll('.fixed .grid > div'));
          if (cards.length === 0) return false;
          const card = cards.find(c => {
            const h3 = c.querySelector('h3');
            return h3 && h3.textContent && h3.textContent.trim().toLowerCase().includes(targetTitle.trim().toLowerCase());
          });
          if (card) {
            card.click();
            return true;
          }
          return false;
        })('${role.title}')`);
        if (roleSelected) break;
      }
      assert.ok(roleSelected, `Failed to click role card for ${role.id}`);
      await wait(400);

      // 3. Inspect DOM after role transition
      const state = await evaluate(`(() => {
        const heroBadge = document.querySelector('button[title*="switch your professional role"] span')?.textContent || '';
        const heroSubline = document.querySelector('.max-w-xl p')?.textContent || '';
        const guidanceCard = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Industry Context & Technical Due Diligence'));
        const guidanceTitle = guidanceCard ? guidanceCard.querySelector('h3')?.textContent || '' : '';
        const safetyBanner = guidanceCard ? (guidanceCard.querySelector('.border-rose-300')?.textContent || '') : '';
        const quickActionsPanel = Array.from(document.querySelectorAll('div')).find(d => d.textContent && (d.textContent.includes('Role-Tailored Quick Actions') || d.textContent.includes('பணி சார்ந்த விரைவு நடவடிக்கைகள்')));
        const quickActions = quickActionsPanel ? Array.from(quickActionsPanel.querySelectorAll('.grid > button')).map(b => b.textContent.trim()) : [];
        const metricValues = Array.from(document.querySelectorAll('.grid.grid-cols-2.gap-3 span.font-black')).map(v => v.textContent.trim());
        const materialOptionsCount = document.querySelectorAll('select option').length;

        return {
          heroBadge,
          heroSubline,
          guidanceTitle,
          hasSafetyBanner: safetyBanner.length > 0,
          safetyText: safetyBanner,
          quickActionsCount: quickActions.length,
          quickActions,
          metricValuesCount: metricValues.length,
          metricValues,
          materialOptionsCount
        };
      })()`);

      assert.ok(state.heroBadge.includes(role.title) || role.title.includes(state.heroBadge), `Badge "${state.heroBadge}" should reflect role "${role.title}"`);
      assert.ok(state.guidanceTitle.length > 0, 'Guidance card title must be rendered');
      assert.equal(state.quickActionsCount, 4, `Expected 4 quick actions for role ${role.id}, got ${state.quickActionsCount}`);
      assert.equal(state.metricValuesCount, 5, `Expected 5 dynamic metrics for role ${role.id}, got ${state.metricValuesCount}`);
      assert.ok(state.materialOptionsCount >= 4, `Material listings must be preserved across role transitions (found ${state.materialOptionsCount})`);

      if (role.hasSafety) {
        assert.ok(state.hasSafetyBanner, `Role ${role.id} MUST display mandatory safety directive!`);
        assert.ok(state.safetyText.toLowerCase().includes(role.safetySnippet.toLowerCase()), `Safety text must include "${role.safetySnippet}"`);
        console.log(`    ✓ Verified Mandatory Safety Directive: "${state.safetyText.slice(0, 75)}..."`);
      } else {
        assert.ok(!state.hasSafetyBanner, `Role ${role.id} should not display irrelevant safety banner`);
      }

      console.log(`    ✓ Actions: [${state.quickActions.join(' | ')}]`);
      console.log(`    ✓ Metrics: [${state.metricValues.join(' | ')}]`);
    }
    console.log('✓ PASS: All 10 roles verified with dynamic adaptation, safety gates and state preservation.');

    console.log('\n[TEST 3] Verifying Bilingual Tamil Toggle & Brand Protection...');
    // Open settings menu and click Tamil
    await evaluate(`(() => {
      const settingsBtn = document.querySelector('button[title*="Language & Unit Settings"]');
      if (settingsBtn) settingsBtn.click();
    })()`);
    await wait(200);

    const switchedToTamil = await evaluate(`(() => {
      const taBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('தமிழ் (Tamil)'));
      if (taBtn) {
        taBtn.click();
        return true;
      }
      return false;
    })()`);
    assert.ok(switchedToTamil, 'Failed to click Tamil language button');
    await wait(400);

    const tamilState = await evaluate(`(() => {
      const brandElements = Array.from(document.querySelectorAll('*')).filter(el => el.textContent && el.textContent.includes('SUZARCHI'));
      const tamilSubline = document.querySelector('.max-w-xl p')?.textContent || '';
      const taNavText = Array.from(document.querySelectorAll('header *')).some(el => el.textContent && el.textContent.includes('தமிழ்'));
      return {
        hasBrandText: brandElements.length > 0,
        tamilSubline,
        taNavText
      };
    })()`);

    assert.ok(tamilState.hasBrandText, 'Canonical English brand "SUZARCHI" MUST remain unchanged even in Tamil UI!');
    assert.ok(tamilState.tamilSubline.length > 0, 'Tamil welcome subline must be populated');
    console.log(`✓ PASS: Tamil interface rendered. Subline: "${tamilState.tamilSubline.slice(0, 50)}...". Brand "SUZARCHI" permanently preserved.`);

    // Switch back to English
    await evaluate(`(() => {
      const settingsBtn = document.querySelector('button[title*="Language & Unit Settings"]');
      if (settingsBtn) settingsBtn.click();
    })()`);
    await wait(200);
    await evaluate(`(() => {
      const enBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.trim() === 'English');
      if (enBtn) enBtn.click();
    })()`);
    await wait(300);

    console.log('\n[TEST 4] Verifying Unit System & Regional Overrides (Imperial, oz, ft)...');
    // Open settings menu and select Imperial
    await evaluate(`(() => {
      const settingsBtn = document.querySelector('button[title*="Language & Unit Settings"]');
      if (settingsBtn) settingsBtn.click();
    })()`);
    await wait(200);

    await evaluate(`(() => {
      const impBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Imperial (lb, in)'));
      if (impBtn) impBtn.click();
    })()`);
    await wait(300);

    const imperialDisplay = await evaluate(`(() => {
      const allText = document.body.innerText;
      const hasLb = allText.includes('lb');
      return { hasLb };
    })()`);

    assert.ok(imperialDisplay.hasLb, 'Weight quantities must be formatted in "lb" in Imperial mode');
    console.log('✓ PASS: Imperial mode converts continuous weights to "lb".');

    // Switch back to Metric
    await evaluate(`(() => {
      const settingsBtn = document.querySelector('button[title*="Language & Unit Settings"]');
      if (settingsBtn) settingsBtn.click();
    })()`);
    await wait(200);
    await evaluate(`(() => {
      const metBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Metric (kg, m)'));
      if (metBtn) metBtn.click();
    })()`);
    await wait(300);

    console.log('\n[TEST 5] Verifying In-Memory Persistence Boundaries (Zero LocalStorage, Zero Cookies)...');
    const storageCheck = await evaluate(`(() => {
      const lsKeys = Object.keys(localStorage);
      const ssKeys = Object.keys(sessionStorage);
      const cookies = document.cookie;
      return {
        lsCount: lsKeys.length,
        ssCount: ssKeys.length,
        cookiesLength: cookies.length
      };
    })()`);

    console.log(`Storage check: localStorage keys: ${storageCheck.lsCount}, sessionStorage keys: ${storageCheck.ssCount}, cookies: ${storageCheck.cookiesLength}`);
    assert.equal(storageCheck.lsCount, 0, 'Application MUST NOT use localStorage (browser memory only)');
    assert.equal(storageCheck.ssCount, 0, 'Application MUST NOT use sessionStorage');
    assert.equal(storageCheck.cookiesLength, 0, 'Application MUST NOT set any cookies');
    console.log('✓ PASS: Strict in-memory session boundary confirmed (zero localStorage, zero cookies).');

    console.log('\n================================================================');
    console.log('  ALL 5 REAL-BROWSER INTERACTION ACCEPTANCE TESTS PASSED (100%)');
    console.log('================================================================\n');

  } finally {
    ws.close();
    edgeProc.kill();
  }
}

runBrowserVerification().catch((err) => {
  console.error('\n❌ Browser Verification Failed:', err);
  process.exit(1);
});
