/**
 * SUZARCHI Phase 6 Preparation: Meta AI Multimodal Integration Contracts
 * 
 * STRICT ARCHITECTURAL BOUNDARY:
 * - This file defines provider-agnostic data schemas, input/output contracts, and validation rules only.
 * - NO remote API calls are executed.
 * - NO API keys, tokens, or credentials are embedded.
 * - NO client images or data are transmitted outside the local browser environment.
 * - Remote execution requires explicit external authorization.
 */

import { EvidenceStatus } from '@/types/passport';
import { LifecycleStreamId } from '@/types/taxonomy';

/**
 * Supported Image MIME Types for Multimodal Processing
 */
export type SupportedImageMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp';

/**
 * Image Quality and Semantic Role Classification per Phase 6A Specification
 */
export type ImageSemanticRole =
  | 'OVERVIEW'                // Material overview
  | 'MACRO_TEXTURE'           // Macro texture
  | 'FABRIC_CONSTRUCTION'     // Fabric construction (knit loop structure, weave type)
  | 'BALE_OR_ROLL_OVERVIEW'   // Bale or roll overview
  | 'MILL_TAG_OR_LABEL'       // Mill tag or specification label
  | 'LAB_TEST_REPORT'         // Laboratory report (ISO 1833, OEKO-TEX, mill certificate)
  | 'DEFECT_OR_CONTAMINATION'; // Stains, oil spots, foreign fibers, or degradation

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per file limit
export const SUPPORTED_MIME_TYPES: SupportedImageMimeType[] = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Validates an image file for intake according to size and format rules
 */
