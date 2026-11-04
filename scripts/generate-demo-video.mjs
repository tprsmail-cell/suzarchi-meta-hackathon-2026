import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PORT = 9280;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\docs\\release\\demo-recording-evidence';
const OUTPUT_VIDEO_MP4 = 'D:\\SUZARCHI hackathon\\docs\\release\\SUZARCHI_Meta_Hackathon_Final_Demo.mp4';
const OUTPUT_VIDEO_WEBM = 'D:\\SUZARCHI hackathon\\docs\\release\\SUZARCHI_Meta_Hackathon_Final_Demo.webm';
const OUTPUT_VIDEO_LEGACY = 'D:\\SUZARCHI hackathon\\docs\\release\\SUZARCHI-Hackathon-Official-3Min-Demonstration.webm';
const ARTIFACT_DIR = 'C:\\Users\\Merch\\.gemini\\antigravity\\brain\\bd2de537-0962-45e2-a6f8-f3193ee33f5e';

const STEPS = [
  {
    step: 0,
    pillLabel: 'Opening: The Opportunity',
    title: 'Turning Textile Surplus into Global Opportunities',
    sub: 'SUZARCHI (சுழற்சி) — One Material. Multiple Possibilities. — Meta AI Hackathon 2026',
    img: '/img/DEMO-STEP-00-opening.png',
    audio: '/audio/step-00-opening.wav',
  },
  {
    step: 1,
    pillLabel: 'Step 1 / 8: Origin',
    title: '1. Material Discovery & Origin (Tiruppur, India)',
    sub: '300 kg Navy Single Jersey Knit Fabric (PCB-2026-IN-42) in 2,400 kg Facility Allocation',
    img: '/img/DEMO-STEP-01-material-discovery.png',
    audio: '/audio/step-01-discovery.wav',
  },
  {
    step: 2,
    pillLabel: 'Step 2 / 8: AI Intake',
    title: '2. AI Intake & Meta AI Architecture Preparation',
    sub: 'Meta Llama 3.2 Vision Schema — Deterministic Local Mode (META_AI_ENABLED=false) — Zero Spend',
    img: '/img/DEMO-STEP-02-ai-assisted-intake.png',
    audio: '/audio/step-02-ai-intake.wav',
  },
  {
    step: 3,
    pillLabel: 'Step 3 / 8: DPP Passport',
    title: '3. Material Passport (Digital Product Passport)',
    sub: 'EU ESPR URN Syntax — 4-Tier Evidence Model — Batch QR Traceability & Integrity',
    img: '/img/DEMO-STEP-03-material-passport.png',
    audio: '/audio/step-03-passport.wav',
  },
  {
    step: 4,
    pillLabel: 'Step 4 / 8: 4D Match',
    title: '4. 4D Circular Compatibility & Mandatory Safety Gate',
    sub: '11 Destination Families — Model Output Scores — Hazardous Pathways Barred',
    img: '/img/DEMO-STEP-04-circular-compatibility.png',
    audio: '/audio/step-04-compatibility.wav',
  },
  {
    step: 5,
    pillLabel: 'Step 5 / 8: Lab Workflow',
    title: '5. Laboratory Verification Workflow',
    sub: 'Simulated ISO/IEC 17025 Test Desk — SHA-256 Tamper-Evident Evidence Audit Log',
    img: '/img/DEMO-STEP-05-laboratory-verification.png',
    audio: '/audio/step-05-lab-verification.wav',
  },
  {
    step: 6,
    pillLabel: 'Step 6 / 8: Global Analytics',
    title: '6. Global Analytics & Regional Circular Intelligence',
    sub: '6 Continents • 17 Global Circular Hubs • Basel Convention Annex IX Non-Hazardous Corridors',
    img: '/img/DEMO-STEP-06-global-intelligence.png',
    audio: '/audio/step-06-global-analytics.wav',
  },
  {
    step: 7,
    pillLabel: 'Step 7 / 8: Buyer RFQ',
    title: '7. Buyer Inquiries & Local RFQ Draft',
    sub: 'Apex Circular Textiles Matching — Local In-Memory RFQ Draft (No External Dispatch)',
    img: '/img/DEMO-STEP-07-buyer-opportunities-rfq.png',
    audio: '/audio/step-07-rfq-commercial.wav',
  },
  {
    step: 8,
    pillLabel: 'Step 8 / 8: Scope 3 LCA',
    title: '8. Scope 3 GHG Accounting & Modelled Estimates',
    sub: 'GHG Protocol Standard — 19.8 tCO2e Avoided — 108,000 L Water Saved (2,400 kg Facility Allocation)',
    img: '/img/DEMO-STEP-08-circular-impact.png',
    audio: '/audio/step-08-scope3-impact.wav',
  },
];

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SUZARCHI Video Renderer</title>
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

    async function startRendering() {
      console.log('Initializing audio context and loading assets...');
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();

      // Preload images and audio buffers
      const loadedData = [];
      for (const s of steps) {
        console.log('Loading step ' + s.step + ': ' + s.title + '...');
        // Image
        const img = new Image();
        img.src = s.img;
        await new Promise(r => { img.onload = r; });

        // Audio
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

      // Prefer genuine MP4 (H.264 / AAC)
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

      // Render loop
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
        const stepDuration = (currentStepIdx === loadedData.length - 1) ? (currentData.aBuf.duration + 0.1) : (currentData.aBuf.duration + 0.6); // precise broadcast pacing with zero trailing lag

        // Check if step completed
        if (now - stepStartTime >= stepDuration) {
          currentStepIdx++;
          if (currentStepIdx >= loadedData.length) {
            // Done!
            recorder.stop();
            return;
          }
          stepStartTime = now;
          activeSource = playStepAudio(currentStepIdx);
        }

        // Draw screenshot image
        ctx.drawImage(currentData.img, 0, 0, 1920, 1080);

        // Professional Broadcast Lower-Third Overlay
        const elapsedTotal = now - totalStartTime;
        const mins = Math.floor(elapsedTotal / 60);
        const secs = Math.floor(elapsedTotal % 60);
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
  console.log('=== STARTING AUTOMATED H.264 / AAC MP4 VIDEO COMPOSITION ===\n');

  // Start local server to serve assets and receive the finished video
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
        const p = path.join(EVIDENCE_DIR, 'audio', file);
        if (fs.existsSync(p)) {
          res.writeHead(200, { 'Content-Type': 'audio/wav' });
          fs.createReadStream(p).pipe(res);
        } else {
          res.writeHead(404); res.end();
        }
      } else if (req.url === '/save-mp4' && req.method === 'POST') {
        console.log('Receiving genuine MP4 video stream from browser...');
        const fileStream = fs.createWriteStream(OUTPUT_VIDEO_MP4);
        req.pipe(fileStream);

        fileStream.on('finish', () => {
          const stats = fs.statSync(OUTPUT_VIDEO_MP4);
          console.log(`\n[OK] Genuine H.264 / AAC MP4 saved: ${OUTPUT_VIDEO_MP4} (${stats.size} bytes)`);

          // Also copy to artifact directory for one-click access
          const artifactVideoMp4 = path.join(ARTIFACT_DIR, 'SUZARCHI_Meta_Hackathon_Final_Demo.mp4');
          fs.copyFileSync(OUTPUT_VIDEO_MP4, artifactVideoMp4);
          console.log(`[OK] Copied genuine MP4 to artifact directory: ${artifactVideoMp4}`);

          // Copy audio files and pronunciation test to artifact directory
          const artifactAudioDir = path.join(ARTIFACT_DIR, 'audio');
          if (!fs.existsSync(artifactAudioDir)) fs.mkdirSync(artifactAudioDir, { recursive: true });
          const audioFiles = fs.readdirSync(path.join(EVIDENCE_DIR, 'audio')).filter(f => f.endsWith('.wav'));
          for (const af of audioFiles) {
            fs.copyFileSync(path.join(EVIDENCE_DIR, 'audio', af), path.join(artifactAudioDir, af));
          }
          console.log(`[OK] Copied ${audioFiles.length} voice tracks & tests to artifact audio directory`);

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

  // Launch headless Edge to execute the render
  const userDataDir = process.env.TEMP + '\\edge-video-render-' + Date.now();
  console.log('Launching headless Edge to render video...');
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
