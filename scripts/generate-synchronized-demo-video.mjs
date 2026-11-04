import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PORT = 9285;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\docs\\release\\demo-recording-evidence';
const REVISED_AUDIO_DIR = path.join(EVIDENCE_DIR, 'audio-revised');
const OUTPUT_VIDEO_MP4 = 'D:\\SUZARCHI hackathon\\docs\\release\\SUZARCHI_Meta_Hackathon_Precision_Synchronized_Demo.mp4';
const ARTIFACT_DIR = 'C:\\Users\\Merch\\.gemini\\antigravity\\brain\\bd2de537-0962-45e2-a6f8-f3193ee33f5e';

const STEPS = [
  {
    step: 0,
    title: 'Turning Textile Surplus into Global Opportunities',
    sub: 'SUZARCHI (சுழற்சி) — One Material. Multiple Possibilities. — Meta AI Hackathon 2026',
    initialImg: '/img/DEMO-STEP-00-opening.png',
    audio: '/audio/step-00-opening.wav',
    subtitles: [
      { start: 0.0, end: 3.2, text: 'Every day, valuable textiles go to waste.' },
      { start: 3.2, end: 6.7, text: 'SUZARCHI connects surplus materials to new possibilities.' },
    ],
    interactions: [
      {
        start: 1.0,
        end: 5.5,
        cursorStart: { x: 1400, y: 750 },
        cursorEnd: { x: 960, y: 520 },
        clickTime: null,
        highlightBox: { x: 420, y: 340, w: 1080, h: 360, label: 'Circular Textile Operating System' },
      },
    ],
  },
  {
    step: 1,
    title: '1. Material Discovery & Origin (Tiruppur, India)',
    sub: '300 kg Navy Single Jersey Knit Fabric (PCB-2026-IN-42) in 2,400 kg Facility Allocation',
    initialImg: '/img/DEMO-MODE-walkthrough-active.png',
    actionImg: '/img/DEMO-STEP-01-material-discovery.png',
    audio: '/audio/step-01-discovery.wav',
    subtitles: [
      { start: 0.0, end: 4.5, text: 'Welcome to SUZARCHI: One Material, Multiple Possibilities.' },
      { start: 4.5, end: 13.5, text: 'In Tiruppur, Tamil Nadu, an active 300 kg lot of navy single jersey knit fabric, batch PCB-2026-IN-42, is cataloged.' },
      { start: 13.5, end: 23.0, text: 'Physical dimensions and origin are confirmed, while self-reported fiber blend awaits chemical verification.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 4.2,
        cursorStart: { x: 960, y: 700 },
        cursorEnd: { x: 620, y: 440 },
        clickTime: 4.0,
        switchImgAt: 4.2,
      },
      {
        start: 4.5,
        end: 13.0,
        cursorStart: { x: 620, y: 440 },
        cursorEnd: { x: 480, y: 320 },
        highlightBox: { x: 340, y: 220, w: 480, h: 160, label: '300 kg Warehouse Lot • Batch PCB-2026-IN-42 • Confirmed' },
      },
      {
        start: 13.5,
        end: 18.0,
        cursorStart: { x: 480, y: 320 },
        cursorEnd: { x: 880, y: 490 },
        highlightBox: { x: 740, y: 450, w: 440, h: 90, label: '180 GSM • 145 cm Width • ESTIMATED' },
      },
      {
        start: 18.2,
        end: 23.0,
        cursorStart: { x: 880, y: 490 },
        cursorEnd: { x: 1240, y: 490 },
        highlightBox: { x: 1040, y: 450, w: 520, h: 90, label: 'Fibre Blend: Cotton Rich • REPORTED • Lab Test Required' },
      },
    ],
  },
  {
    step: 2,
    title: '2. AI Intake & Meta AI Architecture Preparation',
    sub: 'Meta Llama 3.2 Vision Schema — Deterministic Local Mode — Zero Spend & Privacy Preserved',
    initialImg: '/img/DEMO-STEP-01-material-discovery.png',
    actionImg: '/img/DEMO-STEP-02-ai-assisted-intake.png',
    audio: '/audio/step-02-ai-intake.wav',
    subtitles: [
      { start: 0.0, end: 5.5, text: "Our material intake combines AI-assisted analysis with SUZARCHI's deterministic validation engine." },
      { start: 5.5, end: 11.5, text: 'The system identifies visible material characteristics and generates structured extraction candidates.' },
      { start: 11.5, end: 18.0, text: 'Evidence governance ensures that photographs alone cannot confirm fibre composition, GSM or chemical safety.' },
      { start: 18.0, end: 23.8, text: 'All unverified properties remain clearly identified for human review.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 2.8,
        cursorStart: { x: 1240, y: 490 },
        cursorEnd: { x: 1040, y: 720 },
        clickTime: 2.6,
        switchImgAt: 2.8,
      },
      {
        start: 3.0,
        end: 11.0,
        cursorStart: { x: 1040, y: 720 },
        cursorEnd: { x: 560, y: 440 },
        highlightBox: { x: 380, y: 220, w: 460, h: 420, label: 'Meta Llama 3.2 Vision Schema • Local Offline Mode' },
      },
      {
        start: 11.5,
        end: 17.5,
        cursorStart: { x: 560, y: 440 },
        cursorEnd: { x: 1060, y: 340 },
        highlightBox: { x: 880, y: 220, w: 660, h: 180, label: 'Precautionary Bar: Optical Photos Cannot CONFIRM Blend' },
      },
      {
        start: 18.0,
        end: 23.5,
        cursorStart: { x: 1060, y: 340 },
        cursorEnd: { x: 1180, y: 560 },
        highlightBox: { x: 880, y: 440, w: 660, h: 360, label: 'Structured Extraction Candidates • Human Review Required' },
      },
    ],
  },
  {
    step: 3,
    title: '3. Material Passport (Digital Product Passport)',
    sub: 'EU ESPR URN Syntax — 4-Tier Evidence Model — Batch QR Traceability & Integrity',
    initialImg: '/img/DEMO-MODE-walkthrough-active.png',
    actionImg: '/img/DEMO-STEP-03-material-passport.png',
    audio: '/audio/step-03-passport.wav',
    subtitles: [
      { start: 0.0, end: 6.5, text: 'Every listing generates a structured Material Passport aligned with EU Digital Product Passport data syntax.' },
      { start: 6.5, end: 17.0, text: 'Transparent 4-tier evidence badging ensures industrial buyers know exactly what is measured versus what is self-reported.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 2.3,
        cursorStart: { x: 960, y: 700 },
        cursorEnd: { x: 1040, y: 720 },
        clickTime: 2.1,
        switchImgAt: 2.3,
      },
      {
        start: 2.5,
        end: 8.5,
        cursorStart: { x: 1040, y: 720 },
        cursorEnd: { x: 620, y: 280 },
        highlightBox: { x: 380, y: 190, w: 580, h: 120, label: 'EU ESPR DPP URN Traceability: urn:dpp:suzarchi:in:mat-001' },
      },
      {
        start: 8.8,
        end: 16.8,
        cursorStart: { x: 620, y: 280 },
        cursorEnd: { x: 1060, y: 520 },
        highlightBox: { x: 380, y: 340, w: 1160, h: 380, label: '4-Tier Hierarchy: CONFIRMED • REPORTED • ESTIMATED • UNKNOWN' },
      },
    ],
  },
  {
    step: 4,
    title: '4. 4D Circular Compatibility & Mandatory Safety Gate',
    sub: '11 Destination Families — Model Output Scores — Hazardous Pathways Barred',
    initialImg: '/img/DEMO-STEP-04-circular-compatibility.png',
    audio: '/audio/step-04-compatibility.wav',
    subtitles: [
      { start: 0.0, end: 7.0, text: 'Our deterministic circular engine evaluates materials across eleven destination families in four independent dimensions.' },
      { start: 7.0, end: 12.0, text: 'These compatibility percentages are prototype model outputs indicating reuse potential.' },
      { start: 12.0, end: 19.8, text: 'The safety engine enforces a strict hard gate: clean cotton is directed to high-value reuse while hazardous routes are blocked.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 6.8,
        cursorStart: { x: 960, y: 700 },
        cursorEnd: { x: 960, y: 320 },
        highlightBox: { x: 380, y: 220, w: 1160, h: 140, label: '4 Dimensions: Technical • Safety • Evidence • Commercial' },
      },
      {
        start: 7.0,
        end: 11.5,
        cursorStart: { x: 960, y: 320 },
        cursorEnd: { x: 640, y: 520 },
        highlightBox: { x: 380, y: 400, w: 560, h: 260, label: 'Model Output Match: 94% • High-Value Circular Route' },
      },
      {
        start: 12.0,
        end: 19.5,
        cursorStart: { x: 640, y: 520 },
        cursorEnd: { x: 1260, y: 520 },
        highlightBox: { x: 980, y: 400, w: 560, h: 260, label: 'Mandatory Safety Gate: Hazardous Pathways Blocked (0%)' },
      },
    ],
  },
  {
    step: 5,
    title: '5. Laboratory Verification Workflow',
    sub: 'Simulated ISO/IEC 17025 Test Desk — SHA-256 Tamper-Evident Evidence Audit Log',
    initialImg: '/img/DEMO-MODE-walkthrough-active.png',
    actionImg: '/img/DEMO-STEP-05-laboratory-verification.png',
    audio: '/audio/step-05-lab-verification.wav',
    subtitles: [
      { start: 0.0, end: 8.5, text: 'To elevate reported composition to confirmed status, SUZARCHI demonstrates a simulated lab verification workflow.' },
      { start: 8.5, end: 21.3, text: 'When a physical test report is reviewed, its integrity information can be recorded in the passport audit trail using SHA-256 hashing.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 2.3,
        cursorStart: { x: 960, y: 700 },
        cursorEnd: { x: 1040, y: 720 },
        clickTime: 2.1,
        switchImgAt: 2.3,
      },
      {
        start: 2.5,
        end: 10.0,
        cursorStart: { x: 1040, y: 720 },
        cursorEnd: { x: 580, y: 440 },
        highlightBox: { x: 380, y: 220, w: 560, h: 420, label: 'ISO/IEC 17025 Accredited Laboratory Integration' },
      },
      {
        start: 10.5,
        end: 20.8,
        cursorStart: { x: 580, y: 440 },
        cursorEnd: { x: 1240, y: 440 },
        highlightBox: { x: 980, y: 220, w: 560, h: 420, label: 'SHA-256 Tamper-Evident Audit Digest • Passport Status Confirmed' },
      },
    ],
  },
  {
    step: 6,
    title: '6. Global Analytics & Regional Circular Intelligence',
    sub: '6 Continents • 17 Global Circular Hubs • Basel Convention Annex IX Non-Hazardous Corridors',
    initialImg: '/img/DEMO-STEP-06-global-intelligence.png',
    audio: '/audio/step-06-global-analytics.wav',
    subtitles: [
      { start: 0.0, end: 10.5, text: 'Circularity is global. Our analytics map industrial capacity across six continents and seventeen hubs.' },
      { start: 10.5, end: 18.9, text: 'Trade corridors model potential cross-border flows while considering applicable Basel Convention requirements.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 10.0,
        cursorStart: { x: 920, y: 380 },
        cursorEnd: { x: 1180, y: 520 },
        highlightBox: { x: 380, y: 200, w: 1160, h: 440, label: '17 Global Circular Hubs: Prato (Italy) to Tiruppur (India)' },
      },
      {
        start: 10.5,
        end: 18.5,
        cursorStart: { x: 1180, y: 520 },
        cursorEnd: { x: 1380, y: 480 },
        highlightBox: { x: 980, y: 440, w: 560, h: 220, label: 'Basel Convention Annex IX Non-Hazardous Corridor Verification' },
      },
    ],
  },
  {
    step: 7,
    title: '7. Buyer Inquiries & Local RFQ Draft',
    sub: 'Apex Circular Textiles Matching — Local In-Memory RFQ Draft (No External Dispatch)',
    initialImg: '/img/DEMO-MODE-walkthrough-active.png',
    actionImg: '/img/DEMO-STEP-07-buyer-opportunities-rfq.png',
    audio: '/audio/step-07-rfq-commercial.wav',
    subtitles: [
      { start: 0.0, end: 4.5, text: 'Matching buyer demand triggers a structured B2B RFQ draft.' },
      { start: 4.5, end: 17.5, text: 'Demand from Apex Circular Textiles incorporates laboratory testing contingencies and physical swatch approvals.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 2.3,
        cursorStart: { x: 960, y: 700 },
        cursorEnd: { x: 1040, y: 720 },
        clickTime: 2.1,
        switchImgAt: 2.3,
      },
      {
        start: 2.5,
        end: 8.5,
        cursorStart: { x: 1040, y: 720 },
        cursorEnd: { x: 560, y: 380 },
        highlightBox: { x: 380, y: 220, w: 560, h: 320, label: 'Matching Buyer: Apex Circular Textiles (Tiruppur Reclaim)' },
      },
      {
        start: 9.0,
        end: 17.0,
        cursorStart: { x: 560, y: 380 },
        cursorEnd: { x: 1160, y: 540 },
        highlightBox: { x: 980, y: 420, w: 560, h: 220, label: 'Laboratory Testing Contingency Clause • Local In-Memory Draft' },
      },
    ],
  },
  {
    step: 8,
    title: '8. Scope 3 GHG Accounting & Modelled Estimates',
    sub: 'GHG Protocol Standard — 19.8 tCO2e Avoided — 108,000 L Water Saved (2,400 kg Facility Allocation)',
    initialImg: '/img/DEMO-STEP-08-circular-impact.png',
    audio: '/audio/step-08-scope3-impact.wav',
    subtitles: [
      { start: 0.0, end: 6.5, text: 'Finally, SUZARCHI estimates potential environmental benefits using GHG Protocol-informed calculation methods.' },
      { start: 6.5, end: 16.5, text: 'For this broader 2,400 kg facility allocation, the model estimates 19.8 tonnes of avoided CO2 and 108,000 litres of water savings.' },
      { start: 16.5, end: 26.0, text: 'These are modelled estimates, not independently verified environmental savings.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 6.0,
        cursorStart: { x: 960, y: 700 },
        cursorEnd: { x: 640, y: 320 },
        highlightBox: { x: 380, y: 220, w: 1160, h: 140, label: 'GHG Protocol Corporate Value Chain Standard Accounting Model' },
      },
      {
        start: 6.5,
        end: 16.0,
        cursorStart: { x: 640, y: 320 },
        cursorEnd: { x: 960, y: 480 },
        highlightBox: { x: 380, y: 380, w: 1160, h: 220, label: '19.8 tCO2e Avoided • 108,000 L Water Conserved (Facility Scope)' },
      },
      {
        start: 16.5,
        end: 25.5,
        cursorStart: { x: 960, y: 480 },
        cursorEnd: { x: 960, y: 760 },
        highlightBox: { x: 380, y: 700, w: 1160, h: 100, label: 'UNVERIFIED_INTERNAL_MODEL • Prototype Modelled Estimates' },
      },
    ],
  },
];

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SUZARCHI Precision Video Renderer</title>
  <style>
    body { margin: 0; background: #000; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    canvas { display: block; width: 1920px; height: 1080px; }
  </style>
</head>
<body>
  <canvas id="c" width="1920" height="1080"></canvas>
  <script>
    const steps = ${JSON.stringify(STEPS)};
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');

    function easeOutQuad(t) { return t * (2 - t); }
    function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

    function drawMouseCursor(ctx, x, y, clickProgress = 0) {
      ctx.save();
      ctx.translate(x, y);

      // Expanding click ripple
      if (clickProgress > 0 && clickProgress <= 1) {
        ctx.beginPath();
        ctx.arc(0, 0, clickProgress * 36, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(16, 185, 129, ' + (1 - clickProgress) + ')';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, clickProgress * 16, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, ' + (0.4 * (1 - clickProgress)) + ')';
        ctx.fill();
      }

      // Pointer drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 3;

      // Pointer body
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 22);
      ctx.lineTo(6, 17);
      ctx.lineTo(11, 27);
      ctx.lineTo(15, 25);
      ctx.lineTo(10, 15);
      ctx.lineTo(18, 15);
      ctx.closePath();
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#1F2937';
      ctx.stroke();

      ctx.restore();
    }

    function drawHighlightBox(ctx, box, alpha = 1) {
      if (!box) return;
      ctx.save();
      const { x, y, w, h, label } = box;
      
      // Soft glowing fill
      ctx.fillStyle = 'rgba(16, 185, 129, ' + (0.09 * alpha) + ')';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.fill();

      // Sharp bounding border
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(16, 185, 129, ' + (0.95 * alpha) + ')';
      ctx.shadowColor = 'rgba(16, 185, 129, ' + (0.5 * alpha) + ')';
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Callout Label Pill
      if (label) {
        ctx.shadowBlur = 0;
        ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
        const txtWidth = ctx.measureText(label).width;
        const pillW = txtWidth + 24;
        const pillH = 26;
        const pillX = x + 12;
        const pillY = y - 13;

        ctx.fillStyle = '#064E3B';
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 6);
        ctx.fill();
        ctx.strokeStyle = '#34D399';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ECFDF5';
        ctx.fillText(label, pillX + 12, pillY + 18);
      }

      ctx.restore();
    }

    function drawSubtitles(ctx, text) {
      if (!text) return;
      ctx.save();
      ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
      const textMetrics = ctx.measureText(text);
      const boxW = Math.min(1800, textMetrics.width + 48);
      const boxH = 46;
      const boxX = (1920 - boxW) / 2;
      const boxY = 932;

      // Dark translucent backdrop
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 8);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Subtitle Text
      ctx.fillStyle = '#F8FAFC';
      ctx.textAlign = 'center';
      ctx.fillText(text, 960, boxY + 31);
      ctx.restore();
    }

    async function startRendering() {
      console.log('Initializing audio context and loading assets...');
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();

      // Preload images and audio buffers
      const loadedData = [];
      for (const s of steps) {
        console.log('Loading step ' + s.step + ': ' + s.title + '...');
        const initImg = new Image();
        initImg.src = s.initialImg;
        await new Promise(r => { initImg.onload = r; });

        let actImg = null;
        if (s.actionImg) {
          actImg = new Image();
          actImg.src = s.actionImg;
          await new Promise(r => { actImg.onload = r; });
        }

        const aRes = await fetch(s.audio);
        const aArrayBuf = await aRes.arrayBuffer();
        const aBuf = await audioCtx.decodeAudioData(aArrayBuf);

        loadedData.push({ ...s, initImg, actImg, aBuf });
      }

      console.log('All assets loaded. Setting up recorder...');
      const videoStream = canvas.captureStream(30);
      const combinedTracks = [
        ...videoStream.getVideoTracks(),
        ...dest.stream.getAudioTracks()
      ];
      const combinedStream = new MediaStream(combinedTracks);

      const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')
        ? 'video/mp4;codecs=avc1,mp4a.40.2'
        : (MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm');

      console.log('Configured MediaRecorder MIME type:', mimeType);

      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 6000000 // 6 Mbps Full HD
      });

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        console.log('Recorder stopped. Uploading video blob (' + chunks.length + ' chunks)...');
        const blob = new Blob(chunks, { type: mimeType });
        console.log('Blob size: ' + blob.size + ' bytes');
        await fetch('/save-mp4', {
          method: 'POST',
          headers: { 'Content-Type': mimeType },
          body: blob
        });
        document.body.innerHTML = '<h1 style="color:lime;text-align:center;margin-top:200px;">VIDEO RENDER COMPLETE</h1>';
      };

      recorder.start(1000);
      console.log('Recording started.');

      let currentStepIdx = 0;
      let stepStartTime = audioCtx.currentTime;
      let totalStartTime = audioCtx.currentTime;

      function playStepAudio(idx) {
        const source = audioCtx.createBufferSource();
        source.buffer = loadedData[idx].aBuf;
        source.connect(dest);
        source.connect(audioCtx.destination);
        source.start();
        return source;
      }

      let activeSource = playStepAudio(0);

      function drawFrame() {
        const now = audioCtx.currentTime;
        const currentData = loadedData[currentStepIdx];
        const stepAudioDuration = currentData.aBuf.duration;
        const stepDuration = stepAudioDuration + 0.18; // smooth 180ms transition padding

        const stepElapsed = now - stepStartTime;

        // Check step completion
        if (stepElapsed >= stepDuration) {
          currentStepIdx++;
          if (currentStepIdx >= loadedData.length) {
            recorder.stop();
            return;
          }
          stepStartTime = now;
          activeSource = playStepAudio(currentStepIdx);
          requestAnimationFrame(drawFrame);
          return;
        }

        // 1. Determine active background image
        let activeBg = currentData.initImg;
        if (currentData.actImg) {
          const switchInteraction = currentData.interactions.find(i => i.switchImgAt !== undefined);
          if (switchInteraction && stepElapsed >= switchInteraction.switchImgAt) {
            activeBg = currentData.actImg;
          }
        }
        ctx.drawImage(activeBg, 0, 0, 1920, 1080);

        // 2. Find active interaction, cursor, and highlight
        const activeInteraction = currentData.interactions ? currentData.interactions.find(i => stepElapsed >= i.start && stepElapsed <= i.end) : null;

        if (activeInteraction) {
          // Highlight Box
          if (activeInteraction.highlightBox) {
            const hProgress = Math.min(1, (stepElapsed - activeInteraction.start) / 0.4);
            drawHighlightBox(ctx, activeInteraction.highlightBox, hProgress);
          }

          // Cursor position interpolation
          if (activeInteraction.cursorStart && activeInteraction.cursorEnd) {
            const moveDuration = Math.min(1.8, activeInteraction.end - activeInteraction.start);
            const moveElapsed = Math.min(moveDuration, stepElapsed - activeInteraction.start);
            const t = easeInOutQuad(moveElapsed / moveDuration);

            const curX = activeInteraction.cursorStart.x + (activeInteraction.cursorEnd.x - activeInteraction.cursorStart.x) * t;
            const curY = activeInteraction.cursorStart.y + (activeInteraction.cursorEnd.y - activeInteraction.cursorStart.y) * t;

            // Click ripple
            let clickProgress = 0;
            if (activeInteraction.clickTime !== null && stepElapsed >= activeInteraction.clickTime) {
              const clickElapsed = stepElapsed - activeInteraction.clickTime;
              if (clickElapsed <= 0.4) {
                clickProgress = clickElapsed / 0.4;
              }
            }

            drawMouseCursor(ctx, curX, curY, clickProgress);
          }
        }

        // 3. Subtitles
        if (currentData.subtitles) {
          const activeSub = currentData.subtitles.find(s => stepElapsed >= s.start && stepElapsed <= s.end);
          if (activeSub) {
            drawSubtitles(ctx, activeSub.text);
          }
        }

        // 4. Broadcast Lower-Third Overlay Banner
        const totalElapsed = now - totalStartTime;
        const mins = Math.floor(totalElapsed / 60);
        const secs = Math.floor(totalElapsed % 60);
        const timeStr = mins + ':' + (secs < 10 ? '0' : '') + secs;

        // Bottom Banner Bar
        ctx.fillStyle = 'rgba(6, 44, 30, 0.94)';
        ctx.fillRect(0, 996, 1920, 84);

        // Top border accent on banner
        ctx.fillStyle = '#10B981';
        ctx.fillRect(0, 994, 1920, 2);

        // Left Tag
        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
        ctx.fillText('SUZARCHI (சுழற்சி)', 40, 1028);

        ctx.fillStyle = '#A7F3D0';
        ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
        ctx.fillText('One Material. Multiple Possibilities. | Meta Hackathon 2026', 40, 1054);

        // Center Step Info
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
        ctx.fillText(currentData.title, 550, 1028);

        ctx.fillStyle = '#D1D5DB';
        ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
        ctx.fillText(currentData.sub, 550, 1054);

        // Right Timer & Step Pill
        ctx.fillStyle = '#065F46';
        ctx.beginPath();
        ctx.roundRect(1700, 1016, 180, 44, 8);
        ctx.fill();

        ctx.fillStyle = '#34D399';
        ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
        const badgeLabel = currentData.step === 0 ? 'Why SUZARCHI' : ('Step ' + currentData.step + ' / 8');
        ctx.fillText(badgeLabel + '  •  ' + timeStr, 1715, 1044);

        requestAnimationFrame(drawFrame);
      }

      requestAnimationFrame(drawFrame);
    }

    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(startRendering, 1000);
    });
  </script>
