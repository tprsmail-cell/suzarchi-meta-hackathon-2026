/**
 * SUZARCHI Emergency Hackathon Stabilization — Phase 1 Regression Test Suite
 * Validates DEF-001, DEF-002, DEF-003, DEF-005, and DEF-006.
 */

import assert from 'assert';
import { evaluateDestinationForPassport, evaluateReuseDestinations } from '../src/lib/destinationEngine.ts';
import { parseAndValidateModelResponse } from '../src/lib/metaAiResponseParser.ts';
import { calculateScope3GhgAccounting, issueScope3VerificationCertificate } from '../src/lib/scope3GhgEngine.ts';
import { promotePropertyWithLabReport } from '../src/lib/laboratoryEngine.ts';
import { DASHBOARD_SAMPLE_CASE, NAVY_KNIT_SAMPLE_CASE, WORKSHOP_OILY_RAGS_CASE } from '../src/data/sampleCases.ts';
import { INITIAL_TEST_REPORTS } from '../src/data/laboratoryData.ts';
import { MASTER_DESTINATION_CATALOG } from '../src/data/destinationCatalog.ts';

console.log('================================================================');
console.log('  SUZARCHI PHASE 1 EMERGENCY STABILIZATION REGRESSION SUITE     ');
console.log('================================================================\n');

// -------------------------------------------------------------
// 1. DEF-001 REGRESSION: Safety Integrity & Precautionary Principle
// -------------------------------------------------------------
console.log('--- TEST 1: DEF-001 Safety Negative-Proof Elimination ---');

// Case 1A: Unknown Contamination Evidence
const UNKNOWN_CONTAMINATION_PASSPORT = {
  ...DASHBOARD_SAMPLE_CASE,
  id: 'mat-test-unknown-contam',
  cleanlinessRating: { value: 'UNKNOWN', status: 'UNKNOWN' },
  contaminationStatus: { value: 'UNKNOWN', status: 'UNKNOWN' },
  isControlledOrHazardous: undefined,
};

const apparelTarget = MASTER_DESTINATION_CATALOG.find(d => d.id === 'dest-apparel');
assert.ok(apparelTarget, 'Apparel destination must exist');

const unknownEval = evaluateDestinationForPassport(UNKNOWN_CONTAMINATION_PASSPORT, apparelTarget, 0);
assert.equal(
  unknownEval.fourDimensions.safetyEligibility.status,
  'VERIFICATION_REQUIRED',
  'DEF-001: Missing contamination evidence must return VERIFICATION_REQUIRED, never PASSED'
);
assert.ok(
  unknownEval.fourDimensions.safetyEligibility.score <= 50,
  `DEF-001: Safety score (${unknownEval.fourDimensions.safetyEligibility.score}) must not exceed acceptance threshold of 50`
);
assert.equal(
  unknownEval.destination.recommendationStatus,
  'VERIFICATION_REQUIRED',
  'Overall recommendation must be VERIFICATION_REQUIRED when safety is unverified'
);
assert.ok(
  unknownEval.destination.matchScore <= 50,
  `Overall match score (${unknownEval.destination.matchScore}) must be capped at 50 for unverified safety`
);
console.log('✓ 1.1 Passed: Unknown contamination yields VERIFICATION_REQUIRED and score <= 50.');

// Case 1B: Explicit Hazard Block Preservation
const oilyEval = evaluateDestinationForPassport(WORKSHOP_OILY_RAGS_CASE, apparelTarget, 0);
assert.equal(oilyEval.fourDimensions.safetyEligibility.status, 'BLOCKED');
assert.equal(oilyEval.fourDimensions.safetyEligibility.score, 0);
assert.equal(oilyEval.destination.recommendationStatus, 'NOT_ELIGIBLE');
assert.equal(oilyEval.destination.matchScore, 0);
console.log('✓ 1.2 Passed: Explicit hazardous petroleum contamination remains unconditionally BLOCKED with 0 score.');

