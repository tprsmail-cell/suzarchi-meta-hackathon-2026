import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PORT = 9298;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'D:\\SUZARCHI hackathon\\docs\\release\\demo-recording-evidence';
const PINK_FABRIC_IMG = 'D:\\SUZARCHI hackathon\\public\\assets\\pink-corduroy-sample.png';
const LOGO_IMG = 'D:\\SUZARCHI hackathon\\public\\assets\\suzarchi-logo.png';

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SUZARCHI Tiruppur & Thank You</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1920px;
      height: 1080px;
      overflow: hidden;
      background: radial-gradient(circle at 60% 30%, #064e3b 0%, #022c22 45%, #011611 100%);
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
      flex-direction: column;
      width: 100%;
      height: 100%;
      padding: 70px 100px;
      justify-content: space-between;
    }
    .top-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(16, 185, 129, 0.25);
      padding-bottom: 24px;
    }
    .cluster-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(52, 211, 153, 0.4);
      padding: 8px 20px;
      border-radius: 9999px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #34d399;
    }
    .cluster-pill .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
    }
    .hackathon-tag {
      font-size: 15px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .main-title-wrap {
      margin-top: 20px;
    }
    h1 {
      font-size: 52px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #ffffff 40%, #a7f3d0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
    }
    .subtitle {
      font-size: 22px;
      font-weight: 500;
      color: #cbd5e1;
      max-width: 1200px;
      line-height: 1.4;
    }
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
      margin: 32px 0;
    }
    .pillar-card {
      background: rgba(6, 78, 59, 0.35);
      border: 1px solid rgba(52, 211, 153, 0.35);
      border-radius: 20px;
      padding: 28px 26px;
      backdrop-filter: blur(12px);
      box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
    }
    .pillar-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #10b981, #34d399);
    }
    .stat-badge {
      font-size: 38px;
      font-weight: 900;
      color: #34d399;
      margin-bottom: 8px;
      letter-spacing: -0.01em;
    }
    .stat-title {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 10px;
    }
    .stat-desc {
      font-size: 14.5px;
      color: #a7f3d0;
      line-height: 1.5;
    }
    .bottom-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(2, 44, 34, 0.85);
      border: 1px solid rgba(52, 211, 153, 0.4);
      border-radius: 20px;
      padding: 22px 36px;
      backdrop-filter: blur(12px);
    }
    .thankyou-text {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .thankyou-tamil {
      font-size: 26px;
      font-weight: 700;
      color: #34d399;
    }
    .brand-statement {
      font-size: 16px;
      font-weight: 600;
      color: #6ee7b7;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="grid-pattern"></div>
  <div class="container">
    <div class="top-header">
      <div class="cluster-pill">
        <span class="dot"></span>
        Global Circularity Benchmark • Tiruppur, Tamil Nadu
      </div>
      <div class="hackathon-tag">
        Meta Global AI Developer Hackathon 2026
      </div>
    </div>

    <div class="main-title-wrap">
      <h1>Tiruppur: Pioneering Global Industrial Circularity</h1>
      <p class="subtitle">
        Before waste becomes an opportunity, it must be governed. Tiruppur is the world's first textile cluster to achieve 100% Zero Liquid Discharge, recycling millions of litres of water daily while systematically valorising pre-consumer cotton surplus.
      </p>
    </div>

    <div class="pillars-grid">
      <div class="pillar-card">
        <div class="stat-badge">95% Recycled</div>
        <div class="stat-title">100% Zero Liquid Discharge (ZLD)</div>
        <div class="stat-desc">
          18 Common Effluent Treatment Plants (CETPs) treat over 100 MLD of process water. Multi-stage Reverse Osmosis and salt crystallization recover pure water and dyeing salts with zero effluent discharge into river basins.
        </div>
      </div>

      <div class="pillar-card">
        <div class="stat-badge">100% Valorised</div>
        <div class="stat-title">Pre-Consumer Waste Recovery</div>
        <div class="stat-desc">
          Garment cutting clips are sorted at source into 20+ color and composition grades, feeding mechanical garnetting and Open-End rotor spinning mills across Erode, Karur, and Panipat circular corridors.
        </div>
      </div>

      <div class="pillar-card">
        <div class="stat-badge">1,600+ MW</div>
        <div class="stat-title">Net Clean Energy Ecosystem</div>
        <div class="stat-desc">
          Tiruppur textile manufacturers operate over 1,600 MW of dedicated wind and solar installations across Tamil Nadu, generating more clean electricity than the cluster consumes for manufacturing.
        </div>
      </div>
    </div>

    <div class="bottom-footer">
      <div class="thankyou-text">
        <span>Thank You!</span>
        <span class="thankyou-tamil">நன்றி • சுழற்சி</span>
      </div>
      <div class="brand-statement">
        <div>SUZARCHI — One Material. Multiple Possibilities.</div>
        <div style="font-size: 13.5px; color: #94a3b8; margin-top: 4px;">Empowering Circular Corridors from Tiruppur to the World</div>
      </div>
    </div>
  </div>
</body>
</html>`;

async function main() {
  console.log('Rendering 1920x1080 Tiruppur & Thank You Slide...');

  const server = http.createServer((req, res) => {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise(r => server.listen(PORT, r));

  const userDataDir = process.env.TEMP + '\\edge-tiruppur-slide-' + Date.now();
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

  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (e) => {
        const data = JSON.parse(e.data);
        if (data.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  });

  await new Promise(r => setTimeout(r, 1000));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.join(EVIDENCE_DIR, 'DEMO-STEP-09-tiruppur-thankyou.png');
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));

  console.log(`[OK] Generated Tiruppur & Thank You Slide: ${outPath} (${fs.statSync(outPath).size} bytes)`);

  ws.close();
  edgeProc.kill();
  server.close();
  process.exit(0);
}

main().catch(console.error);
