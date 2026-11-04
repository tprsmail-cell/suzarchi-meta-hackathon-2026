import {
  DestinationFamilyId,
  RecommendationStatus,
  FourDimensionEvaluation,
  DimensionEvaluation,
  MatchingDimensionCheck,
  DestinationCatalogEntry,
} from '../types/destinations';
import { MaterialPassport, OpportunityDestination, RequirementVerdict, CheckDimension } from '../types/passport';
import { MASTER_DESTINATION_CATALOG } from '../data/destinationCatalog';
import { evaluateRegionalCorridor } from './regionalCorridors';

export interface ComprehensiveMatchResult {
  destination: OpportunityDestination;
  fourDimensions: FourDimensionEvaluation;
  catalogEntry: DestinationCatalogEntry;
}

/**
 * Evaluates Technical Compatibility (Dimension A)
 */
function evaluateTechnicalDimension(
  passport: MaterialPassport,
  target: DestinationCatalogEntry
): DimensionEvaluation {
  const checks: MatchingDimensionCheck[] = [];
  let score = 100;
  let hasBlocker = false;

  const formVal = (passport.form?.value || passport.materialType?.value || '').toLowerCase();
  const compVal = (passport.fibreComposition?.value || '').toLowerCase();
  const compStatus = passport.fibreComposition?.status || 'UNKNOWN';
  const gsmVal = passport.gsmWeight?.value;
  const gsmStatus = passport.gsmWeight?.status || 'UNKNOWN';
  const widthVal = passport.widthCm?.value;
  const isKnit = formVal.includes('knit') || (passport.materialType?.value || '').toLowerCase().includes('knit');
  const isLooseFibre = formVal.includes('loose') || formVal.includes('bale') || formVal.includes('fibre') || formVal.includes('noil');
  const isRigid = formVal.includes('rigid') || formVal.includes('cone') || formVal.includes('tube') || formVal.includes('plastic');

  // 1. Material Form Compatibility
  const isFormDirectlyCompatible = target.compatibleForms.some((f) =>
    formVal.includes(f.toLowerCase()) || f.toLowerCase().includes(formVal)
  );

  // Hard Technical Mismatches:
  // e.g. Loose unspun fibre into garment cutting
  if (isLooseFibre && (target.id === 'dest-apparel' || target.familyId === 'GARMENT_MANUFACTURING')) {
    checks.push({
      id: 'tech-form-loose-blocked',
      name: 'Material Form Requirement',
      status: 'BLOCKED',
      evidenceStatus: passport.form?.status || 'CONFIRMED',
      finding: 'Loose unspun fibre cannot be cut into garments without prior spinning and weaving/knitting',
      isHardGate: true,
    });
    hasBlocker = true;
    score = 0;
  }
  // e.g. Rigid plastic into hydropulping or garment
  else if (isRigid && (target.familyId === 'GARMENT_MANUFACTURING' || target.familyId === 'DIRECT_FABRIC_REUSE')) {
    checks.push({
      id: 'tech-form-rigid-blocked',
      name: 'Material Form Requirement',
      status: 'BLOCKED',
      evidenceStatus: passport.form?.status || 'CONFIRMED',
      finding: 'Rigid polymer cores cannot be processed by fabric cutting or apparel sewing equipment',
      isHardGate: true,
    });
    hasBlocker = true;
    score = 0;
  } else if (isFormDirectlyCompatible) {
    checks.push({
      id: 'tech-form-match',
      name: 'Material Form Compatibility',
      status: 'SATISFIED',
      evidenceStatus: passport.form?.status || 'CONFIRMED',
      finding: `Material form "${passport.form?.value || 'Recorded form'}" matches target processing intake`,
    });
  } else {
    checks.push({
      id: 'tech-form-partial',
      name: 'Material Form Adaptability',
      status: 'PENDING_VERIFICATION',
      evidenceStatus: passport.form?.status || 'REPORTED',
      finding: `Form requires pre-processing evaluation for ${target.title}`,
      requiredEvidence: 'Trial batch intake test at receiving facility',
    });
    score -= 15;
  }

  // 2. Fibre Composition Compatibility
  if (target.requiredFibreTypes && target.requiredFibreTypes.length > 0) {
    const matchesRequired = target.requiredFibreTypes.some((req) => compVal.includes(req.toLowerCase()));
    if (!matchesRequired) {
      checks.push({
        id: 'tech-fibre-mismatch',
        name: 'Required Polymer / Fibre Matrix',
        status: 'BLOCKED',
        evidenceStatus: compStatus,
        finding: `Destination requires ${target.requiredFibreTypes.join(' or ')}, but material is declared as ${passport.fibreComposition.value}`,
        isHardGate: true,
      });
      hasBlocker = true;
      score = 0;
    } else {
      checks.push({
        id: 'tech-fibre-match',
        name: 'Required Fibre Matrix',
        status: 'SATISFIED',
        evidenceStatus: compStatus,
        finding: `Matches destination required fibre class (${target.requiredFibreTypes.join('/')})`,
      });
    }
  }

  // 3. Weight / GSM Check (where relevant)
  if (target.minGsm !== undefined && target.maxGsm !== undefined) {
    if (gsmVal !== null && gsmVal !== undefined) {
      if (gsmVal >= target.minGsm && gsmVal <= target.maxGsm) {
        checks.push({
          id: 'tech-gsm-fit',
          name: 'Fabric Areal Weight (GSM)',
          status: 'SATISFIED',
          evidenceStatus: gsmStatus,
          finding: `Measured weight (~${gsmVal} GSM) is within optimal ${target.minGsm}-${target.maxGsm} g/m² operating band`,
        });
      } else {
        checks.push({
          id: 'tech-gsm-out-of-bounds',
          name: 'Fabric Areal Weight (GSM)',
          status: 'PENDING_VERIFICATION',
          evidenceStatus: gsmStatus,
          finding: `Weight (${gsmVal} GSM) is outside primary standard band (${target.minGsm}-${target.maxGsm} GSM)`,
          requiredEvidence: 'Sample trial required to verify downstream feeder tolerance',
        });
        score -= 20;
      }
    } else {
      checks.push({
        id: 'tech-gsm-unknown',
        name: 'Fabric Areal Weight (GSM)',
        status: 'PENDING_VERIFICATION',
        evidenceStatus: 'UNKNOWN',
        finding: 'Fabric weight is unmeasured; physical balance test required before pattern cutting',
        requiredEvidence: 'ISO 3801 / ASTM D3776 100cm² round cutter test',
      });
      score -= 25;
    }
  }

  // 4. Width and Dimension Feasibility (where relevant)
  if (target.minWidthCm !== undefined) {
    if (widthVal !== null && widthVal !== undefined) {
      if (widthVal >= target.minWidthCm) {
        checks.push({
          id: 'tech-width-fit',
          name: 'Cuttable Width',
          status: 'SATISFIED',
          evidenceStatus: passport.widthCm?.status || 'ESTIMATED',
          finding: `Width (~${widthVal} cm) satisfies minimum ${target.minWidthCm} cm cutting marker threshold`,
        });
      } else {
        checks.push({
          id: 'tech-width-narrow',
          name: 'Cuttable Width',
          status: 'PENDING_VERIFICATION',
          evidenceStatus: passport.widthCm?.status || 'REPORTED',
          finding: `Remnant width (${widthVal} cm) is below standard ${target.minWidthCm} cm marker layout`,
          requiredEvidence: 'Marker yield optimization layout test',
        });
        score -= 15;
      }
    }
  }

  const finalScore = Math.max(0, Math.min(100, hasBlocker ? 0 : score));
  let status: 'PASSED' | 'CONDITIONALLY_PASSED' | 'VERIFICATION_REQUIRED' | 'BLOCKED' | 'INSUFFICIENT_DATA' =
    hasBlocker ? 'BLOCKED' : finalScore >= 80 ? 'PASSED' : finalScore >= 50 ? 'CONDITIONALLY_PASSED' : 'VERIFICATION_REQUIRED';

  return {
    status,
    score: finalScore,
    summary: hasBlocker
      ? 'Hard technical mismatch blocks physical intake for this application.'
      : finalScore >= 80
      ? 'Substrate construction, form, and physical properties match technical processing requirements.'
      : 'Technically viable but key physical parameters (GSM or width) require verification.',
    checks,
  };
}

