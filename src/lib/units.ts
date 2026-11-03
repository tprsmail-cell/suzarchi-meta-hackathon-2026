/**
 * SUZARCHI Unit Conversion & Measurement Intelligence
 * Canonical representation:
 * - Weight: kg
 * - Length: cm
 * - Fabric Weight: GSM (grams per square metre) - Universal International Standard
 * - Discrete Counts: pieces, cones, rolls, cartons, bales (Preserved strictly as discrete entities)
 */

export type WeightUnit = 'kg' | 'lb' | 'tonne' | 'g' | 'oz';
export type LengthUnit = 'cm' | 'inch' | 'm' | 'yard' | 'ft';
export type UnitSystem = 'metric' | 'imperial';

export interface FormattedQuantity {
  displayValue: number;
  displayUnit: string;
  formattedString: string;
  canonicalKg?: number;
}

// Exact conversion constants
const KG_TO_LB = 2.2046226218;
const LB_TO_KG = 1 / KG_TO_LB;
const KG_TO_OZ = 35.27396195;
const OZ_TO_KG = 1 / KG_TO_OZ;
const CM_TO_INCH = 0.3937007874;
const INCH_TO_CM = 2.54;
const CM_TO_FT = 1 / 30.48;
const FT_TO_CM = 30.48;
const M_TO_YARD = 1.0936132983;

/**
 * Converts a canonical weight (in kg) to the requested display unit.
 */
export function formatWeight(
  canonicalKg: number | null | undefined,
  targetUnit: WeightUnit = 'kg',
  decimals = 1
): FormattedQuantity {
  if (canonicalKg === null || canonicalKg === undefined || isNaN(canonicalKg)) {
    return {
      displayValue: 0,
      displayUnit: targetUnit,
      formattedString: '0 ' + targetUnit,
    };
  }

  let value: number;
  switch (targetUnit) {
    case 'lb':
      value = canonicalKg * KG_TO_LB;
      break;
    case 'oz':
      value = canonicalKg * KG_TO_OZ;
      break;
    case 'tonne':
      value = canonicalKg / 1000;
      break;
    case 'g':
      value = canonicalKg * 1000;
      break;
    case 'kg':
    default:
      value = canonicalKg;
      break;
  }

  const rounded = Number(value.toFixed(decimals));
  return {
    displayValue: rounded,
    displayUnit: targetUnit,
    formattedString: `${rounded.toLocaleString()} ${targetUnit}`,
    canonicalKg,
  };
}

/**
 * Converts a canonical length (in cm) to the requested display unit.
 */
export function formatLength(
  canonicalCm: number | null | undefined,
  targetUnit: LengthUnit = 'cm',
  decimals = 1
): { displayValue: number; displayUnit: string; formattedString: string } {
  if (canonicalCm === null || canonicalCm === undefined || isNaN(canonicalCm)) {
    return { displayValue: 0, displayUnit: targetUnit, formattedString: '0 ' + targetUnit };
  }

  let value: number;
  switch (targetUnit) {
    case 'inch':
      value = canonicalCm * CM_TO_INCH;
      break;
    case 'ft':
      value = canonicalCm * CM_TO_FT;
      break;
    case 'm':
      value = canonicalCm / 100;
      break;
    case 'yard':
      value = (canonicalCm / 100) * M_TO_YARD;
      break;
    case 'cm':
    default:
      value = canonicalCm;
      break;
  }

  const rounded = Number(value.toFixed(decimals));
  return {
    displayValue: rounded,
    displayUnit: targetUnit,
    formattedString: `${rounded.toLocaleString()} ${targetUnit}`,
  };
}

/**
 * Converts input value and unit to canonical kilogram representation.
 */
export function toCanonicalKg(value: number, inputUnit: WeightUnit): number {
  switch (inputUnit) {
    case 'lb':
      return Number((value * LB_TO_KG).toFixed(4));
    case 'oz':
      return Number((value * OZ_TO_KG).toFixed(4));
    case 'tonne':
      return value * 1000;
    case 'g':
      return value / 1000;
    case 'kg':
    default:
      return value;
  }
}

/**
 * Converts input value and unit to canonical centimeter representation.
 */
export function toCanonicalCm(value: number, inputUnit: LengthUnit): number {
  switch (inputUnit) {
    case 'inch':
      return Number((value * INCH_TO_CM).toFixed(4));
    case 'ft':
      return Number((value * FT_TO_CM).toFixed(4));
    case 'm':
      return value * 100;
    case 'yard':
      return Number((value * 91.44).toFixed(4));
    case 'cm':
    default:
      return value;
  }
}

/**
 * Format fabric weight. Fabric weight GSM remains strictly g/m² globally in technical textiles.
 */
export function formatGsm(gsm: number | null | undefined): string {
  if (!gsm) return 'Unknown GSM';
  return `${gsm} GSM (g/m²)`;
}

/**
 * Strictly guard against converting discrete units (cones, pieces, rolls) into weight without explicit density.
 */
export function isDiscreteUnit(unit: string): boolean {
  const discrete = ['pieces', 'cones', 'rolls', 'cartons', 'bales', 'drums', 'bundles'];
  return discrete.includes(unit.toLowerCase());
}

/**
 * Universal quantity formatter that preserves discrete units (pieces, cones, cartons, etc.)
 * and formats continuous weights according to the active weightUnit.
 */
export function formatQuantity(
  quantityValue: number | null | undefined,
  unit: string | undefined = 'kg',
  weightUnit: WeightUnit = 'kg',
  decimals = 1
): string {
  if (quantityValue === null || quantityValue === undefined || isNaN(quantityValue)) {
    return '0 ' + (unit || 'kg');
  }
  const cleanUnit = (unit || 'kg').toLowerCase();
  if (isDiscreteUnit(cleanUnit)) {
    return `${quantityValue.toLocaleString()} ${unit}`;
  }
  if (cleanUnit === 'm' || cleanUnit === 'meter' || cleanUnit === 'meters') {
    return `${quantityValue.toLocaleString()} m`;
  }
  return formatWeight(quantityValue, weightUnit, decimals).formattedString;
}
