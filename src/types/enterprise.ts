/**
 * SUZARCHI Global Circular Material Intelligence Platform
 * Phase 8: Enterprise Multi-Facility, Laboratory Verification & QR Traceability Types
 * Governing standards: ISO/IEC 17025, EU ESPR Digital Product Passport (2024/1781)
 */

import { EvidenceStatus, PropertyRecord } from './passport';

// ============================================================================
// 1. LABORATORY VERIFICATION TYPES (ISO/IEC 17025)
// ============================================================================

export type AccreditationBody =
  | 'NABL_INDIA'       // National Accreditation Board for Testing and Calibration Laboratories (India)
  | 'DAKKS_GERMANY'    // Deutsche Akkreditierungsstelle (Germany)
  | 'UKAS_UK'          // United Kingdom Accreditation Service
  | 'A2LA_USA'         // American Association for Laboratory Accreditation
  | 'CNAS_CHINA'       // China National Accreditation Service
  | 'BOA_VIETNAM'      // Bureau of Accreditation (Vietnam)
  | 'TAF_TAIWAN';      // Taiwan Accreditation Foundation

export interface LaboratoryProfile {
  id: string; // e.g. 'lab-sitracon-01'
  name: string;
  countryCode: string;
  accreditationBody: AccreditationBody;
  accreditationNumber: string; // e.g. 'TC-5482'
  accreditationStandard: 'ISO/IEC 17025:2017';
  accreditationValidUntil: string; // ISO date '2027-12-31'
  accreditedTestMethods: string[]; // ['ISO 1833-1', 'ISO 3801', 'AATCC 61', 'ASTM D5034']
  verificationStatus: 'ACCREDITED_ACTIVE' | 'AUDIT_PENDING' | 'EXPIRED';
  contactEmail: string;
  facilityLocation: string;
}

export type LabTestMethod =
  | 'ISO_1833_FIBRE_BLEND'
  | 'ISO_3801_GSM_MASS'
  | 'AATCC_61_COLORFASTNESS'
  | 'ASTM_D5034_TENSILE_GRAB'
  | 'REACH_SVHC_CHEMICAL_SCREEN'
  | 'TCLP_HAZARDOUS_LEACH';

export interface LaboratoryTestResultItem {
  propertyKey: 'fibreComposition' | 'gsmWeight' | 'cleanlinessRating' | 'chemicalFinishes';
  testMethod: string;
  parameterName: string;
  measuredValue: string | number;
  unit: string;
  uncertaintyMargin?: string; // e.g. '±1.2%'
  passStandard: boolean;
}

export interface LaboratoryTestReport {
  id: string; // e.g. 'rep-2026-cbe-8841'
  reportNumber: string;
  laboratoryId: string;
  laboratoryName: string;
  accreditationReference: string;
  sampleIdentifier: string;
  batchId: string;
  materialPassportId: string;
  testDate: string;
  reportIssueDate: string;
  documentHashSha256: string;
  testMethod: LabTestMethod;
  results: LaboratoryTestResultItem[];
  overallConclusion: string;
  signatoryName: string;
  signatoryTitle: string;
  reviewStatus: 'PENDING_REVIEW' | 'VERIFIED_AUTHENTIC' | 'REJECTED';
}

export interface EvidencePromotionAuditRecord {
  id: string;
  reportId: string;
  materialPassportId: string;
  propertyKey: string;
  previousStatus: EvidenceStatus;
  promotedStatus: EvidenceStatus;
  previousValue: any;
  confirmedValue: any;
  promotedByAuditor: string;
  promotionTimestamp: string;
  laboratoryStandardReference: string;
  auditRationale: string;
}

// ============================================================================
// 2. MULTI-FACILITY INVENTORY MANAGEMENT TYPES
// ============================================================================

export type FacilityType =
  | 'SPINNING_MILL'
  | 'KNITTING_WEAVING_MILL'
  | 'GARMENT_CUTTING_UNIT'
  | 'CENTRAL_REGIONAL_WAREHOUSE'
  | 'HAZARDOUS_TSDF_STORAGE'
  | 'RECYCLING_PROCESSING_PLANT';