/**
 * Evaluates Safety Eligibility (Dimension B) - MANDATORY HARD GATE
 */
function evaluateSafetyDimension(
  passport: MaterialPassport,
  target: DestinationCatalogEntry
): DimensionEvaluation {
  const checks: MatchingDimensionCheck[] = [];
  let isBlocked = false;
  let restrictionReasons: string[] = [];

  const contamText = (passport.contaminationStatus?.value || '').toLowerCase();
  const cleanVal = (passport.cleanlinessRating?.value || '').toUpperCase();
  const notesText = (passport.notes || '').toLowerCase();
  const streamId = passport.streamId || '';

  // 1. Petroleum Oils, Greases & Solvent Contamination
  const hasPetroleum =
    passport.isControlledOrHazardous === true ||
    contamText.includes('oil') ||
    contamText.includes('grease') ||
    contamText.includes('petroleum') ||
    contamText.includes('lubricant') ||
    cleanVal.includes('HAZARDOUS');

  if (hasPetroleum) {
    // If target is cement kiln co-processing (TSDF) or authorized solvent laundry, this is compliant!
    if (target.id === 'dest-tsdf-cement') {
      checks.push({
        id: 'safety-hazardous-tsdf',
        name: 'Regulated Waste Authorization',
        status: 'SATISFIED',
        evidenceStatus: passport.contaminationStatus?.status || 'CONFIRMED',
        finding: 'High calorific organic hydrocarbon content complies with authorized cement kiln fuel substitution criteria (>3,000 kcal/kg)',
      });
    } else {
      // For all consumer, apparel, domestic wiping, and shoddy recycling: BLOCKED!
      const blockReason = target.familyId === 'MECHANICAL_FIBRE_OPENING'
        ? 'SEVERE FIRE & EXPLOSION RISK: Frictional sparks generated by high-speed garnett wire teeth ignite volatile hydrocarbon vapors'
        : 'TOXIC CONTAMINATION: Petroleum lubricants and heavy metals are strictly prohibited in consumer apparel and skin-contact textiles';

      checks.push({
        id: 'safety-petroleum-hazard-blocked',
        name: 'Hazardous Hydrocarbon Exclusion',
        status: 'BLOCKED',
        evidenceStatus: 'CONFIRMED',
        finding: blockReason,
        isHardGate: true,
      });
      isBlocked = true;
      restrictionReasons.push(blockReason);
    }
  }

  // 2. Biological / Potentially Infectious History (Hospital / Healthcare stream MED)
  const isHospitalSource =
    streamId === 'MED' ||
    (passport.taxonomyId || '').startsWith('CAT-MED') ||
    contamText.includes('hospital') ||
    contamText.includes('infectious') ||
    contamText.includes('biohazard') ||
    notesText.includes('hospital');

  if (isHospitalSource) {
    const isCertifiedSanitized =
      passport.cleanlinessRating?.value === 'VIRGIN_CLEAN' &&
      passport.cleanlinessRating?.status === 'CONFIRMED' &&
      contamText.includes('sanitized');

    if (!isCertifiedSanitized && target.id !== 'dest-tsdf-cement') {
      const bioReason =
        'BIOHAZARD RESTRICTION: Textiles with hospital exposure history are legally prohibited from open consumer reuse without physical autoclave certification';
      checks.push({
        id: 'safety-biohazard-blocked',
        name: 'Infectious Biohazard Screening',
        status: 'BLOCKED',
        evidenceStatus: passport.cleanlinessRating?.status || 'REPORTED',
        finding: bioReason,
        isHardGate: true,
      });
      isBlocked = true;
      restrictionReasons.push(bioReason);
    } else if (isCertifiedSanitized) {
      checks.push({
        id: 'safety-biohazard-sanitized',
        name: 'Hospital Sanitization Audit',
        status: 'SATISFIED',
        evidenceStatus: 'CONFIRMED',
        finding: 'Commercial high-temperature sanitization validated with zero pathogenic residue',
      });
    }
  }

  // 3. Foreign Metal Hardware & Metallic Abrasives
  const hasMetalHardware =
    passport.isHardwareFree?.value === false ||
    contamText.includes('metal') ||
    contamText.includes('zipper') ||
    contamText.includes('rivet') ||
    contamText.includes('zari');

  if (hasMetalHardware) {
    if (target.id === 'dest-wiping') {
      const metalScratchReason =
        'SURFACE SAFETY HAZARD: Metallic threads or foreign hardware act as abrasives that scratch precision machinery bearings and lathe shafts';
      checks.push({
        id: 'safety-metal-wiping-blocked',
        name: 'Abrasive Hardware Exclusion',
        status: 'BLOCKED',
        evidenceStatus: 'CONFIRMED',
        finding: metalScratchReason,
        isHardGate: true,
      });
      isBlocked = true;
      restrictionReasons.push(metalScratchReason);
    } else if (target.familyId === 'MECHANICAL_FIBRE_OPENING') {
      const wireBreakReason =
        'MACHINERY SAFETY: Unremoved metal fasteners break spiked carding cylinders and trigger ignition sparks in blowroom chutes';
      checks.push({
        id: 'safety-metal-shoddy-blocked',
        name: 'Garnett Wire Spark Protection',
        status: 'BLOCKED',
        evidenceStatus: 'CONFIRMED',
        finding: wireBreakReason,
        isHardGate: true,
      });
      isBlocked = true;
      restrictionReasons.push(wireBreakReason);
    }
  }

  // 4. Cleanliness & Contamination Verification (DEF-001 & Phase 1.2: Precautionary Principle)
  if (!isBlocked && checks.length === 0) {
    const chemFinishText = (passport.chemicalFinishes?.value || '').toLowerCase();
    const isSafetyUnverified =
      passport.isControlledOrHazardous === null ||
      (passport.cleanlinessRating && passport.cleanlinessRating.status === 'UNKNOWN') ||
      (passport.contaminationStatus && passport.contaminationStatus.status === 'UNKNOWN') ||
      (passport.chemicalFinishes && passport.chemicalFinishes.status === 'UNKNOWN') ||
      contamText.includes('unknown') ||
      contamText.includes('unverified') ||
      chemFinishText.includes('unverified') ||
      chemFinishText.includes('unknown') ||
      notesText.includes('chemical safety not confirmed') ||
      (notesText.includes('peach finish') && !notesText.includes('lab verified'));

    const hasKnownCleanliness =
      !isSafetyUnverified &&
      ((passport.cleanlinessRating &&
        passport.cleanlinessRating.status !== 'UNKNOWN' &&
        passport.cleanlinessRating.value &&
        passport.cleanlinessRating.value.trim().toUpperCase() !== 'UNKNOWN') ||
      (passport.contaminationStatus &&
        passport.contaminationStatus.status !== 'UNKNOWN' &&
        passport.contaminationStatus.value &&
        !['UNKNOWN', 'CONTAMINATED'].includes(passport.contaminationStatus.value.trim().toUpperCase())));

    if (hasKnownCleanliness) {
      checks.push({
        id: 'safety-cleanliness-pass',
        name: 'Sanitary & Cleanliness Compliance',
        status: 'SATISFIED',
        evidenceStatus: passport.cleanlinessRating?.status || passport.contaminationStatus?.status || 'REPORTED',
        finding: 'Visual review and supplier records confirm material is free from hazardous chemicals and biological contaminants',
      });
    } else {
      // DEF-001: Missing or unknown contamination evidence must NEVER receive automatic clearance
      checks.push({
        id: 'safety-cleanliness-unverified',
        name: 'Sanitary & Cleanliness Compliance',
        status: 'PENDING_VERIFICATION',
        evidenceStatus: 'UNKNOWN',
        finding: 'Contamination and chemical safety data missing or unverified; visual inspection and sanitization audit required before clearance.',
        requiredEvidence: 'Supplier sanitary declaration, wash lot certificate, or accredited chemical purity screening',
        isHardGate: false,
      });
    }
  }

  const hasPendingSafety = checks.some((c) => c.status === 'PENDING_VERIFICATION');

  if (isBlocked) {
    return {
      status: 'BLOCKED',
      score: 0,
      summary: `HARD SAFETY FAILURE: ${restrictionReasons.join('; ')}`,
      checks,
    };
  }

  if (hasPendingSafety) {
    return {
      status: 'VERIFICATION_REQUIRED',
      score: 45, // Revision 2.1 threshold: strictly <= 50 for unknown-evidence case
      summary: 'INSUFFICIENT SAFETY EVIDENCE: Chemical and contamination status unverified. Facility sanitization and chemical review required.',
      checks,
    };
  }

  return {
    status: 'PASSED',
    score: 100,
    summary: 'Material passes all biological, petroleum, chemical, and foreign object safety criteria.',
    checks,
  };
}

