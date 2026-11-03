/**
 * SUZARCHI Global Platform — Country Profiles & Regional Jurisdiction Architecture
 * Maps countries, default currencies, measurement standards, and regulatory frameworks.
 */

import { CurrencyCode } from './currencies';
import { SupportedLanguage } from './translations';
import { UnitSystem } from './units';

export type CountryCode = 'IN' | 'US' | 'CA' | 'DE' | 'FR' | 'IT' | 'ES' | 'GB' | 'CN' | 'TW' | 'VN' | 'BR' | 'ZA' | 'AU';

export interface GlobalCountryProfile {
  code: CountryCode;
  name: string;
  flagEmoji: string;
  globalRegion: 'South Asia' | 'North America' | 'Europe' | 'East Asia' | 'Southeast Asia' | 'South America' | 'Africa' | 'Oceania' | 'Asia';
  defaultLanguage: SupportedLanguage;
  defaultCurrency: CurrencyCode;
  measurementConvention: UnitSystem;
  regulatoryJurisdiction: string;
  tradeBlock: string;
  primaryIndustrialClusters: string[];
}

export const GLOBAL_COUNTRY_PROFILES: Record<CountryCode, GlobalCountryProfile> = {
  IN: {
    code: 'IN',
    name: 'India',
    flagEmoji: '🇮🇳',
    globalRegion: 'South Asia',
    defaultLanguage: 'en',
    defaultCurrency: 'INR',
    measurementConvention: 'metric',
    regulatoryJurisdiction: 'CPCB / MoEFCC Hazardous Waste Rules 2016',
    tradeBlock: 'SAFTA / Indo-Pacific Corridors',
    primaryIndustrialClusters: ['Tiruppur Knitwear', 'Coimbatore Spinning', 'Panipat Shoddy', 'Surat Synthetics'],
  },
  US: {
    code: 'US',
    name: 'United States',
    flagEmoji: '🇺🇸',
    globalRegion: 'North America',
    defaultLanguage: 'en',
    defaultCurrency: 'USD',
    measurementConvention: 'imperial',
    regulatoryJurisdiction: 'US EPA RCRA / FTC Green Guides / Cal. SB 707',
    tradeBlock: 'USMCA',
    primaryIndustrialClusters: ['Carolinas Nonwoven Corridor', 'Georgia Carpet Recycling', 'California Apparel Reclaim'],
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    flagEmoji: '🇨🇦',
    globalRegion: 'North America',
    defaultLanguage: 'en',
    defaultCurrency: 'CAD',
    measurementConvention: 'metric',
    regulatoryJurisdiction: 'CEPA Environmental Protection / Canada Plastics & Textile Pact',
    tradeBlock: 'USMCA',
    primaryIndustrialClusters: ['Quebec Technical Textiles', 'Ontario Circular Processing'],
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    flagEmoji: '🇩🇪',
    globalRegion: 'Europe',
    defaultLanguage: 'de',
    defaultCurrency: 'EUR',
    measurementConvention: 'metric',
    regulatoryJurisdiction: 'EU Ecodesign (ESPR) / DPP / Kreislaufwirtschaftsgesetz (KrWG)',
    tradeBlock: 'EU Single Market',
    primaryIndustrialClusters: ['Saxony Technical Textiles', 'Bavaria Nonwovens', 'North Rhine-Westphalia Reclaim'],
  },
  FR: {
    code: 'FR',
    name: 'France',
    flagEmoji: '🇫🇷',
    globalRegion: 'Europe',
    defaultLanguage: 'fr',
    defaultCurrency: 'EUR',
    measurementConvention: 'metric',
    regulatoryJurisdiction: 'EU ESPR / French AGEC Law (Anti-Waste & Circular Economy)',
    tradeBlock: 'EU Single Market',
    primaryIndustrialClusters: ['Hauts-de-France Upcycling', 'Lyon Silk & Synthetic Reclaim'],
  },
  IT: {
    code: 'IT',
    name: 'Italy',
    flagEmoji: '🇮🇹',
    globalRegion: 'Europe',
    defaultLanguage: 'it',
    defaultCurrency: 'EUR',
    measurementConvention: 'metric',
    regulatoryJurisdiction: 'EU ESPR / Italian National Circular Economy Strategy',
    tradeBlock: 'EU Single Market',
    primaryIndustrialClusters: ['Prato Recycled Wool District', 'Biella Fine Spinning', 'Como Silk & Prints'],
  },
  ES: {
    code: 'ES',
    name: 'Spain',
    flagEmoji: '🇪🇸',
    globalRegion: 'Europe',
    defaultLanguage: 'es',
    defaultCurrency: 'EUR',
    measurementConvention: 'metric',
    regulatoryJurisdiction: 'EU ESPR / Ley 7/2022 Residuos y Suelos Contaminados',
    tradeBlock: 'EU Single Market',
    primaryIndustrialClusters: ['Ontinyent-Valencia Recycled Yarn', 'Catalonia Garment Remanufacturing'],
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    flagEmoji: '🇬🇧',
    globalRegion: 'Europe',
    defaultLanguage: 'en',
    defaultCurrency: 'GBP',
    measurementConvention: 'metric',
    regulatoryJurisdiction: 'UK Environmental Protection Act / Extended Producer Responsibility',
    tradeBlock: 'UK-EU Trade Agreement',
    primaryIndustrialClusters: ['West Yorkshire Shoddy Heritage', 'Leicester Knitwear & Sourcing'],
  },
  CN: {
    code: 'CN',
    name: 'China',
    flagEmoji: '🇨🇳',
    globalRegion: 'East Asia',
    defaultLanguage: 'zh-CN',
    defaultCurrency: 'CNY',
    measurementConvention: 'metric',
    regulatoryJurisdiction: 'Circular Economy Promotion Law / Solid Waste Law',
    tradeBlock: 'RCEP',
    primaryIndustrialClusters: ['Shaoxing Keqiao Textile City', 'Jiangsu Synthetic Fiber', 'Guangdong Circular Garment'],
  },
  TW: {
    code: 'TW',
    name: 'Taiwan',
    flagEmoji: '🇹🇼',
    globalRegion: 'East Asia',
    defaultLanguage: 'zh-TW',
    defaultCurrency: 'TWD',
    measurementConvention: 'metric',
    regulatoryJurisdiction: 'Waste Disposal Act / Resource Recycling Regulations',
    tradeBlock: 'East Asian High-Tech Textile Network',
    primaryIndustrialClusters: ['Changhua Functional Textiles', 'Tainan Recycled Polyester & Nylon'],
  },
  VN: {
    code: 'VN',
    name: 'Vietnam',
    flagEmoji: '🇻🇳',
    globalRegion: 'Southeast Asia',
    defaultLanguage: 'vi',
    defaultCurrency: 'VND',
    measurementConvention: 'metric',
    regulatoryJurisdiction: 'Law on Environmental Protection 2020 / National EPR Framework',
    tradeBlock: 'CPTPP / ASEAN / EVFTA',
    primaryIndustrialClusters: ['Ho Chi Minh Garment Belt', 'Binh Duong Processing', 'Hai Phong Export Zones'],
  },
  BR: {
    code: 'BR',
    name: 'Brazil',
    flagEmoji: '🇧🇷',
    globalRegion: 'South America',
    defaultLanguage: 'es',
    defaultCurrency: 'USD',
    measurementConvention: 'metric',
    regulatoryJurisdiction: 'Política Nacional de Resíduos Sólidos (PNRS) / Federal Law 12.305',
    tradeBlock: 'Mercosur',
    primaryIndustrialClusters: ['Americana-Santa Bárbara Cotton Corridor', 'Blumenau Knitted Textiles', 'São Paulo Circular Reclaim'],
  },
  ZA: {
    code: 'ZA',
    name: 'South Africa',
    flagEmoji: '🇿🇦',
    globalRegion: 'Africa',
    defaultLanguage: 'en',
    defaultCurrency: 'USD',
    measurementConvention: 'metric',
    regulatoryJurisdiction: 'National Environmental Management Waste Act (NEMWA) / Extended Producer Responsibility',
    tradeBlock: 'AfCFTA / SADC',
    primaryIndustrialClusters: ['Cape Town Garment Sorting Hub', 'KwaZulu-Natal Textile Belt', 'Johannesburg Industrial Reclaim'],
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    flagEmoji: '🇦🇺',
    globalRegion: 'Oceania',
    defaultLanguage: 'en',
    defaultCurrency: 'USD',
    measurementConvention: 'metric',
    regulatoryJurisdiction: 'National Clothing Product Stewardship Scheme (Seamless) / Recycling Act',
    tradeBlock: 'Indo-Pacific / CPTPP / AUKUS',
    primaryIndustrialClusters: ['Melbourne Circular Fiber Hub', 'Geelong Wool Innovation Corridor', 'Sydney Garment Divergence'],
  },
};
