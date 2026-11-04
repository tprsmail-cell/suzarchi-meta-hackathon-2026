/**
 * SUZARCHI Meta AI Upstream Response Parser & Sanitizer
 *
 * Provides defensive parsing, structure validation, usage accounting, and Evidence Governance
 * sanitization for Meta Model API responses (e.g. muse-spark-1.3).
 *
 * HARD CONSTRAINTS:
 * 1. Safe response validation:
 *    - Never pass null, undefined, arrays, or unexpected primitives into property accessors.
 *    - Handles missing choices, missing message, null content, empty content, and malformed JSON.
 *    - Distinguishes finish_reason === "length" (token limit truncation).
 *    - Distinguishes message.refusal (model policy refusal).
 *    - Strips markdown code fences (```json ... ```) when present.
 * 2. Usage Metadata Accounting:
 *    - Extracts prompt_tokens, completion_tokens, total_tokens, and completion_tokens_details.reasoning_tokens.
 * 3. Evidence Governance:
 *    - NEVER declares fibre composition or GSM as CONFIRMED based on optical/text model outputs.
 *    - Demotes any model-attempted 'CONFIRMED' status to 'REPORTED'.
 *    - Mandatory laboratory verification mandate (ISO 1833 & ISO 3801).
 * 4. Never throws unhandled exceptions during response parsing.
 * 5. Never logs or leaks credentials, authorization headers, or sensitive data.
 */

export interface ModelTokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  reasoningTokens?: number;
}

export interface ParsedModelExtraction {
  sanitizedProperties: {
    materialName: {
      value: string;
      status: 'REPORTED' | 'ESTIMATED' | 'UNKNOWN';
      sourceNote: string;
    };
    materialType: {
      value: string;
      status: 'REPORTED' | 'ESTIMATED' | 'UNKNOWN';
    };
    fibreComposition: {
      value: string;
      status: 'REPORTED' | 'ESTIMATED' | 'UNKNOWN';
      sourceNote: string;
    };
    form: {
      value: string;
      status: 'REPORTED' | 'ESTIMATED' | 'UNKNOWN';
    };
    contaminationRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
    isControlledOrHazardous: boolean | null;
  };
  textileIntelligence: {
    materialCategory: string;
    fabricConstruction: string | null;
    visibleColour: string | null;
    userReportedFibreComposition: string | null;
    userReportedGsm: number | null;
    materialCondition: string | null;
    visibleDefects: string[];
    potentialReusePathways: string[];
    missingInformation: string[];
  };
  usage: ModelTokenUsage;
}

export type ParseValidationResult =
  | { success: true; data: ParsedModelExtraction }
  | { success: false; code: string; message: string; statusCode: number; usage?: ModelTokenUsage };

/**
 * Extracts and normalizes token usage metrics from upstream envelope.
 * Safely handles missing usage metadata, non-numeric values, and reasoning token details.
 */
export function extractModelUsage(upstreamJson: any, fallbackPromptLength: number = 0): ModelTokenUsage {
  const usage = upstreamJson && typeof upstreamJson === 'object' && !Array.isArray(upstreamJson)
    ? upstreamJson.usage
    : null;

  const promptTokens = typeof usage?.prompt_tokens === 'number' && !isNaN(usage.prompt_tokens)
    ? usage.prompt_tokens
    : Math.round(fallbackPromptLength / 4);

  const completionTokens = typeof usage?.completion_tokens === 'number' && !isNaN(usage.completion_tokens)
    ? usage.completion_tokens
    : 0;

  const totalTokens = typeof usage?.total_tokens === 'number' && !isNaN(usage.total_tokens)
    ? usage.total_tokens
    : (promptTokens + completionTokens);

  const rawReasoning = usage?.completion_tokens_details?.reasoning_tokens;
  const reasoningTokens = typeof rawReasoning === 'number' && !isNaN(rawReasoning)
    ? rawReasoning
    : undefined;

  return {
    promptTokens,
    completionTokens,
    totalTokens,
    ...(reasoningTokens !== undefined ? { reasoningTokens } : {}),
  };
}

/**
 * Validates and normalizes upstream Meta Model API responses defensively.
 * Handles token limits, refusals, missing choices, missing messages, null/empty content, malformed JSON.
 */
