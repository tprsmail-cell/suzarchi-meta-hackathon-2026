/**
 * SUZARCHI Global Circular Material Intelligence Platform
 * Phase 9: Global Circular Ecosystem & Scope 3 Verification Types
 *
 * Covers:
 * 1. Scope 3 GHG Accounting (GHG Protocol Corporate Value Chain Standard)
 * 2. B2B Escrow & Commercial Settlement
 * 3. International Recycler Federation Clearinghouse (5 Continents)
 */

// ============================================================================
// 1. SCOPE 3 GHG ACCOUNTING TYPES (GHG Protocol Standard)
// ============================================================================

export type GhgProtocolCategory =
  | 'CAT_1_PURCHASED_GOODS'     // Scope 3, Category 1: Upstream virgin fiber displacement
  | 'CAT_5_WASTE_IN_OPERATIONS'  // Scope 3, Category 5: Pre-consumer diverted production scrap
  | 'CAT_12_END_OF_LIFE';        // Scope 3, Category 12: Downstream circular secondary life

export interface EmissionFactorReference {
  materialType: string;
  virginProductionKgCo2ePerKg: number; // e.g., 5.4 kg CO2e/kg for virgin conventional cotton
  circularProcessingKgCo2ePerKg: number; // e.g., 0.8 kg CO2e/kg for mechanical garnetting
  netAvoidedEmissionsKgCo2ePerKg: number; // virgin minus circular
  waterDisplacementLitersPerKg: number; // e.g., 2,200 L/kg
  dataStandardCitation: 'Ecoinvent v3.10' | 'Sphera GaBi 2024' | 'DEFRA GHG Conversion Factors 2024';
  tierClassification: 'TIER_1_DEFAULT' | 'TIER_2_REGIONAL' | 'TIER_3_PRIMARY_FACILITY_DATA';
}

export interface Scope3GhgRecord {
  id: string; // e.g., 'ghg-mat001-2026'
  materialPassportId: string;
  batchNumber: string;
  accountingPeriod: string; // e.g., '2026-Q4'
  ghgCategory: GhgProtocolCategory;
  processedVolumeKg: number;
  grossVirginBaselineTonsCo2e: number;
  circularProcessingFootprintTonsCo2e: number;
  transportEmissionsTonsCo2e: number;
  netAvoidedEmissionsTonsCo2e: number;
  waterSavingsMegaLiters: number;
  emissionFactorRef: EmissionFactorReference;
  verificationStatus: 'AUDITED_VERIFIED' | 'SELF_DECLARED_PENDING_AUDIT' | 'THIRD_PARTY_CERTIFIED';
  auditingBody: string; // e.g., 'TÜV Rheinland' or 'SGS Carbon Services'
  verificationDate: string;
  certificateHashSha256: string;
}

export interface Scope3VerificationCertificate {
  certificateNumber: string;
  issuer: string;
  beneficiaryOrg: string;
  materialName: string;
  batchIdentifier: string;
  netTonsAvoided: number;
  standardCompliance: 'GHG Protocol Corporate Value Chain (Scope 3) Standard & ISO 14064-3';
  issueDate: string;
  validUntil: string;
  digitalSealHash: string;
  qrVerificationUrl: string;
}

// ============================================================================
// 2. B2B ESCROW & COMMERCIAL SETTLEMENT TYPES
// ============================================================================

export type EscrowMilestoneStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DISPUTED';

export type EscrowOverallStatus =
  | 'CONTRACT_DRAFT'
  | 'ESCROW_FUNDED'
  | 'DISPATCH_IN_TRANSIT'
  | 'INSPECTION_PENDING'
  | 'SETTLED_FUNDS_RELEASED'
  | 'DISPUTE_ARBITRATION';

export interface EscrowMilestone {
  milestoneKey: 'DEPOSIT' | 'DISPATCH' | 'DELIVERY' | 'LAB_QC_PASS' | 'SETTLEMENT';
  name: string;
  description: string;
  requiredProofType: 'BANK_ESCROW_ADVICE' | 'BILL_OF_LADING' | 'WEIGHBRIDGE_SLIP' | 'ISO_17025_TEST_REPORT' | 'BUYER_RELEASE_SIGNATURE';
  status: EscrowMilestoneStatus;
  completedTimestamp?: string;
  verifiedByEntity?: string;
}

export interface CircularTradeAgreement {
  id: string; // e.g., 'cta-2026-in-0842'
  contractNumber: string;
  passportId: string;
  batchNumber: string;
  materialDescription: string;
  sellerOrgId: string;
  sellerName: string;
  buyerOrgId: string;
  buyerName: string;
  orderedQuantityKg: number;
  unitPrice: number;
  currency: string;
  totalOrderValue: number;
  escrowFeePercent: number; // e.g. 1.25%
  escrowStatus: EscrowOverallStatus;
  incoterms: 'EXW' | 'FOB' | 'CIF' | 'DAP';
  deliveryCorridor: string; // e.g. 'Tiruppur to Ho Chi Minh City'
  creationDate: string;
  milestones: EscrowMilestone[];
  disputeNotes?: string;
}

// ============================================================================
// 3. INTERNATIONAL RECYCLER FEDERATION CLEARINGHOUSE TYPES
// ============================================================================

export type ContinentRegion =
  | 'ASIA'
  | 'EUROPE'
  | 'NORTH_AMERICA'
  | 'SOUTH_AMERICA'
  | 'AFRICA_OCEANIA';

export type RecyclerAccreditationStandard =
  | 'GRS_GLOBAL_RECYCLED_STANDARD'
  | 'OEKO_TEX_STEP'
  | 'ISO_14001_ENVIRONMENTAL'
  | 'HIGG_INDEX_FEM'
  | 'EU_CIRCULAR_ECONOMY_CLEARINGHOUSE';

export interface FederatedRecyclerProfile {
  id: string; // e.g., 'fed-rec-asia-01'
  legalEntityName: string;
  tradeName: string;
  continent: ContinentRegion;
  countryCode: string;
  city: string;
  primaryProcessingType:
    | 'MECHANICAL_GARNETTING'
    | 'ROTOR_OPEN_END_SPINNING'
    | 'CHEMICAL_DEPOLYMERIZATION'
    | 'THERMO_MECHANICAL_PELLETIZING'
    | 'NONWOVEN_ACOUSTIC_FELTING';
  annualRecyclingCapacityTons: number;
  acceptedLifecycleStreams: string[]; // e.g., ['GAR', 'SPN', 'KNT', 'FAB']
  activeAccreditations: {
    standard: RecyclerAccreditationStandard;
    certificateNumber: string;
    validUntil: string;
    issuingAuditor: string;
  }[];
  clearinghouseTrustScore: number; // 0 to 100%
  clearinghouseMemberSince: string;
  isFederationVerified: boolean;
  contactDeskEmail: string;
}