/**
 * Evaluates Evidence Completeness (Dimension C)
 */
function evaluateEvidenceDimension(
  passport: MaterialPassport,
  target: DestinationCatalogEntry
): DimensionEvaluation {
  const checks: MatchingDimensionCheck[] = [];
  let score = 100;

  // 1. Fibre Composition Verification
  const compStatus = passport.fibreComposition.status;
  if (compStatus === 'CONFIRMED') {
    checks.push({
      id: 'evid-comp-confirmed',
      name: 'Fibre Composition Evidence',
      status: 'SATISFIED',
      evidenceStatus: 'CONFIRMED',
      finding: 'Supported by third-party laboratory test certificate (ISO 1833 chemical blend analysis)',
    });
  } else if (compStatus === 'REPORTED') {
    checks.push({
      id: 'evid-comp-reported',
      name: 'Fibre Composition Evidence',
      status: 'PENDING_VERIFICATION',
      evidenceStatus: 'REPORTED',
      finding: 'Self-reported by supplier or tag only. Laboratory blend verification required before commercial spinning or pattern cutting.',
      requiredEvidence: 'ISO 1833-1 Quantitative chemical analysis',
    });
    score -= 25;
  } else {
    checks.push({
      id: 'evid-comp-unknown',
      name: 'Fibre Composition Evidence',
      status: 'PENDING_VERIFICATION',
      evidenceStatus: compStatus,
      finding: 'Fibre composition is unverified or estimated from visual inspection alone.',
      requiredEvidence: 'ISO 1833 laboratory certificate',
    });
    score -= 40;
  }

  // 2. Weight / GSM Evidence (for fabric destinations)
  if (target.minGsm !== undefined) {
    const gsmStatus = passport.gsmWeight.status;
    if (gsmStatus === 'CONFIRMED') {
      checks.push({
        id: 'evid-gsm-confirmed',
        name: 'Areal Weight Evidence (GSM)',
        status: 'SATISFIED',
        evidenceStatus: 'CONFIRMED',
        finding: 'Measured with calibrated round sample cutter and analytical balance (ISO 3801)',
      });
    } else if (gsmStatus === 'ESTIMATED') {
      checks.push({
        id: 'evid-gsm-estimated',
        name: 'Areal Weight Evidence (GSM)',
        status: 'PENDING_VERIFICATION',
        evidenceStatus: 'ESTIMATED',
        finding: 'Estimated from visual drape or label tag. Physical measurement required.',
        requiredEvidence: 'ASTM D3776 GSM balance check',
      });
      score -= 15;
    } else {
      checks.push({
        id: 'evid-gsm-unknown',
        name: 'Areal Weight Evidence (GSM)',
        status: 'PENDING_VERIFICATION',
        evidenceStatus: 'UNKNOWN',
        finding: 'Fabric weight completely unrecorded.',
        requiredEvidence: 'Physical GSM measurement',
      });
      score -= 25;
    }
  }

  // 3. Contamination & Cleanliness Documentation
  const contamStatus = passport.contaminationStatus?.status || 'UNKNOWN';
  if (passport.isControlledOrHazardous) {
    if (contamStatus === 'CONFIRMED') {
      checks.push({
        id: 'evid-hazard-manifest',
        name: 'Hazardous Waste Documentation',
        status: 'SATISFIED',
        evidenceStatus: 'CONFIRMED',
        finding: 'State Pollution Control Board (SPCB) Form-10 Hazardous Waste Manifest on file',
      });
    } else {
      checks.push({
        id: 'evid-hazard-pending',
        name: 'Hazardous Waste Documentation',
        status: 'PENDING_VERIFICATION',
        evidenceStatus: 'REPORTED',
        finding: 'Regulatory manifest documentation must be executed prior to transport',
        requiredEvidence: 'SPCB Form-10 Consignment note',
      });
      score -= 30;
    }
  }

  const finalScore = Math.max(20, Math.min(100, score));
  let status: 'PASSED' | 'CONDITIONALLY_PASSED' | 'VERIFICATION_REQUIRED' | 'BLOCKED' | 'INSUFFICIENT_DATA' =
    finalScore >= 85 ? 'PASSED' : finalScore >= 60 ? 'CONDITIONALLY_PASSED' : 'VERIFICATION_REQUIRED';

  return {
    status,
    score: finalScore,
    summary: finalScore >= 85
      ? 'All critical technical parameters are supported by verified laboratory or scale documentation.'
      : 'Key properties rely on self-declarations or visual estimates; physical laboratory testing required before dispatch.',
    checks,
  };
}

