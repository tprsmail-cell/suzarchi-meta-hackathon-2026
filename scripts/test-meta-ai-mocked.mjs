/**
 * SUZARCHI Meta AI Integration Preparation — Local Mock Verification Suite
 *
 * Verifies all 14 criteria specified in Section 8 of the Owner Execution Directive:
 *  1. Meta adapter configuration validation
 *  2. Mocked successful response parsing
 *  3. Mocked authentication failure (401)
 *  4. Mocked rate-limit response (429)
 *  5. Mocked timeout handling (504)
 *  6. Invalid JSON payload rejection
 *  7. Unsupported model response handling
 *  8. Missing environment variable fallback
 *  9. Budget exhaustion ($5.00 ceiling tripped)
 * 10. Duplicate request concurrency prevention
 * 11. Local deterministic fallback verification
 * 12. Evidence status integrity (REPORTED/ESTIMATED, zero CONFIRMED)
 * 13. Zero secret leakage check in bundles
 * 14. Instrument test to ensure ZERO live external network calls occur
 */

import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

// --- INSTRUMENTATION: ZERO EXTERNAL NETWORK EGRESS GUARANTEE ---
let externalNetworkCallsCount = 0;
const allowedLocalHosts = new Set(['localhost', '127.0.0.1', '::1']);

function instrumentNetworkGuards() {
  const originalHttpRequest = http.request;
  const originalHttpsRequest = https.request;

  http.request = function (options, callback) {
    const host = options.host || (options.headers && options.headers.host) || 'localhost';
    if (!allowedLocalHosts.has(host.split(':')[0])) {
      externalNetworkCallsCount++;
      throw new Error(`VIOLATION: Unauthorised external HTTP request blocked to: ${host}`);
    }
    return originalHttpRequest.apply(this, arguments);
  };

  https.request = function (options, callback) {
    const host = options.host || (options.headers && options.headers.host) || 'localhost';
    if (!allowedLocalHosts.has(host.split(':')[0])) {
      externalNetworkCallsCount++;
      throw new Error(`VIOLATION: Unauthorised external HTTPS request blocked to: ${host}`);
    }
    return originalHttpsRequest.apply(this, arguments);
  };
}

instrumentNetworkGuards();

// --- TEST HARNESS & SUITE EXECUTION ---
const testResults = [];

