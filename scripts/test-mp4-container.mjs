import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const PORT = 9310;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const TEST_MP4 = 'D:\\SUZARCHI hackathon\\docs\\release\\test_h264_aac.mp4';

const html = `<!DOCTYPE html>
<html>
<body>
  <canvas id="c" width="640" height="360"></canvas>
  <script>
    async function test() {
      const c = document.getElementById('c');
      const ctx = c.getContext('2d');
      const actx = new AudioContext();
      const osc = actx.createOscillator();
      const dest = actx.createMediaStreamDestination();
      osc.connect(dest);
      osc.start();

      let frame = 0;
      function render() {
        ctx.fillStyle = frame % 2 === 0 ? '#10b981' : '#047857';
        ctx.fillRect(0, 0, 640, 360);
        ctx.fillStyle = '#fff';
        ctx.font = '24px sans-serif';
        ctx.fillText('Testing H.264 MP4: ' + frame++, 50, 100);
        requestAnimationFrame(render);
      }
      render();

      const vstream = c.captureStream(30);
      const stream = new MediaStream([...vstream.getVideoTracks(), ...dest.stream.getAudioTracks()]);

      const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')
        ? 'video/mp4;codecs=avc1,mp4a.40.2'
        : (MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm');

      console.log('Selected MIME:', mimeType);
      const rec = new MediaRecorder(stream, { mimeType });
      const chunks = [];
      rec.ondataavailable = e => { if (e.data && e.data.size > 0) chunks.push(e.data); };
      rec.onstop = async () => {
        const blob = new Blob(chunks, { type: mimeType });
        console.log('Recorded bytes:', blob.size);
        await fetch('/save', { method: 'POST', body: blob });
      };

      rec.start(200);
      setTimeout(() => {
        rec.stop();
        osc.stop();
      }, 2000);
    }
    window.onload = test;
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else if (req.url === '/save') {
    const ws = fs.createWriteStream(TEST_MP4);
    req.pipe(ws);
    ws.on('finish', () => {
      console.log('Saved test MP4:', fs.statSync(TEST_MP4).size, 'bytes');
      res.end('OK');
      server.close();
      p.kill();
      process.exit(0);
    });
  }
});

server.listen(PORT);
const p = spawn(EDGE_PATH, ['--headless=new', '--autoplay-policy=no-user-gesture-required', `http://localhost:${PORT}`]);
