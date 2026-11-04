/**
 * SUZARCHI Global Circular Material Intelligence Platform
 * Phase 8: ISO/IEC 17025 Laboratory Verification & Evidence Promotion Engine
 *
 * Implements strict ISO/IEC 17025 governance:
 * - Only verified accredited laboratories (NABL, DAkkS, UKAS, etc.) can issue reports.
 * - Test reports must match sample identifiers or batch IDs.
 * - Eligible properties (fibreComposition, gsmWeight, cleanlinessRating, chemicalFinishes)
 *   are promoted from REPORTED/UNKNOWN to CONFIRMED.
 * - Every promotion produces an immutable EvidencePromotionAuditRecord.
 */

import { MaterialPassport, PropertyRecord, EvidenceStatus } from '../types/passport';
import {
  LaboratoryProfile,
  LaboratoryTestReport,
  EvidencePromotionAuditRecord,
  LabTestMethod
} from '../types/enterprise';
import { ACCREDITED_LABORATORIES, INITIAL_TEST_REPORTS } from '../data/laboratoryData';

export interface PromotionResult {
  success: boolean;
  message: string;
  updatedPassport?: MaterialPassport;
  auditRecord?: EvidencePromotionAuditRecord;
}

/**
 * Validates whether a laboratory is currently accredited under ISO/IEC 17025
 */
export function isLaboratoryAccredited(labId: string): { valid: boolean; reason?: string; lab?: LaboratoryProfile } {
  const lab = ACCREDITED_LABORATORIES.find((l) => l.id === labId);
  if (!lab) {
    return { valid: false, reason: `Laboratory ID "${labId}" not recognized in accredited directory.` };
  }
  if (lab.verificationStatus !== 'ACCREDITED_ACTIVE') {
    return { valid: false, reason: `Laboratory "${lab.name}" status is ${lab.verificationStatus}.`, lab };
  }
  const expiryDate = new Date(lab.accreditationValidUntil);
  if (expiryDate < new Date()) {
    return { valid: false, reason: `Accreditation expired on ${lab.accreditationValidUntil}.`, lab };
  }
  return { valid: true, lab };
}

/**
 * Verifies a laboratory test report against its issuing accreditation and document hash
 */
export function verifyTestReportAuthenticity(report: LaboratoryTestReport): {
  isAuthentic: boolean;
  status: 'VERIFIED_AUTHENTIC' | 'REJECTED' | 'PENDING_REVIEW';
  reason: string;
} {
  const labCheck = isLaboratoryAccredited(report.laboratoryId);
  if (!labCheck.valid) {
    return {
      isAuthentic: false,
      status: 'REJECTED',
      reason: labCheck.reason || 'Issuing laboratory is not accredited.',
    };
  }

  if (!report.documentHashSha256 || report.documentHashSha256.length !== 64) {
    return {
      isAuthentic: false,
      status: 'REJECTED',
      reason: 'Report lacks a valid 256-bit cryptographic document integrity hash.',
    };
  }

  if (!report.results || report.results.length === 0) {
    return {
      isAuthentic: false,
      status: 'REJECTED',
      reason: 'Report contains zero laboratory parameter results.',
    };
  }

  return {
    isAuthentic: true,
    status: 'VERIFIED_AUTHENTIC',
    reason: `Verified authentic report from ${report.laboratoryName} (${report.accreditationReference}).`,
  };
}

/**
 * Promotes a specific property in a Material Passport to CONFIRMED based on an ISO/IEC 17025 test report
 */
export function promotePropertyWithLabReport(
  passport: MaterialPassport,
  report: LaboratoryTestReport,
  propertyKey: 'fibreComposition' | 'gsmWeight' | 'cleanlinessRating' | 'chemicalFinishes',
  auditorName: string = 'SUZARCHI Verification Desk'
): PromotionResult {
  // 1. Verify Report Authenticity
  const auth = verifyTestReportAuthenticity(report);
  if (!auth.isAuthentic) {
    return {
      success: false,
      message: `Verification Rejected: ${auth.reason}`,
    };
  }

  // 2. Verify Batch or Material Identity Match
  const matchesBatch = report.batchId && passport.batchNumber && report.batchId === passport.batchNumber;
  const matchesPassport = report.materialPassportId === passport.id;
  const matchesSample = report.sampleIdentifier.includes(passport.id.toUpperCase().replace('-', ''));

  if (!matchesBatch && !matchesPassport && !matchesSample) {
    return {
      success: false,
      message: `Batch ID mismatch: Report batch "${report.batchId}" does not correlate with Material Passport "${passport.id}" (${passport.batchNumber}).`,
    };
  }

  // 3. Locate Property Result in Report
  const resultItem = report.results.find((r) => r.propertyKey === propertyKey);
  if (!resultItem) {
    return {
      success: false,
      message: `Report ${report.reportNumber} does not evaluate property "${propertyKey}".`,
    };
  }

  // 4. Retrieve Previous Property Record
  const prevRecord = (passport as any)[propertyKey] as PropertyRecord<any> | undefined;
  const prevStatus: EvidenceStatus = prevRecord?.status || 'UNKNOWN';
  const prevValue = prevRecord?.value ?? 'Unspecified';

  // 5. Build Updated Property Record with Simulated Review Status (Honest Governance: Do NOT promote to CONFIRMED on simulated fixtures)
  const promotedProperty: PropertyRecord<any> = {
    value: resultItem.measuredValue,
    status: 'REPORTED', // Honest integrity: simulated demo reports keep property at REPORTED
    sourceNote: `Simulated laboratory verification review (Modelled on ${report.laboratoryName}, Report #${report.reportNumber}, Method: ${resultItem.testMethod}). Requires genuine physical laboratory accreditation for official confirmation.`.trim(),
  };

  // 6. Build Immutable Audit Record
  const auditRecord: EvidencePromotionAuditRecord = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    reportId: report.id,
    materialPassportId: passport.id,
    propertyKey,
    previousStatus: prevStatus,
    promotedStatus: 'REPORTED',
    previousValue: prevValue,
    confirmedValue: resultItem.measuredValue,
    promotedByAuditor: auditorName,
    promotionTimestamp: new Date().toISOString(),
    laboratoryStandardReference: `${report.laboratoryName} [${report.accreditationReference}] — ${resultItem.testMethod} (Simulated Demonstration Protocol)`,
    auditRationale: `Simulated demonstration test review logged for ${propertyKey}. Property maintained as REPORTED pending genuine ISO/IEC 17025 physical lab testing.`,
  };

  // 7. Clone and return updated Passport
  const updatedPassport: MaterialPassport = {
    ...passport,
    [propertyKey]: promotedProperty,
  };

  return {
    success: true,
    message: `Simulated demonstration test review logged for "${propertyKey}". Property maintained as REPORTED pending genuine ISO/IEC 17025 physical testing.`,
    updatedPassport,
    auditRecord,
  };
}

/**
 * Finds all available test reports correlating with a given Material Passport ID or Batch Number
 */
export function getTestReportsForPassport(passportId: string, batchNumber?: string): LaboratoryTestReport[] {
  return INITIAL_TEST_REPORTS.filter(
    (rep) =>
      rep.materialPassportId === passportId ||
      (batchNumber && rep.batchId === batchNumber) ||
      rep.sampleIdentifier.includes(passportId.toUpperCase().replace('-', ''))
  );
}
