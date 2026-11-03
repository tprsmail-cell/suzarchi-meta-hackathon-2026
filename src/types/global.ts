/**
 * SUZARCHI Global Circular Material Intelligence Platform
 * G1: Canonical Global Data Model Schemas
 * Implements specifications from GLOBAL_DATA_MODEL.md & COUNTRY_REGION_DATA_MODEL.md
 */

import { SupportedLanguage } from '@/lib/translations';
import { CurrencyCode } from '@/lib/currencies';
import { UnitSystem } from '@/lib/units';

// ============================================================================
// 1. GEOGRAPHIC & JURISDICTIONAL ENTITIES
// ============================================================================

export interface AdministrativeRegion {
  id: string; // e.g. 'reg-in-tn', 'reg-us-nc'
  countryCode: string; // ISO 3166-1 alpha-2
  name: string;
  nameLocal?: string;
  code: string; // State / Province code, e.g. 'TN', 'NC', 'ZJ'
  adminType: 'STATE' | 'PROVINCE' | 'PREFECTURE' | 'REGION';
  majorTextileHub: boolean;
}

export interface CountryJurisdiction {
  code: string; // ISO 3166-1 alpha-2, e.g. 'IN', 'US', 'DE'
  isoAlpha3: string; // e.g. 'IND', 'USA', 'DEU'
  name: string;
  nameLocal: string;
  defaultLanguage: SupportedLanguage;
  supportedLanguages: SupportedLanguage[];
  defaultCurrency: CurrencyCode;
  measurementSystem: UnitSystem;
  regions: AdministrativeRegion[];
  baselParty: boolean; // Party to Basel Convention on Transboundary Movement of Hazardous Wastes
  regulatoryAuthority: string; // e.g. 'CPCB / SPCB', 'US EPA', 'EU ECHA / Member State EPAs'
  dppMandatePhase: 'ACTIVE' | 'PILOT' | 'PLANNED_2026' | 'NOT_ENACTED';
}

// ============================================================================
// 2. INDUSTRIAL CLUSTERS & PROCESSING FACILITIES
// ============================================================================

export type ClusterEvidenceTier = 'VERIFIED_EMPIRICAL_CLUSTER' | 'EMERGING_ZONE' | 'LOGISTICS_MODEL';

export interface IndustrialCluster {
  id: string; // e.g. 'clus-in-tiruppur', 'clus-it-prato'
  countryCode: string;
  regionCode: string;
  name: string;
  specialty: string;
  specialtyTa?: string;
  evidenceTier: ClusterEvidenceTier;
  majorStreamsHandled: string[]; // e.g. ['FAB', 'KNT', 'GAR']
  primaryProcessingModes: string[]; // e.g. ['Rotor Spinning', 'Garnetting', 'Dyehouse Recycling']
  logisticsHub: string;
  verifiedCapacityTonsPerMonth?: number;
}

export interface ProcessingFacility {
  id: string; // e.g. 'fac-tiruppur-rotor-01'
  clusterId: string;
  name: string;
  companyName: string;
  verificationLevel: BusinessVerificationLevel;
  statutoryLicenseNumber?: string;
  environmentalConsentValidUntil?: string;
  acceptedStreams: string[];
  minimumLotKg: number;
  hazardousHandlingAuthorized: boolean;
  notes?: string;
}

// ============================================================================
// 3. ORGANISATIONS & BUSINESS VERIFICATION
// ============================================================================

export type BusinessVerificationLevel =
  | 'UNVERIFIED_OPPORTUNITY'
  | 'REGISTERED_COMMERCIAL_ENTITY'
  | 'VERIFIED_PROCESSING_FACILITY'
  | 'STATUTORY_GOVERNMENT_AUDITED';

export type OrganisationType =
  | 'SPINNING_MILL'
  | 'WEAVING_KNITTING_MILL'
  | 'GARMENT_MANUFACTURER'
  | 'BRAND_RETAILER'
  | 'MECHANICAL_RECYCLER'
  | 'CHEMICAL_DISSOLVING_RECYCLER'
  | 'INDUSTRIAL_SOLVENT_LAUNDRY'
  | 'TSDF_HAZARDOUS_COPROCESSOR'
  | 'HANDLOOM_WEAVER_COOPERATIVE'
  | 'CRAFT_UPCYCLING_STUDIO'
  | 'AGRICULTURAL_FIBRE_PROCESSOR';

export interface OrganisationProfile {
  id: string; // e.g. 'org-apex-textiles'
  legalName: string;
  tradeName: string;
  orgType: OrganisationType;
  countryCode: string;
  regionCode: string;
  taxIdentifierMasked?: string;
  verificationLevel: BusinessVerificationLevel;
  verificationDate?: string;
  auditingBody?: string;
  operatingPermits: string[];
  contactEmail: string;
  isMockData: boolean;
}

// ============================================================================
// 4. REGULATORY & CROSS-BORDER TRADE GOVERNANCE
// ============================================================================

export type BaselWasteCategory =
  | 'ANNEX_IX_B3030_NON_HAZARDOUS_TEXTILE' // Clean textile scrap suitable for recycling
  | 'ANNEX_VIII_A4140_HAZARDOUS_WASTE' // Petroleum/chemical/infectious waste strictly controlled
  | 'DOMESTIC_CONTROL_ONLY' // Non-hazardous domestic movement
  | 'RESTRICTED_IMPORT_BAN'; // Jurisdiction bans post-consumer textile imports

export interface CrossBorderTradeAssessment {
  originCountry: string;
  destinationCountry: string;
  isCrossBorder: boolean;
  baselClassification: BaselWasteCategory;
  exportPermitRequired: boolean;
  importPermitRequired: boolean;
  isTradePermitted: boolean;
  prohibitionReason?: string;
  applicableIncoterms: ('EXW' | 'FOB' | 'CIF' | 'DDP')[];
  indicativeTariffPercent: number;
  oceanFreightEstimatedUsdPerKg: number;
  customsDocumentationRequirements: string[];
  evidenceTier: 'STATUTORY_CUSTOMS_RULE' | 'INDICATIVE_TRADE_MODEL';
}

// ============================================================================
// 5. USER PREFERENCES
// ============================================================================

export interface UserLocalePreference {
  userId: string;
  language: SupportedLanguage;
  countryCode: string;
  currency: CurrencyCode;
  units: UnitSystem;
  lastUpdated: string;
}

// ============================================================================
// 6. TECHNICAL TRANSLATION GLOSSARY ENTITY
// ============================================================================

export interface TechnicalGlossaryTerm {
  termKey: string;
  canonicalEnglish: string;
  streamContext: string;
  isoDefinitionRef?: string;
  translations: Record<SupportedLanguage, string>;
  reviewedBy: string;
  reviewDate: string;
}
