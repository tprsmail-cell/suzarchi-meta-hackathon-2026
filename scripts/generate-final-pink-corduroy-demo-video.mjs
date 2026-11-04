import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PORT = 9295;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\docs\\release\\demo-recording-evidence';
const SCREEN_DIR = path.join(EVIDENCE_DIR, 'screens-pink-corduroy');
const AUDIO_DIR = path.join(EVIDENCE_DIR, 'audio-pink-corduroy');
const OUTPUT_VIDEO_MP4 = 'D:\\SUZARCHI hackathon\\docs\\release\\SUZARCHI_Meta_Hackathon_Aligned_Demo.mp4';
const ARTIFACT_DIR = 'C:\\Users\\Merch\\.gemini\\antigravity\\brain\\bd2de537-0962-45e2-a6f8-f3193ee33f5e';

const SCENES = [
  {
    step: 0,
    title: 'Turning Textile Surplus into Global Opportunities',
    sub: 'SUZARCHI (சுழற்சி) — One Material. Multiple Possibilities. — Meta AI Hackathon 2026',
    img: '/screens/scene-00-opening.png',
    audio: '/audio/step-00-opening.wav',
    subtitles: [
      { start: 0.0, end: 5.2, text: 'Millions of tonnes of textile surplus go to waste every year due to fragmented data.' },
      { start: 5.2, end: 10.8, text: 'Welcome to SUZARCHI: One Material, Multiple Possibilities.' },
    ],
    interactions: [
      {
        start: 1.0,
        end: 9.5,
        cursorStart: { x: 1400, y: 750 },
        cursorEnd: { x: 960, y: 520 },
        highlightBox: { x: 420, y: 340, w: 1080, h: 360, label: 'Circular Textile Operating System' },
      },
    ],
  },
  {
    step: 1,
    title: '1. Material Discovery & Origin (Tiruppur, India)',
    sub: '300 kg Pink Ribbed Corduroy Fabric (PCB-2026-IN-42) in 2,400 kg Facility Allocation',
    img: '/screens/scene-01-dashboard.png',
    audio: '/audio/step-01-dashboard.wav',
    subtitles: [
      { start: 0.0, end: 8.5, text: "In Tiruppur, Tamil Nadu—a premier Indian manufacturing cluster—we catalog 300 kilograms of Pink Ribbed Corduroy Fabric, batch PCB-2026-IN-42." },
      { start: 8.5, end: 18.0, text: 'Origin and roll dimensions are confirmed, while reported cotton composition and unmeasured weight await formal verification.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 4.0,
        cursorStart: { x: 960, y: 320 },
        cursorEnd: { x: 620, y: 440 },
        clickTime: 3.8,
        highlightBox: { x: 340, y: 220, w: 480, h: 160, label: '300 kg Warehouse Lot • Batch PCB-2026-IN-42 • Confirmed' },
      },
      {
        start: 4.2,
        end: 11.0,
        cursorStart: { x: 620, y: 440 },
        cursorEnd: { x: 740, y: 470 },
        highlightBox: { x: 640, y: 440, w: 480, h: 90, label: 'Fabric Weight: Unmeasured (UNKNOWN) • Missing Information Flagged' },
      },
      {
        start: 11.2,
        end: 18.0,
        cursorStart: { x: 740, y: 470 },
        cursorEnd: { x: 1140, y: 470 },
        highlightBox: { x: 980, y: 440, w: 540, h: 90, label: 'Fibre Blend: Reported 100% Cotton • REPORTED • Lab Test Required' },
      },
    ],
  },
  {
    step: 2,
    title: '2. Multimodal AI Intake & Evidence Governance',
    sub: 'Meta Llama 3.2 Vision Schema — Optical Color & Ribbed Texture — Zero API Spend',
    img: '/screens/scene-02-ai-intake.png',
    audio: '/audio/step-02-ai-intake.wav',
    subtitles: [
      { start: 0.0, end: 6.5, text: 'Our material intake pairs multimodal vision with strict evidence governance.' },
      { start: 6.5, end: 12.0, text: 'The system observes the light pink hue and raised vertical corduroy ribs.' },
      { start: 12.0, end: 18.5, text: "Under SUZARCHI's precautionary rules, photographs cannot certify composition, GSM, or chemical safety, flagging unverified fields for human review." },
    ],
    interactions: [
      {
        start: 0.5,
        end: 5.5,
        cursorStart: { x: 1140, y: 470 },
        cursorEnd: { x: 680, y: 480 },
        clickTime: 2.2,
        highlightBox: { x: 420, y: 240, w: 480, h: 480, label: 'Pink Corduroy Sample: Optical Light Pink & Vertical Rib Texture' },
      },
      {
        start: 6.0,
        end: 18.0,
        cursorStart: { x: 680, y: 480 },
        cursorEnd: { x: 1240, y: 480 },
        highlightBox: { x: 940, y: 240, w: 600, h: 480, label: 'Mandatory Governance Gate: GSM Unknown (null) • Composition REPORTED' },
      },
    ],
  },
  {
    step: 3,
    title: '3. Material Passport (EU DPP Syntax Alignment)',
    sub: 'Digital Product Passport • 4-Tier Evidence Hierarchy • urn:dpp:suzarchi:in:mat-001',
    img: '/screens/scene-03-passport.png',
    audio: '/audio/step-03-passport.wav',
    subtitles: [
      { start: 0.0, end: 6.8, text: 'The resulting Material Passport enforces four evidence tiers: Confirmed, Reported, Estimated, and Unknown.' },
      { start: 6.8, end: 13.5, text: 'For this corduroy lot, color is estimated while GSM remains strictly null.' },
      { start: 13.5, end: 20.3, text: 'This syntax aligns with European Union Digital Product Passport requirements, tracking batch custody from Tiruppur to global reuse.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 6.5,
        cursorStart: { x: 1240, y: 480 },
        cursorEnd: { x: 800, y: 260 },
        clickTime: 2.5,
        highlightBox: { x: 400, y: 200, w: 1120, h: 120, label: 'EU DPP Identifier: urn:dpp:suzarchi:in:mat-001 • Tiruppur Origin' },
      },
      {
        start: 6.8,
        end: 20.0,
        cursorStart: { x: 800, y: 260 },
        cursorEnd: { x: 960, y: 540 },
        highlightBox: { x: 400, y: 340, w: 1120, h: 420, label: '4-Tier Evidence Hierarchy: Light Pink (ESTIMATED) • GSM (UNKNOWN / null)' },
      },
    ],
  },
  {
    step: 4,
    title: '4. 4D Compatibility Engine & Mandatory Safety Gate',
    sub: 'Deterministic Scoring Across Technical, Evidence, Safety & Commercial Dimensions',
    img: '/screens/scene-04-compatibility.png',
    audio: '/audio/step-04-compatibility.wav',
    subtitles: [
      { start: 0.0, end: 7.0, text: 'Next, SUZARCHI evaluates circular destinations across technical, evidence, safety, and commercial dimensions.' },
      { start: 7.0, end: 13.5, text: 'This corduroy fabric qualifies for upcycled tote bags and craft textiles.' },
      { start: 13.5, end: 20.4, text: 'Because chemical finishes remain unverified, our mandatory safety gate blocks intimate apparel pathways until laboratory clearance.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 6.5,
        cursorStart: { x: 960, y: 540 },
        cursorEnd: { x: 920, y: 140 },
        clickTime: 2.2,
      },
      {
        start: 7.0,
        end: 13.0,
        cursorStart: { x: 920, y: 140 },
        cursorEnd: { x: 620, y: 480 },
        highlightBox: { x: 380, y: 380, w: 560, h: 260, label: 'Upcycled Craft & Tote Bags: Viable Match (67%)' },
      },
      {
        start: 13.5,
        end: 20.0,
        cursorStart: { x: 620, y: 480 },
        cursorEnd: { x: 1240, y: 480 },
        highlightBox: { x: 980, y: 380, w: 560, h: 260, label: 'Mandatory Safety Gate: Intimate Apparel BLOCKED (Score: 0%)' },
      },
    ],
  },
  {
    step: 5,
    title: '5. Laboratory Verification Workflow (Simulated)',
    sub: 'ISO/IEC 17025 Test Desk • Quantitative Dissolution • SHA-256 Tamper-Evident Digest',
    img: '/screens/scene-05-lab-workflow.png',
    audio: '/audio/step-05-lab-workflow.wav',
    subtitles: [
      { start: 0.0, end: 8.0, text: 'To elevate reported attributes, SUZARCHI demonstrates a simulated ISO 17025 laboratory workflow.' },
      { start: 8.0, end: 18.9, text: 'An accredited test desk records quantitative dissolution and GSM cutter results, attaching tamper-evident SHA-256 cryptographic digests directly to the passport audit trail.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 4.5,
        cursorStart: { x: 1240, y: 480 },
        cursorEnd: { x: 680, y: 140 },
        clickTime: 2.0,
      },
      {
        start: 5.0,
        end: 11.5,
        cursorStart: { x: 680, y: 140 },
        cursorEnd: { x: 580, y: 440 },
        highlightBox: { x: 380, y: 220, w: 560, h: 420, label: 'ISO/IEC 17025 Test Desk (SIMULATED): ISO 1833 & ISO 3801 Audits' },
      },
      {
        start: 12.0,
        end: 18.5,
        cursorStart: { x: 580, y: 440 },
        cursorEnd: { x: 1240, y: 440 },
        highlightBox: { x: 980, y: 220, w: 560, h: 420, label: 'SHA-256 Tamper-Evident Digest: Passport Integrity Cryptographically Sealed' },
      },
    ],
  },
  {
    step: 6,
    title: '6. Global Circular Intelligence & Trade Corridors',
    sub: '17 Global Circular Hubs • Tiruppur to Prato & Izmir • Basel Convention Annex IX',
    img: '/screens/scene-06-global-analytics.png',
    audio: '/audio/step-06-global-analytics.wav',
    subtitles: [
      { start: 0.0, end: 9.0, text: 'Textile circularity is global. Our analytics map processing capacity across seventeen circular hubs, connecting Tiruppur to recycling clusters in Prato and Izmir.' },
      { start: 9.0, end: 17.3, text: 'Trade corridors model cross-border flows in compliance with Basel Convention Annex IX non-hazardous scrap rules.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 4.0,
        cursorStart: { x: 1240, y: 440 },
        cursorEnd: { x: 120, y: 520 },
        clickTime: 2.0,
      },
      {
        start: 4.5,
        end: 11.0,
        cursorStart: { x: 120, y: 520 },
        cursorEnd: { x: 960, y: 420 },
        highlightBox: { x: 380, y: 200, w: 1160, h: 440, label: '17 Global Circular Hubs: Tiruppur (India) to Prato (Italy) & Izmir (Turkey)' },
      },
      {
        start: 11.5,
        end: 17.0,
        cursorStart: { x: 960, y: 420 },
        cursorEnd: { x: 1280, y: 700 },
        highlightBox: { x: 1040, y: 660, w: 500, h: 80, label: 'Basel Convention Annex IX Non-Hazardous Scrap Corridor' },
      },
    ],
  },
  {
    step: 7,
    title: '7. Local Commercial Procurement & B2B RFQ Packages',
    sub: 'Structured Request for Quote • 300 kg Lot Terms • Laboratory Testing Contingencies',
    img: '/screens/scene-07-rfq.png',
    audio: '/audio/step-07-rfq.wav',
    subtitles: [
      { start: 0.0, end: 6.5, text: 'With specifications established, local commerce begins.' },
      { start: 6.5, end: 14.8, text: 'SUZARCHI automatically generates structured request-for-quote packages, bundling lot specifications, chain of custody, and physical sample requirements for immediate buyer evaluation.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 4.0,
        cursorStart: { x: 1280, y: 700 },
        cursorEnd: { x: 1420, y: 420 },
        clickTime: 2.2,
      },
      {
        start: 4.5,
        end: 14.5,
        cursorStart: { x: 1420, y: 420 },
        cursorEnd: { x: 960, y: 520 },
        highlightBox: { x: 420, y: 240, w: 1080, h: 540, label: 'Commercial B2B RFQ Package: 300 kg Pink Ribbed Corduroy (PCB-2026-IN-42)' },
      },
    ],
  },
  {
    step: 8,
    title: '8. Scope 3 GHG Accounting & Environmental Impact',
    sub: 'Corporate Value Chain Standard • 1.8 tCO2e Avoided • 735,000 Litres Water Saved',
    img: '/screens/scene-08-scope3.png',
    audio: '/audio/step-08-scope3.wav',
    subtitles: [
      { start: 0.0, end: 6.5, text: 'Every redirected kilogram delivers measurable impact.' },
      { start: 6.5, end: 17.1, text: 'For this 300 kilogram lot, circular reuse avoids an estimated 1.8 tonnes of CO2 equivalent and saves 735,000 litres of water, calculated using models aligned with the GHG Protocol.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 4.0,
        cursorStart: { x: 960, y: 520 },
        cursorEnd: { x: 120, y: 260 },
        clickTime: 2.0,
      },
      {
        start: 4.5,
        end: 10.5,
        cursorStart: { x: 120, y: 260 },
        cursorEnd: { x: 620, y: 350 },
        highlightBox: { x: 380, y: 240, w: 560, h: 220, label: 'GHG Protocol Scope 3: 1.8 tCO2e Avoided Emissions (MODELLED)' },
      },
      {
        start: 11.0,
        end: 17.0,
        cursorStart: { x: 620, y: 350 },
        cursorEnd: { x: 1240, y: 350 },
        highlightBox: { x: 980, y: 240, w: 560, h: 220, label: 'Water Savings: 735,000 Litres Displaced Virgin Production' },
      },
    ],
  },
  {
    step: 9,
    title: 'Turning Textile Surplus into Global Opportunities',
    sub: 'SUZARCHI (சுழற்சி) — One Material. Multiple Possibilities. — Meta AI Hackathon 2026',
    img: '/screens/scene-09-closing.png',
    audio: '/audio/step-09-closing.wav',
    subtitles: [
      { start: 0.0, end: 6.5, text: 'From local surplus in Tiruppur to a connected circular world, SUZARCHI bridges material intelligence, evidence, and sustainable commerce.' },
      { start: 6.5, end: 12.2, text: 'SUZARCHI: One Material, Multiple Possibilities.' },
    ],
    interactions: [
      {
        start: 0.5,
        end: 11.5,
        cursorStart: { x: 1240, y: 350 },
        cursorEnd: { x: 960, y: 520 },
        highlightBox: { x: 420, y: 340, w: 1080, h: 360, label: 'SUZARCHI (சுழற்சி) — One Material. Multiple Possibilities. — Meta AI Hackathon 2026' },
      },
    ],
  },
];

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/screens/')) {
    const filename = path.basename(req.url);
    const p = path.join(SCREEN_DIR, filename);
    if (fs.existsSync(p)) {
      res.writeHead(200, { 'Content-Type': 'image/png' });
      fs.createReadStream(p).pipe(res);
      return;
    }
  } else if (req.url.startsWith('/audio/')) {
    const filename = path.basename(req.url);
    const p = path.join(AUDIO_DIR, filename);
    if (fs.existsSync(p)) {
      res.writeHead(200, { 'Content-Type': 'audio/wav' });
      fs.createReadStream(p).pipe(res);
      return;
    }
  } else if (req.url === '/save-mp4' && req.method === 'POST') {
    const fileStream = fs.createWriteStream(OUTPUT_VIDEO_MP4);
    req.pipe(fileStream);
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('SAVED');
      console.log(`\n[OK] Aligned Precision H.264 / AAC MP4 saved: ${OUTPUT_VIDEO_MP4} (${fs.statSync(OUTPUT_VIDEO_MP4).size} bytes)`);

      // Copy to artifact directory
      const artifactTarget = path.join(ARTIFACT_DIR, 'SUZARCHI_Meta_Hackathon_Aligned_Demo.mp4');
      fs.copyFileSync(OUTPUT_VIDEO_MP4, artifactTarget);
      console.log(`[OK] Copied revised MP4 to artifact directory: ${artifactTarget}`);

      setTimeout(() => {
        server.close();
        if (edgeProc) edgeProc.kill();
        process.exit(0);
      }, 1000);
    });
    return;
  }

  // HTML Renderer Harness
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SUZARCHI Precision Aligned Video Renderer</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #000; overflow: hidden; display: flex; justify-content: center; align-items: center; height: 100vh; }
    canvas { width: 1920px; height: 1080px; image-rendering: -webkit-optimize-contrast; }
  </style>
