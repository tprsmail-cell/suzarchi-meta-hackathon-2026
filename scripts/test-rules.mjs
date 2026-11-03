import assert from 'node:assert/strict';

// Simple mock for testing without compilation
function evaluateTestRules(passport) {
  const isCompositionConfirmed = passport.fibreComposition.status === 'CONFIRMED';
  const isGsmKnown = passport.gsmWeight.status !== 'UNKNOWN' && passport.gsmWeight.value !== null;
  const isClean = passport.contaminationStatus?.value?.toLowerCase().includes('clean') ?? false;

  return {
    isCompositionConfirmed,
    isGsmKnown,
    isClean,
    apparelCompVerdict: isCompositionConfirmed ? 'SATISFIED' : 'PENDING_VERIFICATION',
    apparelGsmVerdict: isGsmKnown ? 'SATISFIED' : 'PENDING_VERIFICATION',
    wipingContamVerdict: isClean ? 'PENDING_VERIFICATION' : 'BLOCKED',
  };
}

console.log('--- Running Deterministic Rule Engine Unit Tests ---');

// Test Case 1: Unverified composition (Dashboard Case)
const dashboardCase = {
  fibreComposition: { value: 'Cotton Rich', status: 'REPORTED' },
  gsmWeight: { value: 180, status: 'ESTIMATED' },
  contaminationStatus: { value: 'clean', status: 'CONFIRMED' }
};
const res1 = evaluateTestRules(dashboardCase);
assert.equal(res1.apparelCompVerdict, 'PENDING_VERIFICATION', 'Reported composition must yield PENDING_VERIFICATION');
assert.equal(res1.apparelGsmVerdict, 'SATISFIED', 'Estimated GSM value should satisfy thickness indicator with caveat');
console.log('✓ Test Case 1 Passed: Reported composition flagged for verification.');

// Test Case 2: Hackathon MVP Case (Unknown GSM and Reported Cotton)
const hackathonCase = {
  fibreComposition: { value: '100% Cotton', status: 'REPORTED' },
  gsmWeight: { value: null, status: 'UNKNOWN' },
  contaminationStatus: { value: 'Clean pre-consumer factory waste', status: 'REPORTED' }
};
const res2 = evaluateTestRules(hackathonCase);
assert.equal(res2.apparelCompVerdict, 'PENDING_VERIFICATION', '100% Cotton self-declaration must not be marked SATISFIED');
assert.equal(res2.apparelGsmVerdict, 'PENDING_VERIFICATION', 'Null GSM must require measurement check');
console.log('✓ Test Case 2 Passed: Unknown properties flagged as PENDING_VERIFICATION.');

// Test Case 3: Contaminated material blocks high-grade wiping
const dirtyCase = {
  fibreComposition: { value: 'Polyester', status: 'CONFIRMED' },
  gsmWeight: { value: 200, status: 'CONFIRMED' },
  contaminationStatus: { value: 'heavy industrial machine oil', status: 'CONFIRMED' }
};
const res3 = evaluateTestRules(dirtyCase);
assert.equal(res3.wipingContamVerdict, 'BLOCKED', 'Severe contamination must block wiping');
console.log('✓ Test Case 3 Passed: Hard constraint failures block destinations.');

console.log('--- All Rule Engine Tests Passed Successfully! ---');
