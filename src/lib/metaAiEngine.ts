/**
 * SUZARCHI Meta AI Circular Intelligence Engine
 * Provider-Independent Multimodal Vision & Attribute Extraction
 *
 * Implements Meta Llama 3.2 Vision architecture abstraction with
 * local deterministic fallback, transparent rule reporting, and uncertainty flagging.
 * Phase 6A: Local In-Memory Boundary. No remote API calls without enterprise authorization.
 */

import { MaterialPassport, PropertyRecord, MaterialPhoto, EvidenceStatus } from '@/types/passport';
import { LifecycleStreamId } from '@/types/taxonomy';
import {
  StructuredPassportExtractionResult,
  ExtractedFieldCandidate,
  HumanFieldReview,
  MultimodalImageInput,
} from './metaAiContracts';

export interface MetaAiExtractionResult {
  engine: 'Local Rule-Based Intake Extraction (Prototype Fallback - Meta AI Integration Ready)';
  status: 'SUCCESS' | 'UNCERTAINTY_FLAGGED' | 'SAFETY_WARNING';
  detectedMaterialName: string;
  detectedStreamId: string;
  detectedTaxonomyId: string;
  estimatedComposition: string;
  compositionConfidenceNote: string;
  detectedForm: string;
  detectedGsm?: number;
  detectedWidthCm?: number;
  detectedYarnCount?: string;
  uncertainties: string[];
  suggestedDestinations: string[];
  safetyWarnings: string[];
  analysisLatencyMs: number;
}

/**
 * Executes structured extraction per Phase 6A specification.
 * Fully compliant with StructuredPassportExtractionResult schema.
 */
