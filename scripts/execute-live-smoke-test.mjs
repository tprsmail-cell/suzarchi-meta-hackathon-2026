import http from 'http';
import fs from 'fs';

const payload = {
  caption: "Three Textile Surplus Candidates for Circular Classification",
  promptHint: `Three textile surplus candidates:
1. Garment fabric: 100% elastomultiester, 110 GSM, quantity 1,000 (unit unspecified), unembellished. Potential application: men's gymwear, sleeveless tops and quick-dry garments.
2. Pink cotton corduroy: 50 kg, reported as pure cotton, standard wale, peach finish, washable, described as cool and silky soft. Potential applications: handmade towels, braided rope and mechanical workshop cleaning materials.
3. Multicolour unravelled textile threads: mixed-colour recovered threads, unknown fibre composition. Potential applications: doormats, handmade products, workshop materials and textile recycling.

Instructions: Output structured JSON containing candidate material classification, potential reuse applications, recycling possibilities, required verification and evidence status. Strictly follow evidence governance: never mark fibre composition, GSM or chemical safety as CONFIRMED. Inferences must be REPORTED or ESTIMATED.`,
  userConsentGranted: true,
  clientEstimatedCost: 0.02
};

const data = JSON.stringify(payload);
const startTime = Date.now();

console.log("=== EXECUTING SINGLE LIVE META MODEL API SMOKE TEST ===");
console.log("Endpoint: http://127.0.0.1:3000/api/meta-ai/extract");
console.log("Payload bytes:", Buffer.byteLength(data));
console.log("Image transmission: DISABLED (0 image bytes)");

const req = http.request({
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/meta-ai/extract',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let responseBody = '';
  res.on('data', chunk => responseBody += chunk);
  res.on('end', () => {
    const latencyMs = Date.now() - startTime;
    console.log(`\nHTTP Status: ${res.statusCode} ${res.statusMessage}`);
    console.log(`Latency: ${latencyMs} ms`);

    try {
      const parsed = JSON.parse(responseBody);
      console.log("\n--- PARSED API RESPONSE ---");
      console.log(JSON.stringify(parsed, null, 2));

      // Save raw response to release evidence (excluding any sensitive keys)
      fs.writeFileSync('docs/release/live-meta-api-smoke-test-result.json', JSON.stringify({
        timestamp: new Date().toISOString(),
        httpStatus: res.statusCode,
        latencyMs,
        response: parsed
      }, null, 2));
      console.log("\nSaved result to docs/release/live-meta-api-smoke-test-result.json");
    } catch (e) {
      console.log("\nRaw Response Body (Non-JSON):");
      console.log(responseBody);
    }
  });
});

req.on('error', (err) => {
  const latencyMs = Date.now() - startTime;
  console.error(`\nRequest Error after ${latencyMs} ms:`, err.message);
});

req.write(data);
req.end();