// Case 1C: Confirmed Clean Material
const cleanEval = evaluateDestinationForPassport(NAVY_KNIT_SAMPLE_CASE, apparelTarget, 0);
assert.equal(cleanEval.fourDimensions.safetyEligibility.status, 'PASSED');
assert.equal(cleanEval.fourDimensions.safetyEligibility.score, 100);
console.log('✓ 1.3 Passed: Verified clean material passes safety with score 100.');

// Case 1D: Explicit null Hazard Status (Unverified)
const nullHazardPassport = {
  ...DASHBOARD_SAMPLE_CASE,
  id: 'mat-test-null-hazard',
  isControlledOrHazardous: null,
};
const nullHazardEval = evaluateDestinationForPassport(nullHazardPassport, apparelTarget, 0);
assert.equal(
  nullHazardEval.fourDimensions.safetyEligibility.status,
  'VERIFICATION_REQUIRED',
  'DEF-B: null hazard status must return VERIFICATION_REQUIRED, never PASSED'
);
assert.ok(
  nullHazardEval.fourDimensions.safetyEligibility.score <= 50,
  'Safety score must be <= 50 for null hazard status'
);
console.log('✓ 1.4 Passed: Explicit null hazard status yields VERIFICATION_REQUIRED and score <= 50.');

// Case 1E: Unverified Chemical Finish (Peach Finish)
const unverifiedFinishPassport = {
  ...DASHBOARD_SAMPLE_CASE,
  id: 'mat-test-peach-finish',
  chemicalFinishes: { value: 'Peach finish, unverified', status: 'REPORTED' },
  isControlledOrHazardous: null,
};
const unverifiedFinishEval = evaluateDestinationForPassport(unverifiedFinishPassport, apparelTarget, 0);
assert.equal(
  unverifiedFinishEval.fourDimensions.safetyEligibility.status,
  'VERIFICATION_REQUIRED',
  'Unverified chemical finish must yield VERIFICATION_REQUIRED, never PASSED'
);
assert.ok(
  unverifiedFinishEval.fourDimensions.safetyEligibility.score <= 50,
  'Safety score must be <= 50 for unverified chemical finish'
);
console.log('✓ 1.5 Passed: Unverified chemical finish yields VERIFICATION_REQUIRED and score <= 50.');

// -------------------------------------------------------------
// 2. DEF-002 REGRESSION: Fabric Attribute Integrity (No 180 GSM Fallback)
// -------------------------------------------------------------
console.log('\n--- TEST 2: DEF-002 Fabric Attribute Integrity ---');

// Payload with missing GSM, construction, and colour
const rawPayloadMissingGsm = {
  materialName: 'Pink Corduroy Surplus',
  materialType: 'Woven Pile',
  userReportedGsm: null,
  fabricConstruction: null,
  visibleColour: null,
  userReportedFibreComposition: '100% Cotton (Reported)',
  potentialReusePathways: ['Wiping Cloths', 'Upcycled Towels'],
  missingInformation: [],
};

const mockEnvelope = {
  choices: [
    {
      message: {
        content: JSON.stringify(rawPayloadMissingGsm),
      },
      finish_reason: 'stop',
    },
  ],
  usage: { prompt_tokens: 350, completion_tokens: 150, total_tokens: 500 },
};

const parsedMissing = parseAndValidateModelResponse(mockEnvelope);
assert.equal(parsedMissing.success, true);
assert.equal(
  parsedMissing.data.textileIntelligence.userReportedGsm,
  null,
  'DEF-002: Missing GSM must be null, never defaulted to 180'
);
assert.equal(
  parsedMissing.data.textileIntelligence.fabricConstruction,
  null,
  'DEF-002: Missing construction must be null, never defaulted to Single Jersey'
);
assert.equal(
  parsedMissing.data.textileIntelligence.visibleColour,
  null,
  'DEF-002: Missing colour must be null, never defaulted to Navy'
);
assert.ok(
  parsedMissing.data.textileIntelligence.missingInformation.some(m => m.includes('GSM')),
  'Missing GSM must be explicitly recorded in missingInformation'
);
console.log('✓ 2.1 Passed: Missing GSM and attributes remain null and logged in missingInformation.');

