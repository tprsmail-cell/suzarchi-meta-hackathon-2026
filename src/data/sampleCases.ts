import { MaterialPassport } from '@/types/passport';

/**
 * Case 1: Verified Phase 1.2 Smoke Test 3 Test Sample
 * Pink Ribbed Corduroy Fabric (batch PCB-2026-IN-42)
 */
export const DASHBOARD_SAMPLE_CASE: MaterialPassport = {
  id: 'mat-001',
  countryOfOrigin: 'IN',
  hsCode: '5801.22',
  batchNumber: 'PCB-2026-IN-42',
  dppIdentifier: 'urn:dpp:suzarchi:in:mat-001',
  taxonomyId: 'CAT-GAR-CUT-CHN',
  streamId: 'GAR',
  materialName: {
    value: 'Pink Ribbed Corduroy Fabric',
    status: 'REPORTED',
  },
  materialType: {
    value: 'Corduroy textile (Woven pile)',
    status: 'REPORTED',
  },
  fibreComposition: {
    value: 'Reported as 100% Cotton (Unverified)',
    status: 'REPORTED',
    sourceNote: 'Supplier intake declaration; requires ISO 1833 chemical laboratory analysis for confirmation.',
  },
  quantityKg: {
    value: 300,
    status: 'CONFIRMED',
    sourceNote: 'Weighed on warehouse receipt',
  },
  quantityUnit: {
    value: 'kg',
    status: 'CONFIRMED',
  },
  gsmWeight: {
    value: null,
    status: 'UNKNOWN',
    sourceNote: 'Not visually observable from photograph; lab GSM cutter required',
  },
  widthCm: {
    value: 145,
    status: 'ESTIMATED',
    sourceNote: 'Estimated from roll width',
  },
  colour: {
    value: 'Light Pink',
    status: 'ESTIMATED',
    sourceNote: 'Optical observation of fabric sample',
  },
  condition: {
    value: 'New / Unused (surplus)',
    status: 'CONFIRMED',
  },
  form: {
    value: 'Fabric roll',
    status: 'CONFIRMED',
  },
  location: {
    value: 'Tirupur, India',
    status: 'CONFIRMED',
  },
  indicativePrice: {
    value: '₹180 / kg (Negotiable)',
    status: 'REPORTED',
  },
  chemicalFinishes: {
    value: 'Peach finish reported; chemical safety unverified',
    status: 'REPORTED',
  },
  contaminationStatus: {
    value: 'Chemical contamination status UNKNOWN',
    status: 'REPORTED',
  },
  cleanlinessRating: {
    value: 'COMMERCIAL_SURPLUS',
    status: 'REPORTED',
  },
  isControlledOrHazardous: null,
  notes: 'Pink ribbed corduroy fabric sample, woven cut-pile structure with distinct vertical ribs. Phase 1.2 verified test sample. Photographic evidence alone cannot confirm fiber composition, GSM, or chemical safety.',
  images: [
    {
      id: 'img-pink-corduroy-01',
      url: '/assets/pink-corduroy-sample.png',
      caption: 'Pink Ribbed Corduroy Fabric Sample',
      mediaType: 'OVERVIEW',
      name: 'phase1_2_pink_corduroy_sample.png',
      sizeBytes: 967353,
    },
  ],
};

/**
 * Preserved Navy Single Jersey Scenario (Secondary Demo Fixture)
 */
