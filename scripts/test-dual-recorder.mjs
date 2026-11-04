import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const PORT = 9315;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const html = `<!DOCTYPE html>
<html>
<body>
  <canvas id="c" width="320" height="240"></canvas>
  <script>
    async function test() {
      const c = document.getElementById('c');
      const actx = new AudioContext();
      const osc = actx.createOscillator();
      const dest = actx.createMediaStreamDestination();
      osc.connect(dest);
      osc.start();

      const vstream = c.captureStream(30);
      const stream = new MediaStream([...vstream.getVideoTracks(), ...dest.stream.getAudioTracks()]);

      const recMp4 = new MediaRecorder(stream, { mimeType: 'video/mp4;codecs=avc1,mp4a.40.2' });
      const recWebm = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });

      const chunksMp4 = [];
      const chunksWebm = [];
      recMp4.ondataavailable = e => { if (e.data?.size) chunksMp4.push(e.data); };
      recWebm.ondataavailable = e => { if (e.data?.size) chunksWebm.push(e.data); };

      let done = 0;
      function checkDone() {
        done++;
        if (done === 2) {
          fetch('/done', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mp4Size: new Blob(chunksMp4).size,
              webmSize: new Blob(chunksWebm).size
            })
          });
        }
      }

      recMp4.onstop = checkDone;
      recWebm.onstop = checkDone;

      recMp4.start(200);
      recWebm.start(200);

      setTimeout(() => {
        recMp4.stop();
        recWebm.stop();
        osc.stop();
      }, 1000);
    }
    window.onload = test;
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else if (req.url === '/done') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      console.log('Dual Recorder Result:', body);
      res.end('OK');
      server.close();
      p.kill();
      process.exit(0);
    });
  }
});

server.listen(PORT);
const p = spawn(EDGE_PATH, ['--headless=new', '--autoplay-policy=no-user-gesture-required', `http://localhost:${PORT}`]);