export function parseAndValidateModelResponse(
  upstreamJson: any,
  fallbackCaption?: string,
  promptLength: number = 0,
  hasImageInput: boolean = false
): ParseValidationResult {
  const usage = extractModelUsage(upstreamJson, promptLength);

  // 1. Validate envelope is a non-null object
  if (!upstreamJson || typeof upstreamJson !== 'object' || Array.isArray(upstreamJson)) {
    return {
      success: false,
      code: 'UNEXPECTED_RESPONSE_STRUCTURE',
      message: 'Upstream response is not a valid JSON object envelope.',
      statusCode: 502,
      usage,
    };
  }

  // 2. Validate choices array
  const choices = upstreamJson.choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    return {
      success: false,
      code: 'MISSING_CHOICES',
      message: 'Upstream Meta API response contains no choices.',
      statusCode: 502,
      usage,
    };
  }

  // 3. Validate message object
  const firstChoice = choices[0];
  if (!firstChoice || typeof firstChoice !== 'object' || !firstChoice.message || typeof firstChoice.message !== 'object') {
    return {
      success: false,
      code: 'MISSING_MESSAGE',
      message: 'Upstream Meta API choice lacks a valid message object.',
      statusCode: 502,
      usage,
    };
  }

  // 4. Check for Model Refusal (e.g. policy refusal)
  if (firstChoice.message.refusal) {
    return {
      success: false,
      code: 'MODEL_REFUSAL',
      message: `Model refused request: ${String(firstChoice.message.refusal).slice(0, 150)}`,
      statusCode: 502,
      usage,
    };
  }

  // 5. Check for Token Limit Truncation (finish_reason: "length")
  const finishReason = firstChoice.finish_reason;
  const contentRaw = firstChoice.message.content;

  if (finishReason === 'length') {
    return {
      success: false,
      code: 'TOKEN_LIMIT_EXCEEDED',
      message: 'Model reached completion token limit (max_completion_tokens) before finishing response.',
      statusCode: 502,
      usage,
    };
  }

  // 6. Validate content presence (null or undefined)
  if (contentRaw === null || contentRaw === undefined) {
    return {
      success: false,
      code: 'NULL_MESSAGE_CONTENT',
      message: 'Model choice returned null or undefined content.',
      statusCode: 502,
      usage,
    };
  }

  // 7. Validate non-empty string content
  if (typeof contentRaw !== 'string' || contentRaw.trim().length === 0) {
    return {
      success: false,
      code: 'EMPTY_MESSAGE_CONTENT',
      message: 'Model choice returned empty content string.',
      statusCode: 502,
      usage,
    };
  }

  // 8. Clean markdown code fences if present (e.g. ```json ... ```)
  let cleanedContent = contentRaw.trim();
  if (cleanedContent.startsWith('```')) {
    cleanedContent = cleanedContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  // 9. Parse JSON content defensively
  let parsedContent: any;
  try {
    parsedContent = JSON.parse(cleanedContent);
  } catch {
    return {
      success: false,
      code: 'MALFORMED_MODEL_JSON',
      message: 'Model message content was not valid JSON. Falling back to local rules.',
      statusCode: 502,
      usage,
    };
  }

  // 10. Validate parsed content structure (must be non-null object or array of objects)
  let rawObject: Record<string, any>;
  if (Array.isArray(parsedContent)) {
    if (parsedContent.length === 0 || !parsedContent[0] || typeof parsedContent[0] !== 'object') {
      return {
        success: false,
        code: 'UNEXPECTED_RESPONSE_STRUCTURE',
        message: 'Model returned an empty or invalid array structure.',
        statusCode: 502,
        usage,
      };
    }
    rawObject = parsedContent[0];
  } else if (parsedContent && typeof parsedContent === 'object') {
    rawObject = parsedContent;
  } else {
    return {
      success: false,
      code: 'UNEXPECTED_RESPONSE_STRUCTURE',
      message: 'Model content parsed into unexpected primitive type.',
      statusCode: 502,
      usage,
    };
  }

  // 11. Safely sanitize properties with evidence governance
  const sanitizedProperties = sanitizeExtractedEvidence(rawObject, fallbackCaption, hasImageInput);

  // 12. Safely construct textile intelligence fields (DEF-002: No fabricated defaults)
  const missingInfoList: string[] = Array.isArray(rawObject.missingInformation)
    ? rawObject.missingInformation.filter((m: any) => typeof m === 'string')
    : [];

  const rawGsm = typeof rawObject.userReportedGsm === 'number' && !isNaN(rawObject.userReportedGsm)
    ? rawObject.userReportedGsm
    : null;
  if (rawGsm === null && !missingInfoList.some((m: string) => m.toLowerCase().includes('gsm') || m.toLowerCase().includes('mass'))) {
    missingInfoList.push('Fabric Areal Mass (GSM) unmeasured / missing');
  }

  const rawConstruction = typeof rawObject.fabricConstruction === 'string' && rawObject.fabricConstruction.trim()
    ? rawObject.fabricConstruction.trim()
    : null;
  if (rawConstruction === null && !missingInfoList.some((m: string) => m.toLowerCase().includes('construction') || m.toLowerCase().includes('weave') || m.toLowerCase().includes('knit'))) {
    missingInfoList.push('Fabric Construction unverified');
  }

  const rawColour = typeof rawObject.visibleColour === 'string' && rawObject.visibleColour.trim()
    ? rawObject.visibleColour.trim()
    : null;
  if (rawColour === null && !missingInfoList.some((m: string) => m.toLowerCase().includes('colo'))) {
    missingInfoList.push('Visible Colour unspecified');
  }

  const rawFibreComp = typeof rawObject.userReportedFibreComposition === 'string' && rawObject.userReportedFibreComposition.trim()
    ? rawObject.userReportedFibreComposition.trim()
    : null;
  if (rawFibreComp === null && !missingInfoList.some((m: string) => m.toLowerCase().includes('fibre') || m.toLowerCase().includes('fiber') || m.toLowerCase().includes('composition'))) {
    missingInfoList.push('Fibre Composition unverified (ISO 1833 required)');
  }

  const rawCondition = typeof rawObject.materialCondition === 'string' && rawObject.materialCondition.trim()
    ? rawObject.materialCondition.trim()
    : null;

  // Append missing classification/type and contamination status if unverified (DEF-A, DEF-B)
  if (sanitizedProperties.materialType.status === 'UNKNOWN' || sanitizedProperties.materialType.value === 'Unspecified Material Type') {
    if (!missingInfoList.some((m: string) => m.toLowerCase().includes('material type') || m.toLowerCase().includes('classification'))) {
      missingInfoList.push('Material classification / type unverified');
    }
  }

  if (sanitizedProperties.contaminationRisk === 'UNKNOWN' || sanitizedProperties.isControlledOrHazardous === null) {
    if (!missingInfoList.some((m: string) => m.toLowerCase().includes('contamin') || m.toLowerCase().includes('hazard'))) {
      missingInfoList.push('Chemical contamination & hazardous status unverified');
    }
  }

  const textileIntelligence = {
    materialCategory: typeof rawObject.materialCategory === 'string' && rawObject.materialCategory.trim()
      ? rawObject.materialCategory.trim()
      : 'Circular Textile',
    fabricConstruction: rawConstruction,
    visibleColour: rawColour,
    userReportedFibreComposition: rawFibreComp,
    userReportedGsm: rawGsm,
    materialCondition: rawCondition,
    visibleDefects: Array.isArray(rawObject.visibleDefects)
      ? rawObject.visibleDefects.filter((d: any) => typeof d === 'string')
      : [],
    potentialReusePathways: Array.isArray(rawObject.potentialReusePathways) && rawObject.potentialReusePathways.length > 0
      ? rawObject.potentialReusePathways.filter((p: any) => typeof p === 'string')
      : ['OE-Rotor Spinning', 'Mechanical Recycling'],
    missingInformation: missingInfoList,
  };

  return {
    success: true,
    data: {
      sanitizedProperties,
      textileIntelligence,
      usage,
    },
  };
}