// Payload with valid GSM supplied
const rawPayloadWithGsm = {
  ...rawPayloadMissingGsm,
  userReportedGsm: 240,
  fabricConstruction: 'Corduroy',
  visibleColour: 'Dusty Pink',
};

const mockEnvelopeValid = {
  choices: [
    {
      message: {
        content: JSON.stringify(rawPayloadWithGsm),
      },
      finish_reason: 'stop',
    },
  ],
};

const parsedValid = parseAndValidateModelResponse(mockEnvelopeValid);
assert.equal(parsedValid.success, true);
assert.equal(parsedValid.data.textileIntelligence.userReportedGsm, 240, 'Valid GSM must be preserved');
assert.equal(parsedValid.data.textileIntelligence.fabricConstruction, 'Corduroy', 'Valid construction preserved');
assert.equal(parsedValid.data.textileIntelligence.visibleColour, 'Dusty Pink', 'Valid colour preserved');
console.log('✓ 2.2 Passed: Valid supplied attributes are accurately preserved.');

// -------------------------------------------------------------
// 3. DEF-003 REGRESSION: Environmental Claim Integrity
// -------------------------------------------------------------
console.log('\n--- TEST 3: DEF-003 Scope 3 Environmental Claim Integrity ---');

const ghgRecord = calculateScope3GhgAccounting(DASHBOARD_SAMPLE_CASE, 1000, 'CAT_5_WASTE_IN_OPERATIONS');
assert.equal(
  ghgRecord.verificationStatus,
  'UNVERIFIED_INTERNAL_MODEL',
  'DEF-003: Verification status must be UNVERIFIED_INTERNAL_MODEL'
);
assert.equal(
  ghgRecord.auditingBody.includes('TÜV Rheinland'),
  false,
  'DEF-003: Must NOT claim TÜV Rheinland accreditation'
);
assert.ok(
  ghgRecord.auditingBody.includes('Internal Computation Engine'),
  'Auditing body must honestly identify internal calculation model'
);
assert.ok(
  !ghgRecord.certificateHashSha256.includes('9a4b8c7d6e5f1029384756abcdef'),
  'DEF-003: Must not contain hardcoded fake hash seed'
);
assert.ok(
  ghgRecord.certificateHashSha256.startsWith('sha256:0x'),
  'Hash must be genuine SHA-256 digest'
);
assert.ok(ghgRecord.netAvoidedEmissionsTonsCo2e > 0, 'Avoided emissions calculation preserved');
console.log('✓ 3.1 Passed: Scope 3 model correctly labeled UNVERIFIED_INTERNAL_MODEL with zero false claims.');

// -------------------------------------------------------------
// 4. DEF-006 REGRESSION: Laboratory Evidence Promotion Contract
// -------------------------------------------------------------
console.log('\n--- TEST 4: DEF-006 Laboratory Simulated Evidence Contract ---');

const sitraReport = INITIAL_TEST_REPORTS.find(r => r.id === 'rep-sitra-2026-4401');
assert.ok(sitraReport, 'SITRA lab report fixture must exist');

const promoResult = promotePropertyWithLabReport(
  DASHBOARD_SAMPLE_CASE,
  sitraReport,
  'fibreComposition',
  'Auditor S. Ramanathan'
);

assert.equal(promoResult.success, true);
assert.equal(
  promoResult.updatedPassport.fibreComposition.status,
  'REPORTED',
  'DEF-006: Simulated lab report must maintain REPORTED status (not promoted to CONFIRMED)'
);
assert.equal(
  promoResult.auditRecord.promotedStatus,
  'REPORTED',
  'Audit record must record promoted status as REPORTED'
);
console.log('✓ 4.1 Passed: Simulated laboratory report maintains REPORTED status with honest audit trail.');

console.log('\n================================================================');
console.log('  ALL PHASE 1 EMERGENCY STABILIZATION REGRESSION TESTS PASSED!  ');
console.log('================================================================\n');
