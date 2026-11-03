import { RegionalCorridorAssessment } from '../types/destinations';
import { MaterialPassport } from '../types/passport';

export interface RegionalClusterHub {
  id: string;
  name: string;
  state: string;
  primarySpecialty: string;
  corridorRole: string;
  typicalDistanceKm: Record<string, number>;
}

export const KNOWN_REGIONAL_CLUSTERS: Record<string, RegionalClusterHub> = {
  tirupur: {
    id: 'hub-tirupur',
    name: 'Tirupur Knitwear & Garment Cluster',
    state: 'Tamil Nadu',
    primarySpecialty: 'Cotton single-jersey knitting, garment cutting, and pre-consumer offcuts',
    corridorRole: 'Primary generation and direct garment manufacturing hub',
    typicalDistanceKm: {
      tirupur: 15,
      coimbatore: 50,
      erode: 55,
      salem: 110,
      karur: 90,
      chennai: 460,
      hosur: 320,
      panipat: 2450,
    },
  },
  coimbatore: {
    id: 'hub-coimbatore',
    name: 'Coimbatore Textile & Spinning Belt',
    state: 'Tamil Nadu',
    primarySpecialty: 'Cotton spinning mills, carding, comber noils, and rotor yarn',
    corridorRole: 'Short staple virgin fiber consumption & rotor spinning hub',
    typicalDistanceKm: {
      tirupur: 50,
      coimbatore: 10,
      erode: 100,
      salem: 160,
      karur: 135,
      chennai: 510,
      hosur: 360,
      panipat: 2500,
    },
  },
  erode: {
    id: 'hub-erode',
    name: 'Erode Yarn Dyeing & Powerloom Hub',
    state: 'Tamil Nadu',
    primarySpecialty: 'Package yarn dyeing, cone reuse, and woven grey cloth',
    corridorRole: 'Carrier core closed-loop returns and weaving by-product hub',
    typicalDistanceKm: {
      tirupur: 55,
      coimbatore: 100,
      erode: 10,
      salem: 65,
      karur: 65,
      chennai: 410,
      hosur: 260,
      panipat: 2390,
    },
  },
  karur: {
    id: 'hub-karur',
    name: 'Karur Home Textile & Linen Export Corridor',
    state: 'Tamil Nadu',
    primarySpecialty: 'Bed linen, kitchen textiles, table linen, and woven furnishings',
    corridorRole: 'Institutional linen conversion and wide woven fabric reuse hub',
    typicalDistanceKm: {
      tirupur: 90,
      coimbatore: 135,
      erode: 65,
      salem: 85,
      karur: 10,
      chennai: 380,
      hosur: 270,
      panipat: 2420,
    },
  },
  kanchipuram: {
    id: 'hub-kanchipuram',
    name: 'Kanchipuram Handloom & Silk Heritage Cluster',
    state: 'Tamil Nadu',
    primarySpecialty: 'Pure mulberry silk weaving, real zari brocade, and precious-metal thrums',
    corridorRole: 'Artisanal thrum generation and silver/gold metallurgical refining',
    typicalDistanceKm: {
      tirupur: 410,
      coimbatore: 450,
      erode: 370,
      salem: 290,
      karur: 330,
      chennai: 75,
      hosur: 240,
      panipat: 2200,
    },
  },
  panipat: {
    id: 'hub-panipat',
    name: 'Panipat Shoddy Yarn & Recycled Blanket Hub',
    state: 'Haryana',
    primarySpecialty: 'Large-scale mechanical garnetting, shoddy tearing, and open-end blanket yarn',
    corridorRole: 'National bulk shredding and secondary fiber recovery destination',
    typicalDistanceKm: {
      tirupur: 2450,
      coimbatore: 2500,
      erode: 2390,
      salem: 2350,
      karur: 2420,
      chennai: 2280,
      hosur: 2200,
      panipat: 15,
    },
  },
  hosur_tsdf: {
    id: 'hub-hosur-tsdf',
    name: 'Hosur-Ariyalur Industrial TSDF & Kiln Corridor',
    state: 'Tamil Nadu',
    primarySpecialty: 'CPCB-authorized hazardous waste co-processing in cement kilns',
    corridorRole: 'Regulated hazardous waste thermal destruction and energy recovery',
    typicalDistanceKm: {
      tirupur: 320,
      coimbatore: 360,
      erode: 260,
      salem: 160,
      karur: 270,
      chennai: 310,
      hosur: 25,
      panipat: 2150,
    },
  },
};