export interface EnterpriseFacility {
  id: string; // e.g. 'fac-tiruppur-cut-02'
  organizationId: string;
  name: string;
  code: string;
  facilityType: FacilityType;
  countryCode: string;
  regionCode: string;
  city: string;
  addressLine: string;
  contactPerson: string;
  contactEmail: string;
  operationalStatus: 'ACTIVE' | 'MAINTENANCE' | 'QUARANTINE_ONLY';
  handlingCapabilities: string[]; // e.g. ['FAB', 'KNT', 'GAR']
  maxCapacityKg: number;
  currentOccupancyKg: number;
  isHazardousWastePermitted: boolean;
}

export type InventoryAvailabilityStatus =
  | 'AVAILABLE_FOR_TRADE'
  | 'RESERVED_FOR_CONTRACT'
  | 'DISPATCH_IN_TRANSIT'
  | 'QUARANTINED_PENDING_AUDIT'
  | 'HAZARDOUS_HOLD';

export interface MultiFacilityInventoryLot {
  id: string; // e.g. 'inv-lot-001'
  batchNumber: string;
  passportId: string;
  organizationId: string;
  facilityId: string;
  facilityName: string;
  materialName: string;
  streamId: string;
  quantityKg: number;
  originalQuantity: number;
  originalUnit: string;
  availabilityStatus: InventoryAvailabilityStatus;
  storageBayLocation: string; // e.g. 'Bay C-14 / Pallet 02'
  registeredDate: string;
  lastInspectionDate: string;
  isControlledHazardous: boolean;
  qrIssued: boolean;
  qrCodeId?: string;
}

export interface StockTransferProposal {
  id: string;
  inventoryLotId: string;
  batchNumber: string;
  sourceFacilityId: string;
  destinationFacilityId: string;
  quantityKg: number;
  proposedDate: string;
  transferReason: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'IN_TRANSIT' | 'COMPLETED' | 'REJECTED';
}

// ============================================================================
// 3. BATCH QR & TRACEABILITY TYPES
// ============================================================================

export interface BatchQrRecord {
  id: string; // e.g. 'qr-pcb-2026-in-42'
  qrPayloadUrl: string; // Canonical verification URL
  dppUrn: string; // e.g. 'urn:dpp:suzarchi:in:mat-001'
  batchNumber: string;
  materialPassportId: string;
  organizationId: string;
  facilityId: string;
  issuanceTimestamp: string;
  schemaVersion: 'SUZARCHI-QR-v1.0';
  isRevoked: boolean;
  securityHash: string; // Non-guessable verification hash
}

export interface PrintableBatchLabel {
  title: string;
  materialName: string;
  streamCode: string;
  batchNumber: string;
  weightDisplay: string;
  facilityName: string;
  countryOfOrigin: string;
  hsTariffCode: string;
  issuanceDate: string;
  dppUrn: string;
  qrPayloadUrl: string;
  safetyAdvisory?: string;
}

export interface QrVerificationResult {
  isValid: boolean;
  status: 'VERIFIED_ACTIVE' | 'SUPERSEDED' | 'REVOKED' | 'QUARANTINED' | 'UNKNOWN';
  batchNumber?: string;
  passportId?: string;
  materialName?: string;
  facilityName?: string;
  countryCode?: string;
  verificationMessage: string;
  chainOfCustodyCount: number;
}

// ============================================================================
// 4. META AI SECURE SERVER PROXY & COST BUDGETING
// ============================================================================

export interface MetaAiUsageBudget {
  maxBudgetUsd: number; // e.g. $5.00 testing ceiling
  currentSpendUsd: number;
  requestCount: number;
  maxRequestsAllowed: number;
  isBudgetExceeded: boolean;
  modelIdentifier: string;
  lastInvocationTimestamp?: string;
  totalAccountCreditPoolUsd?: number; // USD $150.00 owner credit pool
  initialTestingAllocationUsd?: number; // USD $5.00 testing allocation
  providerStatus?: 'PREPARATION_OFFLINE' | 'AWAITING_OWNER_KEY' | 'ACTIVE_LIVE';
}
