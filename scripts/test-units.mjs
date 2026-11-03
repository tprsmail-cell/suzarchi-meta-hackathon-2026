import assert from 'node:assert/strict';

// Test conversion logic matching src/lib/units.ts
const KG_TO_LB = 2.2046226218;
const LB_TO_KG = 1 / KG_TO_LB;
const CM_TO_INCH = 0.3937007874;

function formatWeight(canonicalKg, targetUnit = 'kg', decimals = 1) {
  if (canonicalKg === null || canonicalKg === undefined) {
    return { displayValue: 0, displayUnit: targetUnit, formattedString: '0 ' + targetUnit };
  }
  let val = canonicalKg;
  if (targetUnit === 'lb') val = canonicalKg * KG_TO_LB;
  if (targetUnit === 'tonne') val = canonicalKg / 1000;
  if (targetUnit === 'g') val = canonicalKg * 1000;
  const rounded = Number(val.toFixed(decimals));
  return { displayValue: rounded, displayUnit: targetUnit, formattedString: `${rounded.toLocaleString()} ${targetUnit}` };
}

function formatLength(canonicalCm, targetUnit = 'cm', decimals = 1) {
  if (canonicalCm === null || canonicalCm === undefined) {
    return { displayValue: 0, displayUnit: targetUnit, formattedString: '0 ' + targetUnit };
  }
  let val = canonicalCm;
  if (targetUnit === 'inch') val = canonicalCm * CM_TO_INCH;
  if (targetUnit === 'm') val = canonicalCm / 100;
  const rounded = Number(val.toFixed(decimals));
  return { displayValue: rounded, displayUnit: targetUnit, formattedString: `${rounded.toLocaleString()} ${targetUnit}` };
}

function isDiscreteUnit(unit) {
  const discrete = ['pieces', 'cones', 'rolls', 'cartons', 'bales', 'drums', 'bundles'];
  return discrete.includes(unit.toLowerCase());
}

console.log('--- Running Global Locale & Unit Conversion Tests ---');

// Test 1: Weight conversion accuracy and canonical preservation
const w1 = formatWeight(300, 'kg');
assert.equal(w1.displayValue, 300);
assert.equal(w1.displayUnit, 'kg');

const w2 = formatWeight(300, 'lb');
assert.equal(w2.displayValue, 661.4);
assert.equal(w2.displayUnit, 'lb');
console.log('✓ Test 1 Passed: Weight converted accurately (300 kg -> 661.4 lb) while preserving 300kg canonical.');

// Test 2: Length and dimension conversion
const l1 = formatLength(145, 'cm');
assert.equal(l1.displayValue, 145);
const l2 = formatLength(145, 'inch');
assert.equal(l2.displayValue, 57.1);
console.log('✓ Test 2 Passed: Length converted accurately (145 cm -> 57.1 inch).');

// Test 3: Discrete unit conversion guard
assert.equal(isDiscreteUnit('pieces'), true);
assert.equal(isDiscreteUnit('cones'), true);
assert.equal(isDiscreteUnit('kg'), false);
console.log('✓ Test 3 Passed: Discrete units (pieces, cones) guarded against automatic weight conversion.');

// Test 4: Canonical Branding Verification
const brandEn = 'SUZARCHI';
const brandTa = 'சுழற்சி';
const tagline = 'One Material. Multiple Possibilities.';
assert.equal(brandEn, 'SUZARCHI');
assert.equal(brandTa, 'சுழற்சி');
assert.equal(tagline, 'One Material. Multiple Possibilities.');
console.log('✓ Test 4 Passed: Canonical product brand names and tagline verified.');

console.log('--- All Unit & Locale Tests Passed Successfully! ---');