/**
 * Normalizes extracted fields to enforce SUZARCHI Evidence Governance.
 * Never allows null, undefined, arrays, or unexpected primitives to cause runtime crashes.
 * Fiber composition and GSM MUST NEVER be CONFIRMED based on optical photos.
 */
export function sanitizeExtractedEvidence(raw: any, fallbackCaption?: string, hasImageInput: boolean = false) {
  // Defensive guard: ensure raw is a valid non-null plain object
  const safe = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : {};

  const safeStatus = (val: any): 'REPORTED' | 'ESTIMATED' | 'UNKNOWN' => {
    if (val === 'CONFIRMED') return 'REPORTED'; // Demote any attempted CONFIRMED optical/text claim
    if (val === 'REPORTED' || val === 'ESTIMATED' || val === 'UNKNOWN') return val;
    return 'REPORTED';
  };

  const safeString = (val: any, fallback: string): string => {
    return (typeof val === 'string' && val.trim().length > 0) ? val.trim() : fallback;
  };

  // DEF-C: Modality-aware source attribution
  const sourceAttribution = hasImageInput
    ? 'Meta AI Multimodal Vision Analysis (Reported Observation)'
    : 'Meta AI Text-Based Attribute Extraction (Reported)';

  const fibreSourceNote = hasImageInput
    ? 'Optical visual estimate only; requires ISO 1833 chemical laboratory analysis for confirmation.'
    : 'Text metadata extraction only; requires ISO 1833 chemical laboratory analysis for confirmation.';

  // DEF-A: Fabric identity integrity - No fabricated 'Knit Fabric Roll' fallback
  const hasExplicitType = typeof safe.materialType === 'string' && safe.materialType.trim().length > 0;
  const materialTypeValue = hasExplicitType ? safe.materialType.trim() : 'Unspecified Material Type';
  const materialTypeStatus = hasExplicitType ? safeStatus(safe.materialTypeStatus) : 'UNKNOWN';

  // DEF-B: Contamination integrity - Remove default 'LOW' and default false
  let contaminationRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN' = 'UNKNOWN';
  if (typeof safe.contaminationRisk === 'string') {
    const upper = safe.contaminationRisk.trim().toUpperCase();
    if (upper === 'LOW' || upper === 'MEDIUM' || upper === 'HIGH' || upper === 'UNKNOWN') {
      contaminationRisk = upper as 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
    }
  }

  // Safety Consistency & Semantics (Phase 1.2 Post-Live Safety Correction):
  // - true: hazardous/controlled status is established by adequate evidence.
  // - false: non-hazardous/non-controlled status is established by adequate evidence (NOT by unverified AI assertion alone).
  // - null: status is unknown, missing or unverified.
  let isControlledOrHazardous: boolean | null = null;

  if (safe.isControlledOrHazardous === true) {
    isControlledOrHazardous = true;
  } else if (safe.isControlledOrHazardous === false) {
    // Only accept false if supported by verified evidence.
    // An AI-generated assertion alone cannot declare non-hazardous when contamination is UNKNOWN, MEDIUM, or HIGH,
    // or when chemical finishes/safety are unverified.
    const hasAdequateEvidence =
      safe.hasVerifiedNonHazardousEvidence === true ||
      safe.hazardousEvidenceStatus === 'CONFIRMED' ||
      (safe.cleanlinessRating === 'VIRGIN_CLEAN' && safe.cleanlinessStatus === 'CONFIRMED') ||
      Boolean(safe.laboratoryReportId);

    const hasContaminationUncertainty =
      contaminationRisk === 'MEDIUM' ||
      contaminationRisk === 'HIGH' ||
      contaminationRisk === 'UNKNOWN';

    if (hasAdequateEvidence && !hasContaminationUncertainty) {
      isControlledOrHazardous = false;
    } else {
      // Unverified AI negative claim demoted to null (precautionary governance)
      isControlledOrHazardous = null;
    }
  } else {
    isControlledOrHazardous = null;
  }

  return {
    materialName: {
      value: safeString(safe.materialName, fallbackCaption || 'Extracted Circular Textile'),
      status: safeStatus(safe.materialNameStatus),
      sourceNote: sourceAttribution,
    },
    materialType: {
      value: materialTypeValue,
      status: materialTypeStatus,
    },
    fibreComposition: {
      value: safeString(safe.fibreComposition, safe.userReportedFibreComposition || 'Unspecified Fibre Blend'),
      status: (safe.fibreComposition || safe.userReportedFibreComposition) ? ('REPORTED' as const) : ('UNKNOWN' as const),
      sourceNote: fibreSourceNote,
    },
    form: {
      value: safeString(safe.form, safeString(safe.physicalForm, 'Roll Goods')),
      status: safeStatus(safe.formStatus),
    },
    contaminationRisk,
    isControlledOrHazardous,
  };
}