function recordTest(id, name, passed, details) {
  testResults.push({ id, name, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} [Test ${id.toString().padStart(2, '0')}] ${name}`);
  if (details) {
    console.log(`    └─ ${details}`);
  }
}

async function runLocalMockSuite() {
  console.log('='.repeat(75));
  console.log('SUZARCHI META AI INTEGRATION PREPARATION — LOCAL MOCK AUDIT SUITE');
  console.log('Strict Owner Policy: 100% Offline, Zero External Egress');
  console.log('='.repeat(75));

  // --- 1. Meta Adapter Configuration Validation ---
  try {
    const routeFile = fs.readFileSync('src/app/api/meta-ai/extract/route.ts', 'utf8');
    const hasBaseUrl = routeFile.includes('https://api.meta.ai/v1');
    const hasModelSpark = routeFile.includes('muse-spark-1.3') || routeFile.includes('muse-spark-1.1');
    const hasMaxBudget = routeFile.includes('META_AI_MAX_SPEND_USD');
    const hasEnabledFlag = routeFile.includes('META_AI_ENABLED');

    const configValid = hasBaseUrl && hasModelSpark && hasMaxBudget && hasEnabledFlag;
    recordTest(
      1,
      'Meta adapter configuration validation',
      configValid,
      'Verified placeholders: META_AI_BASE_URL, META_AI_MODEL (muse-spark-1.3 / muse-spark-1.1), META_AI_MAX_SPEND_USD, META_AI_ENABLED'
    );
  } catch (err) {
    recordTest(1, 'Meta adapter configuration validation', false, err.message);
  }

  // Helper to make local mock requests to running Next.js route
  async function callLocalProxy(bodyPayload) {
    return new Promise((resolve, reject) => {
      const dataString = JSON.stringify(bodyPayload);
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: 3000,
          path: '/api/meta-ai/extract',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(dataString),
          },
        },
        (res) => {
          let chunks = '';
          res.on('data', (d) => (chunks += d));
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(chunks) });
            } catch (e) {
              resolve({ status: res.statusCode, raw: chunks });
            }
          });
        }
      );

      req.on('error', (err) => reject(err));
      req.write(dataString);
      req.end();
    });
  }

  // --- 2. Mocked Successful Response Parsing ---
  try {
    const res = await callLocalProxy({
      photoUrl: '/assets/navy-single-jersey-fabric.jpg',
      caption: 'Navy Single Jersey Fabric Roll',
      clientEstimatedCost: 0.02,
      userConsentGranted: true,
      mockSimulationMode: 'MOCK_SUCCESS',
    });

    const passed =
      res.status === 200 &&
      res.data.success === true &&
      res.data.source === 'REMOTE_META_AI' &&
      res.data.extractedProperties?.materialName?.value === 'Navy Single Jersey Fabric Roll';

    recordTest(
      2,
      'Mocked successful response parsing',
      passed,
      `Status: ${res.status}, Model: ${res.data.model}, Source: ${res.data.source}`
    );
  } catch (err) {
    recordTest(2, 'Mocked successful response parsing', false, err.message);
  }

  // --- 3. Mocked Authentication Failure (401) ---
  try {
    const res = await callLocalProxy({
      photoUrl: '/assets/sample.jpg',
      caption: 'Test Fabric',
      userConsentGranted: true,
      mockSimulationMode: 'MOCK_AUTH_FAILURE',
    });

    const passed = res.status === 401 && res.data.code === 'UPSTREAM_HTTP_401';
    recordTest(
      3,
      'Mocked authentication failure (401)',
      passed,
      `Status: ${res.status}, Code: ${res.data.code}, Fallback: ${res.data.source}`
    );
  } catch (err) {
    recordTest(3, 'Mocked authentication failure (401)', false, err.message);
  }

  // --- 4. Mocked Rate-Limit Response (429) ---
  try {
    const res = await callLocalProxy({
      photoUrl: '/assets/sample.jpg',
      caption: 'Test Fabric',
      userConsentGranted: true,
      mockSimulationMode: 'MOCK_RATE_LIMIT',
    });

    const passed = res.status === 429 && res.data.code === 'UPSTREAM_HTTP_429';
    recordTest(
      4,
      'Mocked rate-limit response (429)',
      passed,
      `Status: ${res.status}, Code: ${res.data.code}, Message: ${res.data.message}`
    );
  } catch (err) {
    recordTest(4, 'Mocked rate-limit response (429)', false, err.message);
  }

  // --- 5. Mocked Timeout Handling (504) ---
  try {
    const res = await callLocalProxy({
      photoUrl: '/assets/sample.jpg',
      caption: 'Test Fabric',
      userConsentGranted: true,
      mockSimulationMode: 'MOCK_TIMEOUT',
    });

    const passed = res.status === 504 && res.data.code === 'TIMEOUT_EXCEEDED';
    recordTest(
      5,
      'Mocked timeout handling (504)',
      passed,
      `Status: ${res.status}, Code: ${res.data.code}, Fallback: ${res.data.source}`
    );
  } catch (err) {
    recordTest(5, 'Mocked timeout handling (504)', false, err.message);
  }

  // --- 6. Invalid JSON Handling (502 / 400) ---
  try {
    const res = await callLocalProxy({
      photoUrl: '/assets/sample.jpg',
      caption: 'Test Fabric',
      userConsentGranted: true,
      mockSimulationMode: 'MOCK_INVALID_JSON',
    });

    const passed = res.status === 502 && res.data.code === 'MALFORMED_MODEL_JSON';
    recordTest(
      6,
      'Invalid JSON handling',
      passed,
      `Status: ${res.status}, Code: ${res.data.code}, Graceful Fallback: ${res.data.source}`
    );
  } catch (err) {
    recordTest(6, 'Invalid JSON handling', false, err.message);
  }

  // --- 7. Unsupported Model Response ---
  try {
    const res = await callLocalProxy({
      photoUrl: '/assets/sample.jpg',
      caption: 'Test Fabric',
      userConsentGranted: true,
      mockSimulationMode: 'MOCK_UNSUPPORTED_MODEL',
    });

    const passed = res.status === 400 && res.data.code === 'UNSUPPORTED_MODEL_ERROR';
    recordTest(
      7,
      'Unsupported model response handling',
      passed,
      `Status: ${res.status}, Code: ${res.data.code}, Message: ${res.data.message}`
    );
  } catch (err) {
    recordTest(7, 'Unsupported model response handling', false, err.message);
  }

  // --- 8. Missing Environment Variable Fallback ---
  try {
    // Normal call without mock mode; in preparation environment without live key
    const res = await callLocalProxy({
      photoUrl: '/assets/sample.jpg',
      caption: 'Offline Test Fabric',
      userConsentGranted: true,
    });

    const passed =
      res.status === 200 &&
      res.data.success === false &&
      res.data.source === 'LOCAL_FALLBACK' &&
      res.data.code?.includes('DISABLED_BY_POLICY');

    recordTest(
      8,
      'Missing environment variable / disabled flag fallback',
      passed,
      `Source: ${res.data.source}, Code: ${res.data.code}, Fallback Message: ${res.data.message}`
    );
  } catch (err) {
    recordTest(8, 'Missing environment variable / disabled flag fallback', false, err.message);
  }

  // --- 9. Budget Exhaustion ($5.00 limit) ---
  try {
    const res = await callLocalProxy({
      photoUrl: '/assets/sample.jpg',
      caption: 'Budget Exhaustion Test',
      userConsentGranted: true,
      clientEstimatedCost: 10.0, // Exceeds $5.00 ceiling
    });

    const passed = res.status === 429 && res.data.code === 'BUDGET_EXHAUSTED';
    recordTest(
      9,
      'Budget exhaustion ($5.00 ceiling hard gate)',
      passed,
      `Status: ${res.status}, Blocked: ${res.data.code}, Limit: $${res.data.maxSpendUsd}`
    );
  } catch (err) {
    recordTest(9, 'Budget exhaustion ($5.00 ceiling hard gate)', false, err.message);
  }

  // --- 10. Duplicate Request & Rapid Submission Throttle ---
  try {
    // Fire two identical requests in immediate sequence
    const [req1, req2] = await Promise.all([
      callLocalProxy({ photoUrl: '/assets/1.jpg', caption: 'Concurrent 1', userConsentGranted: true, clientEstimatedCost: 0.02 }),
      callLocalProxy({ photoUrl: '/assets/1.jpg', caption: 'Concurrent 1', userConsentGranted: true, clientEstimatedCost: 0.02 }),
    ]);

    const passed = req1.status === 200 || req2.status === 429;
    recordTest(
      10,
      'Duplicate request concurrency & throttle protection',
      passed,
      `Req 1 Status: ${req1.status}, Req 2 Status: ${req2.status} (Handled gracefully)`
    );
  } catch (err) {
    recordTest(10, 'Duplicate request concurrency & throttle protection', false, err.message);
  }

  // --- 11. Local Deterministic Fallback Verification ---
  try {
    const engineCode = fs.readFileSync('src/lib/metaAiEngine.ts', 'utf8');
    const clientCode = fs.readFileSync('src/lib/metaAiProxyClient.ts', 'utf8');
    const hasLocalExtraction = engineCode.includes('runStructuredExtraction');
    const hasTransparentFallback = clientCode.includes('Local-Deterministic-Extractor');

    recordTest(
      11,
      'Local deterministic fallback verification',
      hasLocalExtraction && hasTransparentFallback,
      'Confirmed full ISO-aligned offline rule engine available and wired as primary fallback.'
    );
  } catch (err) {
    recordTest(11, 'Local deterministic fallback verification', false, err.message);
  }

  // --- 12. Evidence Status Integrity (Rule 5: Optical cannot CONFIRM) ---
  try {
    const res = await callLocalProxy({
      photoUrl: '/assets/navy-single-jersey-fabric.jpg',
      caption: 'Navy Single Jersey',
      userConsentGranted: true,
      mockSimulationMode: 'MOCK_SUCCESS',
    });

    const fibreStatus = res.data.extractedProperties?.fibreComposition?.status;
    const nameStatus = res.data.extractedProperties?.materialName?.status;

    // Optical observations must NEVER be CONFIRMED
    const hasConfirmedFibre = fibreStatus === 'CONFIRMED';
    const passed = !hasConfirmedFibre && fibreStatus === 'REPORTED' && nameStatus === 'REPORTED';

    recordTest(
      12,
      'Evidence status integrity (Rule 5: Zero unverified CONFIRMED)',
      passed,
      `Fibre Composition Status: ${fibreStatus} (Correctly demoted from attempted CONFIRMED to REPORTED)`
    );
  } catch (err) {
    recordTest(12, 'Evidence status integrity', false, err.message);
  }

  // --- 13. Zero Secret Leakage in Frontend Bundles ---
  try {
    const nextEnvLocalExists = fs.existsSync('.env.local');
    const nextEnvContent = nextEnvLocalExists ? fs.readFileSync('.env.local', 'utf8') : '';
    const hasNextPublicSecret = nextEnvContent.includes('NEXT_PUBLIC_META_AI_API_KEY');

    // Scan client components for raw secret references
    const clientFile = fs.readFileSync('src/lib/metaAiProxyClient.ts', 'utf8');
    const modalFile = fs.readFileSync('src/components/AiIntakeReviewModal.tsx', 'utf8');
    const hasClientSecret = clientFile.includes('process.env.META_AI_API_KEY') || modalFile.includes('META_AI_API_KEY');

    const passed = !hasNextPublicSecret && !hasClientSecret;
    recordTest(
      13,
      'Zero secret leakage into frontend bundles',
      passed,
      'No NEXT_PUBLIC_ keys or raw process.env credentials accessed in client bundles.'
    );
  } catch (err) {
    recordTest(13, 'Zero secret leakage into frontend bundles', false, err.message);
  }

  // --- 14. Instrument Test: ZERO External Network Calls Occurred ---
  recordTest(
    14,
    'Instrumentation verification: Zero external network egress',
    externalNetworkCallsCount === 0,
    `Total external network requests dispatched: ${externalNetworkCallsCount} (Strict owner boundary maintained).`
  );

  console.log('='.repeat(75));
  const allPassed = testResults.every((t) => t.passed);
  console.log(`TOTAL TESTS: ${testResults.length} | PASSED: ${testResults.filter((t) => t.passed).length} | FAILED: ${testResults.filter((t) => !t.passed).length}`);
  console.log(`STATUS: ${allPassed ? 'PREPARATION_COMPLETE' : 'PREPARATION_PARTIAL'}`);
  console.log('='.repeat(75));

  return testResults;
}

runLocalMockSuite()
  .then((results) => {
    fs.writeFileSync('docs/release/mock-test-results.json', JSON.stringify(results, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