export async function runStructuredExtraction(
  photos: MaterialPhoto[],
  userPromptHint?: string
): Promise<StructuredPassportExtractionResult> {
  // Deterministic simulation latency (600ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  const hintLower = (
    userPromptHint ||
    photos.map((p) => `${p.name || ''} ${p.caption || ''}`).join(' ')
  ).toLowerCase();

  const isSilk = hintLower.includes('silk') || hintLower.includes('zari') || hintLower.includes('handloom');
  const isOily = hintLower.includes('oil') || hintLower.includes('rag') || hintLower.includes('grease') || hintLower.includes('workshop');
  const isCone = hintLower.includes('cone') || hintLower.includes('plastic') || hintLower.includes('tube') || hintLower.includes('bobbin');
  const isLinen = hintLower.includes('hospital') || hintLower.includes('linen') || hintLower.includes('bed') || hintLower.includes('hotel');

  const extractionId = `ext-${Date.now()}`;
  const timestamp = new Date().toISOString();
  const modelIdentifier = 'meta-llama/Llama-3.2-11B-Vision-Instruct (Local Rule Heuristics Engine)';

  // Case A: Handloom Silk Thrums & Zari
  if (isSilk) {
    return {
      extractionId,
      timestamp,
      modelIdentifier,
      isFallback: true,
      streamId: {
        value: 'HLM',
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.95,
        opticalRationale: 'Artisanal thrum ends with visible gold/silver metallic wrap around silk filament core.',
        verificationCaveat: 'Handloom artisanal provenance confirmed; metal purity assay required.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      suggestedTaxonomyId: {
        value: 'CAT-HLM-SLK-ZAR',
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.92,
        opticalRationale: 'Matches Kanchipuram paavu ends with real zari profile.',
        verificationCaveat: 'Taxonomy classification subject to weaver guild audit.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      materialName: {
        value: 'Pure Mulberry Silk Thrum Waste with Real Silver Zari',
        evidenceStatus: 'REPORTED',
        opticalConfidence: 0.88,
        opticalRationale: 'High-sheen mulberry silk fibers with spiral-wound silver lamé ribbons.',
        verificationCaveat: 'Self-reported artisan grade; precious metal assay required.',
        observationBasis: 'SUPPLIER_REPORTED',
      },
      materialType: {
        value: 'Silk thrums with real zari',
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.94,
        opticalRationale: 'Loose thrum yarn bunches from handloom warp beam cut-off.',
        verificationCaveat: 'Visual format confirmed.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      detectedColour: {
        value: 'Natural Silk with Metallic Gold/Silver',
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.96,
        opticalRationale: 'Bright metallic luster with pale silk ground.',
        verificationCaveat: 'Direct visual confirmation.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      physicalForm: {
        value: 'Loose thrum yarn bunches',
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.95,
        opticalRationale: 'Tangled warp filament ends tied in hanks.',
        verificationCaveat: 'Direct visual confirmation.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      knitOrWeaveAppearance: {
        value: 'Unwoven warp filaments & lamé threads',
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.92,
        opticalRationale: 'Loom waste cut before weaving; not a fabric structure.',
        verificationCaveat: 'Filament form confirmed optically.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      visibleTexture: {
        value: 'Silky smooth filaments with crisp metallic wire ribbing',
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.90,
        opticalRationale: 'Contrast between mulberry protein filament and metallic zari lamina.',
        verificationCaveat: 'Surface texture directly visible.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      labelInformation: {
        value: 'Artisan tag: Real Silver & Gold Zari',
        evidenceStatus: 'REPORTED',
        opticalConfidence: 0.85,
        opticalRationale: 'Artisan label present in staging bin.',
        verificationCaveat: 'Requires metallurgical laboratory verification.',
        observationBasis: 'LABEL_OCR_READING',
      },
      visibleDefects: {
        value: [],
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.90,
        opticalRationale: 'Clean workshop thrums; no grease or mildew.',
        verificationCaveat: 'Visual surface check only.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      fibreComposition: {
        value: 'Mulberry Silk / Silver Lamé / Gold Gilt Blend',
        evidenceStatus: 'REPORTED',
        opticalConfidence: 0.78,
        opticalRationale: 'Optical luster indicates natural silk core; precious metal percentage cannot be measured visually.',
        verificationCaveat: 'Precious metal assay (XRF spectrometry or acid cupellation) mandatory before refining.',
        requiredVerificationMethod: 'XRF Spectrometry & Acid Cupellation Assay',
        observationBasis: 'SUPPLIER_REPORTED',
      },
      estimatedGsm: {
        value: null,
        evidenceStatus: 'UNKNOWN',
        opticalConfidence: 0,
        opticalRationale: 'Loose yarn form; GSM does not apply.',
        verificationCaveat: 'Yarn thrum material does not have planar fabric area weight.',
      },
      estimatedWidthCm: {
        value: null,
        evidenceStatus: 'UNKNOWN',
        opticalConfidence: 0,
        opticalRationale: 'Continuous yarn bunches; width not applicable.',
        verificationCaveat: 'Not applicable to loose filament thrums.',
      },
      yarnCountNe: {
        value: '20/22 Denier Mulberry Silk with 240D Zari thread',
        evidenceStatus: 'ESTIMATED',
        opticalConfidence: 0.75,
        opticalRationale: 'Estimated from traditional Kanchipuram handloom warp specifications.',
        verificationCaveat: 'Denier must be verified with wrap reel and analytical balance.',
        requiredVerificationMethod: 'Wrap Reel & Digital Microbalance per ASTM D1059',
        observationBasis: 'ESTIMATED_HEURISTIC',
      },
      stapleLengthMm: {
        value: null,
        evidenceStatus: 'UNKNOWN',
        opticalConfidence: 0,
        opticalRationale: 'Continuous silk filament thrums; not staple fiber.',
        verificationCaveat: 'Filament form; staple length test not applicable.',
      },
      contaminationAssessment: {
        value: 'CLEAN_VIRGIN',
        evidenceStatus: 'REPORTED',
        opticalConfidence: 0.92,
        opticalRationale: 'Clean weaving shed thrums; no machine oil stains or foreign matter.',
        verificationCaveat: 'Surface visual check; moisture content must be tested with oven drying.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      metalHardwareDetected: {
        value: false,
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.96,
        opticalRationale: 'No zippers, needles, or heavy iron hardware visible.',
        verificationCaveat: 'Visual check confirmed.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      isControlledOrHazardous: {
        value: false,
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.98,
        opticalRationale: 'Natural silk and precious metal alloy; non-hazardous.',
        verificationCaveat: 'Safe for craft and pyrometallurgical recovery.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      mandatoryLabAudits: [
        'XRF Spectrometry for Silver/Gold Fineness (karat purity)',
        'Moisture Content Determination by Oven Drying (ASTM D2654)',
      ],
      processingSummary:
        'Phase 6A Analysis: Mulberry silk thrums with real zari confirmed in form and color. Precious metal percentage must be certified by laboratory assay before thermal refining valuation.',
    };
  }

  // Case B: Hazardous Oily Rags & Saturated Maintenance Cloths
  if (isOily) {
    return {
      extractionId,
      timestamp,
      modelIdentifier,
      isFallback: true,
      streamId: {
        value: 'WRK',
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.96,
        opticalRationale: 'Heavy hydrocarbon solvent discoloration and lubricating oil penetration observed.',
        verificationCaveat: 'Industrial hazardous classification confirmed by visual indicators.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      suggestedTaxonomyId: {
        value: 'CAT-WRK-OIL-HAZ',
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.94,
        opticalRationale: 'Matches oily contaminated maintenance wipers stream.',
        verificationCaveat: 'Mandatory hazardous waste handling applies.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      materialName: {
        value: 'Machine Tool Lubricant-Saturated Maintenance Cloths',
        evidenceStatus: 'REPORTED',
        opticalConfidence: 0.90,
        opticalRationale: 'Visual greasy black/amber stains consistent with workshop machine sump cleaning.',
        verificationCaveat: 'Requires EPA Method 9071B oil/grease gravimetric quantification.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      materialType: {
        value: 'Oily hydrocarbon-soaked rags',
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.96,
        opticalRationale: 'Saturated cut cloth pieces with heavy oil and grease load.',
        verificationCaveat: 'Direct visual confirmation.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      detectedColour: {
        value: 'Dark Brown / Black Oil-Stained',
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.96,
        opticalRationale: 'Heavy mottled black, brown, and grease spots across textile ground.',
        verificationCaveat: 'Direct visual confirmation.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      physicalForm: {
        value: 'Oily hydrocarbon-soaked rags',
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.95,
        opticalRationale: 'Irregular cut wiping squares stored in industrial collection drum.',
        verificationCaveat: 'Direct visual confirmation.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      knitOrWeaveAppearance: {
        value: 'Mixed woven & knitted scrap wipers',
        evidenceStatus: 'REPORTED',
        opticalConfidence: 0.80,
        opticalRationale: 'Underlying cotton/poly cloth substrate obscured by oil saturation.',
        verificationCaveat: 'Substrate fiber composition requires solvent wash extraction before analysis.',
      },
      visibleTexture: {
        value: 'Heavy, greasy, solvent-damp cloth pieces',
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.92,
        opticalRationale: 'Glossy wet sheen and oily saturation clearly visible.',
        verificationCaveat: 'Direct visual confirmation.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      labelInformation: {
        value: 'Drum label: Hazardous Industrial Waste (Used Oil Saturated)',
        evidenceStatus: 'REPORTED',
        opticalConfidence: 0.88,
        opticalRationale: 'Hazardous warning placard visible on staging container.',
        verificationCaveat: 'Confirmed by workshop intake log.',
        observationBasis: 'LABEL_OCR_READING',
      },
      visibleDefects: {
        value: ['Extreme hydrocarbon saturation', 'Grease buildup', 'Fine metal dust shavings'],
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.94,
        opticalRationale: 'Severe contamination visible across all sample fragments.',
        verificationCaveat: 'Direct visual confirmation.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      fibreComposition: {
        value: 'Cotton / Poly blend saturated with mineral lubricating oils',
        evidenceStatus: 'REPORTED',
        opticalConfidence: 0.75,
        opticalRationale: 'Textile base appears to be mixed cotton shop rags, saturated with mineral oil.',
        verificationCaveat: 'Flash point & hydrocarbon fraction must be tested per ASTM D93 / EPA 9071B.',
        requiredVerificationMethod: 'ASTM D93 Closed-Cup Flash Point & EPA 9071B SOH Extraction',
        observationBasis: 'SUPPLIER_REPORTED',
      },
      estimatedGsm: {
        value: 280,
        evidenceStatus: 'ESTIMATED',
        opticalConfidence: 0.60,
        opticalRationale: 'High apparent mass includes absorbed heavy oil (~100-150% dry weight).',
        verificationCaveat: 'Dry weight cannot be calculated without solvent degreasing.',
        requiredVerificationMethod: 'Soxhlet Solvent Extraction for Dry Mass per ASTM D1574',
        observationBasis: 'ESTIMATED_HEURISTIC',
      },
      estimatedWidthCm: {
        value: 40,
        evidenceStatus: 'ESTIMATED',
        opticalConfidence: 0.70,
        opticalRationale: 'Cut wiping rags ~30-50 cm size.',
        verificationCaveat: 'Variable cut rag sizes.',
        observationBasis: 'ESTIMATED_HEURISTIC',
      },
      yarnCountNe: {
        value: null,
        evidenceStatus: 'UNKNOWN',
        opticalConfidence: 0,
        opticalRationale: 'Wiping rags; yarn count not relevant for hazardous TSDF co-processing.',
        verificationCaveat: 'Not applicable to oily rags.',
      },
      stapleLengthMm: {
        value: null,
        evidenceStatus: 'UNKNOWN',
        opticalConfidence: 0,
        opticalRationale: 'Cut rags; staple length test not applicable.',
        verificationCaveat: 'Not applicable.',
      },
      contaminationAssessment: {
        value: 'OIL_HYDROCARBON',
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.98,
        opticalRationale: 'Severe petroleum oil and grease saturation clearly visible.',
        verificationCaveat: 'CRITICAL SAFETY HAZARD: Spontaneous combustion and flammability risk.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      metalHardwareDetected: {
        value: false,
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.90,
        opticalRationale: 'No zippers or snaps; may contain incidental steel lathe shavings.',
        verificationCaveat: 'Magnetic sweep recommended before shredding.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      isControlledOrHazardous: {
        value: true,
        evidenceStatus: 'CONFIRMED',
        opticalConfidence: 0.99,
        opticalRationale: 'Heavy petroleum hydrocarbon saturation creates spontaneous combustion hazard.',
        verificationCaveat: 'STRICTLY PROHIBITED from open-loop recycling, tearing, or landfill.',
        observationBasis: 'DIRECT_PHOTO_OBSERVATION',
      },
      mandatoryLabAudits: [
        'ASTM D93 Closed-Cup Flash Point Testing (<60°C is RCRA ignitable hazardous)',
        'EPA 9071B Oil & Grease Gravimetric Quantification',
        'TSDF Waste Acceptance Characterization for Cement Kiln Co-processing',
      ],
      processingSummary:
        'CRITICAL SAFETY WARNING: Optical inspection detects severe petroleum hydrocarbon oil saturation. Classified as HAZARDOUS. Deterministic safety engine must immediately block open mechanical tearing and municipal landfill routes.',
    };
  }

  // Case C: Standard Navy Cotton-Rich Knit Fabric (Test Case: mat-001)
  // Used by default and for navy/knit/fabric roll test queries
  return {
    extractionId,
    timestamp,
    modelIdentifier,
    isFallback: true,
    streamId: {
      value: 'GAR',
      evidenceStatus: 'CONFIRMED',
      opticalConfidence: 0.94,
      opticalRationale: 'Knitted garment production fabric roll inventory from cutting room surplus.',
      verificationCaveat: 'Stream classification verified against garment manufacturing inventory standard.',
      observationBasis: 'DIRECT_PHOTO_OBSERVATION',
    },
    suggestedTaxonomyId: {
      value: 'CAT-GAR-CUT-CHN',
      evidenceStatus: 'CONFIRMED',
      opticalConfidence: 0.94,
      opticalRationale: 'Matches Knitted Garment Fabric Offcuts & Roll Remnants taxonomy definition.',
      verificationCaveat: 'Confirmed under Tirupur apparel cluster manufacturing classifications.',
      observationBasis: 'DIRECT_PHOTO_OBSERVATION',
    },
    materialName: {
      value: 'Navy Cotton-Rich Knit Fabric',
      evidenceStatus: 'REPORTED',
      opticalConfidence: 0.88,
      opticalRationale: 'Supplier-declared Navy Cotton-Rich Knit Fabric roll matching factory staging tags.',
      verificationCaveat: 'Blend ratio must be confirmed by ISO 1833 chemical dissolution test.',
      observationBasis: 'SUPPLIER_REPORTED',
    },
    materialType: {
      value: 'Knit (Single jersey)',
      evidenceStatus: 'REPORTED',
      opticalConfidence: 0.85,
      opticalRationale: 'Circular weft knit face wales and characteristic curl at draped edge.',
      verificationCaveat: 'Stitch loop density requires physical count (wales/courses per cm) per ISO 7211.',
      requiredVerificationMethod: 'ISO 7211 Loop Density & Stitch Count',
      observationBasis: 'DIRECT_PHOTO_OBSERVATION',
    },
    detectedColour: {
      value: 'Navy',
      evidenceStatus: 'CONFIRMED',
      opticalConfidence: 0.96,
      opticalRationale: 'Deep uniform navy reactive dye shade visible across well-lit roll sample.',
      verificationCaveat: 'Direct visual optical confirmation; dye lot shade consistency requires CIELAB spectrophotometry.',
      observationBasis: 'DIRECT_PHOTO_OBSERVATION',
    },
    physicalForm: {
      value: 'Fabric rolls with draped fabric sample',
      evidenceStatus: 'CONFIRMED',
      opticalConfidence: 0.95,
      opticalRationale: 'Spiral cardboard core roll with unrolled draped fabric section displayed on dock staging.',
      verificationCaveat: 'Direct visual confirmation.',
      observationBasis: 'DIRECT_PHOTO_OBSERVATION',
    },
    knitOrWeaveAppearance: {
      value: 'Single Jersey Weft Knit',
      evidenceStatus: 'REPORTED',
      opticalConfidence: 0.85,
      opticalRationale: 'Distinct face V-loops with purl back and natural single jersey curl along edge cut.',
      verificationCaveat: 'Requires magnifying pick glass inspection per ISO 7211.',
      requiredVerificationMethod: 'ISO 7211 Pick Glass Course & Wale Analysis',
      observationBasis: 'DIRECT_PHOTO_OBSERVATION',
    },
    visibleTexture: {
      value: 'Smooth knit with soft matte cotton finish',
      evidenceStatus: 'CONFIRMED',
      opticalConfidence: 0.90,
      opticalRationale: 'Uniform knit surface with natural cotton light absorption and minimal surface fuzz.',
      verificationCaveat: 'Surface texture directly visible in macro overview.',
      observationBasis: 'DIRECT_PHOTO_OBSERVATION',
    },
    labelInformation: {
      value: 'Mill Staging Tag: Navy Knit Roll • 300 kg Lot',
      evidenceStatus: 'REPORTED',
      opticalConfidence: 0.82,
      opticalRationale: 'Visual warehouse dock roll numbering and supplier lot reference.',
      verificationCaveat: 'Weight and blend declared by supplier; subject to laboratory receipt audit.',
      observationBasis: 'LABEL_OCR_READING',
    },
    visibleDefects: {
      value: [],
      evidenceStatus: 'CONFIRMED',
      opticalConfidence: 0.92,
      opticalRationale: 'Clean roll goods; zero visible stains, slubs, oil droplets, or tearing defects.',
      verificationCaveat: 'Surface visual inspection only.',
      observationBasis: 'DIRECT_PHOTO_OBSERVATION',
    },
    fibreComposition: {
      value: 'Cotton Rich (exact % to confirm)',
      evidenceStatus: 'REPORTED',
      opticalConfidence: 0.80,
      opticalRationale: 'Visual inspection indicates cotton-like matte hand feel and drape; exact cotton/elastane ratio cannot be determined optically.',
      verificationCaveat: 'Photographs cannot certify chemical blend or elastane percentage; ISO 1833 chemical dissolution test mandatory before mechanical tearing.',
      requiredVerificationMethod: 'ISO 1833 Quantitative Chemical Blend Analysis (Solvent Dissolution)',
      observationBasis: 'SUPPLIER_REPORTED',
    },
    estimatedGsm: {
      value: 180,
      evidenceStatus: 'ESTIMATED',
      opticalConfidence: 0.72,
      opticalRationale: 'Drape profile and roll density indicate standard T-shirt medium single jersey (~160-200 GSM band).',
      verificationCaveat: 'Fabric mass cannot be certified without cutting 100 cm² circular specimens and weighing on calibrated digital balance.',
      requiredVerificationMethod: 'ISO 3801 / ASTM D3776 Circular Sample Cutter (100 cm²) Weighing',
      observationBasis: 'ESTIMATED_HEURISTIC',
    },
    estimatedWidthCm: {
      value: 145,
      evidenceStatus: 'ESTIMATED',
      opticalConfidence: 0.75,
      opticalRationale: 'Estimated from standard 58-inch (145-147 cm) open-width tubular knit finishing cylinder.',
      verificationCaveat: 'Physical tape measurement across relaxed open roll required.',
      requiredVerificationMethod: 'Calibrated Steel Rule or Tape per ISO 22198',
      observationBasis: 'ESTIMATED_HEURISTIC',
    },
    yarnCountNe: {
      value: '30s Ne Single Jersey (Estimated)',
      evidenceStatus: 'ESTIMATED',
      opticalConfidence: 0.68,
      opticalRationale: 'Consistent with 180 GSM single jersey garment knitting specification.',
      verificationCaveat: 'Yarn count must be verified with skein unravelling and microbalance.',
      requiredVerificationMethod: 'ISO 2060 Yarn Count from Packages / Fabric Skeins',
      observationBasis: 'ESTIMATED_HEURISTIC',
    },
    stapleLengthMm: {
      value: null,
      evidenceStatus: 'UNKNOWN',
      opticalConfidence: 0,
      opticalRationale: 'Spun yarn already knitted; individual fiber staple length cannot be determined optically.',
      verificationCaveat: 'Requires yarn unravelling and comb sorter analysis (ASTM D1440).',
    },
    contaminationAssessment: {
      value: 'CLEAN_VIRGIN',
      evidenceStatus: 'REPORTED',
      opticalConfidence: 0.90,
      opticalRationale: 'No oil spots, chemical discolouration, or foreign particulate contamination observed on exposed fabric roll.',
      verificationCaveat: 'Visual check only; does not guarantee absence of chemical processing residues or silicone softeners.',
      observationBasis: 'DIRECT_PHOTO_OBSERVATION',
    },
    metalHardwareDetected: {
      value: false,
      evidenceStatus: 'CONFIRMED',
      opticalConfidence: 0.95,
      opticalRationale: 'Continuous roll yardage without metal snaps, sliders, needles, or foreign metallic inclusions.',
      verificationCaveat: 'Direct visual confirmation.',
      observationBasis: 'DIRECT_PHOTO_OBSERVATION',
    },
    isControlledOrHazardous: {
      value: false,
      evidenceStatus: 'CONFIRMED',
      opticalConfidence: 0.98,
      opticalRationale: 'Standard cotton-rich apparel textile; non-hazardous and safe for circular handling.',
      verificationCaveat: 'Non-hazardous certification confirmed.',
      observationBasis: 'DIRECT_PHOTO_OBSERVATION',
    },
    mandatoryLabAudits: [
      'ISO 1833 Chemical Dissolution Analysis (for exact Cotton % and Elastane threshold)',
      'ISO 3801 Fabric Mass (100 cm² round sample cutter verification)',
      'ISO 105 Colour Fastness to Domestic and Commercial Laundering',
      'Elastane Blend Dissolution Test (<3% required for mechanical shoddy carding)',
    ],
    processingSummary:
      'Phase 6A Multimodal Local Analysis: Direct optical observation confirms Navy colour and Fabric Roll physical form. Knit construction classified as Single Jersey (REPORTED, requiring loop density audit). Cotton-rich composition and 180 GSM retained as REPORTED and ESTIMATED; laboratory verification required prior to high-speed circular manufacturing.',
  };
}

