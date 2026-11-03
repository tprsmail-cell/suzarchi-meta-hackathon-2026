/**
 * SUZARCHI Phase 6B: Provider-Independent Multimodal Adapter Scaffolding
 * 
 * STRICT SECURITY & ACCURACY INVARIANT:
 * - ACTIVE RUNTIME: Strictly the Local Rule-Based Intake Engine (in-memory offline heuristics).
 * - REMOTE PROVIDER: Inactive planned candidate scaffolding only. Cannot be activated via client config.
 * - ZERO NETWORK EGRESS: No image payload, prompt, or metadata is transmitted over the network.
 * - ZERO CREDENTIALS: No API keys, tokens, or credentials exist or are queried.
 * - ALL INTAKE REQUESTS UNCONDITIONALLY ROUTE TO THE LOCAL EXTRACTION ENGINE.
 */

import { MaterialPhoto } from '@/types/passport';
import {
  MetaAiExtractionRequest,
  StructuredPassportExtractionResult,
  MetaAiProviderConfig,
  validateExtractionSchema,
} from './metaAiContracts';
import { runStructuredExtraction } from './metaAiEngine';

export interface IMetaAiMultimodalAdapter {
  readonly isLiveInferenceEnabled: false;
  extractPassport(request: MetaAiExtractionRequest): Promise<StructuredPassportExtractionResult>;
  getProviderConfig(): MetaAiProviderConfig;
}

export class MetaLlamaVisionAdapter implements IMetaAiMultimodalAdapter {
  /**
   * Immutable security barrier: Hardcoded false.
   * Remote inference cannot be toggled through client-side configuration.
   */
  public readonly isLiveInferenceEnabled: false = false;

  /**
   * Active runtime configuration: Strictly local offline engine.
   * Planned remote candidate settings are explicitly separated and marked unconfigured.
   */
  private readonly config: MetaAiProviderConfig = {
    activeRuntimeEngine: 'RULE_BASED_FALLBACK',
    activeEngineName: 'Local Rule-Based Intake Heuristics (Offline In-Memory Engine)',
    isLiveInferenceActive: false,
    providerName: 'RULE_BASED_FALLBACK',
    modelId: 'SUZARCHI-Local-Rule-Heuristics-v1', // Accurately reflects local rule engine, not a Meta model
    apiVersion: 'UNCONFIGURED (Pending Provider Selection)',
    endpointUrl: undefined,
    requiresApiKey: false,
    isApprovedByEnterprise: false,
    allowClientImageTransmission: false,
    costStatus: 'LOCAL_OFFLINE_ZERO_COST',
    plannedRemoteCandidate: {
      modelId: 'meta-llama/Llama-3.2-11B-Vision-Instruct',
      apiVersion: 'UNCONFIGURED (Pending Provider Selection)',
      endpointUrl: 'UNCONFIGURED (Requires Server-Side Proxy Route)',
      requiresApiKey: true,
      isApprovedByEnterprise: false,
      allowClientImageTransmission: false,
      commercialCostStatus: 'UNVERIFIED_PENDING_COMMERCIAL_TERMS',
    },
  };

  /**
   * Retrieves current provider operational configuration
   */
  public getProviderConfig(): MetaAiProviderConfig {
    return { ...this.config };
  }

  /**
   * Main entrypoint for multimodal passport extraction.
   * In the running application, this UNCONDITIONALLY executes the local extraction engine.
   * No remote network client exists, and no remote call is possible.
   */
  public async extractPassport(
    request: MetaAiExtractionRequest
  ): Promise<StructuredPassportExtractionResult> {
    // Current and ONLY execution path: Convert input images into local MaterialPhoto objects
    const photos: MaterialPhoto[] = request.images.map((img) => ({
      id: img.id,
      url: img.dataUrlOrBase64,
      name: img.name,
      sizeBytes: img.sizeBytes,
      caption: `${img.semanticRole || 'OVERVIEW'}: ${img.name}`,
      mediaType: this.mapSemanticRoleToMediaType(img.semanticRole),
      isPrimary: false,
    }));

    const userHint = [
      request.userHint?.claimedStreamId ? `Stream: ${request.userHint.claimedStreamId}` : '',
      request.userHint?.preDeclaredFibre || '',
      request.userHint?.supplierNotes || '',
    ]
      .filter(Boolean)
      .join(' ');

    // Execute local deterministic rule engine in browser memory
    return await runStructuredExtraction(photos, userHint);
  }

  /**
   * INACTIVE ARCHITECTURAL SCAFFOLDING ONLY.
   * 
   * WARNING: This method is NOT reachable or invoked by the application intake workflow.
   * It has ZERO network execution capability and exists solely as a structural reference
   * for future server-side proxy payload formatting.
   * 
   * @internal
   * @deprecated Inactive scaffolding for future Phase 6B server-proxy reference only.
   */
  public formatMultimodalPayloadReference(request: MetaAiExtractionRequest) {
    // Completely uncalled by runtime
    const systemPrompt = `You are the SUZARCHI Circular Material Intelligence Extractor.
Analyze the provided photographs of textile surplus, yarn, or cutting waste.
Extract visible attributes conforming strictly to the SUZARCHI Structured Material Passport schema.

SCIENTIFIC GOVERNANCE RULES:
1. Optical inspection CANNOT confirm chemical blend ratios. Fiber composition MUST be assigned "REPORTED" or "ESTIMATED" status and mandate ISO 1833 chemical dissolution testing.
2. Fabric mass (GSM) CANNOT be verified from photos. Assign status "ESTIMATED" and mandate ISO 3801 round sample cutter testing.
3. Detect visible contaminants, oily stains, or foreign metal hardware. If petroleum oil or hazardous grease is detected, flag isControlledOrHazardous: true.
4. Output ONLY valid JSON matching StructuredPassportExtractionResult.`;

    const userContent: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];

    if (request.userHint?.supplierNotes) {
      userContent.push({
        type: 'text',
        text: `Supplier Declarations: ${request.userHint.supplierNotes}`,
      });
    }

    for (const img of request.images) {
      userContent.push({
        type: 'text',
        text: `[Image Purpose: ${img.semanticRole || 'OVERVIEW'} | File: ${img.name}]`,
      });
      userContent.push({
        type: 'image_url',
        image_url: {
          url: img.dataUrlOrBase64,
        },
      });
    }

    return {
      model: this.config.plannedRemoteCandidate?.modelId || 'UNCONFIGURED',
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
    };
  }

  /**
   * Helper to map ImageSemanticRole to MaterialPhoto ImagePurposeClassification
   */
  private mapSemanticRoleToMediaType(role?: string) {
    switch (role) {
      case 'MACRO_TEXTURE':
        return 'TEXTURE';
      case 'FABRIC_CONSTRUCTION':
        return 'CONSTRUCTION';
      case 'BALE_OR_ROLL_OVERVIEW':
        return 'BALE_ROLL';
      case 'MILL_TAG_OR_LABEL':
        return 'LABEL';
      case 'LAB_TEST_REPORT':
        return 'LAB_TEST';
      case 'DEFECT_OR_CONTAMINATION':
        return 'DEFECT_DAMAGE';
      case 'OVERVIEW':
      default:
        return 'OVERVIEW';
    }
  }
}

// Export singleton adapter instance defaulting unconditionally to local fallback mode
export const defaultMultimodalAdapter = new MetaLlamaVisionAdapter();
