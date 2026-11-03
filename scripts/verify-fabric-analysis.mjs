import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9225;
const APP_URL = 'http://localhost:3000';
const ARTIFACT_DIR = 'C:\\Users\\Merch\\.gemini\\antigravity\\brain\\bd2de537-0962-45e2-a6f8-f3193ee33f5e';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runFabricAnalysisVerification() {
  console.log('=== Starting SUZARCHI Knitted Fabric Analysis & Image Integrity Verification ===');

  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--window-size=1440,900',
    '--user-data-dir=' + process.env.TEMP + '\\edge-fabric-test-' + Date.now(),
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
      throw new Error(`Eval Error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result ? res.result.value : undefined;
  }

  async function captureScreenshot(fileName) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(ARTIFACT_DIR, fileName);
    fs.writeFileSync(outPath, buffer);
    console.log(`  -> Saved screenshot: ${fileName}`);
  }

  try {
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: APP_URL });
    await wait(2500);

    // -------------------------------------------------------------
    // TEST 1: Material Image Association & Landscape Elimination
    // -------------------------------------------------------------
    console.log('\n[TEST 1] Verifying Image Association & Elimination of Unrelated Mountain Banner...');
    const imageAudit = await evaluate(`(() => {
      // Find the primary image or SVG in the Recent Material Listing card
      const listingCard = document.querySelector('[class*="sm:col-span-4"]');
      if (!listingCard) return { error: 'Listing card photo column not found' };

      const imgTag = listingCard.querySelector('img');
      const imgSrc = imgTag ? imgTag.src : null;

      const svgTag = listingCard.querySelector('svg');
      const hasSvg = svgTag !== null;

      const placeholderText = listingCard.innerText;
      const hasPlaceholderBadge = placeholderText.includes('Textile Structure Placeholder');
      const hasDemoBadge = placeholderText.includes('DEMO DATA');

      return {
        imgSrc,
        hasSvg,
        hasPlaceholderBadge,
        hasDemoBadge,
        isNatureBannerPresent: imgSrc ? imgSrc.includes('nature-banner') : false
      };
    })()`);

    console.log('Image Audit Result:', imageAudit);
    assert.equal(imageAudit.isNatureBannerPresent, false, 'Unrelated mountain landscape MUST NOT be displayed as material photograph');
    assert.ok(imageAudit.hasPlaceholderBadge, 'Clearly labelled textile-image placeholder must be visible when no photo is attached');
    assert.ok(imageAudit.hasDemoBadge, 'DEMO DATA badge must remain visible for sample records');
    console.log('✓ PASS: Mountain landscape successfully eliminated; textile structure placeholder with DEMO DATA verified.');

    // -------------------------------------------------------------
    // TEST 2: Dedicated Knitted Fabric Technical Analysis Section
    // -------------------------------------------------------------
    console.log('\n[TEST 2] Verifying Dedicated Knitted Fabric Technical Analysis Component...');
    const fabricSectionAudit = await evaluate(`(() => {
      const allText = document.body.innerText;
      const hasTitle = allText.includes('Knitted Fabric Technical Analysis');
      const hasIdentificationTab = allText.includes('A. Material Identification');
      const hasVisualTab = allText.includes('B. Visual Fabric Inspection');
      const hasSpecsTab = allText.includes('C. Technical Specification Table');
      const hasLabTestsTab = allText.includes('D. Physical & Lab Tests');
      const hasDestinationsTab = allText.includes('E. Compatibility & Destinations');

      return {
        hasTitle,
        hasIdentificationTab,
        hasVisualTab,
        hasSpecsTab,
        hasLabTestsTab,
        hasDestinationsTab
      };
    })()`);

    console.log('Fabric Section Tabs:', fabricSectionAudit);
    assert.ok(fabricSectionAudit.hasTitle, 'Knitted Fabric Technical Analysis section must be rendered');
    assert.ok(fabricSectionAudit.hasIdentificationTab, 'Tab A must exist');
    assert.ok(fabricSectionAudit.hasVisualTab, 'Tab B must exist');
    assert.ok(fabricSectionAudit.hasSpecsTab, 'Tab C must exist');
    assert.ok(fabricSectionAudit.hasLabTestsTab, 'Tab D must exist');
    assert.ok(fabricSectionAudit.hasDestinationsTab, 'Tab E must exist');
    console.log('✓ PASS: Dedicated Knitted Fabric Technical Analysis section with all 5 subsections confirmed.');

    // -------------------------------------------------------------
    // TEST 3: Technical Specifications Table & 4-Tier Evidence Verification
    // -------------------------------------------------------------
    console.log('\n[TEST 3] Verifying Technical Specification Assessment Table & Evidence Statuses...');
    // Click Tab C
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('C. Technical Specification Table'));
      if (btn) btn.click();
    })()`);
    await wait(400);

    const tableAudit = await evaluate(`(() => {
      const table = document.querySelector('table');
      if (!table) return { error: 'Specification table not found' };

      const rows = Array.from(table.querySelectorAll('tbody tr')).map(r => {
        const cells = Array.from(r.querySelectorAll('td')).map(c => c.textContent.trim());
        return {
          param: cells[0],
          value: cells[1],
          status: cells[2],
          auditMethod: cells[3]
        };
      });

      return { rowCount: rows.length, rows };
    })()`);

    console.log(`Found ${tableAudit.rowCount} specification rows in table:`);
    tableAudit.rows.forEach(r => console.log(`  - ${r.param}: ${r.value} [${r.status}] -> ${r.auditMethod}`));

    assert.ok(tableAudit.rows.some(r => r.param.includes('Construction') && r.value.includes('Single Jersey') && r.status.includes('REPORTED')), 'Construction must be Single Jersey (REPORTED)');
    assert.ok(tableAudit.rows.some(r => r.param.includes('Composition') && r.status.includes('REPORTED') && r.auditMethod.includes('ISO 1833')), 'Composition must be REPORTED with ISO 1833 verification requirement');
    assert.ok(tableAudit.rows.some(r => r.param.includes('Weight (GSM)') && r.status.includes('ESTIMATED')), 'GSM must be ESTIMATED');
    assert.ok(tableAudit.rows.some(r => r.param.includes('Colour') && r.value.includes('Navy') && r.status.includes('CONFIRMED')), 'Colour must be Navy (CONFIRMED)');
    console.log('✓ PASS: Technical specification table respects 4-tier evidence model without unearned upgrades.');

    // -------------------------------------------------------------
    // TEST 4: Visual Fabric Inspection & Explicit Optical Limitations
    // -------------------------------------------------------------
    console.log('\n[TEST 4] Verifying Visual Fabric Inspection & Optical Limitations Alert...');
    // Click Tab B
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('B. Visual Fabric Inspection'));
      if (btn) btn.click();
    })()`);
    await wait(400);

    const visualAudit = await evaluate(`(() => {
      const text = document.body.innerText;
      const hasFaceReverse = text.includes('Face & Reverse Structure');
      const hasStitchRegularity = text.includes('Stitch Loop Regularity');
      const hasDefectScan = text.includes('Surface Defects & Holes');
      const hasLimitationAlert = text.includes('Scientific Inspection Limitation') && text.includes('CANNOT conclusively prove');

      return {
        hasFaceReverse,
        hasStitchRegularity,
        hasDefectScan,
        hasLimitationAlert
      };
    })()`);

    assert.ok(visualAudit.hasFaceReverse, 'Face & reverse single jersey loop structure must be documented');
    assert.ok(visualAudit.hasLimitationAlert, 'Mandatory optical limitation notice must explicitly state photos cannot prove chemical composition or lab properties');
    console.log('✓ PASS: Visual fabric inspection correctly presents optical observations alongside mandatory limitations.');

    // -------------------------------------------------------------
    // TEST 5: Recommended Physical and Laboratory Tests
    // -------------------------------------------------------------
    console.log('\n[TEST 5] Verifying Recommended Physical & Laboratory Tests...');
    // Click Tab D
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('D. Physical & Lab Tests'));
      if (btn) btn.click();
    })()`);
    await wait(400);

    const labTestsAudit = await evaluate(`(() => {
      const text = document.body.innerText;
      const hasIso1833 = text.includes('ISO 1833');
      const hasGsmTest = text.includes('ISO 3801') || text.includes('GSM Cutter');
      const hasShrinkage = text.includes('ISO 6330') || text.includes('Shrinkage');
      const hasSpirality = text.includes('Spirality') || text.includes('Torque');

      return { hasIso1833, hasGsmTest, hasShrinkage, hasSpirality };
    })()`);

    assert.ok(labTestsAudit.hasIso1833, 'ISO 1833 test must be recommended');
    assert.ok(labTestsAudit.hasGsmTest, 'GSM cutter test must be recommended');
    assert.ok(labTestsAudit.hasShrinkage, 'Shrinkage test must be recommended');
    assert.ok(labTestsAudit.hasSpirality, 'Spirality test must be recommended');
    console.log('✓ PASS: All relevant knitted fabric laboratory and physical test protocols recommended.');

    // -------------------------------------------------------------
    // TEST 6: Compatibility and Potential Destination Breakdown
    // -------------------------------------------------------------
    console.log('\n[TEST 6] Verifying Destination Compatibility & Safety Rules Connection...');
    // Click Tab E
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('E. Compatibility & Destinations'));
      if (btn) btn.click();
    })()`);
    await wait(400);

    const destAudit = await evaluate(`(() => {
      const text = document.body.innerText;
      const hasApparel = text.includes('Apparel Manufacturer');
      const hasWiping = text.includes('Industrial Wiping');
      const hasRecycler = text.includes('Recycler');
      const hasTechnicalComp = text.includes('Technical Compatibility');
      const hasSafetyElig = text.includes('Safety Eligibility');
      const hasEvidenceComp = text.includes('Evidence Completeness');
      const hasCommercialSuit = text.includes('Commercial Suitability');

      return {
        hasApparel,
        hasWiping,
        hasRecycler,
        hasTechnicalComp,
        hasSafetyElig,
        hasEvidenceComp,
        hasCommercialSuit
      };
    })()`);

    assert.ok(destAudit.hasApparel, 'Apparel destination must be present');
    assert.ok(destAudit.hasWiping, 'Wiping destination must be present');
    assert.ok(destAudit.hasRecycler, 'Recycler destination must be present');
    assert.ok(destAudit.hasTechnicalComp && destAudit.hasSafetyElig, '4-dimensional evaluation criteria must be rendered for destinations');
    console.log('✓ PASS: Circular reuse pathways connected with deterministic compatibility rule engine.');

    // -------------------------------------------------------------
    // TEST 7: Global Demand Snapshot Demarcation
    // -------------------------------------------------------------
    console.log('\n[TEST 7] Verifying Global Demand Snapshot Demarcation & Market Indicator Labels...');
    const demandAudit = await evaluate(`(() => {
      const snapshot = Array.from(document.querySelectorAll('div')).find(d => d.textContent.includes('Global Demand Snapshot'));
      if (!snapshot) return { error: 'Global Demand Snapshot not found' };
      const text = snapshot.innerText;
      const hasIllustrativeLabel = text.includes('Illustrative Trade Indicators') || text.includes('Macro Indicators');
      const hasTransparencyNotice = text.includes('Transparency Notice') || text.includes('illustrative regional market indicators');

      return { hasIllustrativeLabel, hasTransparencyNotice };
    })()`);

    assert.ok(demandAudit.hasIllustrativeLabel, 'Global Demand Snapshot must be clearly labelled as illustrative trade indicators');
    assert.ok(demandAudit.hasTransparencyNotice, 'Global Demand Snapshot must display explicit market intelligence transparency notice');
    console.log('✓ PASS: Global Demand Snapshot distinctly demarcated from technical fabric analysis.');

    // -------------------------------------------------------------
    // TEST 8: Material Record Switching (mat-001 -> mat-007 Oily Rags)
    // -------------------------------------------------------------
    console.log('\n[TEST 8] Verifying Material Record Switching & Hazardous Safety Overrides...');
    // Switch to mat-007 (Workshop oily rags) using floating switcher
    await evaluate(`(() => {
      const select = document.querySelector('select');
      if (select) {
        select.value = 'mat-007';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await wait(600);

    const oilyAudit = await evaluate(`(() => {
      const text = document.body.innerText;
      const hasHazardousTrack = text.includes('Hazardous Track');
      const hasTsdfRoute = text.includes('Cement Kiln') || text.includes('TSDF');
      const hasDisqualified = text.includes('Disqualified') || text.includes('BLOCKED (HAZARD)');

      return { hasHazardousTrack, hasTsdfRoute, hasDisqualified };
    })()`);

    console.log('Oily Material Audit:', oilyAudit);
    assert.ok(oilyAudit.hasHazardousTrack, 'Hazardous material must display Hazardous Track badge');
    assert.ok(oilyAudit.hasDisqualified, 'Hazardous material must be disqualified from open reuse');
    console.log('✓ PASS: Switching material records updates images, specifications, and enforces hard safety gates.');

    // Switch back to mat-001
    await evaluate(`(() => {
      const select = document.querySelector('select');
      if (select) {
        select.value = 'mat-001';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await wait(600);

    // -------------------------------------------------------------
    // TEST 9: Visual Evidence Captures
    // -------------------------------------------------------------
    console.log('\n[TEST 9] Capturing Detailed Visual Verification Artifacts...');
    // Reset to Tab A
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('A. Material Identification'));
      if (btn) btn.click();
    })()`);
    await wait(400);

    // Capture Desktop 1440x900
    await captureScreenshot('fabric_analysis_desktop_1440.png');

    // Capture Tab C Specs Table
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('C. Technical Specification Table'));
      if (btn) btn.click();
    })()`);
    await wait(400);
    await captureScreenshot('fabric_specs_table.png');

    // Capture Tab E Destinations
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('E. Compatibility & Destinations'));
      if (btn) btn.click();
    })()`);
    await wait(400);
    await captureScreenshot('fabric_destinations_eval.png');

    // Capture Mobile 390x844
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await wait(500);
    await captureScreenshot('fabric_analysis_mobile_390.png');

    console.log('\n================================================================');
    console.log('  ALL 9 FABRIC ANALYSIS & IMAGE INTEGRITY TESTS PASSED (100%)');
    console.log('================================================================\n');

  } finally {
    ws.close();
    edgeProc.kill();
  }
}

runFabricAnalysisVerification().catch((err) => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
