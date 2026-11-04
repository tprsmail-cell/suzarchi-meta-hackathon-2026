import { spawn } from 'node:child_process';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const p = spawn(EDGE_PATH, ['--headless=new', '--remote-debugging-port=9299']);

await new Promise(r => setTimeout(r, 1500));
const res = await fetch('http://127.0.0.1:9299/json');
const list = await res.json();
const page = list[0];
const ws = new WebSocket(page.webSocketDebuggerUrl);

ws.onopen = () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `JSON.stringify({
        mp4: MediaRecorder.isTypeSupported('video/mp4'),
        mp4_avc: MediaRecorder.isTypeSupported('video/mp4;codecs=avc1'),
        mp4_aac: MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2'),
        mp4_h264: MediaRecorder.isTypeSupported('video/mp4;codecs=h264'),
        webm_vp9: MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus'),
        webm_vp8: MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
      })`,
      returnByValue: true
    }
  }));
};

ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  console.log('Edge MediaRecorder Support:', data.result.result.value);
  p.kill();
  process.exit(0);
};