/**
 * Deterministically evaluates regional corridor logistics for a given material and destination
 */
export function evaluateRegionalCorridor(
  passport: MaterialPassport,
  destinationId: string
): RegionalCorridorAssessment {
  const rawLocation = (passport.location?.value || '').toLowerCase();
  const quantity = passport.quantityKg.value || 0;
  const isHazardous = passport.isControlledOrHazardous === true ||
    (passport.contaminationStatus?.value || '').toLowerCase().includes('oil');

  // Match source cluster
  let sourceClusterKey = 'tirupur';
  if (rawLocation.includes('coimbatore')) sourceClusterKey = 'coimbatore';
  else if (rawLocation.includes('erode')) sourceClusterKey = 'erode';
  else if (rawLocation.includes('karur')) sourceClusterKey = 'karur';
  else if (rawLocation.includes('kanchipuram')) sourceClusterKey = 'kanchipuram';
  else if (rawLocation.includes('chennai')) sourceClusterKey = 'chennai';
  else if (rawLocation.includes('hosur')) sourceClusterKey = 'hosur_tsdf';

  const sourceCluster = KNOWN_REGIONAL_CLUSTERS[sourceClusterKey] || KNOWN_REGIONAL_CLUSTERS.tirupur;

  // Determine optimal destination cluster based on destination route
  let targetHubKey = 'tirupur';
  let corridorName = 'Tirupur Intra-Cluster Processing Corridor';
  let clusterProcessingAvailability = 'Dense local network of garment stitchers and job-work cutters within 25 km radius';

  if (isHazardous || destinationId === 'dest-tsdf-cement') {
    targetHubKey = 'hosur_tsdf';
    corridorName = 'Tamil Nadu Authorized SPCB Hazardous Waste Transport Corridor';
    clusterProcessingAvailability = 'Licensed TSDF collection vehicles and high-temperature cement kilns in Ariyalur / Hosur';
  } else if (destinationId === 'dest-recycler') {
    if (quantity >= 5000) {
      targetHubKey = 'panipat';
      corridorName = 'South-to-North Interstate Bulk Shoddy Rail/Road Corridor';
      clusterProcessingAvailability = 'Panipat garnetting mills processing high-tonnage cotton-rich and blended clips';
    } else {
      targetHubKey = 'tirupur'; // Palladam / Tirupur local shoddy tearers
      corridorName = 'Tirupur-Palladam Local Mechanical Recycling Belt';
      clusterProcessingAvailability = 'Regional rag-pulling and garnetting units equipped for small to medium batches (< 5 tonnes)';
    }
  } else if (destinationId === 'dest-home-textiles') {
    targetHubKey = 'karur';
    corridorName = 'Kongu Region Home Furnishing Export Belt (Karur Corridor)';
    clusterProcessingAvailability = 'Karur wide-width stitching units, hem-stitchers, and domestic textile converters';
  } else if (destinationId === 'dest-dyehouse-return' || destinationId === 'dest-plastic-granulate') {
    targetHubKey = 'erode';
    corridorName = 'Erode Package Dyeing & Polymer Regranulation Corridor';
    clusterProcessingAvailability = 'Continuous yarn package winding mills with automated cone washing stations';
  } else if (destinationId === 'dest-rotor-spin') {
    targetHubKey = 'coimbatore';
    corridorName = 'Coimbatore-Tirupur Spinning Mill Secondary Fiber Hub';
    clusterProcessingAvailability = 'Open-end rotor spinning mills actively purchasing combed noils and card waste';
  } else if (destinationId === 'dest-zari-leach' || destinationId === 'dest-craft-applique') {
    targetHubKey = 'kanchipuram';
    corridorName = 'Kanchipuram Artisanal & Salem Metallurgical Assay Corridor';
    clusterProcessingAvailability = 'Certified acid leaching jewel refiners and master handloom weaver societies';
  } else if (destinationId === 'dest-wiping') {
    targetHubKey = 'coimbatore'; // Coimbatore / Hosur industrial CNC belt
    corridorName = 'Western Tamil Nadu CNC Engineering & Machine Tool Belt';
    clusterProcessingAvailability = 'High daily consumption of cotton machinery wiping cloths in auto-component hubs';
  }

  const targetHub = KNOWN_REGIONAL_CLUSTERS[targetHubKey] || KNOWN_REGIONAL_CLUSTERS.tirupur;
  const estimatedDistance = sourceCluster.typicalDistanceKm[targetHubKey] ?? 120;

  // Determine transport feasibility
  let transportFeasibility: 'HIGH' | 'MEDIUM' | 'LOW' | 'RESTRICTED' = 'HIGH';
  if (isHazardous) {
    transportFeasibility = 'RESTRICTED';
  } else if (estimatedDistance > 1000) {
    transportFeasibility = quantity >= 5000 ? 'MEDIUM' : 'LOW';
  } else if (estimatedDistance > 200) {
    transportFeasibility = quantity >= 500 ? 'HIGH' : 'MEDIUM';
  }

  // Explicitly separate verified facts from estimates and unknown info
  const verifiedSourceFacts: string[] = [
    `Declared source location: "${passport.location?.value || 'Unspecified'}" (Evidence status: ${passport.location?.status || 'UNKNOWN'})`,
    `Declared quantity: ${passport.quantityKg.value} ${passport.quantityUnit?.value || 'kg'} (Evidence status: ${passport.quantityKg.status})`,
  ];

  const estimatedLogisticsAssumptions: string[] = [
    `Point-to-point road transit distance estimated at ~${estimatedDistance} km via National Highway corridors`,
    `Transit duration: ${estimatedDistance < 100 ? 'Same-day turnaround (< 4 hours)' : estimatedDistance < 500 ? '1-2 working days' : '4-6 days (Interstate haulage)'}`,
    `Payload optimization: ${quantity >= 3000 ? 'Full Truckload (FTL) viable' : 'Part Truckload (PTL / Consolidated milk run) required'}`,
  ];

  const missingRegionalInformation: string[] = [];
  if (passport.location.status !== 'CONFIRMED') {
    missingRegionalInformation.push('Source facility GPS or registered warehouse pin code requires confirmation');
  }
  if (isHazardous) {
    missingRegionalInformation.push('State Pollution Control Board (SPCB) designated hazardous waste vehicle authorization');
    missingRegionalInformation.push('Form-10 Hazardous Waste Manifest consignment serial number');
  }
  if (!passport.quantityKg.sourceNote) {
    missingRegionalInformation.push('Weighbridge certified gross-tare receipt pending for freight dispatch');
  }

  return {
    sourceRegion: passport.location.value || 'Registered Supplier Hub',
    destinationRegion: targetHub.name,
    corridorName,
    distanceKmEstimated: estimatedDistance,
    transportFeasibility,
    clusterProcessingAvailability,
    verifiedSourceFacts,
    estimatedLogisticsAssumptions,
    missingRegionalInformation,
    transparencyLimitationNotice:
      'Regional corridor distances and cluster descriptions are deterministic logistics models based on established Indian textile clusters (CPCB/Ministry of Textiles data). They do not represent booked freight contracts or live vehicle tracking.',
  };
}