/**
 * Evaluates Commercial Suitability (Dimension D)
 */
function evaluateCommercialDimension(
  passport: MaterialPassport,
  target: DestinationCatalogEntry
): DimensionEvaluation {
  const checks: MatchingDimensionCheck[] = [];
  let score = 90;

  const qty = passport.quantityKg.value || 0;
  const minQty = target.minQuantityKg || 50;

  // 1. Lot Quantity Feasibility
  if (qty >= minQty * 2) {
    checks.push({
      id: 'comm-qty-bulk',
      name: 'Batch Volume Feasibility',
      status: 'SATISFIED',
      evidenceStatus: passport.quantityKg.status,
      finding: `Available quantity (${qty} ${passport.quantityUnit?.value || 'kg'}) provides commercial batch scale (> ${minQty} kg threshold)`,
    });
  } else if (qty >= minQty) {
    checks.push({
      id: 'comm-qty-sufficient',
      name: 'Batch Volume Feasibility',
      status: 'SATISFIED',
      evidenceStatus: passport.quantityKg.status,
      finding: `Batch size (${qty} kg) meets minimum processing threshold (${minQty} kg)`,
    });
    score -= 10;
  } else {
    checks.push({
      id: 'comm-qty-small',
      name: 'Batch Volume Feasibility',
      status: 'PENDING_VERIFICATION',
      evidenceStatus: passport.quantityKg.status,
      finding: `Quantity (${qty} kg) is below standard industrial minimum (${minQty} kg); suitable for small craft or capsular runs only`,
      requiredEvidence: 'Consolidation with similar lots recommended',
    });
    score -= 30;
  }

  // 2. Preparation & Segregation Effort
  if (target.processingRequirements.length > 2) {
    checks.push({
      id: 'comm-prep-effort',
      name: 'Material Handling Complexity',
      status: 'PENDING_VERIFICATION',
      evidenceStatus: 'REPORTED',
      finding: `Requires manual preparation: ${target.processingRequirements.slice(0, 2).join(', ')}`,
    });
    score -= 10;
  } else {
    checks.push({
      id: 'comm-prep-low',
      name: 'Material Handling Complexity',
      status: 'SATISFIED',
      evidenceStatus: 'CONFIRMED',
      finding: 'Direct intake with minimal sorting or handling overhead',
    });
  }

  const finalScore = Math.max(25, Math.min(100, score));
  let status: 'PASSED' | 'CONDITIONALLY_PASSED' | 'VERIFICATION_REQUIRED' | 'BLOCKED' | 'INSUFFICIENT_DATA' =
    finalScore >= 75 ? 'PASSED' : 'CONDITIONALLY_PASSED';

  return {
    status,
    score: finalScore,
    summary: finalScore >= 75
      ? 'Batch size and logistics complexity align with established regional recycling and manufacturing buyers.'
      : 'Economically viable but handling overhead or small lot volume may constrain commercial margins.',
    checks,
  };
}

