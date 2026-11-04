import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PORT = 9295;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\docs\\release\\demo-recording-evidence';
const FABRIC_IMG = 'D:\\SUZARCHI hackathon\\public\\assets\\pink-corduroy-sample.png';
const LOGO_IMG = 'D:\\SUZARCHI hackathon\\public\\assets\\suzarchi-logo.png';

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SUZARCHI Opening Title</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1920px;
      height: 1080px;
      overflow: hidden;
      background: radial-gradient(circle at 60% 40%, #064e3b 0%, #022c22 45%, #021a14 100%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: white;
      position: relative;
    }
    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
      background-size: 40px 40px;
      opacity: 0.8;
    }
    .container {
      position: relative;
      z-index: 10;
      display: flex;
      width: 100%;
      height: 100%;
      padding: 90px 110px;
      align-items: center;
      justify-content: space-between;
    }
    .left-col {
      max-width: 960px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(52, 211, 153, 0.4);
      padding: 10px 22px;
      border-radius: 9999px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #34d399;
      margin-bottom: 28px;
    }
    .pill .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
    }
    h1 {
      font-size: 64px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin-bottom: 24px;
      background: linear-gradient(135deg, #ffffff 30%, #a7f3d0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subheading {
      font-size: 28px;
      font-weight: 500;
      line-height: 1.4;
      color: #cbd5e1;
      margin-bottom: 36px;
    }
    .brand-box {
      display: flex;
      align-items: center;
      gap: 24px;
      padding-top: 24px;
      border-top: 1px solid rgba(16, 185, 129, 0.25);
    }
    .brand-name {
      font-size: 38px;
      font-weight: 900;
      letter-spacing: 0.02em;
      color: #ffffff;
    }
    .brand-tamil {
      color: #34d399;
      font-size: 32px;
      font-weight: 700;
      margin-left: 12px;
    }
    .tagline {
      font-size: 20px;
      font-weight: 600;
      color: #6ee7b7;
      letter-spacing: 0.04em;
    }
    .hackathon-badge {
      display: inline-block;
      margin-top: 28px;
      font-size: 14px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .right-col {
      width: 580px;
      position: relative;
    }
    .card-wrap {
      position: relative;
      border-radius: 28px;
      padding: 16px;
      background: linear-gradient(135deg, rgba(52, 211, 153, 0.45), rgba(6, 78, 59, 0.6));
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
      border: 1px solid rgba(52, 211, 153, 0.4);
    }
    .photo-inner {
      width: 100%;
      height: 460px;
      border-radius: 20px;
      background: #09121f;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }
    .fabric-photo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      padding: 12px;
    }
    .card-caption {
      position: absolute;
      bottom: 28px;
      left: 28px;
      right: 28px;
      background: rgba(2, 44, 34, 0.94);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(52, 211, 153, 0.4);
      border-radius: 16px;
      padding: 18px 22px;
    }
    .card-caption-title {
      font-size: 16px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 4px;
    }
    .card-caption-desc {
      font-size: 13px;
      color: #a7f3d0;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="grid-pattern"></div>
  <div class="container">
    <div class="left-col">
      <div class="pill">
        <span class="dot"></span>
        Global Circular Material Intelligence
      </div>
      <h1>Turning Textile Surplus into Global Opportunities</h1>
      <p class="subheading">
        Every day, valuable industrial textiles go to waste.<br>
        SUZARCHI bridges surplus inventory to high-value circular destinations.
      </p>
      <div class="brand-box">
        <div>
          <div class="brand-name">SUZARCHI <span class="brand-tamil">சுழற்சி</span></div>
          <div class="tagline">One Material. Multiple Possibilities.</div>
          <div style="font-size: 15px; color: #a7f3d0; margin-top: 6px; font-weight: 500;">
            Pronounced <strong style="color: #ffffff;">Suzharchi</strong> • From the Tamil word <em>சுழற்சி</em> meaning <strong>"Cyclical Rotation"</strong>
          </div>
        </div>
      </div>
      <div class="hackathon-badge">
        Meta Global AI Developer Hackathon 2026 • Official Demonstration
      </div>
    </div>
    <div class="right-col">
      <div class="card-wrap">
        <div class="photo-inner">
          <img class="fabric-photo" src="/fabric-photo.jpg" alt="Textile Surplus">
        </div>
        <div class="card-caption">
          <div class="card-caption-title">300 kg Pink Ribbed Corduroy Fabric</div>
          <div class="card-caption-desc">Warehouse Lot PCB-2026-IN-42 • Tiruppur Textile Cluster • Ready for Circular Intake</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

async function main() {
  console.log('Rendering 1920x1080 Opening Title Slide...');

  const server = http.createServer((req, res) => {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } else if (req.url === '/fabric-photo.jpg') {
      const img = fs.readFileSync(FABRIC_IMG);
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(img);
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise(r => server.listen(PORT, r));

  const userDataDir = process.env.TEMP + '\\edge-opening-slide-' + Date.now();
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT + 1}`,
    '--disable-gpu',
    '--window-size=1920,1080',
    `--user-data-dir=${userDataDir}`,
    `http://localhost:${PORT}/`,
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const targetsRes = await fetch(`http://127.0.0.1:${PORT + 1}/json`);
  const targets = await targetsRes.json();
  const page = targets.find(t => t.type === 'page') || targets[0];

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let idCounter = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await new Promise(r => setTimeout(r, 1000));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.join(EVIDENCE_DIR, 'DEMO-STEP-00-opening.png');
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));

  console.log(`[OK] Generated Opening Slide: ${outPath} (${fs.statSync(outPath).size} bytes)`);

  ws.close();
  edgeProc.kill();
  server.close();
  process.exit(0);
}

main().catch(console.error);
