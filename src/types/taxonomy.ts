export type LifecycleStreamId =
  | 'AGR' // 1. Agricultural fibre sources and raw fibre
  | 'GIN' // 2. Ginning, fibre preparation, blow-room, carding and combing
  | 'SPN' // 3. Spinning, sliver, roving, hard waste, soft waste and broken yarn
  | 'YRN' // 4. Yarn, thread, full/partial cones, empty cones, tubes, bobbins, cone socks and protective covers
  | 'HLM' // 5. Handloom, traditional weaving and artisan production
  | 'MFG' // 6. Power loom, circular knitting, flat knitting and nonwovens
  | 'KNT' // 6b. Knitting, Weaving and Nonwoven (alias)
  | 'FAB' // 7. Warp, weft, selvedge, roll ends and rejected fabric
  | 'WET' // 8. Dyeing, lab dips, shade rejects, washing, bleaching, scouring and mercerising
  | 'FNS' // 9. Finishing, coating, lamination and chemical-process residues
  | 'PRN' // 10. Screen printing, digital printing, block printing and print waste
  | 'GAR' // 11. Garment cutting, sewing, rejected panels, trims and finished garments
  | 'HOM' // 12. Home textiles, bedding, towels, curtains, rugs, mats, quilts, fillings and household textile discards
  | 'PKG' // 13. Packaging: used polybags, plastic films, PP sacks, carton boxes, paper cones, tubes, wrapping covers, cone socks, straps, pallets
  | 'HOS' // 14. Hotels, hospitality, commercial laundries and institutional textiles
  | 'INS' // 14b. Institutional & Hospitality (alias)
  | 'MED' // 15. Hospitals and healthcare textiles, with strict exposure and contamination controls
  | 'WRK' // 16. Mechanic shops, garages, industrial wiping rags, oil-contaminated cloths and solvent-contaminated textiles
  | 'RET' // 17. Distribution, retail returns, deadstock and post-consumer textile collection
  | 'OTH'; // 18. Other configurable industrial by-products and material streams

export interface TaxonomySubcategory {
  id: string; // e.g., 'CAT-GAR-CUT-CHN'
  streamId: LifecycleStreamId;
  name: string;
  nameTa?: string;
  description: string;
  materialForm: string;
  defaultUnit: string;
  allowedUnits: string[];
  requiredFields: string[];
  optionalFields: string[];
  typicalComposition: string;
  contaminationRisks: string[];
  evidenceRequirements: string[];
  candidateDestinations: string[];
  isControlledOrHazardous?: boolean;
}

export interface LifecycleStream {
  id: LifecycleStreamId;
  code: string;
  name: string;
  nameTa: string;
  description: string;
  iconName: string;
  subcategories: TaxonomySubcategory[];
}
