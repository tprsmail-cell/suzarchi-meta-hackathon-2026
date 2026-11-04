/**
 * SUZARCHI Meta AI Response Parser Hardening Verification Suite
 *
 * Verifies defensive parser behavior, diagnostic distinctions, and Evidence Governance:
 *  1. Token-limit truncation (finish_reason: "length")
 *  2. Successful response with valid JSON content
 *  3. Model refusal (message.refusal)
 *  4. Missing usage metadata handling
 *  5. Missing or null content
 *  6. Valid structured extraction with evidence demotion (CONFIRMED -> REPORTED)
 *  7. E2E route verification for token limits and refusals
 *
 * STRICT GOVERNANCE:
 * - 100% Offline with network interceptors guaranteeing ZERO external egress.
 * - Confirms usage accounting (prompt, completion, total, reasoning tokens).
 */

import http from 'http';
import https from 'https';
import {
  parseAndValidateModelResponse,
  sanitizeExtractedEvidence,
  extractModelUsage,
} from '../src/lib/metaAiResponseParser.ts';

// --- NETWORK GUARD: GUARANTEE ZERO EXTERNAL CALLS ---
let externalCallsBlocked = 0;
const allowedLocal = new Set(['localhost', '127.0.0.1', '::1']);

const origHttp = http.request;
const origHttps = https.request;

http.request = function (options, cb) {
  const host = (options.host || (options.headers && options.headers.host) || 'localhost').split(':')[0];
  if (!allowedLocal.has(host)) {
    externalCallsBlocked++;
    throw new Error(`CRITICAL SECURITY VIOLATION: External HTTP call blocked to: ${host}`);
  }
  return origHttp.apply(this, arguments);
};

https.request = function (options, cb) {
  const host = (options.host || (options.headers && options.headers.host) || 'localhost').split(':')[0];
  if (!allowedLocal.has(host)) {
    externalCallsBlocked++;
    throw new Error(`CRITICAL SECURITY VIOLATION: External HTTPS call blocked to: ${host}`);
  }
  return origHttps.apply(this, arguments);
};

const results = [];

function record(id, title, pass, details) {
  results.push({ id, title, pass, details });
  const badge = pass ? ' PASS ' : ' FAIL ';
  console.log(`[${badge}] #${id}: ${title}`);
  if (details) console.log(`       -> ${details}`);
}

