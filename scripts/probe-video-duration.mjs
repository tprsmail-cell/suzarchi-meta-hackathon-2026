import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const PORT = 9394;
const VIDEO_PATH = 'docs/release/SUZARCHI_Meta_Hackathon_Aligned_Demo.mp4';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

let p;
const server = http.createServer((req, res) => {
  if (req.url === '/v') {
    const stat = fs.statSync(VIDEO_PATH);
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(VIDEO_PATH, {start, end});
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': 'video/mp4',
      });
      fs.createReadStream(VIDEO_PATH).pipe(res);
    }
  } else if (req.url.startsWith('/log')) {
    console.log(decodeURIComponent(req.url));
    if (req.url.includes('DONE')) {
      res.end('OK');
      server.close();
      if (p) p.kill();
      process.exit(0);
    }
    res.end('OK');
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html><html><body>
      <video id="v" src="/v" controls></video>
      <script>
        const v = document.getElementById('v');
        v.addEventListener('loadedmetadata', () => {
          fetch('/log?event=loadedmetadata&d=' + v.duration + '&seekable=' + (v.seekable.length ? v.seekable.end(0) : 'none'));
          v.currentTime = 9999;
        });
        v.addEventListener('timeupdate', () => {
          if (v.currentTime > 10) {
            fetch('/log?event=timeupdate&time=' + v.currentTime + '&d=' + v.duration);
          }
        });
        v.addEventListener('seeked', () => {
          fetch('/log?event=seeked&currentTime=' + v.currentTime + '&d=' + v.duration + '&seekable=' + (v.seekable.length ? v.seekable.end(0) : 'none') + '&DONE=1');
        });
        setTimeout(() => {
          fetch('/log?event=timeout&currentTime=' + v.currentTime + '&d=' + v.duration + '&seekable=' + (v.seekable.length ? v.seekable.end(0) : 'none') + '&DONE=1');
        }, 5000);
      </script>
    </body></html>`);
  }
});

server.listen(PORT, () => {
  p = spawn(EDGE_PATH, ['--headless=new', `http://localhost:${PORT}`]);
});
