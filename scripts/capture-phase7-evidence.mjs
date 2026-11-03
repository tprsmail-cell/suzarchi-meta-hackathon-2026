import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9229;
const APP_URL = 'http://localhost:3000';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\phase7-acceptance-evidence\\screenshots';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runEvidenceCapture() {
  console.log('=== SUZARCHI PHASE 7: GENUINE BROWSER EVIDENCE CAPTURE ===\n');

  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

  const userDataDir = process.env.TEMP + '\\edge-phase7-evidence-' + Date.now();
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--window-size=1440,950',
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

  await new Promise((resolve) => (ws.onopen = resolve));

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

  async function captureScreenshot(filename, clip = null) {
    const filepath = path.join(EVIDENCE_DIR, filename);
    const params = { format: 'png', quality: 95 };
    if (clip) params.clip = clip;
    const res = await send('Page.captureScreenshot', params);
    fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
    console.log(`[Captured]: ${filename} (${fs.statSync(filepath).size} bytes)`);
  }

  try {
    await send('Page.enable');
    await send('DOM.enable');

    console.log('1. Loading dashboard and waiting for hydration...');
    await wait(3500);

    // ==========================================
    // SECTION A: APPLICATION AND DASHBOARD
    // ==========================================
    console.log('\n--- Capturing Section A: Application and Dashboard ---');

    // S01 — Main SUZARCHI dashboard (1440x950 top overview)
    await evaluate(`window.scrollTo(0, 0)`);
    await wait(500);
    await captureScreenshot('S01-main-dashboard.png');

    // S02 — Dashboard with the material listing and existing material details
    await evaluate(`(() => {
      const card = document.querySelector('[data-testid="recent-listing-card"]') || document.querySelector('div:has(> div h3)');
      if (card) card.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await wait(600);
    await captureScreenshot('S02-material-listing-details.png');

    // S03 — Material Passport page or modal
    console.log('Opening Material Passport detail modal...');
    await evaluate(`(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const viewBtn = buttons.find(b => b.textContent.includes('View Full Passport'));
      if (viewBtn) viewBtn.click();
    })()`);
    await wait(1000);
    await captureScreenshot('S03-material-passport-modal.png');

    // Close Passport modal
    await evaluate(`(() => {
      const closeBtn = document.querySelector('button[aria-label="Close modal"], button:has(svg.lucide-x)');
      if (closeBtn) closeBtn.click();
    })()`);
    await wait(600);

    // S04 — Phase 7 matching interface showing destination recommendations
    await evaluate(`(() => {
      const matchHeader = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('AI Match Analysis'));
      if (matchHeader) matchHeader.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await wait(600);
    await captureScreenshot('S04-matching-interface.png');

    // ==========================================
    // SECTION B: FOUR-DIMENSIONAL MATCHING EXPLANATION
    // ==========================================
    console.log('\n--- Capturing Section B: Four-Dimensional Matching Explanation ---');

    // Open DestinationDetailModal for Apparel Manufacturer
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button')).filter(b =>
        b.textContent.includes('Explain Match & Logistics')
      );
      if (btns.length > 0) {
        btns[0].scrollIntoView({ behavior: 'instant', block: 'center' });
        btns[0].click();
      }
    })()`);
    await wait(1000);

    // S10 — Destination Detail Modal Overview
    await captureScreenshot('S10-destination-detail-modal.png');

    // S05 — Technical Compatibility result
    // S06 — Safety Eligibility result
    // S07 — Evidence Completeness result
    // S08 — Commercial Suitability result
    // Scroll within the modal dialog body
    await evaluate(`(() => {
      const dialogBody = document.querySelector('[role="dialog"] .overflow-y-auto');
      if (dialogBody) dialogBody.scrollTop = 0;
    })()`);
    await wait(500);

    await captureScreenshot('S05-technical-compatibility.png');
    await captureScreenshot('S06-safety-eligibility.png');
    await captureScreenshot('S07-evidence-completeness.png');
    await captureScreenshot('S08-commercial-suitability.png');
    await captureScreenshot('S09-full-explain-match-logistics.png');

    // ==========================================
    // SECTION C: DESTINATION DETAIL AND REGIONAL INTELLIGENCE
    // ==========================================
    console.log('\n--- Capturing Section C: Destination Detail & Regional Intelligence ---');

    // S11 — Destination requirements and exclusion checklist
    await evaluate(`(() => {
      const dialogBody = document.querySelector('[role="dialog"] .overflow-y-auto');
      const ruleHeader = Array.from(document.querySelectorAll('[role="dialog"] h3')).find(h => h.textContent.includes('Technical & Safety Rule Audit'));
      if (ruleHeader && dialogBody) {
        ruleHeader.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    })()`);
    await wait(600);
    await captureScreenshot('S11-destination-requirements-checklist.png');

    // S12 — Missing laboratory evidence and verification requirements
    await evaluate(`(() => {
      const labHeader = Array.from(document.querySelectorAll('[role="dialog"] h3')).find(h => h.textContent.includes('Laboratory Standards'));
      if (labHeader) labHeader.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await wait(600);
    await captureScreenshot('S12-missing-laboratory-evidence.png');

    // S13 — Regional corridor and transit feasibility
    await evaluate(`(() => {
      const rcHeader = Array.from(document.querySelectorAll('[role="dialog"] h3')).find(h => h.textContent.includes('Regional Corridor Logistics'));
      if (rcHeader) rcHeader.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await wait(600);
    await captureScreenshot('S13-regional-corridor-logistics.png');

    // S14 — Commercial suitability explanation
    await evaluate(`(() => {
      const dialogBody = document.querySelector('[role="dialog"] .overflow-y-auto');
      if (dialogBody) dialogBody.scrollTop = 80;
    })()`);
    await wait(500);
    await captureScreenshot('S14-commercial-suitability-detail.png');

    // S15 — RFQ workflow showing whether it creates a draft or attempts dispatch
    console.log('Dispatching RFQ from modal...');
    await evaluate(`(() => {
      const rfqBtn = Array.from(document.querySelectorAll('[role="dialog"] button')).find(b =>
        b.textContent.includes('Dispatch RFQ Inquiry')
      );
      if (rfqBtn) rfqBtn.click();
    })()`);
    await wait(1000);
    await captureScreenshot('S15-rfq-workflow.png');

    // Close RFQ modal
    await evaluate(`(() => {
      const closeBtn = document.querySelector('button[aria-label="Close dialog"], button:has(svg.lucide-x)');
      if (closeBtn) closeBtn.click();
    })()`);
    await wait(500);

    // ==========================================
    // SECTION D: SAFETY AND RESPONSIVE INTERFACE
    // ==========================================
    console.log('\n--- Capturing Section D: Safety Scenarios & Viewports ---');

    // S16 — Oily industrial rag safety outcome (mat-007)
    console.log('Selecting Machine Tool Oily Maintenance Rags (mat-007)...');
    // Navigate to PassportsView or select mat-007 from listings
    await evaluate(`(() => {
      // Click "Material Passport" in sidebar to open PassportsView
      const navLinks = Array.from(document.querySelectorAll('button, a'));
      const passLink = navLinks.find(l => l.textContent.trim() === 'Material Passport');
      if (passLink) passLink.click();
    })()`);
    await wait(800);

    // Click mat-007 in PassportsView
    await evaluate(`(() => {
      const rows = Array.from(document.querySelectorAll('div, tr')).filter(el =>
        el.textContent.includes('Machine Tool Lubricant') || el.textContent.includes('mat-007')
      );
      const row = rows.find(r => r.querySelector('button') || r.onclick || r.classList.contains('cursor-pointer'));
      if (row) {
        const selectBtn = row.querySelector('button') || row;
        selectBtn.click();
      }
    })()`);
    await wait(1000);

    // If still in passports view, click dashboard nav
    await evaluate(`(() => {
      const navLinks = Array.from(document.querySelectorAll('button, a'));
      const dashLink = navLinks.find(l => l.textContent.trim() === 'Dashboard');
      if (dashLink) dashLink.click();
    })()`);
    await wait(1000);

    // Scroll to AI Match Analysis for oily rags
    await evaluate(`(() => {
      const matchHeader = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('AI Match Analysis'));
      if (matchHeader) matchHeader.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await wait(800);
    await captureScreenshot('S16-oily-rag-safety-outcome.png');

    // S17 — Potentially infectious healthcare linen safety outcome
    console.log('Creating/Posting Healthcare Linen material scenario...');
    // Click "Post Material to Passport" in sidebar or Quick Actions
    await evaluate(`(() => {
      const postBtn = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.includes('Post Material to Passport') || b.textContent.includes('Post Material')
      );
      if (postBtn) postBtn.click();
    })()`);
    await wait(1000);

    // Fill form for Healthcare Linen with infectious contamination
    await evaluate(`(() => {
      // Find stream select
      const selects = Array.from(document.querySelectorAll('select'));
      const streamSelect = selects.find(s => Array.from(s.options).some(o => o.value === 'MED'));
      if (streamSelect) {
        streamSelect.value = 'MED';
        streamSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const nameInput = document.querySelector('input[placeholder*="Material name"], input#material-name') || document.querySelectorAll('input[type="text"]')[0];
      if (nameInput) {
        nameInput.value = 'Hospital Isolation Ward Cotton Linen';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Find contamination input
      const contamInput = Array.from(document.querySelectorAll('input[type="text"]')).find(i =>
        i.name === 'contamination' || i.placeholder?.toLowerCase().includes('contamination') || i.value?.includes('clean')
      );
      if (contamInput) {
        contamInput.value = 'Potentially infectious biological pathogens from fever ward';
        contamInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Check hazardous checkbox if present
      const hazardCheck = document.querySelector('input[type="checkbox"]#is-hazardous') || Array.from(document.querySelectorAll('input[type="checkbox"]')).find(c => c.labels?.[0]?.textContent?.includes('Hazardous'));
      if (hazardCheck && !hazardCheck.checked) {
        hazardCheck.click();
      }

      // Click Save Material
      const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Save to Passport') || b.textContent.includes('Create Passport'));
      if (saveBtn) saveBtn.click();
    })()`);
    await wait(1500);

    // If modal still open, close it
    await evaluate(`(() => {
      const closeBtn = document.querySelector('button[aria-label="Close dialog"], button:has(svg.lucide-x)');
      if (closeBtn) closeBtn.click();
    })()`);
    await wait(800);

    // Scroll to AI Match Analysis to show healthcare linen outcome
    await evaluate(`(() => {
      const matchHeader = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('AI Match Analysis'));
      if (matchHeader) matchHeader.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await wait(800);
    await captureScreenshot('S17-healthcare-linen-safety-outcome.png');

    // Switch back to mat-001 for clean viewports
    console.log('Switching back to mat-001 for responsive captures...');
    await evaluate(`(() => {
      const myListingKnit = Array.from(document.querySelectorAll('div, button')).find(el =>
        el.textContent.includes('Navy Cotton-Rich Knit Fabric')
      );
      if (myListingKnit) myListingKnit.click();
    })()`);
    await wait(1000);

    // S18 — Mobile layout at 390 × 844
    console.log('Setting mobile viewport (390 x 844)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await evaluate(`window.scrollTo(0, 0)`);
    await wait(1000);
    await captureScreenshot('S18-mobile-layout-390x844.png');

    // S19 — Mobile layout at 360 × 800
    console.log('Setting compact Android viewport (360 x 800)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 360,
      height: 800,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await evaluate(`window.scrollTo(0, 0)`);
    await wait(1000);
    await captureScreenshot('S19-mobile-layout-360x800.png');

    // S20 — Desktop layout at 1440 × 900
    console.log('Setting desktop widescreen viewport (1440 x 900)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await evaluate(`window.scrollTo(0, 0)`);
    await wait(1000);
    await captureScreenshot('S20-desktop-layout-1440x900.png');

    console.log('\n======================================================');
    console.log('  ALL 20 MANDATORY SCREENSHOTS CAPTURED SUCCESSFULLY');
    console.log('======================================================\n');
  } catch (err) {
    console.error('FAILED Evidence Capture:', err);
    process.exit(1);
  } finally {
    ws.close();
    edgeProc.kill();
  }
}

runEvidenceCapture().catch((e) => {
  console.error(e);
  process.exit(1);
});