export function validateImageUpload(file: { name: string; size: number; type: string }): { valid: boolean; error?: string } {
  const mime = file.type.toLowerCase() as SupportedImageMimeType;
  if (!SUPPORTED_MIME_TYPES.includes(mime)) {
    // Check extension fallback if MIME type is missing or generic
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png' && ext !== 'webp') {
      return {
        valid: false,
        error: `Unsupported image format (${file.type || 'unknown'}). Only JPEG, PNG, and WebP are accepted.`,
      };
    }
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size exceeds 10 MB limit (${sizeMb} MB). Please compress or crop the photograph.`,
    };
  }

  return { valid: true };
}

/**
 * Standard Input Contract for an Image submitted to Meta AI Multimodal Pipeline
 */
export interface MultimodalImageInput {
  id: string;
  name: string;
  mimeType: SupportedImageMimeType;
  /**
   * Base64 encoded payload or ephemeral object URL.
   * Kept strictly in browser memory. Never logged or persisted.
   */
  dataUrlOrBase64: string;
  sizeBytes: number;
  semanticRole?: ImageSemanticRole;
  clientTimestampMs: number;
}

/**
 * Extraction Request Envelope
 */
export interface MetaAiExtractionRequest {
  requestId: string;
  images: MultimodalImageInput[];
  userHint?: {
    claimedStreamId?: LifecycleStreamId;
    supplierNotes?: string;
    preDeclaredFibre?: string;
  };
  clientConfiguration: {
    targetLanguage: 'en' | 'ta';
    maxInferenceTimeMs: number; // e.g. 15000 ms timeout
    uncertaintyThreshold: number; // e.g. 0.70 minimum confidence for PROVISIONAL status
  };
}

/**
 * Extracted Field Candidate with Explicit Optical Uncertainty & Provenance
 */
export interface ExtractedFieldCandidate<T> {
  value: T;
  evidenceStatus: EvidenceStatus;
  /**
   * Model probability score (0.0 to 1.0) of optical extraction accuracy.
   */
  opticalConfidence: number;
  /**
   * Explains how the model reached this candidate from visual inspection.
   */
  opticalRationale: string;
  /**
   * Specific reason why this cannot be treated as CONFIRMED without physical laboratory test.
   */
  verificationCaveat: string;
  /**
   * Mandatory physical or laboratory test standard required to certify this property.
   */
  requiredVerificationMethod?: string;
  /**
   * Information provenance tier
   */
  observationBasis?:
    | 'DIRECT_PHOTO_OBSERVATION'  // e.g. Navy color, roll/drape physical form
    | 'LABEL_OCR_READING'         // e.g. mill tag text
    | 'SUPPLIER_REPORTED'         // e.g. declared composition
    | 'ESTIMATED_HEURISTIC'       // e.g. GSM estimated from fabric thickness & drape
    | 'UNKNOWN';
}

/**
 * Structured Material Passport Extraction Schema (Output Contract)
 */
export interface StructuredPassportExtractionResult {
  extractionId: string;
  timestamp: string;
  modelIdentifier: string; // e.g. "meta-llama/Llama-3.2-11B-Vision-Instruct" or "prototype-local-fallback"
  isFallback: boolean;
  
  // High-Level Stream Identification
  streamId: ExtractedFieldCandidate<LifecycleStreamId>;
  suggestedTaxonomyId: ExtractedFieldCandidate<string>;
  
  // Core Visual Identifications
  materialName: ExtractedFieldCandidate<string>;
  materialType: ExtractedFieldCandidate<string>;
  detectedColour: ExtractedFieldCandidate<string>;
  physicalForm: ExtractedFieldCandidate<string>;
  knitOrWeaveAppearance?: ExtractedFieldCandidate<string | null>;
  visibleTexture?: ExtractedFieldCandidate<string | null>;
  labelInformation?: ExtractedFieldCandidate<string | null>;
  visibleDefects?: ExtractedFieldCandidate<string[]>;
  
  // Technical Properties (Subject to Optical Uncertainty)
  fibreComposition: ExtractedFieldCandidate<string>;
  estimatedGsm: ExtractedFieldCandidate<number | null>;
  estimatedWidthCm: ExtractedFieldCandidate<number | null>;
  yarnCountNe: ExtractedFieldCandidate<string | null>;
  stapleLengthMm: ExtractedFieldCandidate<number | null>;
  
  // Contamination & Foreign Object Audit
  contaminationAssessment: ExtractedFieldCandidate<'CLEAN_VIRGIN' | 'SURPLUS_DUST' | 'OIL_HYDROCARBON' | 'FOREIGN_POLYMERS' | 'UNKNOWN'>;
  metalHardwareDetected: ExtractedFieldCandidate<boolean>;
  isControlledOrHazardous: ExtractedFieldCandidate<boolean>;
  
  // Recommended Mandatory Laboratory Tests
  mandatoryLabAudits: string[];
  
  // Raw LLM Reasoning Trace (for Explainability & Debugging)
  processingSummary: string;
}

/**
 * Human Review State for each extracted field
 */
export interface HumanFieldReview<T = any> {
  fieldKey: string;
  fieldLabel: string;
  candidate: ExtractedFieldCandidate<T>;
  decision: 'ACCEPTED' | 'REJECTED' | 'MODIFIED';
  currentValue: T;
  currentEvidenceStatus: EvidenceStatus;
  manualNotes?: string;
}

/**
 * Provider Configuration Boundary
 * Strictly distinguishes the active local offline engine from planned remote provider candidates.
 */
export interface MetaAiProviderConfig {
  activeRuntimeEngine: 'RULE_BASED_FALLBACK';
  activeEngineName: string;
  isLiveInferenceActive: false;
  providerName: 'RULE_BASED_FALLBACK';
  modelId: string;
  apiVersion: string;
  endpointUrl?: string;
  requiresApiKey: boolean;
  isApprovedByEnterprise: boolean;
  allowClientImageTransmission: boolean;
  costStatus: 'UNVERIFIED_PENDING_COMMERCIAL_TERMS' | 'LOCAL_OFFLINE_ZERO_COST';
  plannedRemoteCandidate?: {
    modelId: string;
    apiVersion: string;
    endpointUrl: string;
    requiresApiKey: true;
    isApprovedByEnterprise: boolean;
    allowClientImageTransmission: boolean;
    commercialCostStatus: 'UNVERIFIED_PENDING_COMMERCIAL_TERMS';
  };
}

/**
 * Provider-Independent Multimodal Extraction Interface
 */
export interface IMetaAiMultimodalExtractor {
  extractPassport(request: MetaAiExtractionRequest): Promise<StructuredPassportExtractionResult>;
  validateResponse(rawResponse: unknown): rawResponse is StructuredPassportExtractionResult;
  getProviderConfig(): MetaAiProviderConfig;
}

/**
 * Safe Response Validator Helper
 */
export function validateExtractionSchema(result: unknown): result is StructuredPassportExtractionResult {
  if (!result || typeof result !== 'object') return false;
  const r = result as Record<string, unknown>;
  return (
    typeof r.extractionId === 'string' &&
    typeof r.modelIdentifier === 'string' &&
    typeof r.isFallback === 'boolean' &&
    typeof r.streamId === 'object' &&
    typeof r.fibreComposition === 'object' &&
    Array.isArray(r.mandatoryLabAudits)
  );
}