</head>
<body>
  <canvas id="stage" width="1920" height="1080"></canvas>
  <script>
    const scenes = ${JSON.stringify(SCENES)};
    const canvas = document.getElementById('stage');
    const ctx = canvas.getContext('2d', { alpha: false });

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

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

    function drawBanner(ctx, title, sub, currentStep, totalSteps, currentTimeSec) {
      ctx.save();
      // Banner container
      ctx.fillStyle = 'rgba(15, 45, 31, 0.95)';
      ctx.fillRect(0, 1008, 1920, 72);

      // Top accent hairline
      ctx.fillStyle = '#10B981';
      ctx.fillRect(0, 1008, 1920, 3);

      // Emblem & Branding
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('SUZARCHI (சுழற்சி)', 28, 1039);

      ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
      ctx.fillStyle = '#A7F3D0';
      ctx.fillText('Meta Global AI Developer Hackathon 2026', 28, 1062);

      // Step & Topic Title
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(title, 460, 1039);

      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
      ctx.fillStyle = '#9CA3AF';
      ctx.fillText(sub, 460, 1061);

      // Running Time & Step Badge
      const mins = Math.floor(currentTimeSec / 60);
      const secs = Math.floor(currentTimeSec % 60).toString().padStart(2, '0');
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
      ctx.fillStyle = '#10B981';
      ctx.textAlign = 'right';
      ctx.fillText('Step ' + (currentStep + 1) + '/' + totalSteps + '  •  ' + mins + ':' + secs + ' / 02:56', 1892, 1042);

      // Progress Bar along bottom
      const progressRatio = Math.min(1, currentTimeSec / 175.5);
      ctx.fillStyle = '#065F46';
      ctx.fillRect(0, 1076, 1920, 4);
      ctx.fillStyle = '#34D399';
      ctx.fillRect(0, 1076, 1920 * progressRatio, 4);

      ctx.restore();
    }

    async function startRendering() {
      console.log('Initializing audio context and loading assets...');
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();

      // Preload images and audio buffers
      const loadedData = [];
      for (const s of scenes) {
        console.log('Loading scene ' + s.step + ': ' + s.title + '...');
        const img = new Image();
        img.src = s.img;
        await new Promise(r => { img.onload = r; });

        const aRes = await fetch(s.audio);
        const aArrayBuf = await aRes.arrayBuffer();
        const aBuf = await audioCtx.decodeAudioData(aArrayBuf);

        loadedData.push({ ...s, img, aBuf });
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

      let currentSceneIdx = 0;
      let sceneStartTime = audioCtx.currentTime;
      let totalStartTime = audioCtx.currentTime;

      function playSceneAudio(idx) {
        const source = audioCtx.createBufferSource();
        source.buffer = loadedData[idx].aBuf;
        source.connect(dest);
        source.connect(audioCtx.destination);
        source.start();
        return source;
      }

      let activeSource = playSceneAudio(0);

      function drawFrame() {
        const now = audioCtx.currentTime;
        const currentData = loadedData[currentSceneIdx];
        const sceneAudioDuration = currentData.aBuf.duration;
        const sceneDuration = sceneAudioDuration + 0.18; // smooth 180ms padding

        const sceneElapsed = now - sceneStartTime;

        // Check scene completion
        if (sceneElapsed >= sceneDuration) {
          currentSceneIdx++;
          if (currentSceneIdx >= loadedData.length) {
            recorder.stop();
            return;
          }
          sceneStartTime = now;
          activeSource = playSceneAudio(currentSceneIdx);
          requestAnimationFrame(drawFrame);
          return;
        }

        // Draw active screen image
        ctx.drawImage(currentData.img, 0, 0, 1920, 1080);

        // Find and draw active interaction (cursor + click + highlight)
        let activeCursorPos = { x: 960, y: 540 };
        let activeClickProgress = 0;
        let activeHighlight = null;

        if (currentData.interactions && currentData.interactions.length > 0) {
          for (const inter of currentData.interactions) {
            if (sceneElapsed >= inter.start && sceneElapsed <= inter.end) {
              const span = inter.end - inter.start;
              const progress = Math.min(1, Math.max(0, (sceneElapsed - inter.start) / span));
              const easeProg = easeOutCubic(progress);

              activeCursorPos = {
                x: inter.cursorStart.x + (inter.cursorEnd.x - inter.cursorStart.x) * easeProg,
                y: inter.cursorStart.y + (inter.cursorEnd.y - inter.cursorStart.y) * easeProg,
              };

              if (inter.clickTime) {
                const clickElapsed = sceneElapsed - inter.clickTime;
                if (clickElapsed >= 0 && clickElapsed <= 0.6) {
                  activeClickProgress = clickElapsed / 0.6;
                }
              }

              if (inter.highlightBox) {
                activeHighlight = inter.highlightBox;
              }
              break;
            }
          }
        }

        // Render visual highlight bounding box if active
        if (activeHighlight) {
          drawHighlightBox(ctx, activeHighlight, 1.0);
        }

        // Render natural mouse cursor with click ring
        drawMouseCursor(ctx, activeCursorPos.x, activeCursorPos.y, activeClickProgress);

        // Render synchronized broadcast subtitles
        if (currentData.subtitles) {
          for (const sub of currentData.subtitles) {
            if (sceneElapsed >= sub.start && sceneElapsed < sub.end) {
              drawSubtitles(ctx, sub.text);
              break;
            }
          }
        }

        // Render lower-third banner
        const totalElapsed = now - totalStartTime;
        drawBanner(ctx, currentData.title, currentData.sub, currentSceneIdx, loadedData.length, totalElapsed);

        requestAnimationFrame(drawFrame);
      }

      requestAnimationFrame(drawFrame);
    }

    window.addEventListener('load', () => {
      setTimeout(startRendering, 500);
    });
  </script>
</body>
</html>`);
});

let edgeProc = null;

server.listen(PORT, () => {
  console.log(`=== STARTING ALIGNED PINK CORDUROY DEMO VIDEO COMPOSITION ===\n`);
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Launching headless Edge to render revised synchronized video...`);

  edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--window-size=1920,1080',
    '--autoplay-policy=no-user-gesture-required',
    '--use-fake-ui-for-media-stream',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `http://localhost:${PORT}`
  ]);

  edgeProc.stdout?.on('data', (d) => console.log(`[Edge stdout] ${d.toString().trim()}`));
  edgeProc.stderr?.on('data', (d) => {
    const s = d.toString().trim();
    if (!s.includes('GL') && !s.includes('bluetooth') && !s.includes('font')) {
      console.log(`[Edge] ${s}`);
    }
  });

  edgeProc.on('exit', (code) => {
    console.log(`Edge process exited with code ${code}`);
  });
});