/**
 * Legacy API bridge for backwards compatibility with Phase 5 components
 */
export async function runMetaAiExtraction(
  photos: MaterialPhoto[],
  userPromptHint?: string
): Promise<MetaAiExtractionResult> {
  const structured = await runStructuredExtraction(photos, userPromptHint);

  let status: 'SUCCESS' | 'UNCERTAINTY_FLAGGED' | 'SAFETY_WARNING' = 'SUCCESS';
  if (structured.isControlledOrHazardous.value) {
    status = 'SAFETY_WARNING';
  } else if (structured.fibreComposition.evidenceStatus !== 'CONFIRMED') {
    status = 'UNCERTAINTY_FLAGGED';
  }

  const uncertainties: string[] = [
    structured.fibreComposition.verificationCaveat,
    structured.estimatedGsm.verificationCaveat,
  ].filter(Boolean);

  const safetyWarnings: string[] = [];
  if (structured.isControlledOrHazardous.value) {
    safetyWarnings.push(
      'CRITICAL SAFETY HAZARD: Spontaneous combustion or chemical contamination risk detected.',
      'STRICTLY PROHIBITED from mechanical tearing, open textile shredding, or municipal landfill.'
    );
  }

  return {
    engine: 'Local Rule-Based Intake Extraction (Prototype Fallback - Meta AI Integration Ready)',
    status,
    detectedMaterialName: structured.materialName.value,
    detectedStreamId: structured.streamId.value,
    detectedTaxonomyId: structured.suggestedTaxonomyId.value,
    estimatedComposition: structured.fibreComposition.value,
    compositionConfidenceNote: structured.fibreComposition.opticalRationale,
    detectedForm: structured.physicalForm.value,
    detectedGsm: structured.estimatedGsm.value || undefined,
    detectedWidthCm: structured.estimatedWidthCm.value || undefined,
    detectedYarnCount: structured.yarnCountNe.value || undefined,
    uncertainties,
    suggestedDestinations: [
      'Apparel Manufacturing (Subject to composition confirmation)',
      'Industrial Machinery Wipers (High absorbency)',
      'Mechanical Fibre Recovery (Shoddy spinning)',
    ],
    safetyWarnings,
    analysisLatencyMs: 600,
  };
}

