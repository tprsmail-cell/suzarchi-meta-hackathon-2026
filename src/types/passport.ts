export type EvidenceStatus = 'CONFIRMED' | 'REPORTED' | 'ESTIMATED' | 'UNKNOWN';

export interface PropertyRecord<T> {
  value: T;
  status: EvidenceStatus;
  sourceNote?: string;
}

export type ImagePurposeClassification =
  | 'OVERVIEW'         // Material overview
  | 'TEXTURE'          // Macro texture
  | 'CONSTRUCTION'     // Fabric construction
  | 'BALE_ROLL'        // Bale or roll overview
  | 'LABEL'            // Mill tag or specification label
  | 'LAB_TEST'         // Laboratory report
  | 'TEST_REPORT'      // Legacy alias for LAB_TEST
  | 'DEFECT_DAMAGE';   // Defect or contamination

export interface MaterialPhoto {
  id: string;
  url: string;
  caption?: string;
  mediaType?: ImagePurposeClassification;
  name?: string;
  sizeBytes?: number;
  mimeType?: string;
  isPrimary?: boolean;
}

export interface MaterialPassport {
  id: string;
  taxonomyId?: string; // e.g. 'CAT-GAR-CUT-CHN'
  streamId?: string;   // e.g. 'GAR'
  materialName: PropertyRecord<string>;
  materialType: PropertyRecord<string>;
  fibreComposition: PropertyRecord<string>;
  quantityKg: PropertyRecord<number>; // Canonical quantity (in kg for weights, or count for discrete)
  quantityUnit?: PropertyRecord<string>; // 'kg' | 'tonnes' | 'pieces' | 'cones' | 'metres' | 'cartons' | 'bales' | 'rolls'
  gsmWeight: PropertyRecord<number | null>;
  widthCm: PropertyRecord<number | null>;
  colour: PropertyRecord<string>;
  condition: PropertyRecord<string>;
  form: PropertyRecord<string>;
  location: PropertyRecord<string>;
  indicativePrice: PropertyRecord<string>;
  chemicalFinishes?: PropertyRecord<string>;
  contaminationStatus?: PropertyRecord<string>;
  notes?: string;
  photoUrl?: string; // legacy single photo fallback
  images?: MaterialPhoto[]; // Multi-image upload registry

  // Category-specific conditional properties
  yarnCount?: PropertyRecord<string | null>;
  coneCarrierType?: PropertyRecord<string | null>;
  stapleLengthMm?: PropertyRecord<number | null>;
  trashPercentage?: PropertyRecord<number | null>;
  absorbencyRating?: PropertyRecord<string | null>;
  isHardwareFree?: PropertyRecord<boolean | null>;
  cleanlinessRating?: PropertyRecord<string | null>;
  isControlledOrHazardous?: boolean | null;
  isUserCreated?: boolean;

  // G2 Global Passport & EU DPP Traceability Extensions
  countryOfOrigin?: string; // ISO 3166-1 alpha-2, e.g. 'IN', 'VN', 'CN', 'US'
  hsCode?: string; // Harmonized System tariff code (e.g. '6310.10', '5208.11')
  batchNumber?: string; // Unique lot/batch identifier (e.g. 'PCB-2026-IN-42')
  dppIdentifier?: string; // Digital Product Passport URI / UUID (e.g. 'urn:dpp:suzarchi:mat-001')
}

export type RequirementVerdict = 'SATISFIED' | 'BLOCKED' | 'PENDING_VERIFICATION';
export type CheckDimension = 'TECHNICAL' | 'EVIDENCE' | 'SAFETY' | 'COMMERCIAL';
export type DestinationEligibility = 
  | 'QUALIFIED'
  | 'CONDITIONALLY_VIABLE'
  | 'DISQUALIFIED_SAFETY'
  | 'INCOMPATIBLE_TECHNICAL';

export interface CompatibilityCheck {
  id: string;
  propertyChecked: string;
  label: string;
  verdict: RequirementVerdict;
  note?: string;
  dimension?: CheckDimension;
}

import type {
  DestinationFamilyId,
  RecommendationStatus,
  FourDimensionEvaluation,
  RegionalCorridorAssessment,
} from './destinations';

export interface OpportunityDestination {
  id: string;
  index: number;
  title: string;
  badgeText?: string;
  matchScore: number;
  colorTheme: 'green' | 'blue' | 'purple' | 'mauve' | 'amber';
  thumbnailTitle: string;
  thumbnailEmoji: string;
  checks: CompatibilityCheck[];
  rationale: string;
  actionLabel: string;
  actionCount: number;
  mandatoryVerifications: string[];
  eligibilityState?: DestinationEligibility;
  eligibilityReason?: string;
  technicalCompatibility?: 'COMPATIBLE' | 'INCOMPATIBLE';
  safetyEligibility?: 'PASSED' | 'BLOCKED';
  evidenceCompleteness?: 'CONFIRMED' | 'PENDING_VERIFICATION';
  commercialSuitability?: 'VIABLE' | 'LIMITED';
  technicalFitScore?: number;
  evidenceCompletenessScore?: number;
  safetyPassed?: boolean;

  // Phase 7: Explainable 4-Dimension Engine & Regional Corridor fields
  familyId?: DestinationFamilyId;
  recommendationStatus?: RecommendationStatus;
  fourDimensions?: FourDimensionEvaluation;
  regionalCorridor?: RegionalCorridorAssessment;
  missingEvidenceList?: string[];
  requiredVerificationChecklist?: string[];
  rejectionOrRestrictionReasons?: string[];
}

export function getEvidenceLabel(status: EvidenceStatus): string {
  switch (status) {
    case 'CONFIRMED':
      return 'Confirmed';
    case 'REPORTED':
      return 'Needs Confirmation';
    case 'ESTIMATED':
      return 'From label / visual estimate';
    case 'UNKNOWN':
      return 'Unknown / Unspecified';
  }
}

export function getEvidenceBadgeStyle(status: EvidenceStatus) {
  switch (status) {
    case 'CONFIRMED':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
        icon: '✓',
      };
    case 'REPORTED':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        icon: '!',
      };
    case 'ESTIMATED':
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
        dot: 'bg-blue-500',
        icon: '~',
      };
    case 'UNKNOWN':
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        icon: '?',
      };
  }
}