export const NAVY_KNIT_SAMPLE_CASE: MaterialPassport = {
  id: 'mat-001-navy',
  countryOfOrigin: 'IN',
  hsCode: '6006.21',
  batchNumber: 'PCB-2026-IN-42-NAVY',
  dppIdentifier: 'urn:dpp:suzarchi:in:mat-001-navy',
  taxonomyId: 'CAT-GAR-CUT-CHN',
  streamId: 'GAR',
  materialName: {
    value: 'Navy Cotton-Rich Knit Fabric',
    status: 'CONFIRMED',
  },
  materialType: {
    value: 'Knit (Single jersey)',
    status: 'CONFIRMED',
  },
  fibreComposition: {
    value: 'Cotton Rich (exact % to confirm)',
    status: 'REPORTED',
    sourceNote: 'Supplier tag; needs laboratory test for exact ratio',
  },
  quantityKg: {
    value: 300,
    status: 'CONFIRMED',
    sourceNote: 'Weighed on warehouse receipt',
  },
  quantityUnit: {
    value: 'kg',
    status: 'CONFIRMED',
  },
  gsmWeight: {
    value: 180,
    status: 'ESTIMATED',
    sourceNote: 'From label / visual estimate',
  },
  widthCm: {
    value: 145,
    status: 'ESTIMATED',
    sourceNote: 'From label / visual estimate',
  },
  colour: {
    value: 'Navy',
    status: 'CONFIRMED',
  },
  condition: {
    value: 'New / Unused (surplus)',
    status: 'CONFIRMED',
  },
  form: {
    value: 'Fabric rolls',
    status: 'CONFIRMED',
  },
  location: {
    value: 'Tirupur, India',
    status: 'CONFIRMED',
  },
  indicativePrice: {
    value: '₹180 / kg (Negotiable)',
    status: 'REPORTED',
  },
  chemicalFinishes: {
    value: 'Standard reactive dye; no flame retardant documented',
    status: 'REPORTED',
  },
  contaminationStatus: {
    value: 'clean',
    status: 'CONFIRMED',
  },
  cleanlinessRating: {
    value: 'VIRGIN_CLEAN',
    status: 'CONFIRMED',
  },
  notes: 'Single jersey knit, navy colour, cotton-rich roll surplus. Actual supplier warehouse photograph attached.',
  images: [
    {
      id: 'img-navy-01',
      url: '/assets/navy-single-jersey-fabric.jpg',
      caption: 'Navy Fabric Roll with Draped Fabric Sample',
      mediaType: 'OVERVIEW',
      name: 'navy-single-jersey-fabric.jpg',
      sizeBytes: 89918,
    },
  ],
};

/**
 * Case 2: Hackathon MVP test specification (PROJECT_SCOPE.md)
 */
export const HACKATHON_SAMPLE_CASE: MaterialPassport = {
  id: 'mat-002',
  taxonomyId: 'CAT-GAR-CUT-CHN',
  streamId: 'GAR',
  materialName: {
    value: 'T-shirt production fabric offcuts',
    status: 'REPORTED',
  },
  materialType: {
    value: 'Fabric offcuts (Cutting waste)',
    status: 'REPORTED',
  },
  fibreComposition: {
    value: '100% Cotton',
    status: 'REPORTED',
    sourceNote: 'Self-reported by garment cutter; no lab certification',
  },
  quantityKg: {
    value: 50,
    status: 'REPORTED',
  },
  quantityUnit: {
    value: 'kg',
    status: 'REPORTED',
  },
  gsmWeight: {
    value: null,
    status: 'UNKNOWN',
    sourceNote: 'Not measured',
  },
  widthCm: {
    value: null,
    status: 'UNKNOWN',
    sourceNote: 'Variable scrap dimensions',
  },
  colour: {
    value: 'Assorted (predominantly white/grey)',
    status: 'REPORTED',
  },
  condition: {
    value: 'Clean production trimmings',
    status: 'REPORTED',
  },
  form: {
    value: 'Baled offcuts',
    status: 'REPORTED',
  },
  location: {
    value: 'Tirupur, India',
    status: 'REPORTED',
  },
  indicativePrice: {
    value: '₹85 / kg (Negotiable)',
    status: 'REPORTED',
  },
  chemicalFinishes: {
    value: 'Unspecified',
    status: 'UNKNOWN',
  },
  contaminationStatus: {
    value: 'Clean pre-consumer factory waste',
    status: 'REPORTED',
  },
  cleanlinessRating: {
    value: 'COMMERCIAL_SURPLUS',
    status: 'REPORTED',
  },
  notes: 'T-shirt cutting table offcuts. Composition is reported 100% cotton but requires verification test before shredding.',
};