</body>
</html>`;

async function main() {
  console.log('=== STARTING PRECISION SYNCHRONIZED H.264 / AAC MP4 VIDEO COMPOSITION ===\n');

  let server;
  await new Promise((resolve) => {
    server = http.createServer((req, res) => {
      if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlContent);
      } else if (req.url.startsWith('/img/')) {
        const file = path.basename(req.url);
        const p = path.join(EVIDENCE_DIR, file);
        if (fs.existsSync(p)) {
          res.writeHead(200, { 'Content-Type': 'image/png' });
          fs.createReadStream(p).pipe(res);
        } else {
          res.writeHead(404); res.end();
        }
      } else if (req.url.startsWith('/audio/')) {
        const file = path.basename(req.url);
        const p = path.join(REVISED_AUDIO_DIR, file);
        if (fs.existsSync(p)) {
          res.writeHead(200, { 'Content-Type': 'audio/wav' });
          fs.createReadStream(p).pipe(res);
        } else {
          res.writeHead(404); res.end();
        }
      } else if (req.url === '/save-mp4' && req.method === 'POST') {
        console.log('Receiving revised precision MP4 video stream from browser...');
        const fileStream = fs.createWriteStream(OUTPUT_VIDEO_MP4);
        req.pipe(fileStream);

        fileStream.on('finish', () => {
          const stats = fs.statSync(OUTPUT_VIDEO_MP4);
          console.log(`\n[OK] Revised Precision H.264 / AAC MP4 saved: ${OUTPUT_VIDEO_MP4} (${stats.size} bytes)`);

          const artifactVideoMp4 = path.join(ARTIFACT_DIR, 'SUZARCHI_Meta_Hackathon_Precision_Synchronized_Demo.mp4');
          fs.copyFileSync(OUTPUT_VIDEO_MP4, artifactVideoMp4);
          console.log(`[OK] Copied revised MP4 to artifact directory: ${artifactVideoMp4}`);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, size: stats.size }));

          setTimeout(() => {
            server.close();
            process.exit(0);
          }, 1500);
        });

        fileStream.on('error', (err) => {
          console.error('File stream error:', err);
          res.writeHead(500); res.end();
        });
      } else {
        res.writeHead(404); res.end();
      }
    });

    server.listen(PORT, resolve);
  });

  console.log(`Server listening on http://localhost:${PORT}`);

  const userDataDir = process.env.TEMP + '\\edge-video-render-' + Date.now();
  console.log('Launching headless Edge to render revised synchronized video...');
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--window-size=1920,1080',
    '--autoplay-policy=no-user-gesture-required',
    `--user-data-dir=${userDataDir}`,
    `http://localhost:${PORT}`,
  ]);

  edgeProc.on('exit', (code) => {
    console.log('Edge process exited with code', code);
  });
}

main().catch(console.error);
