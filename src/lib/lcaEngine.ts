import { MaterialPassport } from '@/types/passport';

export interface LcaImpactResult {
  co2AvoidedKg: number;
  waterSavedLitres: number;
  energySavedKwh: number;
  landfillDivertedKg: number;
  isIllustrativeBenchmark: boolean;
  uncertaintyPercentage: number;
  methodologyDescription: string;
  sourceReferences: string[];
  assumptions: string[];
}

/**
 * Calculates empirical Scope 3 avoided impacts based on material stream and fiber composition.
 * Differentiates natural cellulosic fibers (cotton), protein fibers (silk), rigid polymers (PP), and hazardous TSDF waste.
 */
export function calculateLcaImpact(passport: MaterialPassport): LcaImpactResult {
  const weightKg = passport.quantityKg?.value || 0;
  const stream = passport.streamId || '';
  const taxId = passport.taxonomyId || '';
  const isHazardous = passport.isControlledOrHazardous === true;

  // Case 1: Hazardous Industrial Waste (TSDF thermal co-processing)
  if (isHazardous || stream === 'WRK' && taxId.includes('HAZ')) {
    return {
      co2AvoidedKg: Math.round(weightKg * 0.85), // Net avoided coal displacement in cement kilns less combustion
      waterSavedLitres: 0, // Thermal destruction does not preserve agricultural freshwater
      energySavedKwh: Math.round(weightKg * 4.1), // Direct thermal energy substitution in kiln (>3,500 kcal/kg)
      landfillDivertedKg: weightKg,
      isIllustrativeBenchmark: true,
      uncertaintyPercentage: 20,
      methodologyDescription: 'UN-rated TSDF Cement Kiln Thermal Co-Processing Proxy (Displacing pulverized bituminous coal)',
      sourceReferences: [
        'CPCB Guidelines on Co-Processing of Hazardous Wastes in Cement Plants (2021)',
        'Basel Convention Technical Guidelines on Incineration (D10 / R1)',
      ],
      assumptions: [
        'Petroleum hydrocarbon saturation provides ~3,500 - 4,200 kcal/kg calorific value.',
        'High temperature (>1,400°C) complete mineralisation with zero bottom ash to landfill.',
        'Zero agricultural irrigation displacement credit claimed.',
      ],
    };
  }

  // Case 2: Rigid Polymers & Carrier Packaging (e.g., Polypropylene Cones)
  if (stream === 'PKG' || taxId.includes('COR') || passport.coneCarrierType) {
    return {
      co2AvoidedKg: Math.round(weightKg * 1.70), // Virgin PP granule displacement
      waterSavedLitres: Math.round(weightKg * 45), // Polymer cooling water only (no agricultural irrigation)
      energySavedKwh: Math.round(weightKg * 5.2), // Cracking & polymerization thermal energy avoided
      landfillDivertedKg: weightKg,
      isIllustrativeBenchmark: true,
      uncertaintyPercentage: 15,
      methodologyDescription: 'Virgin Polypropylene (PP) Polymer Displacement Proxy via Closed-Loop Re-Winding or Regranulation',
      sourceReferences: [
        'Ecoinvent 3.8: Polypropylene granulate production (RER)',
        'PlasticsEurope Eco-profiles: Polypropylene (PP)',
      ],
      assumptions: [
        'Displaces primary virgin injection-moulding PP copolymer grade.',
        'Re-use loop or mechanical regranulation process consumes ~0.4 kWh/kg washing/pelletizing energy.',
        'Cooling water closed-loop circulation minimizes process freshwater loss.',
      ],
    };
  }

  // Case 3: Pure Silk & Precious Zari Remnants (Handloom Craft Stream)
  if (stream === 'HLM' || taxId.includes('SLK') || taxId.includes('ZAR')) {
    return {
      co2AvoidedKg: Math.round(weightKg * 4.8), // Avoided sericulture mulberry farming & reeling
      waterSavedLitres: Math.round(weightKg * 420), // Sericulture irrigation & reeling boiling water
      energySavedKwh: Math.round(weightKg * 9.5), // High thermal energy in silkworm pupae boiling & reeling
      landfillDivertedKg: weightKg,
      isIllustrativeBenchmark: true,
      uncertaintyPercentage: 25,
      methodologyDescription: 'Mulberry Sericulture & Precious Metal Recovery LCA Proxy (High embodied energy biological fibre)',
      sourceReferences: [
        'Central Silk Board of India: Life Cycle Assessment of Indian Raw Silk (2020)',
        'ISO 14044: Environmental Management — Life Cycle Assessment',
      ],
      assumptions: [
        'Mulberry leaf agriculture and cocoon reeling have high embodied primary energy.',
        'Displacement credit assumes artisan craft re-spinning or pyrometallurgical silver extraction.',
      ],
    };
  }

  // Case 4: Default Cotton & Cellulosic Textile Surplus (Garment, Knitting, Home Textiles, Linen)
  return {
    co2AvoidedKg: Math.round(weightKg * 1.62), // Virgin combed cotton cultivation & ginning displacement
    waterSavedLitres: Math.round(weightKg * 850), // Direct blue/green freshwater irrigation & wet processing displacement
    energySavedKwh: Math.round(weightKg * 3.4), // Primary ginning, opening, and carding electrical energy avoided
    landfillDivertedKg: weightKg,
    isIllustrativeBenchmark: true,
    uncertaintyPercentage: 20,
    methodologyDescription: 'Virgin Combed Cotton Staple Fibre Displacement Proxy (Higg MSI / Textile Exchange benchmarks)',
    sourceReferences: [
      'Higg Materials Sustainability Index (Higg MSI v3.7): Conventional Ring-Spun Cotton',
      'Water Footprint Network: Global Average Water Footprint of Cotton Textiles',
      'GHG Protocol Corporate Value Chain (Scope 3) Standard: Category 1 Purchased Goods',
    ],
    assumptions: [
      '1 kg diverted clean cotton surplus displaces 1 kg virgin cotton fiber in spinning or wiping conversion.',
      'Average irrigation footprint based on Indian cotton growing regions (Gujarat/Maharashtra/Tamil Nadu).',
      'Transport logistics within regional circular corridor (<150 km) contributes negligible deduction (<0.04 kg CO2e/kg).',
    ],
  };
}
