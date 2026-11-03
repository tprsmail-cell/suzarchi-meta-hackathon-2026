import { EvidenceStatus } from './passport';
import { LifecycleStreamId } from './taxonomy';

/**
 * 11 Destination Families as specified in SUZARCHI Phase 7 Architecture
 */
export type DestinationFamilyId =
  | 'DIRECT_FABRIC_REUSE'
  | 'GARMENT_MANUFACTURING'
  | 'ACCESSORIES_CRAFT'
  | 'HOME_TEXTILES'
  | 'INDUSTRIAL_APPLICATIONS'
  | 'YARN_RECOVERY_REUSE'
  | 'MECHANICAL_FIBRE_OPENING'
  | 'NONWOVEN_APPLICATIONS'
  | 'INSULATION_FILLING'
  | 'INDUSTRIAL_WIPING'
  | 'RECYCLING_RECOVERY';

export type RecommendationStatus =
  | 'ELIGIBLE'
  | 'CONDITIONALLY_ELIGIBLE'
  | 'VERIFICATION_REQUIRED'
  | 'NOT_ELIGIBLE'
  | 'INSUFFICIENT_DATA';

export type DimensionStatus =
  | 'PASSED'
  | 'CONDITIONALLY_PASSED'
  | 'VERIFICATION_REQUIRED'
  | 'BLOCKED'
  | 'INSUFFICIENT_DATA';

export interface MatchingDimensionCheck {
  id: string;
  name: string;
  status: 'SATISFIED' | 'PENDING_VERIFICATION' | 'BLOCKED';
  evidenceStatus: EvidenceStatus;
  finding: string;
  requiredEvidence?: string;
  isHardGate?: boolean;
}

export interface DimensionEvaluation {
  status: DimensionStatus;
  score: number; // 0 to 100
  summary: string;
  checks: MatchingDimensionCheck[];
}

export interface FourDimensionEvaluation {
  technicalCompatibility: DimensionEvaluation;
  safetyEligibility: DimensionEvaluation;
  evidenceCompleteness: DimensionEvaluation;
  commercialSuitability: DimensionEvaluation;
}

export interface RegionalCorridorAssessment {
  sourceRegion: string;
  destinationRegion: string;
  corridorName: string;
  distanceKmEstimated: number;
  transportFeasibility: 'HIGH' | 'MEDIUM' | 'LOW' | 'RESTRICTED';
  clusterProcessingAvailability: string;
  verifiedSourceFacts: string[];
  estimatedLogisticsAssumptions: string[];
  missingRegionalInformation: string[];
  transparencyLimitationNotice: string;
}

export interface DestinationCatalogEntry {
  id: string;
  familyId: DestinationFamilyId;
  familyName: string;
  title: string;
  titleTa?: string;
  description: string;
  compatibleStreams: LifecycleStreamId[];
  compatibleForms: string[];
  requiredFibreTypes?: string[];
  excludedFibreTypes?: string[];
  minGsm?: number;
  maxGsm?: number;
  minWidthCm?: number;
  minQuantityKg?: number;
  prohibitedContaminants: string[];
  processingRequirements: string[];
  requiredLaboratoryStandards: string[];
  commercialSuitabilityFactors: string[];
  defaultActionLabel: string;
  defaultActionCount: number;
  thumbnailEmoji: string;
}