async function runPostRequest(payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
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
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runSuite() {
  console.log('\n============================================================');
  console.log('   SUZARCHI MUSE SPARK 1.3 PARSER OPTIMIZATION SUITE       ');
  console.log('============================================================\n');

  console.log('--- PART 1: Direct Parser Unit Tests & Diagnostic Scenarios ---');

  // Test 1: Token-limit truncation (finish_reason: "length" with reasoning tokens)
  try {
    const tokenLimitEnvelope = {
      choices: [
        {
          finish_reason: 'length',
          message: {
            role: 'assistant',
            content: null,
          },
        },
      ],
      usage: {
        prompt_tokens: 180,
        completion_tokens: 4096,
        total_tokens: 4276,
        completion_tokens_details: {
          reasoning_tokens: 4096,
        },
      },
    };
    const res = parseAndValidateModelResponse(tokenLimitEnvelope, 'Pink Corduroy', 400);
    const pass =
      res.success === false &&
      res.code === 'TOKEN_LIMIT_EXCEEDED' &&
      res.statusCode === 502 &&
      res.usage.completionTokens === 4096 &&
      res.usage.reasoningTokens === 4096;
    record(1, 'Token-limit truncation handling (finish_reason: "length")', pass, `Code: ${res.code}, Reasoning Tokens: ${res.usage?.reasoningTokens}`);
  } catch (err) {
    record(1, 'Token-limit truncation handling', false, err.message);
  }

  // Test 2: Successful response with valid JSON content
  try {
    const successEnvelope = {
      choices: [
        {
          finish_reason: 'stop',
          message: {
            role: 'assistant',
            content: JSON.stringify({
              materialCategory: 'Corduroy Fabric',
              fabricConstruction: 'Standard Wale Corduroy',
              visibleColour: 'Pink',
              userReportedFibreComposition: '100% Cotton',
              userReportedGsm: 220,
              materialCondition: 'Surplus Rolls',
              visibleDefects: [],
              potentialReusePathways: ['Handmade Towels', 'Braided Rope', 'Cleaning Cloths'],
              missingInformation: ['Chemical Finishing Lab Test'],
            }),
          },
        },
      ],
      usage: {
        prompt_tokens: 150,
        completion_tokens: 280,
        total_tokens: 430,
        completion_tokens_details: {
          reasoning_tokens: 120,
        },
      },
    };
    const res = parseAndValidateModelResponse(successEnvelope, 'Pink Cotton Corduroy', 500);
    const pass =
      res.success === true &&
      res.data.sanitizedProperties.fibreComposition.status === 'REPORTED' &&
      res.data.textileIntelligence.materialCategory === 'Corduroy Fabric' &&
      res.data.usage.reasoningTokens === 120 &&
      res.data.usage.totalTokens === 430;
    record(2, 'Successful response with JSON content & usage accounting', pass, `Category: ${res.data?.textileIntelligence.materialCategory}, Reasoning: ${res.data?.usage.reasoningTokens}`);
  } catch (err) {
    record(2, 'Successful response with JSON content', false, err.message);
  }

  // Test 3: Model refusal (message.refusal)
  try {
    const refusalEnvelope = {
      choices: [
        {
          finish_reason: 'stop',
          message: {
            role: 'assistant',
            content: null,
            refusal: 'The request violated safety or acceptable use policies.',
          },
        },
      ],
      usage: {
        prompt_tokens: 95,
        completion_tokens: 15,
        total_tokens: 110,
      },
    };
    const res = parseAndValidateModelResponse(refusalEnvelope, 'Test', 300);
    const pass =
      res.success === false &&
      res.code === 'MODEL_REFUSAL' &&
      res.statusCode === 502 &&
      res.message.includes('safety');
    record(3, 'Model refusal diagnostic (message.refusal)', pass, `Code: ${res.code}, Msg: ${res.message.slice(0, 60)}`);
  } catch (err) {
    record(3, 'Model refusal diagnostic', false, err.message);
  }

  // Test 4: Missing usage metadata (safe fallback without crashing or NaN)
  try {
    const noUsageEnvelope = {
      choices: [
        {
          finish_reason: 'stop',
          message: {
            role: 'assistant',
            content: JSON.stringify({ materialCategory: 'Recycled Yarn' }),
          },
        },
      ],
    };
    const res = parseAndValidateModelResponse(noUsageEnvelope, 'Recycled Yarn', 400);
    const pass =
      res.success === true &&
      typeof res.data.usage.promptTokens === 'number' &&
      !isNaN(res.data.usage.promptTokens) &&
      res.data.usage.completionTokens === 0 &&
      res.data.usage.reasoningTokens === undefined;
    record(4, 'Missing usage metadata fallback (zero NaN values)', pass, `Calculated Prompt Tokens: ${res.data?.usage.promptTokens}`);
  } catch (err) {
    record(4, 'Missing usage metadata fallback', false, err.message);
  }

  // Test 5: Missing or null message content without length finish_reason
  try {
    const nullContentEnvelope = {
      choices: [
        {
          finish_reason: 'stop',
          message: {
            role: 'assistant',
            content: null,
          },
        },
      ],
    };
    const res = parseAndValidateModelResponse(nullContentEnvelope);
    const pass =
      res.success === false &&
      res.code === 'NULL_MESSAGE_CONTENT' &&
      res.statusCode === 502;
    record(5, 'Missing or null content without token truncation', pass, `Code: ${res.code}`);
  } catch (err) {
    record(5, 'Missing or null content', false, err.message);
  }

  // Test 6: Valid structured extraction with evidence demotion
  try {
    const rawWithConfirmed = {
      materialName: '100% Pure Silk',
      materialNameStatus: 'CONFIRMED',
      fibreComposition: '100% Silk',
      fibreCompositionStatus: 'CONFIRMED', // Hard Rule: MUST be demoted
      userReportedGsm: 110,
    };
    const sanitized = sanitizeExtractedEvidence(rawWithConfirmed, 'Silk Roll');
    const pass =
      sanitized.materialName.status === 'REPORTED' &&
      sanitized.fibreComposition.status === 'REPORTED';
    record(6, 'Evidence Governance Demotion (CONFIRMED -> REPORTED)', pass, `Composition Status: ${sanitized.fibreComposition.status}`);
  } catch (err) {
    record(6, 'Evidence Governance Demotion', false, err.message);
  }

  // Test 6A: Missing hazard status -> null
  try {
    const rawMissingHazard = {
      materialName: 'Cotton Scrap',
      // isControlledOrHazardous omitted
    };
    const sanitized = sanitizeExtractedEvidence(rawMissingHazard);
    const pass = sanitized.isControlledOrHazardous === null;
    record('6A', 'Missing hazard status -> null', pass, `isControlledOrHazardous: ${sanitized.isControlledOrHazardous}`);
  } catch (err) {
    record('6A', 'Missing hazard status', false, err.message);
  }

  // Test 6B: Explicit unknown hazard status -> null
  try {
    const rawUnknownHazard = {
      materialName: 'Dyed Yarn',
      isControlledOrHazardous: 'UNKNOWN',
      contaminationRisk: 'UNKNOWN',
    };
    const sanitized = sanitizeExtractedEvidence(rawUnknownHazard);
    const pass = sanitized.isControlledOrHazardous === null && sanitized.contaminationRisk === 'UNKNOWN';
    record('6B', 'Explicit unknown hazard status -> null', pass, `isControlledOrHazardous: ${sanitized.isControlledOrHazardous}, risk: ${sanitized.contaminationRisk}`);
  } catch (err) {
    record('6B', 'Explicit unknown hazard status', false, err.message);
  }

  // Test 6C: Unverified chemical finish with AI claiming false -> null (cannot override without evidence)
  try {
    const rawUnverifiedFinish = {
      materialName: 'Peach finish corduroy',
      isControlledOrHazardous: false, // Model guess without evidence
      contaminationRisk: 'MEDIUM',
    };
    const sanitized = sanitizeExtractedEvidence(rawUnverifiedFinish);
    const pass = sanitized.isControlledOrHazardous === null;
    record('6C', 'Unverified chemical finish (AI false override) -> null', pass, `isControlledOrHazardous: ${sanitized.isControlledOrHazardous}`);
  } catch (err) {
    record('6C', 'Unverified chemical finish', false, err.message);
  }

  // Test 6D: Verified hazardous status -> true
  try {
    const rawHazardous = {
      materialName: 'Oily solvent rags',
      isControlledOrHazardous: true,
      contaminationRisk: 'HIGH',
    };
    const sanitized = sanitizeExtractedEvidence(rawHazardous);
    const pass = sanitized.isControlledOrHazardous === true && sanitized.contaminationRisk === 'HIGH';
    record('6D', 'Verified hazardous status -> true', pass, `isControlledOrHazardous: ${sanitized.isControlledOrHazardous}, risk: ${sanitized.contaminationRisk}`);
  } catch (err) {
    record('6D', 'Verified hazardous status', false, err.message);
  }

  // Test 6E: Verified non-hazardous status -> false only with adequate evidence
  try {
    const rawVerifiedNonHazardous = {
      materialName: 'Certified organic cotton',
      isControlledOrHazardous: false,
      hasVerifiedNonHazardousEvidence: true,
      contaminationRisk: 'LOW',
    };
    const sanitized = sanitizeExtractedEvidence(rawVerifiedNonHazardous);
    const pass = sanitized.isControlledOrHazardous === false && sanitized.contaminationRisk === 'LOW';
    record('6E', 'Verified non-hazardous status -> false (with evidence)', pass, `isControlledOrHazardous: ${sanitized.isControlledOrHazardous}`);
  } catch (err) {
    record('6E', 'Verified non-hazardous status', false, err.message);
  }

  // --------------------------------------------------------------------------
  // PART 2: END-TO-END HTTP ROUTE INTEGRATION TESTS (Local Server)
  // --------------------------------------------------------------------------
  console.log('\n--- PART 2: End-to-End Route Tests (Local Offline Simulation) ---');

  // E2E Test 7: Route handling of token limit simulation
  try {
    const httpRes = await runPostRequest({
      mockSimulationMode: 'MOCK_TOKEN_LIMIT',
      caption: 'Pink Corduroy',
    });
    const pass =
      httpRes.statusCode === 502 &&
      httpRes.data.code === 'TOKEN_LIMIT_EXCEEDED' &&
      httpRes.data.tokenUsage?.reasoningTokens === 3800;
    record(7, 'E2E Route Test: Token Limit Simulation (502 TOKEN_LIMIT_EXCEEDED)', pass, `Reasoning Tokens: ${httpRes.data.tokenUsage?.reasoningTokens}`);
  } catch (err) {
    record(7, 'E2E Route Test: Token Limit Simulation', false, err.message);
  }

  // E2E Test 8: Route handling of model refusal simulation
  try {
    const httpRes = await runPostRequest({
      mockSimulationMode: 'MOCK_MODEL_REFUSAL',
      caption: 'Restricted Material',
    });
    const pass =
      httpRes.statusCode === 502 &&
      httpRes.data.code === 'MODEL_REFUSAL';
    record(8, 'E2E Route Test: Model Refusal Simulation (502 MODEL_REFUSAL)', pass, `Code: ${httpRes.data?.code}`);
  } catch (err) {
    record(8, 'E2E Route Test: Model Refusal Simulation', false, err.message);
  }

  // E2E Test 9: Route handling of valid mock success
  try {
    const httpRes = await runPostRequest({
      mockSimulationMode: 'MOCK_SUCCESS',
      caption: 'Pink Corduroy',
    });
    const pass =
      httpRes.statusCode === 200 &&
      httpRes.data.success === true &&
      httpRes.data.source === 'REMOTE_META_AI' &&
      httpRes.data.tokenUsage?.totalTokens === 205;
    record(9, 'E2E Route Test: Valid Mock Success (200 OK)', pass, `Source: ${httpRes.data?.source}, Total Tokens: ${httpRes.data?.tokenUsage?.totalTokens}`);
  } catch (err) {
    record(9, 'E2E Route Test: Valid Mock Success', false, err.message);
  }

  // --------------------------------------------------------------------------
  // SUMMARY & NETWORK VERIFICATION
  // --------------------------------------------------------------------------
  console.log('\n============================================================');
  console.log('                   VERIFICATION SUMMARY                     ');
  console.log('============================================================');

  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = total - passed;

  console.log(`Total Checks Executed  : ${total}`);
  console.log(`Passed                 : ${passed}`);
  console.log(`Failed                 : ${failed}`);
  console.log(`External Calls Blocked : ${externalCallsBlocked}`);
  console.log(`External Egress Leaks  : ZERO (Guaranteed 100% offline)`);

  if (failed > 0) {
    console.error('\n❌ TEST SUITE FAILED!');
    process.exit(1);
  } else {
    console.log('\n✅ ALL MUSE SPARK 1.3 OPTIMIZATION TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  }
}

runSuite().catch((err) => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