/**
 * Master Phase 7 Matching Function
 * Evaluates all 4 dimensions, applies the hard safety gate, and produces an explainable OpportunityDestination
 */
export function evaluateDestinationForPassport(
  passport: MaterialPassport,
  catalogEntry: DestinationCatalogEntry,
  index: number
): ComprehensiveMatchResult {
  const technical = evaluateTechnicalDimension(passport, catalogEntry);
  const safety = evaluateSafetyDimension(passport, catalogEntry);
  const evidence = evaluateEvidenceDimension(passport, catalogEntry);
  const commercial = evaluateCommercialDimension(passport, catalogEntry);

  const regional = evaluateRegionalCorridor(passport, catalogEntry.id);

  // Four Dimension Evaluation Object
  const fourDimensions: FourDimensionEvaluation = {
    technicalCompatibility: technical,
    safetyEligibility: safety,
    evidenceCompleteness: evidence,
    commercialSuitability: commercial,
  };

  // Determine Overall Recommendation Status & Gating
  let recommendationStatus: RecommendationStatus;
  let matchScore: number;
  let badgeText: string;
  let colorTheme: 'green' | 'blue' | 'purple' | 'mauve' | 'amber';
  let eligibilityReason: string | undefined;

  // HARD SAFETY FAILURE OVERRIDE
  if (safety.status === 'BLOCKED') {
    recommendationStatus = 'NOT_ELIGIBLE';
    matchScore = 0;
    badgeText = 'Disqualified';
    colorTheme = 'amber';
    eligibilityReason = safety.summary;
  }
  // HARD TECHNICAL MISMATCH OVERRIDE
  else if (technical.status === 'BLOCKED') {
    recommendationStatus = 'NOT_ELIGIBLE';
    matchScore = 0;
    badgeText = 'Incompatible';
    colorTheme = 'mauve';
    eligibilityReason = technical.summary;
  }
  // INSUFFICIENT DATA
  else if (passport.materialName.status === 'UNKNOWN' && passport.fibreComposition.status === 'UNKNOWN') {
    recommendationStatus = 'INSUFFICIENT_DATA';
    matchScore = 25;
    badgeText = 'Data Needed';
    colorTheme = 'mauve';
    eligibilityReason = 'Core material properties missing; laboratory identification required';
  }
  // VERIFICATION REQUIRED (Evidence gap on critical property or unverified safety)
  else if (safety.status === 'VERIFICATION_REQUIRED' || evidence.status === 'VERIFICATION_REQUIRED' || passport.fibreComposition.status !== 'CONFIRMED') {
    recommendationStatus = 'VERIFICATION_REQUIRED';
    // Dynamic weighted score: Tech 40%, Evidence 30%, Comm 20%, Regional 10%
    const computed = Math.round(
      technical.score * 0.4 + evidence.score * 0.3 + commercial.score * 0.2 + (regional.transportFeasibility === 'HIGH' ? 10 : 5)
    );
    // DEF-001 / Revision 2.1: If safety verification is required, match score is capped at 50
    matchScore = safety.status === 'VERIFICATION_REQUIRED'
      ? Math.min(50, Math.max(30, computed))
      : Math.min(84, Math.max(30, computed));
    badgeText = 'Conditional Match';
    colorTheme = index === 1 ? 'green' : 'blue';
    eligibilityReason = safety.status === 'VERIFICATION_REQUIRED'
      ? safety.summary
      : (evidence.checks.find((c) => c.status === 'PENDING_VERIFICATION')?.finding || 'Laboratory certification required');
  }
  // CONDITIONALLY ELIGIBLE
  else if (technical.status === 'CONDITIONALLY_PASSED' || commercial.status === 'CONDITIONALLY_PASSED') {
    recommendationStatus = 'CONDITIONALLY_ELIGIBLE';
    const computed = Math.round(
      technical.score * 0.4 + evidence.score * 0.3 + commercial.score * 0.2 + (regional.transportFeasibility === 'HIGH' ? 10 : 5)
    );
    matchScore = Math.min(88, Math.max(40, computed));
    badgeText = 'Viable Option';
    colorTheme = 'blue';
  }
  // FULLY ELIGIBLE
  else {
    recommendationStatus = 'ELIGIBLE';
    const computed = Math.round(
      technical.score * 0.4 + evidence.score * 0.3 + commercial.score * 0.2 + (regional.transportFeasibility === 'HIGH' ? 10 : 5)
    );
    matchScore = Math.min(96, Math.max(80, computed));
    badgeText = index === 1 ? 'Best Match' : 'High Fit';
    colorTheme = 'green';
  }

  // Collect consolidated checks across all 4 dimensions
  const compatibilityChecks: OpportunityDestination['checks'] = [
    ...technical.checks.map((c) => ({
      id: c.id,
      propertyChecked: c.name,
      label: `${c.name}: ${c.status === 'SATISFIED' ? 'Compatible' : c.status === 'BLOCKED' ? 'Incompatible' : 'To Verify'}`,
      verdict: (c.status === 'SATISFIED' ? 'SATISFIED' : c.status === 'BLOCKED' ? 'BLOCKED' : 'PENDING_VERIFICATION') as RequirementVerdict,
      note: c.finding,
      dimension: 'TECHNICAL' as CheckDimension,
    })),
    ...safety.checks.map((c) => ({
      id: c.id,
      propertyChecked: c.name,
      label: `${c.name}: ${c.status === 'SATISFIED' ? 'Passed' : 'Blocked'}`,
      verdict: (c.status === 'SATISFIED' ? 'SATISFIED' : 'BLOCKED') as RequirementVerdict,
      note: c.finding,
      dimension: 'SAFETY' as CheckDimension,
    })),
    ...evidence.checks.map((c) => ({
      id: c.id,
      propertyChecked: c.name,
      label: `${c.name}: ${c.status === 'SATISFIED' ? 'Confirmed' : 'Pending Lab'}`,
      verdict: (c.status === 'SATISFIED' ? 'SATISFIED' : 'PENDING_VERIFICATION') as RequirementVerdict,
      note: c.finding,
      dimension: 'EVIDENCE' as CheckDimension,
    })),
    ...commercial.checks.map((c) => ({
      id: c.id,
      propertyChecked: c.name,
      label: `${c.name}: ${c.status === 'SATISFIED' ? 'Suitable' : 'Limited'}`,
      verdict: (c.status === 'SATISFIED' ? 'SATISFIED' : 'PENDING_VERIFICATION') as RequirementVerdict,
      note: c.finding,
      dimension: 'COMMERCIAL' as CheckDimension,
    })),
  ];

  // Missing evidence and laboratory verifications
  const missingEvidenceList: string[] = [];
  const requiredVerificationChecklist: string[] = [...catalogEntry.requiredLaboratoryStandards];

  for (const c of [...technical.checks, ...evidence.checks, ...commercial.checks]) {
    if (c.status === 'PENDING_VERIFICATION' && c.requiredEvidence) {
      missingEvidenceList.push(c.requiredEvidence);
      if (!requiredVerificationChecklist.includes(c.requiredEvidence)) {
        requiredVerificationChecklist.push(c.requiredEvidence);
      }
    }
  }

  const destination: OpportunityDestination = {
    id: catalogEntry.id,
    index,
    title: catalogEntry.title,
    badgeText,
    matchScore,
    colorTheme,
    thumbnailTitle: catalogEntry.familyName,
    thumbnailEmoji: catalogEntry.thumbnailEmoji,
    checks: compatibilityChecks,
    rationale: catalogEntry.description,
    actionLabel: catalogEntry.defaultActionLabel,
    actionCount: catalogEntry.defaultActionCount,
    mandatoryVerifications: requiredVerificationChecklist.slice(0, 3),
    eligibilityState: safety.status === 'BLOCKED'
      ? 'DISQUALIFIED_SAFETY'
      : technical.status === 'BLOCKED'
      ? 'INCOMPATIBLE_TECHNICAL'
      : recommendationStatus === 'ELIGIBLE'
      ? 'QUALIFIED'
      : 'CONDITIONALLY_VIABLE',
    eligibilityReason,
    technicalCompatibility: technical.status === 'BLOCKED' ? 'INCOMPATIBLE' : 'COMPATIBLE',
    safetyEligibility: safety.status === 'BLOCKED' ? 'BLOCKED' : 'PASSED',
    evidenceCompleteness: evidence.status === 'PASSED' ? 'CONFIRMED' : 'PENDING_VERIFICATION',
    commercialSuitability: commercial.status === 'PASSED' ? 'VIABLE' : 'LIMITED',
    technicalFitScore: technical.score,
    evidenceCompletenessScore: evidence.score,
    safetyPassed: safety.status !== 'BLOCKED',

    // Phase 7 Rich Metadata
    familyId: catalogEntry.familyId,
    recommendationStatus,
    fourDimensions,
    regionalCorridor: regional,
    missingEvidenceList,
    requiredVerificationChecklist,
    rejectionOrRestrictionReasons: safety.status === 'BLOCKED' ? [safety.summary] : technical.status === 'BLOCKED' ? [technical.summary] : undefined,
  };

  return {
    destination,
    fourDimensions,
    catalogEntry,
  };
}