/**
 * Case 3: Handloom Zari & Paavu Warp Ends (Artisan Craft Stream)
 */
export const HANDLOOM_ZARI_CASE: MaterialPassport = {
  id: 'mat-003',
  taxonomyId: 'CAT-HLM-ZAR-SEL',
  streamId: 'HLM',
  materialName: {
    value: 'Kanchipuram Silk Paavu Ends with Real Zari',
    status: 'CONFIRMED',
  },
  materialType: {
    value: 'Handloom warp ends & brocade selvedge',
    status: 'CONFIRMED',
  },
  fibreComposition: {
    value: 'Pure Mulberry Silk with Electroplated Silver/Gold Copper Zari',
    status: 'CONFIRMED',
    sourceNote: 'Weaver cooperative certified handloom mark',
  },
  quantityKg: {
    value: 18,
    status: 'CONFIRMED',
  },
  quantityUnit: {
    value: 'kg',
    status: 'CONFIRMED',
  },
  gsmWeight: {
    value: null,
    status: 'UNKNOWN',
  },
  widthCm: {
    value: 15,
    status: 'REPORTED',
    sourceNote: 'Selvedge strips (10-20 cm width)',
  },
  colour: {
    value: 'Crimson Red with Metallic Gold',
    status: 'CONFIRMED',
  },
  condition: {
    value: 'Unused artisanal loom remnants',
    status: 'CONFIRMED',
  },
  form: {
    value: 'Tied thread bundles & ribbons',
    status: 'CONFIRMED',
  },
  location: {
    value: 'Kanchipuram, Tamil Nadu',
    status: 'CONFIRMED',
  },
  indicativePrice: {
    value: '₹3,200 / kg (Silver metal content)',
    status: 'REPORTED',
  },
  contaminationStatus: {
    value: 'Clean natural starch kanji only',
    status: 'CONFIRMED',
  },
  cleanlinessRating: {
    value: 'VIRGIN_CLEAN',
    status: 'CONFIRMED',
  },
  notes: 'Artisanal handloom warp cut-offs with real zari. High recovery value for certified precious-metal leaching or luxury applique craft.',
};

/**
 * Case 4: Spinning Comber Noil (Spinning Stream)
 */
export const SPINNING_NOIL_CASE: MaterialPassport = {
  id: 'mat-004',
  taxonomyId: 'CAT-SPN-CMB-NOI',
  streamId: 'SPN',
  materialName: {
    value: 'Combed Cotton Noils (Baled)',
    status: 'CONFIRMED',
  },
  materialType: {
    value: 'Short staple virgin cotton fibre',
    status: 'CONFIRMED',
  },
  fibreComposition: {
    value: '100% Combed Cotton',
    status: 'CONFIRMED',
    sourceNote: 'Mill spinning laboratory report #SP-4029',
  },
  quantityKg: {
    value: 1200,
    status: 'CONFIRMED',
  },
  quantityUnit: {
    value: 'kg',
    status: 'CONFIRMED',
  },
  stapleLengthMm: {
    value: 24,
    status: 'CONFIRMED',
    sourceNote: 'Laboratory Baer sorter test #2910',
  },
  trashPercentage: {
    value: 1.2,
    status: 'CONFIRMED',
    sourceNote: 'Trash separator analyzer test',
  },
  gsmWeight: {
    value: null,
    status: 'UNKNOWN',
  },
  widthCm: {
    value: null,
    status: 'UNKNOWN',
  },
  colour: {
    value: 'Natural Ecru (Greige unbleached)',
    status: 'CONFIRMED',
  },
  condition: {
    value: 'Virgin spinning by-product',
    status: 'CONFIRMED',
  },
  form: {
    value: 'High-density pressed bales (240kg each)',
    status: 'CONFIRMED',
  },
  location: {
    value: 'Coimbatore, Tamil Nadu',
    status: 'CONFIRMED',
  },
  indicativePrice: {
    value: '₹140 / kg (Ex-mill)',
    status: 'CONFIRMED',
  },
  contaminationStatus: {
    value: 'Trash <1.5%, zero synthetic contaminants',
    status: 'CONFIRMED',
  },
  cleanlinessRating: {
    value: 'VIRGIN_CLEAN',
    status: 'CONFIRMED',
  },
  notes: 'Prime comber noil from Shankar-6 cotton combed spinning. Certified feedstock for rotor rotor-spun coarse counts (10s-16s) or medical cotton pads.',
};

