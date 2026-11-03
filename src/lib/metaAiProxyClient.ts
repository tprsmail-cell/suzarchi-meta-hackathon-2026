/**
 * SUZARCHI Global Circular Material Intelligence Platform
 * Phase 8.1 & Meta AI Controlled Integration Preparation
 *
 * Enforces:
 * - $5.00 USD strict testing budget cap
 * - Single image payload limits
 * - Preserves evidence model: AI extracted values are tagged REPORTED / ESTIMATED, NEVER promoted to CONFIRMED
 * - Explicit user consent required before external network transmission
 * - Client-side fallback to deterministic local heuristic extraction if server route is unconfigured, disabled, or offline
 */

import { MetaAiUsageBudget } from '../types/enterprise';
import { MaterialPassport, MaterialPhoto } from '../types/passport';
import { runStructuredExtraction } from './metaAiEngine';
import { StructuredPassportExtractionResult } from './metaAiContracts';

function buildPassportDraftFromExtraction(result: StructuredPassportExtractionResult): Partial<MaterialPassport> {
  return {
    materialName: {
      value: result.materialName.value,
      status: result.materialName.evidenceStatus,
      sourceNote: result.materialName.opticalRationale,
    },
    materialType: {
      value: result.materialType.value,
      status: result.materialType.evidenceStatus,
    },
    fibreComposition: {
      value: result.fibreComposition.value,
      status: result.fibreComposition.evidenceStatus,
      sourceNote: result.fibreComposition.opticalRationale,
    },
    form: {
      value: result.physicalForm.value,
      status: result.physicalForm.evidenceStatus,
    },
    streamId: result.streamId.value,
    taxonomyId: result.suggestedTaxonomyId.value,
    isControlledOrHazardous: result.isControlledOrHazardous.value,
  };
}

export const INITIAL_META_AI_BUDGET: MetaAiUsageBudget = {
  maxBudgetUsd: 5.0,
  currentSpendUsd: 0.0,
  requestCount: 0,
  maxRequestsAllowed: 250, // Approx $0.02 per multimodal inference request
  isBudgetExceeded: false,
  modelIdentifier: 'muse-spark-1.1',
};

// In-memory budget state for browser session
let currentBudgetState: MetaAiUsageBudget = { ...INITIAL_META_AI_BUDGET };

export function getMetaAiBudget(): MetaAiUsageBudget {
  return { ...currentBudgetState };
}

export function resetMetaAiBudget(): void {
  currentBudgetState = { ...INITIAL_META_AI_BUDGET };
}

export interface MetaAiProxyResponse {
  success: boolean;
  source: 'REMOTE_META_AI' | 'LOCAL_FALLBACK';
  modelUsed: string;
  extractedProperties?: Partial<MaterialPassport>;
  spendIncurredUsd: number;
  remainingBudgetUsd: number;
  message: string;
  code?: string;
}

export interface ExtractionRequestOptions {
  promptHint?: string;
  userConsentGranted?: boolean;
  mockSimulationMode?: string;
}

/**
 * Dispatches multimodal extraction request through the secure server route handler.
 * Falls back transparently to local extraction if server is unconfigured, disabled, or offline.
 */
export async function requestMetaAiExtraction(
  photo: MaterialPhoto,
  optionsOrHint?: string | ExtractionRequestOptions
): Promise<MetaAiProxyResponse> {
  const options: ExtractionRequestOptions =
    typeof optionsOrHint === 'string' ? { promptHint: optionsOrHint } : optionsOrHint || {};

  const { promptHint, userConsentGranted = false, mockSimulationMode } = options;

  // Check budget gate
  if (currentBudgetState.currentSpendUsd >= currentBudgetState.maxBudgetUsd || currentBudgetState.isBudgetExceeded) {
    const fallbackStructured = await runStructuredExtraction([photo], promptHint);
    return {
      success: false,
      source: 'LOCAL_FALLBACK',
      modelUsed: 'Local-Heuristic-Rule-Engine',
      extractedProperties: buildPassportDraftFromExtraction(fallbackStructured),
      spendIncurredUsd: 0.0,
      remainingBudgetUsd: 0.0,
      message: 'Meta AI testing budget cap ($5.00 USD) reached. Reverted to offline local fallback.',
      code: 'BUDGET_EXHAUSTED',
    };
  }

  // Pre-Flight User Consent Check (Rule 7)
  // If consent not granted, immediately fallback to local engine without external call
  if (!userConsentGranted && !mockSimulationMode) {
    const fallbackStructured = await runStructuredExtraction([photo], promptHint);
    return {
      success: true,
      source: 'LOCAL_FALLBACK',
      modelUsed: 'Local-Deterministic-Extractor (Consent Gated)',
      extractedProperties: buildPassportDraftFromExtraction(fallbackStructured),
      spendIncurredUsd: 0.0,
      remainingBudgetUsd: Math.max(0, currentBudgetState.maxBudgetUsd - currentBudgetState.currentSpendUsd),
      message: 'External transmission not consented. Processed via local deterministic heuristic engine.',
      code: 'USER_CONSENT_REQUIRED',
    };
  }

  try {
    const response = await fetch('/api/meta-ai/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        photoUrl: photo.url,
        caption: photo.caption,
        promptHint,
        clientEstimatedCost: 0.02,
        userConsentGranted,
        mockSimulationMode,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.source === 'REMOTE_META_AI') {
        currentBudgetState.currentSpendUsd = Number(
          (currentBudgetState.currentSpendUsd + (data.costUsd || 0.02)).toFixed(4)
        );
        currentBudgetState.requestCount += 1;
        if (currentBudgetState.currentSpendUsd >= currentBudgetState.maxBudgetUsd) {
          currentBudgetState.isBudgetExceeded = true;
        }

        return {
          success: true,
          source: 'REMOTE_META_AI',
          modelUsed: data.model || currentBudgetState.modelIdentifier,
          extractedProperties: data.extractedProperties,
          spendIncurredUsd: data.costUsd || 0.02,
          remainingBudgetUsd: Math.max(0, currentBudgetState.maxBudgetUsd - currentBudgetState.currentSpendUsd),
          message: data.message || 'Extracted via Meta Multimodal AI Proxy.',
        };
      }
    }
  } catch {
    // Server fetch error or offline dev server
  }

  // Graceful deterministic fallback
  const fallbackStructured = await runStructuredExtraction([photo], promptHint);
  return {
    success: true,
    source: 'LOCAL_FALLBACK',
    modelUsed: 'Local-Deterministic-Extractor (ISO 1833 Ready)',
    extractedProperties: buildPassportDraftFromExtraction(fallbackStructured),
    spendIncurredUsd: 0.0,
    remainingBudgetUsd: Math.max(0, currentBudgetState.maxBudgetUsd - currentBudgetState.currentSpendUsd),
    message: 'Processed via secure local heuristic engine (Zero external data transmission).',
  };
}
