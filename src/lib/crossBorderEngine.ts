/**
 * SUZARCHI Global Circular Material Intelligence Platform
 * G5 & G6: Cross-Border Matching & Basel Convention Regulatory Engine
 * Evaluates transboundary secondary textile movements, customs tariffs,
 * container MOQs, and international safety exclusions.
 */

import { MaterialPassport } from '@/types/passport';
import { CrossBorderTradeAssessment, BaselWasteCategory } from '@/types/global';

/**
 * Evaluates whether a secondary textile lot can cross international borders
 * under the Basel Convention on the Control of Transboundary Movements of Hazardous Wastes,
 * national import/export bans, and WTO tariff schedules.
 */
export function evaluateCrossBorderTrade(
  passport: MaterialPassport,
  originCountryCode = 'IN',
  destinationCountryCode = 'IN'
): CrossBorderTradeAssessment {
  const isCrossBorder = originCountryCode.toUpperCase() !== destinationCountryCode.toUpperCase();
  const contamText = (passport.contaminationStatus?.value || '').toLowerCase();
  const isHazardous =
    passport.isControlledOrHazardous === true ||
    contamText.includes('oil') ||
    contamText.includes('grease') ||
    contamText.includes('solvent') ||
    contamText.includes('petroleum') ||
    contamText.includes('biohazard') ||
    contamText.includes('infectious') ||
    contamText.includes('hazardous');

  // Case 1: Domestic Movement
  if (!isCrossBorder) {
    return {
      originCountry: originCountryCode,
      destinationCountry: destinationCountryCode,
      isCrossBorder: false,
      baselClassification: isHazardous ? 'ANNEX_VIII_A4140_HAZARDOUS_WASTE' : 'DOMESTIC_CONTROL_ONLY',
      exportPermitRequired: false,
      importPermitRequired: false,
      isTradePermitted: true,
      applicableIncoterms: ['EXW', 'FOB'],
      indicativeTariffPercent: 0,
      oceanFreightEstimatedUsdPerKg: 0,
      customsDocumentationRequirements: isHazardous
        ? ['State Pollution Control Board (SPCB) Form-10 Hazardous Waste Manifest', 'Authorized Transporter Permit']
        : ['Commercial Invoice', 'GST / Domestic Transit Delivery Challan', 'Weighbridge Certificate'],
      evidenceTier: 'STATUTORY_CUSTOMS_RULE',
    };
  }

  // Case 2: Cross-Border Hazardous Waste (Strictly Blocked by Basel Ban Amendment)
  if (isHazardous) {
    return {
      originCountry: originCountryCode,
      destinationCountry: destinationCountryCode,
      isCrossBorder: true,
      baselClassification: 'ANNEX_VIII_A4140_HAZARDOUS_WASTE',
      exportPermitRequired: true,
      importPermitRequired: true,
      isTradePermitted: false,
      prohibitionReason:
        'TRANSBOUNDARY HAZARD PROHIBITION: Petroleum-contaminated rags and biohazard linens are classified as hazardous waste under Basel Annex VIII (Code A4140). International commercial export for open reuse or recovery is strictly prohibited under the Basel Ban Amendment and national hazardous waste import rules.',
      applicableIncoterms: ['EXW'],
      indicativeTariffPercent: 0,
      oceanFreightEstimatedUsdPerKg: 0,
      customsDocumentationRequirements: [
        'Prior Informed Consent (PIC) Notification (Basel Convention Article 6)',
        'Bilateral Inter-Governmental Hazardous Movement Treaty',
        'Certified TSDF Destruction Protocol',
      ],
      evidenceTier: 'STATUTORY_CUSTOMS_RULE',
    };
  }

  // Case 3: Clean Non-Hazardous Secondary Textile Scrap (Basel Annex IX B3030)
  // Permitted secondary textile feedstock: single-stream cut offcuts, yarn bobbins, comber noils
  const quantityKg = passport.quantityKg.value || 0;
  const isFclEligible = quantityKg >= 10000; // 10 MT full container load threshold

  // Indicative customs tariffs based on HS Code
  let indicativeTariff = 5.0; // Standard 5% WTO bound rate for textile offcuts
  if (destinationCountryCode === 'US') {
    indicativeTariff = 4.2; // US HTS 6310 rate
  } else if (destinationCountryCode === 'DE' || destinationCountryCode === 'IT' || destinationCountryCode === 'FR') {
    indicativeTariff = 0.0; // EU autonomous tariff suspension on certain industrial secondary raw materials
  } else if (destinationCountryCode === 'VN') {
    indicativeTariff = 3.0; // Vietnam ASEAN / MFN rate on clean cotton scrap
  }

  const oceanFreightPerKg = isFclEligible ? 0.12 : 0.28; // FCL economies vs LCL consolidated freight

  const customsDocs = [
    'Commercial Shipping Invoice & Packing List',
    `Preferential Certificate of Origin (Form A / COO from ${originCountryCode})`,
    'Non-Hazardous Basel Annex IX Declaration (Code B3030: Clean Textile Wastes)',
    'ISO 1833 Quantitative Fibre Blend Laboratory Certificate',
    'Customs Bill of Lading (B/L) / Clean Sea Waybill',
  ];

  if (passport.fibreComposition.value.toLowerCase().includes('cotton')) {
    customsDocs.push('Plant Quarantine / Phytosanitary Non-Pest Certificate');
  }

  return {
    originCountry: originCountryCode,
    destinationCountry: destinationCountryCode,
    isCrossBorder: true,
    baselClassification: 'ANNEX_IX_B3030_NON_HAZARDOUS_TEXTILE',
    exportPermitRequired: false,
    importPermitRequired: false,
    isTradePermitted: true,
    applicableIncoterms: ['FOB', 'CIF', 'DDP'],
    indicativeTariffPercent: indicativeTariff,
    oceanFreightEstimatedUsdPerKg: oceanFreightPerKg,
    customsDocumentationRequirements: customsDocs,
    evidenceTier: 'INDICATIVE_TRADE_MODEL',
  };
}
