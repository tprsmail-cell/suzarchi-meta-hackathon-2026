'use client';

import React, { useState, useMemo } from 'react';
import { useLocale } from '@/lib/localeContext';
import { 
  BarChart3, 
  TrendingUp, 
  Globe2, 
  MapPin, 
  ShieldCheck, 
  Activity,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Scale,
  Building2,
  Compass,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { GLOBAL_COUNTRY_PROFILES, CountryCode } from '@/lib/countries';
import { NavViewType } from '@/components/Sidebar';

export type GlobalWorldRegion = 
  | 'ALL'
  | 'Asia'
  | 'Europe'
  | 'North America'
  | 'South America'
  | 'Africa'
  | 'Oceania';

export type EvidenceClassification = 
  | 'VERIFIED_BENCHMARK'
  | 'DEMO_MODEL'
  | 'ESTIMATED_CAPACITY'
  | 'UNDER_ASSESSMENT';

export interface RegionalHubData {
  id: string;
  city: string;
  country: string;
  countryCode: CountryCode;
  region: 'Asia' | 'Europe' | 'North America' | 'South America' | 'Africa' | 'Oceania';
  role: string;
  volumeTonnesMonth: number;
  circularRatePct: number;
  primaryStream: string;
  classification: EvidenceClassification;
  regulatoryContext: string;
  crossBorderPotential: string;
}

export const GLOBAL_REGIONAL_HUBS: RegionalHubData[] = [
  // --- ASIA (Preserving original Indian hubs + East/SE Asia) ---
  {
    id: 'hub-in-tirupur',
    city: 'Tiruppur',
    country: 'India',
    countryCode: 'IN',
    region: 'Asia',
    role: 'Cotton Knitwear Trimmings, Fabric Roll Ends & Dyehouse Sludge Control',
    volumeTonnesMonth: 14200,
    circularRatePct: 86,
    primaryStream: 'Single Jersey & Rib Knits (Cotton / Elastane)',
    classification: 'VERIFIED_BENCHMARK',
    regulatoryContext: 'CPCB / TNPCB Zero Liquid Discharge & Hazardous Waste Rules 2016',
    crossBorderPotential: 'Supplies mechanical shoddy garnetting & open-end spinning mills across South Asia.',
  },
  {
    id: 'hub-in-coimbatore',
    city: 'Coimbatore',
    country: 'India',
    countryCode: 'IN',
    region: 'Asia',
    role: 'Spinning Mill Comber Noil, Carding Fly & Blow-Room Caddis Reclaim',
    volumeTonnesMonth: 22400,
    circularRatePct: 92,
    primaryStream: 'Pure Combed Cotton Short Staple Fiber (<24mm)',
    classification: 'VERIFIED_BENCHMARK',
    regulatoryContext: 'Textiles Committee Quality Verification & Indian EPR Framework',
    crossBorderPotential: 'Direct feedstock for pharmaceutical absorbent cotton and high-count open-end yarn.',
  },
  {
    id: 'hub-in-kanchipuram',
    city: 'Kanchipuram',
    country: 'India',
    countryCode: 'IN',
    region: 'Asia',
    role: 'Handloom Mulberry Silk Thrums & Metallized Silver/Gold Zari Smelting',
    volumeTonnesMonth: 180,
    circularRatePct: 98,
    primaryStream: 'Degummed Mulberry Silk & Fine Silver-Gilt Wire',
    classification: 'VERIFIED_BENCHMARK',
    regulatoryContext: 'Geographical Indication (GI) Heritage Protocol & Precious Metal Reclamation',
    crossBorderPotential: 'Precious metal recovery + spun silk circular blends for high-luxury fashion.',
  },
  {
    id: 'hub-in-panipat',
    city: 'Panipat',
    country: 'India',
    countryCode: 'IN',
    region: 'Asia',
    role: 'Global Shoddy Yarn Capital, Mechanical Tearing & Thermal Insulation Blankets',
    volumeTonnesMonth: 38000,
    circularRatePct: 89,
    primaryStream: 'Post-Consumer Tailoring Clips & Blended Knits',
    classification: 'VERIFIED_BENCHMARK',
    regulatoryContext: 'MoEFCC Secondary Fiber Standards & Air Quality Emission Controls',
    crossBorderPotential: 'Largest mechanical garnetting center receiving clean post-industrial clips globally.',
  },
  {
    id: 'hub-in-surat',
    city: 'Surat',
    country: 'India',
    countryCode: 'IN',
    region: 'Asia',
    role: 'Synthetic Polyester Filament Weaving Roll Ends & Micro-Denier Depolymerization',
    volumeTonnesMonth: 28500,
    circularRatePct: 78,
    primaryStream: 'PET / Nylon Microfiber Weaving Surplus',
    classification: 'VERIFIED_BENCHMARK',
    regulatoryContext: 'GPCB Industrial Waste Monitoring & Chemical Recycling Directives',
    crossBorderPotential: 'Export grade secondary polymer pellets for technical geogrids and packaging.',
  },
  {
    id: 'hub-vn-hcm',
    city: 'Ho Chi Minh City & Binh Duong',
    country: 'Vietnam',
    countryCode: 'VN',
    region: 'Asia',
    role: 'High-Volume Apparel Cutting Waste, Poly-Cotton Interlock & Footwear Canvas',
    volumeTonnesMonth: 18600,
    circularRatePct: 82,
    primaryStream: 'Export Garment Table Clips (Cotton/Poly Blends)',
    classification: 'DEMO_MODEL',
    regulatoryContext: 'Vietnam Law on Environmental Protection 2020 / National EPR Framework',
    crossBorderPotential: 'Key regional supplier for Southeast Asian circular open-end spinning corridors.',
  },
  {
    id: 'hub-cn-shaoxing',
    city: 'Shaoxing (Keqiao) & Jiangsu',
    country: 'China',
    countryCode: 'CN',
    region: 'Asia',
    role: 'World Textile City Recycled PET Filament Spinning & Circular Dyehouse Integration',
    volumeTonnesMonth: 65000,
    circularRatePct: 91,
    primaryStream: 'Synthetic Filament Surplus & Circular Circular Weaving Roll Goods',
    classification: 'ESTIMATED_CAPACITY',
    regulatoryContext: 'China Circular Economy Promotion Law & Solid Waste Import Ban Compliance',
    crossBorderPotential: 'Massive closed-loop polyester depolymerization and high-count rPET yarns.',
  },

  // --- EUROPE ---
  {
    id: 'hub-it-prato',
    city: 'Prato',
    country: 'Italy',
    countryCode: 'IT',
    region: 'Europe',
    role: 'Historic Mechanical Carded Wool & Cashmere Regeneration (Lana Cardata)',
    volumeTonnesMonth: 16500,
    circularRatePct: 94,
    primaryStream: 'Regenerated Wool, Cashmere & Noble Animal Fibers',
    classification: 'VERIFIED_BENCHMARK',
    regulatoryContext: 'EU Ecodesign (ESPR), Digital Product Passport (DPP), Italian Circular Economy Strategy',
    crossBorderPotential: 'Global luxury benchmark: closed-loop circular wool recycling without re-dyeing.',
  },
  {
    id: 'hub-fr-hauts',
    city: 'Hauts-de-France & Lyon',
    country: 'France',
    countryCode: 'FR',
    region: 'Europe',
    role: 'Technical Synthetic Upcycling, Circular Luxury Silk & Post-Consumer Textile Sorting',
    volumeTonnesMonth: 8200,
    circularRatePct: 84,
    primaryStream: 'High-End Jacquard Trimmings & Technical Polymer Membranes',
    classification: 'DEMO_MODEL',
    regulatoryContext: 'French AGEC Law (Anti-Gaspillage) & EU ESPR Mandatory Fiber Labeling',
    crossBorderPotential: 'Automated optical sorting hubs feeding mechanical and thermo-mechanical recyclers.',
  },
  {
    id: 'hub-de-saxony',
    city: 'Saxony & Bavaria',
    country: 'Germany',
    countryCode: 'DE',
    region: 'Europe',
    role: 'Automotive Acoustic Nonwovens & Industrial Technical Insulation Felts',
    volumeTonnesMonth: 24000,
    circularRatePct: 88,
    primaryStream: 'Mixed Synthetic Nonwovens, Bicomponent Shoddy, Aramid Scraps',
    classification: 'VERIFIED_BENCHMARK',
    regulatoryContext: 'Kreislaufwirtschaftsgesetz (KrWG), EU ESPR & German Supply Chain Act (LkSG)',
    crossBorderPotential: 'Direct integration with European automotive interior & underbody soundproofing.',
  },
  {
    id: 'hub-es-valencia',
    city: 'Ontinyent & Valencia',
    country: 'Spain',
    countryCode: 'ES',
    region: 'Europe',
    role: 'Open-End Recycled Cotton Yarn Spinning & Color-Sorted Clip Defibering',
    volumeTonnesMonth: 19500,
    circularRatePct: 90,
    primaryStream: 'Color-Sorted Pre-Consumer Cotton Clips',
    classification: 'VERIFIED_BENCHMARK',
    regulatoryContext: 'Spanish Law 7/2022 on Waste and Contaminated Soils / EU ESPR',
    crossBorderPotential: 'European center for zero-water, zero-dye recycled color rotor spinning.',
  },
  {
    id: 'hub-gb-yorkshire',
    city: 'West Yorkshire & Leicester',
    country: 'United Kingdom',
    countryCode: 'GB',
    region: 'Europe',
    role: 'Heritage Shoddy Machinery, Wool Rag Pulling & Institutional Mattress Felt Pad Reclaim',
    volumeTonnesMonth: 7800,
    circularRatePct: 85,
    primaryStream: 'Wool-Rich Suiting Clips & Flame-Retardant Mattress Felt',
    classification: 'DEMO_MODEL',
    regulatoryContext: 'UK Environmental Protection Act & Waste Resources Action Programme (WRAP)',
    crossBorderPotential: 'Supplies acoustic baffling and circular horticultural growing mats.',
  },

  // --- NORTH AMERICA ---
  {
    id: 'hub-us-carolinas',
    city: 'Carolinas Textile Corridor',
    country: 'United States',
    countryCode: 'US',
    region: 'North America',
    role: 'High-Speed Nonwoven Needlepunching & Hydroentangled Industrial Cleaning Substrates',
    volumeTonnesMonth: 32000,
    circularRatePct: 87,
    primaryStream: 'Carded Cotton Waste, Spunlace Trim & Geotextile Off-Cuts',
    classification: 'VERIFIED_BENCHMARK',
    regulatoryContext: 'US EPA Resource Conservation & Recovery Act (RCRA) / Cal. SB 707 Textile Stewardship',
    crossBorderPotential: 'Largest North American industrial wiping & automotive acoustic pad converter.',
  },
  {
    id: 'hub-ca-montreal',
    city: 'Montreal & Quebec Region',
    country: 'Canada',
    countryCode: 'CA',
    region: 'North America',
    role: 'Post-Consumer Outerwear Down Reclaim & Synthetic Technical Apparel Defibering',
    volumeTonnesMonth: 6400,
    circularRatePct: 79,
    primaryStream: 'Heavyweight Nylon Canvas, Recycled Down & Polyester Microfleece',
    classification: 'DEMO_MODEL',
    regulatoryContext: 'Canadian Environmental Protection Act (CEPA) / Canada Plastics & Textile Pact',
    crossBorderPotential: 'Closed-loop down sterilization and high-durability winter outerwear remanufacturing.',
  },

  // --- SOUTH AMERICA ---
  {
    id: 'hub-br-sp',
    city: 'Americana & Santa Bárbara d’Oeste',
    country: 'Brazil',
    countryCode: 'BR',
    region: 'South America',
    role: 'Denim Garment Cutting Defibering, Open-End Rotor Yarns & Agro-Textile Coverings',
    volumeTonnesMonth: 15400,
    circularRatePct: 83,
    primaryStream: 'Indigo Dyed Cotton Denim Clips & Weaving Selvages',
    classification: 'DEMO_MODEL',
    regulatoryContext: 'Política Nacional de Resíduos Sólidos (PNRS) / Federal Law 12.305',
    crossBorderPotential: 'Mercosur leader in closed-loop denim-to-denim circular yarn production.',
  },

  // --- AFRICA ---
  {
    id: 'hub-za-ct',
    city: 'Cape Town & KwaZulu-Natal',
    country: 'South Africa',
    countryCode: 'ZA',
    region: 'Africa',
    role: 'Post-Consumer Garment Sorting Hub, Mechanical Rag Wiping & Agricultural Shading',
    volumeTonnesMonth: 9100,
    circularRatePct: 76,
    primaryStream: 'Mixed Post-Consumer Linens & Cotton Workwear',
    classification: 'UNDER_ASSESSMENT',
    regulatoryContext: 'National Environmental Management Waste Act (NEMWA) / SA EPR Directives',
    crossBorderPotential: 'African Continental Free Trade Area (AfCFTA) circular textile gateway.',
  },

  // --- OCEANIA ---
  {
    id: 'hub-au-mel',
    city: 'Melbourne & Geelong',
    country: 'Australia',
    countryCode: 'AU',
    region: 'Oceania',
    role: 'Circular Merino Wool Innovation Corridor & End-of-Life Cotton Divergence Network',
    volumeTonnesMonth: 5200,
    circularRatePct: 81,
    primaryStream: 'Fine Micron Merino Wool Waste, Medical Cotton Sheets & Workwear',
    classification: 'DEMO_MODEL',
    regulatoryContext: 'National Clothing Product Stewardship Scheme (Seamless) / Recycling Act',
    crossBorderPotential: 'Super-fine micron wool reclamation & biological soil remediation mulch.',
  },
];

interface AnalyticsViewProps {
  onNavigateView?: (view: NavViewType) => void;
}

export function AnalyticsView({ onNavigateView }: AnalyticsViewProps) {
  const { t, language, currency, formatPriceDisplay } = useLocale();

  const [selectedRegion, setSelectedRegion] = useState<GlobalWorldRegion>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');

  // Filtered Hubs List
  const filteredHubs = useMemo(() => {
    return GLOBAL_REGIONAL_HUBS.filter((hub) => {
      const matchRegion = selectedRegion === 'ALL' || hub.region === selectedRegion;
      const matchCountry = selectedCountry === 'ALL' || hub.countryCode === selectedCountry;
      return matchRegion && matchCountry;
    });
  }, [selectedRegion, selectedCountry]);

  // Regional Aggregations
  const stats = useMemo(() => {
    const totalVolume = filteredHubs.reduce((acc, h) => acc + h.volumeTonnesMonth, 0);
    const avgCircularRate = filteredHubs.length > 0
      ? Math.round(filteredHubs.reduce((acc, h) => acc + h.circularRatePct, 0) / filteredHubs.length)
      : 0;
    
    // Average indicative value per tonne: ~$650 USD
    const estimatedValueUsd = totalVolume * 650;
    const { displayString } = formatPriceDisplay(estimatedValueUsd, 'USD');

    return {
      hubCount: filteredHubs.length,
      totalVolume,
      avgCircularRate,
      estimatedValue: displayString,
    };
  }, [filteredHubs, formatPriceDisplay]);

  // Unique country codes in current view
  const availableCountries = useMemo(() => {
    const codes = new Set(GLOBAL_REGIONAL_HUBS.map((h) => h.countryCode));
    return Array.from(codes);
  }, []);

  const getBadgeStyle = (classification: EvidenceClassification) => {
    switch (classification) {
      case 'VERIFIED_BENCHMARK':
        return {
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
          label: t.analytics.verifiedBenchmark,
          dot: 'bg-emerald-600',
        };
      case 'DEMO_MODEL':
        return {
          bg: 'bg-blue-50 text-blue-900 border-blue-200',
          label: t.analytics.demonstrationModel,
          dot: 'bg-blue-600',
        };
      case 'ESTIMATED_CAPACITY':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          label: t.analytics.estimatedCapacity,
          dot: 'bg-amber-600',
        };
      case 'UNDER_ASSESSMENT':
      default:
        return {
          bg: 'bg-gray-100 text-gray-800 border-gray-300',
          label: t.analytics.underAssessment,
          dot: 'bg-gray-500',
        };
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* 1. Header Bar with Global Identity */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-gray-200/90 bg-white p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 shadow-2xs">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                  {t.analytics.title}
                </h1>
                <span className="rounded-full bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-200">
                  6 Continents
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {t.analytics.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls & Recycler Directory Shortcut */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onNavigateView && (
            <button
              onClick={() => onNavigateView('clearinghouse')}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-950 hover:bg-emerald-100 transition shadow-2xs"
            >
              <Building2 className="h-3.5 w-3.5 text-emerald-700" />
              <span>{t.analytics.openRecyclerClearinghouse}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}

          <span className="flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-3 py-1 text-xs font-bold text-emerald-950">
            <Activity className="h-3.5 w-3.5 text-emerald-700 animate-pulse" />
            {t.analytics.liveClusterNetwork}
          </span>
        </div>
      </div>

      {/* 2. Global Evidence & Truthfulness Legend Banner (Strict Boundary) */}
      <div className="rounded-xl border border-gray-200/90 bg-gradient-to-r from-gray-50 via-emerald-50/30 to-gray-50 p-3.5 text-xs text-gray-700 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-gray-200/60 pb-2.5 mb-2.5">
          <div className="flex items-center gap-1.5 font-bold text-gray-900">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Empirical Evidence Governance & Demonstration Transparency</span>
          </div>
          <span className="text-[11px] text-gray-500">
            Active Currency: <strong className="text-emerald-900">{currency}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
            <span><strong>Verified:</strong> Industrial Trade Benchmark</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
            <span><strong>Demo Model:</strong> Illustrative Cluster</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-600 shrink-0" />
            <span><strong>Estimated:</strong> Capacity Projection</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gray-500 shrink-0" />
            <span><strong>Under Assessment:</strong> Emerging Hub</span>
          </div>
        </div>
      </div>

      {/* 3. Global Region & Country Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200/90 bg-white p-3.5 shadow-2xs">
        {/* World Region Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(['ALL', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'] as GlobalWorldRegion[]).map((region) => {
            const isActive = selectedRegion === region;
            const regionLabels: Record<GlobalWorldRegion, string> = {
              ALL: t.analytics.allRegions,
              Asia: t.analytics.asia,
              Europe: t.analytics.europe,
              'North America': t.analytics.northAmerica,
              'South America': t.analytics.southAmerica,
              Africa: t.analytics.africa,
              Oceania: t.analytics.oceania,
            };

            return (
              <button
                key={region}
                onClick={() => {
                  setSelectedRegion(region);
                  setSelectedCountry('ALL');
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#133827] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {regionLabels[region]}
              </button>
            );
          })}
        </div>

        {/* Country Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-800 focus:outline-hidden focus:border-emerald-600"
            aria-label={t.analytics.filterByCountry}
          >
            <option value="ALL">{t.analytics.allCountries}</option>
            {availableCountries.map((code) => {
              const profile = GLOBAL_COUNTRY_PROFILES[code];
              if (!profile) return null;
              return (
                <option key={code} value={code}>
                  {profile.flagEmoji} {profile.name} ({code})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* 4. Macro Aggregation Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-gray-200/90 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Monitored Regional Hubs
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-black text-gray-900">{stats.hubCount}</span>
            <span className="text-[11px] text-gray-500">Clusters Active</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/90 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Monthly Material Throughput
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-800">
              {stats.totalVolume.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-500">tonnes / mo</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/90 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Average Circular Conversion
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-800">{stats.avgCircularRate}%</span>
            <span className="text-[11px] text-emerald-700 font-semibold">Diversion Target</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/90 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Est. Monthly Economic Flow ({currency})
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-black text-gray-900 truncate">{stats.estimatedValue}</span>
          </div>
        </div>
      </div>

      {/* 5. Regional Industrial Corridors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHubs.map((hub) => {
          const badge = getBadgeStyle(hub.classification);
          const countryProfile = GLOBAL_COUNTRY_PROFILES[hub.countryCode];

          return (
            <div
              key={hub.id}
              className="rounded-xl border border-gray-200/90 bg-white p-4 shadow-2xs flex flex-col justify-between space-y-3 hover:border-emerald-300 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2.5">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900">
                      <span>{countryProfile?.flagEmoji || '🌐'}</span>
                      <span>{hub.city}, {hub.country}</span>
                    </div>
                    <span className="text-[10px] font-medium text-emerald-800 block mt-0.5">
                      {hub.region} • {countryProfile?.tradeBlock || 'International Trade'}
                    </span>
                  </div>

                  <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold text-emerald-900 shrink-0">
                    {hub.circularRatePct}% {t.analytics.conversionRate}
                  </span>
                </div>

                {/* Evidence Classification Badge */}
                <div className="mt-2.5 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9.5px] font-bold ${badge.bg}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {hub.countryCode}
                  </span>
                </div>

                {/* Industrial Role & Primary Stream */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <p className="text-[11px] font-medium text-gray-800 leading-relaxed">
                    {hub.role}
                  </p>
                  <div className="rounded-lg bg-gray-50 p-2 text-[10px] text-gray-600">
                    <span className="font-bold text-gray-700">Primary Feedstock: </span>
                    {hub.primaryStream}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer: Logistics & Throughput */}
              <div className="space-y-2 border-t border-gray-100 pt-3 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{t.analytics.throughput}:</span>
                  <span className="font-bold text-gray-900">
                    {hub.volumeTonnesMonth.toLocaleString()} t / mo
                  </span>
                </div>

                <div className="rounded bg-emerald-50/50 p-1.5 text-[10px] text-emerald-950/80 leading-normal">
                  <strong>Circular Opportunity: </strong>
                  {hub.crossBorderPotential}
                </div>

                <div className="text-[9px] text-gray-400 truncate" title={hub.regulatoryContext}>
                  <strong>Jurisdiction: </strong>
                  {hub.regulatoryContext}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Cross-Border Circular Opportunities & Basel Convention Governance */}
      <div className="rounded-xl border border-gray-200/90 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900">
              {t.analytics.crossBorderOpportunities}
            </h2>
          </div>
          <span className="text-[10px] font-semibold text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded">
            Basel Convention B3030 Regulated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-950">
              <span>Southeast Asia ➔ South Asia</span>
              <span className="text-emerald-700 font-mono">B3030</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Export of clean Vietnam poly-cotton cutting table trimmings (`mat-001`) into Panipat and Tiruppur for high-efficiency mechanical shoddy garnetting and rotor open-end yarn spinning.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-semibold">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>Complies with Basel Annex IX Non-Hazardous Textile Waste</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-950">
              <span>North America ➔ Southern Europe</span>
              <span className="text-emerald-700 font-mono">B3030</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Consolidation of US denim cutting scraps from North Carolina corridors routed into Prato (Italy) carded wool-denim blended heritage winter blankets.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-semibold">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>EU ESPR DPP Digital Product Passport Verification Ready</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-950">
              <span>South Asia ➔ Western Europe</span>
              <span className="text-emerald-700 font-mono">B3030</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Mulberry silk handloom thrums from Kanchipuram routed into Lyon (France) circular luxury research for biological peptide extraction and spun silk fine yarn.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-semibold">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>Zero Chemicals Added; 100% Biodegradable Protein Feedstock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
