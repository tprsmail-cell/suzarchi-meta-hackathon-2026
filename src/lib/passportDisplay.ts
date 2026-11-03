import { MaterialPassport, EvidenceStatus } from '@/types/passport';

export interface CategoryTechnicalSpec {
  label: string;
  value: string;
  status: EvidenceStatus;
  note?: string;
}

/**
 * Returns stream-appropriate technical specifications for a material passport,
 * avoiding inappropriate fabric fields (GSM/width) leaking into raw fibre, packaging, or wipers.
 */
export function getCategoryTechnicalSpecs(
  passport: MaterialPassport,
  formatLengthDisplay: (cm: number | null | undefined) => string
): CategoryTechnicalSpec[] {
  const stream = passport.streamId || '';
  const taxId = passport.taxonomyId || '';

  // 1. Raw Fibre / Spinning / Ginning / Agriculture
  if (stream === 'SPN' || stream === 'GIN' || stream === 'AGR' || taxId.includes('SPN') || taxId.includes('FBR')) {
    const specs: CategoryTechnicalSpec[] = [];
    if (passport.stapleLengthMm?.value) {
      specs.push({
        label: 'Staple Length',
        value: `${passport.stapleLengthMm.value} mm`,
        status: passport.stapleLengthMm.status,
        note: passport.stapleLengthMm.sourceNote || 'Fibre staple length analysis',
      });
    } else {
      specs.push({
        label: 'Fibre Type',
        value: passport.materialType.value.split(' ')[0] || 'Virgin Cotton',
        status: passport.materialType.status,
      });
    }

    if (passport.trashPercentage?.value !== undefined) {
      specs.push({
        label: 'Trash %',
        value: `${passport.trashPercentage.value}%`,
        status: passport.trashPercentage.status,
        note: passport.trashPercentage.sourceNote || 'Non-lint trash content separator test',
      });
    } else {
      specs.push({
        label: 'Fibre Grade',
        value: 'Short Staple (< 28mm)',
        status: 'CONFIRMED',
      });
    }
    return specs;
  }

  // 2. Rigid Packaging & Carrier Cores
  if (stream === 'PKG' || taxId.includes('COR') || passport.coneCarrierType) {
    return [
      {
        label: 'Resin Type',
        value: passport.fibreComposition.value.includes('Polypropylene')
          ? 'PP (Resin Code 5)'
          : passport.fibreComposition.value.split(' ')[0],
        status: passport.fibreComposition.status,
        note: 'High-density injection moulded polymer',
      },
      {
        label: 'Carrier Core',
        value: passport.coneCarrierType?.value || 'Perforated 170mm',
        status: passport.coneCarrierType?.status || 'CONFIRMED',
        note: passport.condition.value,
      },
    ];
  }

  // 3. Workshop & Wiping Cloths
  if (stream === 'WRK' || taxId.includes('WRK') || passport.absorbencyRating || passport.isControlledOrHazardous) {
    return [
      {
        label: 'Absorbency',
        value:
          passport.absorbencyRating?.value === 'HIGH_INSTANT_ABSORB'
            ? 'High Absorbency'
            : passport.absorbencyRating?.value || 'Grease Absorbent',
        status: passport.absorbencyRating?.status || 'CONFIRMED',
      },
      {
        label: 'Hazard / Safety',
        value: passport.isControlledOrHazardous ? 'Regulated Hazardous' : passport.isHardwareFree?.value ? 'Hardware-Free' : 'Visual Inspect',
        status: passport.isHardwareFree?.status || 'CONFIRMED',
      },
    ];
  }

  // 4. Yarn & Handloom Warp / Brocade
  if (stream === 'YRN' || stream === 'HLM' || taxId.includes('YRN') || taxId.includes('HLM') || passport.yarnCount) {
    return [
      {
        label: 'Yarn Count / Structure',
        value: passport.yarnCount?.value || (stream === 'HLM' ? 'Paavu Warp Ends' : 'Spun Filament'),
        status: passport.yarnCount?.status || 'CONFIRMED',
      },
      {
        label: passport.widthCm?.value ? 'Remnant Width' : 'Selvedge / Core',
        value: passport.widthCm?.value
          ? formatLengthDisplay(passport.widthCm.value)
          : 'Narrow ribbon',
        status: passport.widthCm?.status || 'CONFIRMED',
      },
    ];
  }

  // 5. Healthcare & Medical Controlled Textiles (Stream 17)
  if (stream === 'MED' || taxId.includes('MED')) {
    return [
      {
        label: 'Clinical Grade',
        value: passport.isControlledOrHazardous ? 'Biohazard (Controlled)' : 'Sanitized Linen',
        status: passport.cleanlinessRating?.status || 'CONFIRMED',
      },
      {
        label: 'Infection Safety',
        value: passport.isControlledOrHazardous ? 'Mandatory Autoclave/TSDF' : 'Eligible Internal Repurpose',
        status: 'CONFIRMED',
      },
    ];
  }

  // 6. Dyeing, Printing & Wet Processing Residues (Streams 06, 07, 16)
  if (stream === 'WET' || stream === 'FNS' || stream === 'PRN' || taxId.includes('DYE') || taxId.includes('PRN')) {
    return [
      {
        label: 'Chemical Finish',
        value: passport.chemicalFinishes?.value || 'Reactive Dyestuff',
        status: passport.chemicalFinishes?.status || 'REPORTED',
      },
      {
        label: 'Process Form',
        value: passport.form.value.split(' ')[0] || 'Roll strike-off',
        status: passport.form.status || 'CONFIRMED',
      },
    ];
  }

  // 7. Fabric, Knit, Garment, Hospitality, Home Textiles (Default Fabric Streams)
  return [
    {
      label: 'Estimated GSM',
      value: passport.gsmWeight?.value ? `${passport.gsmWeight.value} GSM` : 'Unknown',
      status: passport.gsmWeight?.status || 'UNKNOWN',
      note: passport.gsmWeight?.sourceNote,
    },
    {
      label: 'Width',
      value: passport.widthCm?.value ? formatLengthDisplay(passport.widthCm.value) : 'Variable scrap',
      status: passport.widthCm?.status || 'UNKNOWN',
      note: passport.widthCm?.sourceNote,
    },
  ];
}
