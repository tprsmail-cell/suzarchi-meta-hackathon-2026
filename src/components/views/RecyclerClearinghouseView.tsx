'use client';

import React, { useState } from 'react';
import {
  ContinentRegion,
  FederatedRecyclerProfile,
  RecyclerAccreditationStandard
} from '@/types/phase9';
import { FEDERATED_RECYCLER_DIRECTORY } from '@/data/phase9Data';
import { filterRecyclers, getClearinghouseStats, verifyRecyclerAccreditation } from '@/lib/clearinghouseEngine';
import {
  Globe,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Award,
  Layers,
  Search,
  Filter,
  ExternalLink,
  Mail,
  MapPin
} from 'lucide-react';

export function RecyclerClearinghouseView() {
  const [selectedContinent, setSelectedContinent] = useState<ContinentRegion | 'ALL'>('ALL');
  const [selectedAccreditation, setSelectedAccreditation] = useState<RecyclerAccreditationStandard | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCredentialModal, setActiveCredentialModal] = useState<FederatedRecyclerProfile | null>(null);

  const stats = getClearinghouseStats();
  const filteredRecyclers = filterRecyclers(selectedContinent, selectedAccreditation, searchQuery);

  const continentList: { label: string; value: ContinentRegion | 'ALL'; count: number }[] = [
    { label: 'All Continents', value: 'ALL', count: FEDERATED_RECYCLER_DIRECTORY.length },
    { label: 'Asia', value: 'ASIA', count: FEDERATED_RECYCLER_DIRECTORY.filter((r) => r.continent === 'ASIA').length },
    { label: 'Europe', value: 'EUROPE', count: FEDERATED_RECYCLER_DIRECTORY.filter((r) => r.continent === 'EUROPE').length },
    { label: 'North America', value: 'NORTH_AMERICA', count: FEDERATED_RECYCLER_DIRECTORY.filter((r) => r.continent === 'NORTH_AMERICA').length },
    { label: 'South America', value: 'SOUTH_AMERICA', count: FEDERATED_RECYCLER_DIRECTORY.filter((r) => r.continent === 'SOUTH_AMERICA').length },
    { label: 'Africa & Oceania', value: 'AFRICA_OCEANIA', count: FEDERATED_RECYCLER_DIRECTORY.filter((r) => r.continent === 'AFRICA_OCEANIA').length },
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Phase 9.3 • Global Clearinghouse
            </span>
            <span className="text-[10px] font-mono text-gray-500">
              International Recycler Federation • 5 Continents
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 mt-1">
            International Recycler Federation Clearinghouse
          </h1>
          <p className="text-xs text-gray-600">
            Decentralized federated clearinghouse verifying credentials, capacity, and accreditations (GRS, OEKO-TEX STeP, ISO 14001) across five continents.
          </p>
        </div>
      </div>

      {/* 4-KPI SUMMARY ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#0F2D1F] to-[#1B4332] p-5 text-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Federation Capacity</span>
            <Globe className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold mt-2 text-white">
            {(stats.totalAnnualCapacityTons / 1000).toFixed(0)}k Tons/Yr
          </div>
          <p className="text-[11px] text-emerald-200/80 mt-1">
            Aggregated circular recycling capacity across accredited facilities.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Continents Covered</span>
            <MapPin className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-extrabold mt-2 text-gray-900">
            5 Continents
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Asia, Europe, North America, South America & Africa/Oceania.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Accredited Recyclers</span>
            <Building2 className="h-4 w-4 text-teal-700" />
          </div>
          <div className="text-2xl font-extrabold mt-2 text-gray-900">
            {stats.totalRecyclersCount} Entities
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            100% verified with active GRS or ISO 14001 audits on file.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Average Trust Score</span>
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-extrabold mt-2 text-emerald-800">
            {stats.averageTrustScore}%
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Zero unresolved quality disputes or illegal transboundary shipments.
          </p>
        </div>
      </div>

      {/* CONTINENT SELECTOR BUTTONS */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        {continentList.map((c) => (
          <button
            key={c.value}
            onClick={() => setSelectedContinent(c.value)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
              selectedContinent === c.value
                ? 'bg-[#0F2D1F] text-white shadow-xs'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{c.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                selectedContinent === c.value ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {c.count}
            </span>
          </button>
        ))}
      </div>

      {/* SEARCH AND ACCREDITATION FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search recycler name, city, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 w-full"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] text-gray-500 font-semibold whitespace-nowrap">Filter Standard:</span>
          <select
            value={selectedAccreditation}
            onChange={(e) => setSelectedAccreditation(e.target.value as any)}
            className="text-xs rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 w-full sm:w-auto"
          >
            <option value="ALL">All Standards</option>
            <option value="GRS_GLOBAL_RECYCLED_STANDARD">Global Recycled Standard (GRS)</option>
            <option value="OEKO_TEX_STEP">OEKO-TEX STeP</option>
            <option value="ISO_14001_ENVIRONMENTAL">ISO 14001 Environmental</option>
            <option value="EU_CIRCULAR_ECONOMY_CLEARINGHOUSE">EU Circular Economy Clearinghouse</option>
            <option value="HIGG_INDEX_FEM">Higg Index FEM</option>
          </select>
        </div>
      </div>

      {/* RECYCLER PROFILES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecyclers.map((rec) => (
          <div
            key={rec.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs hover:border-emerald-300 transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {rec.continent.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mt-1.5 leading-snug">
                    {rec.tradeName}
                  </h3>
                  <div className="text-[11px] text-gray-500 font-medium">
                    {rec.legalEntityName}
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-emerald-100 text-emerald-900 text-xs font-black px-2.5 py-0.5 inline-block">
                    {rec.clearinghouseTrustScore}% Trust
                  </span>
                  <div className="text-[9px] text-gray-400 mt-0.5">Member since {rec.clearinghouseMemberSince.slice(0, 4)}</div>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-gray-600 bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-semibold">Location:</span>
                  <span className="font-semibold text-gray-800">{rec.city} ({rec.countryCode})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-semibold">Processing:</span>
                  <span className="font-semibold text-gray-800">{rec.primaryProcessingType.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-semibold">Annual Capacity:</span>
                  <span className="font-bold text-emerald-800">{rec.annualRecyclingCapacityTons.toLocaleString()} tons/yr</span>
                </div>
              </div>

              {/* Accreditations Badges */}
              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Verified Accreditations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {rec.activeAccreditations.map((a, i) => (
                    <span
                      key={i}
                      className="rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                      {a.standard.split('_')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-gray-400 font-mono">ID: {rec.id}</span>
              <button
                onClick={() => setActiveCredentialModal(rec)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 px-3 py-1.5 text-xs font-bold text-white transition shadow-2xs"
              >
                <span>Inspect Credentials</span>
                <Award className="h-3.5 w-3.5 text-emerald-300" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREDENTIAL INSPECTION MODAL */}
      {activeCredentialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800">
                  Federation Clearinghouse Dossier
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  {activeCredentialModal.tradeName}
                </h3>
                <p className="text-xs text-gray-500">{activeCredentialModal.legalEntityName}</p>
              </div>
              <button
                onClick={() => setActiveCredentialModal(null)}
                className="text-gray-400 hover:text-gray-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                Active Third-Party Certificates on File ({activeCredentialModal.activeAccreditations.length})
              </h4>
              <div className="space-y-2">
                {activeCredentialModal.activeAccreditations.map((a, idx) => (
                  <div key={idx} className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950">{a.standard.replace(/_/g, ' ')}</span>
                      <span className="rounded bg-emerald-200 text-emerald-950 text-[9px] font-bold px-1.5 py-0.2">
                        Active Verified
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-600">Cert #: <span className="font-mono font-semibold">{a.certificateNumber}</span></div>
                    <div className="text-[10px] text-gray-500">Auditor: {a.issuingAuditor} • Valid until: {a.validUntil}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs space-y-1">
                <div className="text-gray-500 font-semibold">Federated Contact Desk:</div>
                <div className="font-mono text-emerald-900 font-bold">{activeCredentialModal.contactDeskEmail}</div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setActiveCredentialModal(null)}
                className="rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