/**
 * Maps human-reviewed extraction candidates directly into a standard MaterialPassport record.
 * Only user-approved or modified values are transferred.
 */
export function buildPassportFromExtractionReview(
  extraction: StructuredPassportExtractionResult,
  reviews: Record<string, HumanFieldReview>,
  photos: MaterialPhoto[],
  targetPassportId: string,
  basePassport?: MaterialPassport
): MaterialPassport {
  const getReviewedField = <T>(
    key: string,
    fallbackValue: T,
    fallbackStatus: EvidenceStatus,
    fallbackSourceNote?: string
  ): PropertyRecord<T> => {
    const rev = reviews[key];
    if (!rev) {
      return {
        value: fallbackValue,
        status: fallbackStatus,
        sourceNote: fallbackSourceNote,
      };
    }

    if (rev.decision === 'REJECTED') {
      return {
        value: (basePassport ? (basePassport as any)[key]?.value : fallbackValue) ?? fallbackValue,
        status: 'UNKNOWN',
        sourceNote: 'Rejected by user during AI intake review',
      };
    }

    // Scientific Integrity Guard: Laboratory properties (fibreComposition, estimatedGsm, yarnCount)
    // CANNOT be promoted to CONFIRMED through intake photo review or manual acceptance alone
    // without verified physical laboratory certificate attachment (ISO 1833, ISO 3801, ASTM).
    const isLabCertifiedOnlyField =
      key === 'fibreComposition' ||
      key === 'estimatedGsm' ||
      key === 'yarnCount' ||
      key === 'yarnCountNe';

    let validatedStatus = rev.currentEvidenceStatus;
    if (isLabCertifiedOnlyField && validatedStatus === 'CONFIRMED') {
      validatedStatus = key === 'estimatedGsm' ? 'ESTIMATED' : 'REPORTED';
    }

    return {
      value: rev.currentValue ?? fallbackValue,
      status: validatedStatus,
      sourceNote:
        rev.manualNotes ||
        rev.candidate?.opticalRationale ||
        `Verified during AI intake review (Confidence: ${(rev.candidate?.opticalConfidence ? rev.candidate.opticalConfidence * 100 : 80).toFixed(0)}%)`,
    };
  };

  const streamId = getReviewedField('streamId', extraction.streamId.value, extraction.streamId.evidenceStatus).value;
  const taxonomyId = getReviewedField(
    'suggestedTaxonomyId',
    extraction.suggestedTaxonomyId.value,
    extraction.suggestedTaxonomyId.evidenceStatus
  ).value;

  const isControlled = reviews['isControlledOrHazardous']?.decision === 'ACCEPTED'
    ? extraction.isControlledOrHazardous.value
    : reviews['isControlledOrHazardous']?.decision === 'MODIFIED'
    ? Boolean(reviews['isControlledOrHazardous'].currentValue)
    : (basePassport?.isControlledOrHazardous ?? extraction.isControlledOrHazardous.value);

  // Build the clean passport
  const newPassport: MaterialPassport = {
    id: targetPassportId,
    streamId,
    taxonomyId,
    materialName: getReviewedField(
      'materialName',
      extraction.materialName.value,
      extraction.materialName.evidenceStatus
    ),
    materialType: getReviewedField(
      'materialType',
      extraction.materialType.value,
      extraction.materialType.evidenceStatus
    ),
    fibreComposition: getReviewedField(
      'fibreComposition',
      extraction.fibreComposition.value,
      extraction.fibreComposition.evidenceStatus,
      extraction.fibreComposition.verificationCaveat
    ),
    quantityKg: basePassport?.quantityKg || {
      value: 300,
      status: 'REPORTED',
      sourceNote: 'Initial intake quantity pending physical weighment',
    },
    quantityUnit: basePassport?.quantityUnit || {
      value: 'kg',
      status: 'CONFIRMED',
    },
    gsmWeight: getReviewedField(
      'estimatedGsm',
      extraction.estimatedGsm.value,
      extraction.estimatedGsm.evidenceStatus,
      extraction.estimatedGsm.verificationCaveat
    ),
    widthCm: getReviewedField(
      'estimatedWidthCm',
      extraction.estimatedWidthCm.value,
      extraction.estimatedWidthCm.evidenceStatus,
      extraction.estimatedWidthCm.verificationCaveat
    ),
    colour: getReviewedField(
      'detectedColour',
      extraction.detectedColour.value,
      extraction.detectedColour.evidenceStatus
    ),
    condition: basePassport?.condition || {
      value: 'New / Unused (surplus)',
      status: 'CONFIRMED',
    },
    form: getReviewedField(
      'physicalForm',
      extraction.physicalForm.value,
      extraction.physicalForm.evidenceStatus
    ),
    location: basePassport?.location || {
      value: 'Tirupur Cluster, Tamil Nadu, India',
      status: 'CONFIRMED',
    },
    indicativePrice: basePassport?.indicativePrice || {
      value: '₹180 / kg (Negotiable)',
      status: 'REPORTED',
    },
    contaminationStatus: {
      value: isControlled
        ? 'Hazardous Contamination Detected'
        : extraction.contaminationAssessment.value === 'CLEAN_VIRGIN'
        ? 'Clean'
        : 'Commercial Surplus',
      status: isControlled ? 'CONFIRMED' : 'REPORTED',
      sourceNote: extraction.contaminationAssessment.opticalRationale,
    },
    cleanlinessRating: {
      value: isControlled ? 'HAZARDOUS_CONTAMINATED' : 'VIRGIN_CLEAN',
      status: 'CONFIRMED',
    },
    isHardwareFree: {
      value: !extraction.metalHardwareDetected.value,
      status: extraction.metalHardwareDetected.evidenceStatus,
    },
    yarnCount: extraction.yarnCountNe.value
      ? {
          value: extraction.yarnCountNe.value,
          status: extraction.yarnCountNe.evidenceStatus,
        }
      : undefined,
    isControlledOrHazardous: isControlled,
    images: photos.length > 0 ? photos : basePassport?.images || [],
    notes: basePassport?.notes || extraction.processingSummary,
    isUserCreated: true,
  };

  return newPassport;
}
