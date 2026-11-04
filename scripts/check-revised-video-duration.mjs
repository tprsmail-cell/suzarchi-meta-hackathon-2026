import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const PORT = 9292;
const VIDEO_PATH = 'docs/release/SUZARCHI_Meta_Hackathon_Precision_Synchronized_Demo.mp4';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

let p;
const server = http.createServer((req, res) => {
  if (req.url === '/video') {
    res.writeHead(200, { 'Content-Type': 'video/mp4' });
    fs.createReadStream(VIDEO_PATH).pipe(res);
  } else if (req.url.startsWith('/done')) {
    const q = new URL(req.url, `http://localhost:${PORT}`);
    const duration = parseFloat(q.searchParams.get('d'));
    const width = parseInt(q.searchParams.get('w'));
    const height = parseInt(q.searchParams.get('h'));
    console.log(`EXACT VIDEO DURATION : ${duration.toFixed(2)} seconds`);
    console.log(`VIDEO RESOLUTION     : ${width} x ${height}`);
    console.log(`VIDEO COMPLIANCE     : ${duration <= 180 ? 'PASS (<= 180s)' : 'FAIL (> 180s)'}`);
    res.writeHead(200); res.end('OK');
    server.close();
    if (p) p.kill();
    process.exit(0);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html><html><body>
      <video id="v" src="/video" preload="metadata"></video>
      <script>
        const v = document.getElementById('v');
        v.onloadedmetadata = () => {
          fetch('/done?d=' + v.duration + '&w=' + v.videoWidth + '&h=' + v.videoHeight);
        };
      </script>
    </body></html>`);
  }
});

server.listen(PORT, () => {
  p = spawn(EDGE_PATH, ['--headless=new', `http://localhost:${PORT}`]);
});
