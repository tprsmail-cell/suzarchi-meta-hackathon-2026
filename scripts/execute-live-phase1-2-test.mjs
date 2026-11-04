/**
 * SUZARCHI — PHASE 1.2 CONTROLLED LIVE META API VALIDATION
 * Executed under Explicit Owner Authorization
 *
 * Model: muse-spark-1.3 (max_completion_tokens: 4096, reasoning_effort: 'low')
 * Material: Pink cotton corduroy (50 kg)
 * Constraints:
 * - Text metadata only (0 image bytes)
 * - Exactly ONE upstream request (no retries)
 * - $5.00 USD budget ceiling preserved
 * - Zero secrets logged or exposed
 */

import http from 'http';
import fs from 'fs';

const payload = {
  caption: 'Pink cotton corduroy',
  promptHint: `Material: Pink cotton corduroy
Quantity: 50 kg
Composition: Reported as 100% cotton; not laboratory verified
Construction: Standard wale corduroy, woven pile
Finish: Peach finish, reported
Hand feel: Soft, as reported
GSM: Unknown
Chemical contamination: Unknown
Potential reuse applications:
- Handmade towels
- Braided rope
- Workshop cleaning cloths
- Upcycled textile products

Instructions: Analyze circular textile surplus metadata into candidate structured specifications for a Digital Product Passport. Produce structured JSON containing:
- Candidate material category
- Material construction
- Fibre composition with evidence status
- Potential reuse applications
- Potential recycling routes
- Missing information
- Recommended physical and laboratory verification
- Safety and contamination uncertainties

Enforce SUZARCHI Evidence Governance: Never declare fibre composition, GSM, or chemical safety as CONFIRMED. Missing GSM must remain null. Unknown contamination must remain UNKNOWN. Missing material classification must remain UNKNOWN. All property inferences must be REPORTED or ESTIMATED.`,
  userConsentGranted: true,
  clientEstimatedCost: 0.02,
};

const postData = JSON.stringify(payload);
const startTime = Date.now();

console.log('============================================================');
console.log('   SUZARCHI PHASE 1.2 CONTROLLED LIVE META MODEL API TEST   ');
console.log('============================================================');
console.log('Target Endpoint       : http://127.0.0.1:3000/api/meta-ai/extract');
console.log('Model Configuration   : muse-spark-1.3 (max_completion_tokens: 4096, reasoning: low)');
console.log('Payload Type          : Text Metadata Only (Strict 0 Image Bytes)');
console.log('Material Under Test   : Pink cotton corduroy (50 kg)');
console.log('Request Policy        : Exactly ONE Request (Retries Disabled)');
console.log('Budget Limit          : $5.00 USD Ceiling Preserved');
console.log('------------------------------------------------------------');

const req = http.request(
  {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/meta-ai/extract',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  },
  (res) => {
    let responseBody = '';
    res.on('data', (chunk) => (responseBody += chunk));
    res.on('end', () => {
      const latencyMs = Date.now() - startTime;
      console.log(`\nHTTP Response Status : ${res.statusCode} ${res.statusMessage}`);
      console.log(`Round-Trip Latency   : ${latencyMs} ms`);

      try {
        const parsed = JSON.parse(responseBody);

        console.log('\n--- STRUCTURED PROXY RESPONSE ---');
        console.log(JSON.stringify(parsed, null, 2));

        // Save sanitized result record
        const record = {
          timestamp: new Date().toISOString(),
          httpStatus: res.statusCode,
          latencyMs,
          response: parsed,
        };

        fs.writeFileSync(
          'docs/release/live-meta-api-phase1-2-result.json',
          JSON.stringify(record, null, 2)
        );
        console.log('\nResult successfully saved to docs/release/live-meta-api-phase1-2-result.json');
      } catch (err) {
        console.error('\nRaw Non-JSON Response:');
        console.log(responseBody);
      }
    });
  }
);

req.on('error', (err) => {
  const latencyMs = Date.now() - startTime;
  console.error(`\nRequest Network Error after ${latencyMs} ms:`, err.message);
});

// Send exactly ONE request
req.write(postData);
req.end();