/**
 * Case 5: Empty Plastic Dyeing Cones (Packaging & Carriers Stream)
 */
export const PLASTIC_CONES_CASE: MaterialPassport = {
  id: 'mat-005',
  taxonomyId: 'CAT-YRN-COR-PLS',
  streamId: 'YRN',
  materialName: {
    value: 'Perforated PP Package Dyeing Cones (Reusable)',
    status: 'CONFIRMED',
  },
  materialType: {
    value: 'Injection-moulded rigid plastic cone core',
    status: 'CONFIRMED',
  },
  fibreComposition: {
    value: '100% Polypropylene (PP - Resin Code 5)',
    status: 'CONFIRMED',
    sourceNote: 'Embossed manufacturer stamp (Veejay Lakshmi)',
  },
  quantityKg: {
    value: 2400,
    status: 'CONFIRMED',
  },
  quantityUnit: {
    value: 'pieces',
    status: 'CONFIRMED',
    sourceNote: '10 cartons of 240 pieces each',
  },
  gsmWeight: {
    value: null,
    status: 'UNKNOWN',
  },
  widthCm: {
    value: null,
    status: 'UNKNOWN',
  },
  colour: {
    value: 'Assorted Red/Blue color-coded',
    status: 'CONFIRMED',
  },
  condition: {
    value: 'Used, 100% structurally sound, no cracks',
    status: 'CONFIRMED',
  },
  form: {
    value: 'Rigid conical tubes in 10 cartons (2,400 pieces)',
    status: 'CONFIRMED',
  },
  location: {
    value: 'Erode, Tamil Nadu',
    status: 'CONFIRMED',
  },
  indicativePrice: {
    value: '₹3.50 / piece (New retail: ₹8.00)',
    status: 'CONFIRMED',
  },
  contaminationStatus: {
    value: 'Dyed surface deposit (fixed, non-leaching)',
    status: 'CONFIRMED',
  },
  cleanlinessRating: {
    value: 'COMMERCIAL_SURPLUS',
    status: 'CONFIRMED',
  },
  coneCarrierType: {
    value: 'Perforated PP 170mm',
    status: 'CONFIRMED',
  },
  notes: 'High-speed package dyeing plastic cones ready for immediate re-use by yarn dyehouses or regranulation into industrial crates.',
};

/**
 * Case 6: Hospitality Retired Hotel Percale Linen (Institutional Stream)
 */
export const HOTEL_LINEN_CASE: MaterialPassport = {
  id: 'mat-006',
  taxonomyId: 'CAT-INS-HOS-BED',
  streamId: 'INS',
  materialName: {
    value: 'Retired Luxury Hotel Percale White Bedsheets',
    status: 'CONFIRMED',
  },
  materialType: {
    value: 'Woven flat bedsheets (Commercial linen)',
    status: 'CONFIRMED',
  },
  fibreComposition: {
    value: '100% Combed Cotton (300 Thread Count)',
    status: 'CONFIRMED',
    sourceNote: 'Linen inventory procurement spec',
  },
  quantityKg: {
    value: 450,
    status: 'CONFIRMED',
  },
  quantityUnit: {
    value: 'kg',
    status: 'CONFIRMED',
  },
  gsmWeight: {
    value: 135,
    status: 'CONFIRMED',
  },
  widthCm: {
    value: 275, // King size 108"
    status: 'CONFIRMED',
  },
  colour: {
    value: 'Optic White',
    status: 'CONFIRMED',
  },
  condition: {
    value: 'Commercial wash retired (slight thinning/minor pinholes)',
    status: 'CONFIRMED',
  },
  form: {
    value: 'Folded sheets in laundry carts (~600 pieces)',
    status: 'CONFIRMED',
  },
  location: {
    value: 'Chennai, Tamil Nadu',
    status: 'CONFIRMED',
  },
  indicativePrice: {
    value: '₹120 / kg',
    status: 'REPORTED',
  },
  contaminationStatus: {
    value: 'Sanitized, commercial laundry washed, zero hospital contamination',
    status: 'CONFIRMED',
  },
  cleanlinessRating: {
    value: 'VIRGIN_CLEAN',
    status: 'CONFIRMED',
  },
  absorbencyRating: {
    value: 'HIGH_INSTANT_ABSORB',
    status: 'CONFIRMED',
  },
  isHardwareFree: {
    value: true,
    status: 'CONFIRMED',
  },
  notes: 'High-thread-count white bedsheets from premium hospitality. Ideal for cutting into lint-free precision wiping rags, hospital apron re-cutting, or Lyocell chemical dissolution.',
};

