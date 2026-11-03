'use client';

import React, { useState } from 'react';
import { MaterialPassport } from '@/types/passport';
import { Scope3GhgRecord, Scope3VerificationCertificate } from '@/types/phase9';
import { INITIAL_SCOPE3_RECORDS, PRIMARY_EMISSION_FACTORS } from '@/data/phase9Data';
import { calculateScope3GhgAccounting, issueScope3VerificationCertificate } from '@/lib/scope3GhgEngine';
import {
  Leaf,
  ShieldCheck,
  TrendingDown,
  Droplet,
  FileCheck,
  Award,
  Printer,
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

interface Scope3AccountingViewProps {
  materials: MaterialPassport[];
  onSelectPassport?: (passport: MaterialPassport) => void;
}

export function Scope3AccountingView({ materials }: Scope3AccountingViewProps) {
  const [records, setRecords] = useState<Scope3GhgRecord[]>(INITIAL_SCOPE3_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<Scope3GhgRecord>(INITIAL_SCOPE3_RECORDS[0]);
  const [activeCertificate, setActiveCertificate] = useState<Scope3VerificationCertificate | null>(null);

  const totalAvoidedCo2e = records.reduce((sum, r) => sum + r.netAvoidedEmissionsTonsCo2e, 0);
  const totalWaterSavedMl = records.reduce((sum, r) => sum + r.waterSavingsMegaLiters, 0);
  const totalVolumeKg = records.reduce((sum, r) => sum + r.processedVolumeKg, 0);

  const handleIssueCertificate = (record: Scope3GhgRecord) => {
    const cert = issueScope3VerificationCertificate(record);
    setActiveCertificate(cert);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Phase 9.1 • Primary LCA Data
            </span>
            <span className="text-[10px] font-mono text-gray-500">
              GHG Protocol Corporate Value Chain Standard & ISO 14064-3
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 mt-1">
            Scope 3 GHG Accounting & Carbon Verification
          </h1>
          <p className="text-xs text-gray-600">
            Traceable primary emission factor accounting, virgin material displacement calculations, and third-party verified Scope 3 certificates.
          </p>
        </div>
      </div>

      {/* KPI STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#0F2D1F] to-[#1B4332] p-5 text-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Net Avoided Emissions</span>
            <Leaf className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold mt-2 text-white">
            {totalAvoidedCo2e.toFixed(1)} tCO₂e
          </div>
          <p className="text-[11px] text-emerald-200/80 mt-1">
            Diverted pre-consumer waste replacing virgin fiber agriculture.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Water Displacement</span>
            <Droplet className="h-4 w-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold mt-2 text-teal-800">
            {totalWaterSavedMl.toFixed(1)} ML
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Agricultural irrigation avoided across Tiruppur & Panipat.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Processed Volume</span>
            <Layers className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-extrabold mt-2 text-gray-900">
            {totalVolumeKg.toLocaleString()} kg
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Reclaimed across verified circular intake corridors.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">LCA Primary Source</span>
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="text-lg font-bold mt-2 text-emerald-950">
            Sphera GaBi & Ecoinvent
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Tier-3 mill-specific primary energy and steam audits.
          </p>
        </div>
      </div>

      {/* GHG PROTOCOL 3-CATEGORY PILLARS */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              GHG Protocol Corporate Value Chain Alignment
            </h2>
            <p className="text-xs text-gray-500">
              Standardized attribution of emissions reductions across corporate reporting scopes.
            </p>
          </div>
          <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-900">
            ISO 14064-3 Certified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-emerald-800">Scope 3 • Category 1</span>
              <span className="text-xs font-bold text-emerald-900">7.29 tCO₂e</span>
            </div>
            <h4 className="text-xs font-bold text-gray-900">Purchased Goods & Services</h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Displaces upstream agricultural cultivation of raw virgin cotton (5.85 kg CO₂e/kg) with mechanical recycling (0.62 kg CO₂e/kg).
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-emerald-800">Scope 3 • Category 5</span>
              <span className="text-xs font-bold text-emerald-900">15.08 tCO₂e</span>
            </div>
            <h4 className="text-xs font-bold text-gray-900">Waste Generated in Operations</h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Diverts cutting room clips from municipal landfill methane generation and open burning into closed-loop garnetting.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-emerald-800">Scope 3 • Category 12</span>
              <span className="text-xs font-bold text-emerald-900">3.78 tCO₂e</span>
            </div>
            <h4 className="text-xs font-bold text-gray-900">End-of-Life Treatment</h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Industrial polypropylene cones remelted into injection-molding pellets, displacing virgin fossil naphtha polymers.
            </p>
          </div>
        </div>
      </div>

      {/* PRIMARY LCA RECORDS TABLE */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Audited Scope 3 Emission Factor Records
            </h2>
            <p className="text-xs text-gray-500">
              Primary cradle-to-gate inventory records citing Sphera GaBi, Ecoinvent, and DEFRA 2024 emission factors.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-[#0F2D1F] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold">Batch & Material</th>
                <th className="px-4 py-3 font-semibold">GHG Category</th>
                <th className="px-4 py-3 font-semibold">Processed Volume</th>
                <th className="px-4 py-3 font-semibold">Virgin Baseline</th>
                <th className="px-4 py-3 font-semibold">Net Avoided</th>
                <th className="px-4 py-3 font-semibold">Verification Body</th>
                <th className="px-4 py-3 font-semibold text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white font-medium">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50/80 transition">
                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-emerald-900">{rec.batchNumber}</div>
                    <div className="text-[10px] text-gray-500">{rec.emissionFactorRef.materialType}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px]">
                      {rec.ghgCategory.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    {rec.processedVolumeKg.toLocaleString()} kg
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {rec.grossVirginBaselineTonsCo2e} tCO₂e
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-700">
                    {rec.netAvoidedEmissionsTonsCo2e} tCO₂e
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div className="font-semibold text-gray-900">{rec.auditingBody.split('(')[0]}</div>
                    <div className="text-[10px] text-gray-400">Audited: {rec.verificationDate}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleIssueCertificate(rec)}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 px-2.5 py-1 text-[11px] font-semibold text-white transition shadow-2xs"
                    >
                      <Award className="h-3 w-3 text-emerald-300" />
                      <span>Certificate</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CERTIFICATE MODAL / DRAWER */}
      {activeCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
          <div className="relative w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b-2 border-emerald-900 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                  SUZARCHI • சுழற்சி
                </span>
                <h3 className="text-base font-black text-gray-900 uppercase">
                  Scope 3 GHG Verification Certificate
                </h3>
                <span className="text-[11px] font-mono text-emerald-900">
                  {activeCertificate.certificateNumber}
                </span>
              </div>
              <button
                onClick={() => setActiveCertificate(null)}
                className="text-gray-400 hover:text-gray-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-semibold">Beneficiary Organization:</span>
                <span className="font-bold text-gray-900">{activeCertificate.beneficiaryOrg}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-semibold">Material Commodity:</span>
                <span className="font-bold text-gray-900">{activeCertificate.materialName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-semibold">Batch Identifier:</span>
                <span className="font-mono font-bold text-emerald-900">{activeCertificate.batchIdentifier}</span>
              </div>
              <div className="flex items-center justify-between border-t border-emerald-200 pt-2">
                <span className="text-gray-700 font-bold text-sm">Certified Avoided GHG Emissions:</span>
                <span className="text-lg font-black text-emerald-800">
                  {activeCertificate.netTonsAvoided} tCO₂e
                </span>
              </div>
              <div className="text-[10px] text-gray-500 pt-1">
                Standard: {activeCertificate.standardCompliance}
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-3 border border-gray-200 text-[10px] font-mono break-all text-gray-600">
              <span className="font-bold text-gray-800 block">Cryptographic Digital Seal:</span>
              {activeCertificate.digitalSealHash}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Certificate
              </button>
              <button
                onClick={() => setActiveCertificate(null)}
                className="rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