/**
 * Case 7: Workshop Oil-Contaminated Rags (Hazardous Waste - Controlled Route)
 */
export const WORKSHOP_OILY_RAGS_CASE: MaterialPassport = {
  id: 'mat-007',
  taxonomyId: 'CAT-WRK-OIL-HAZ',
  streamId: 'WRK',
  materialName: {
    value: 'Machine Tool Lubricant-Saturated Maintenance Cloths',
    status: 'CONFIRMED',
  },
  materialType: {
    value: 'Used industrial wiping rags with heavy petroleum grease',
    status: 'CONFIRMED',
  },
  fibreComposition: {
    value: 'Cotton / Poly blend with ~25% Petroleum Hydrocarbons',
    status: 'REPORTED',
    sourceNote: 'Automotive lathe maintenance logs',
  },
  quantityKg: {
    value: 180,
    status: 'CONFIRMED',
  },
  quantityUnit: {
    value: 'kg',
    status: 'CONFIRMED',
  },
  gsmWeight: {
    value: null,
    status: 'UNKNOWN',
  },
  widthCm: {
    value: null,
    status: 'UNKNOWN',
  },
  colour: {
    value: 'Black / Dark Grey grease stained',
    status: 'CONFIRMED',
  },
  condition: {
    value: 'Heavily soiled hazardous industrial waste',
    status: 'CONFIRMED',
  },
  form: {
    value: 'Sealed steel UN-rated drums (3 drums)',
    status: 'CONFIRMED',
  },
  location: {
    value: 'Hosur Industrial Complex, Tamil Nadu',
    status: 'CONFIRMED',
  },
  indicativePrice: {
    value: 'Zero (TSDF collection fee applies)',
    status: 'CONFIRMED',
  },
  contaminationStatus: {
    value: 'Hazardous Waste - Schedule II (Flammable hydrocarbon oil & metal filings)',
    status: 'CONFIRMED',
  },
  cleanlinessRating: {
    value: 'HAZARDOUS_CONTAMINATED',
    status: 'CONFIRMED',
  },
  isControlledOrHazardous: true,
  notes: 'FLAMMABLE HAZARDOUS WASTE (Schedule II, Class A). Strictly barred from open textile reuse, shoddy spinning, and municipal disposal. Regulated under Hazardous Waste Rules 2016. Exclusive compliant route: Authorized TSDF Cement Kiln Co-Processing. Solvent laundry route is disqualified pending statutory SPCB hazardous recovery permits.',
};

export const ALL_SAMPLE_CASES: Record<string, MaterialPassport> = {
  'mat-001': DASHBOARD_SAMPLE_CASE,
  'mat-001-navy': NAVY_KNIT_SAMPLE_CASE,
  'mat-002': HACKATHON_SAMPLE_CASE,
  'mat-003': HANDLOOM_ZARI_CASE,
  'mat-004': SPINNING_NOIL_CASE,
  'mat-005': PLASTIC_CONES_CASE,
  'mat-006': HOTEL_LINEN_CASE,
  'mat-007': WORKSHOP_OILY_RAGS_CASE,
};
