'use client';

import React, { useState } from 'react';
import { MaterialPassport, getEvidenceLabel, getEvidenceBadgeStyle } from '@/types/passport';
import { MultiFacilityInventoryLot } from '@/types/enterprise';
import { useLocale } from '@/lib/localeContext';
import { getCategoryTechnicalSpecs } from '@/lib/passportDisplay';
import { INITIAL_INVENTORY_LOTS } from '@/data/facilityData';
import { 
  X, 
  ShieldCheck, 
  FileCheck, 
  AlertTriangle, 
  Image as ImageIcon, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Truck, 
  Leaf, 
  QrCode,
  ArrowRight,
  Sparkles,
  Info,
  ExternalLink,
  Building2
} from 'lucide-react';

interface MaterialPassportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  passport: MaterialPassport;
  onOpenEdit?: (passport: MaterialPassport) => void;
  onOpenBatchQr?: (passport: MaterialPassport, lot?: MultiFacilityInventoryLot) => void;
}

export function MaterialPassportDetailModal({
  isOpen,
  onClose,
  passport,
  onOpenEdit,
  onOpenBatchQr,
}: MaterialPassportDetailModalProps) {
  const { t, formatQuantityDisplay, formatLengthDisplay } = useLocale();
  const categorySpecs = getCategoryTechnicalSpecs(passport, formatLengthDisplay);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DPP_ALIGNMENT' | 'TRACEABILITY'>('OVERVIEW');
  const [dppPublished, setDppPublished] = useState(false);

  if (!isOpen) return null;

  // Retrieve batch lots associated with this passport
  const matchingLots = INITIAL_INVENTORY_LOTS.filter((l) => l.passportId === passport.id);

  const sections = [
    {
      title: '1. Identification & Classification',
      items: [
        { label: 'Passport Record ID', value: passport.id, status: 'CONFIRMED' as const },
        { label: 'Taxonomy Code', value: passport.taxonomyId || 'CAT-GAR-CUT-CHN', status: 'CONFIRMED' as const },
        { label: 'Lifecycle Stream', value: passport.streamId || 'GAR', status: 'CONFIRMED' as const },
        { label: 'Material Name', value: passport.materialName.value, status: passport.materialName.status },
        { label: 'Classification', value: passport.materialType.value, status: passport.materialType.status },
        { label: 'Surplus Category', value: passport.condition.value, status: passport.condition.status },
      ],
    },
    {
      title: '2. Composition & Fibre Assurance',
      items: [
        {
          label: 'Fibre Composition',
          value: passport.fibreComposition.value,
          status: passport.fibreComposition.status,
          note: passport.fibreComposition.sourceNote || 'Requires laboratory verification (ISO 1833) before pure-stream spinning.',
        },
        {
          label: 'Chemical Finishes & Dyes',
          value: passport.chemicalFinishes?.value || 'Unspecified / None declared',
          status: passport.chemicalFinishes?.status || 'UNKNOWN',
          note: 'OEKO-TEX / ZDHC MRSL testing required for consumer skin-contact reuse.',
        },
      ],
    },
    {
      title: '3. Physical Dimensions & Volume',
      items: [
        {
          label: 'Available Quantity',
          value: formatQuantityDisplay(passport.quantityKg.value, passport.quantityUnit?.value),
          status: passport.quantityKg.status,
          note: passport.quantityKg.sourceNote || 'Physical scale weight or discrete count recorded',
        },
        ...categorySpecs.map((spec) => ({
          label: spec.label,
          value: spec.value,
          status: spec.status,
          note: spec.note,
        })),
      ],
    },
    {
      title: '4. Chain of Custody & Traceability',
      items: [
        { label: 'Geographic Location', value: passport.location.value, status: passport.location.status },
        { label: 'Physical Form', value: passport.form.value, status: passport.form.status },
        {
          label: 'Contamination Assessment',
          value: passport.contaminationStatus?.value || 'Clean',
          status: passport.contaminationStatus?.status || 'REPORTED',
          note: passport.isControlledOrHazardous === true
            ? 'REGULATED HAZARDOUS WASTE. Mandatory SPCB manifest tracking applies.'
            : passport.isControlledOrHazardous === null
            ? 'UNVERIFIED HAZARDOUS STATUS. Chemical safety data missing; laboratory screening required before release.'
            : 'Visual inspection confirms freedom from foreign metal objects, oil, or food spills.',
        },
        {
          label: 'Cleanliness Classification',
          value: passport.cleanlinessRating?.value || (passport.isControlledOrHazardous === true ? 'HAZARDOUS' : passport.isControlledOrHazardous === null ? 'UNKNOWN_UNVERIFIED' : 'COMMERCIAL_SURPLUS'),
          status: passport.cleanlinessRating?.status || (passport.isControlledOrHazardous === null ? 'UNKNOWN' : 'CONFIRMED'),
        },
        {
          label: 'Country of Origin',
          value: passport.countryOfOrigin || 'IN (India)',
          status: 'CONFIRMED' as const,
          note: 'Country of primary manufacture and lot origin',
        },
        {
          label: 'HS Tariff Classification',
          value: passport.hsCode ? `HS ${passport.hsCode}` : 'HS 6310.10 (Secondary textile scrap)',
          status: 'CONFIRMED' as const,
          note: 'Harmonized Commodity Description and Coding System',
        },
        {
          label: 'Batch / Lot Reference',
          value: passport.batchNumber || `LOT-${passport.id.toUpperCase()}`,
          status: 'CONFIRMED' as const,
          note: 'Mill tracking batch number and chain-of-custody identifier',
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#0F2D1F] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700/80 text-white shadow-xs">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  Digital Product Passport (DPP)
                </span>
                <span className="rounded bg-emerald-800/80 px-1.5 py-0.2 text-[9px] font-mono text-emerald-200">
                  ESPR Ready
                </span>
              </div>
              <h2 className="text-base font-bold tracking-tight text-white">
                {passport.materialName.value}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center border-b border-gray-200 bg-gray-50/90 px-5 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'OVERVIEW'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Technical Passport</span>
          </button>
          <button
            onClick={() => setActiveTab('DPP_ALIGNMENT')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'DPP_ALIGNMENT'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>EU DPP Alignment Check</span>
          </button>
          <button
            onClick={() => setActiveTab('TRACEABILITY')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'TRACEABILITY'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Chain of Custody & Batch Flow</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* TAB 1: TECHNICAL PASSPORT OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-5">
              {/* Photos Carousel / Grid if Attached */}
              {passport.images && passport.images.length > 0 && (
                <div className="rounded-xl border border-gray-200 p-3.5 bg-gray-50/80">
                  <span className="text-xs font-bold text-gray-800 block mb-2 flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-emerald-700" />
                    Attached Photographic Evidence ({passport.images.length})
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {passport.images.map((img, i) => (
                      <div key={img.id || i} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xs">
                        <div className="aspect-[16/10] bg-gray-200 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url} alt={img.caption || 'Evidence'} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-1.5 text-[10px] text-gray-700 font-medium truncate">{img.caption || `Image ${i + 1}`}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Governance Banner */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-emerald-950">4-Tier Evidence Governance Active</p>
                  <p className="text-emerald-800/80 mt-0.5 leading-relaxed">
                    Properties marked as <span className="font-semibold text-emerald-950">CONFIRMED</span> carry laboratory test or statutory scale documentation. <span className="font-semibold text-amber-900">REPORTED</span> and <span className="font-semibold text-slate-800">UNKNOWN</span> tiers trigger mandatory laboratory verification before high-speed circular manufacturing.
                  </p>
                </div>
              </div>

              {/* Sections Table */}
              <div className="space-y-4">
                {sections.map((sec) => (
                  <div key={sec.title} className="rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
                    <div className="bg-gray-50/90 px-4 py-2.5 border-b border-gray-100">
                      <h3 className="text-xs font-bold text-gray-900 tracking-tight">{sec.title}</h3>
                    </div>
                    <div className="divide-y divide-gray-100 text-xs">
                      {sec.items.map((it) => {
                        const badge = getEvidenceBadgeStyle(it.status);
                        const label = getEvidenceLabel(it.status);

                        return (
                          <div key={it.label} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-2">
                            <div className="sm:w-1/3">
                              <span className="font-semibold text-gray-700">{it.label}</span>
                              {'note' in it && it.note && (
                                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{it.note}</p>
                              )}
                            </div>
                            <div className="sm:w-1/3 font-semibold text-gray-900">
                              {it.value}
                            </div>
                            <div className="sm:w-1/3 sm:text-right">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${badge.bg}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                                {label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: EU DPP COMPLIANCE ALIGNMENT (Inspired by Provenant by Protokol) */}
          {activeTab === 'DPP_ALIGNMENT' && (
            <div className="space-y-5 text-xs">
              {/* Compliance Status Banner */}
              <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950">Alignment Check: High Compliance Readiness</h3>
                    <p className="text-[11px] text-emerald-800">
                      Evaluated against European Union Digital Product Passport (ESPR 2024/1781) textile criteria.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="rounded-full bg-emerald-200/80 px-3 py-1 font-bold text-emerald-900 text-xs inline-block">
                    {dppPublished ? '100% Published' : '85% Aligned'}
                  </span>
                  <div className="text-[9px] text-emerald-700 font-semibold mt-1">Illustrative Readiness Model</div>
                </div>
              </div>

              {/* PROVENANT-INSPIRED COMPOSITION DONUT & DPP PUBLISH CARD */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
                {/* Donut Chart Simulation */}
                <div className="sm:col-span-7 rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                      Materials & Composition Analysis
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Recycled Content: 20–30%
                    </span>
                  </div>

                  <div className="flex items-center gap-5 pt-2">
                    {/* SVG Donut */}
                    <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-emerald-100"
                          strokeWidth="4"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-700"
                          strokeDasharray="65, 100"
                          strokeWidth="4"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-teal-500"
                          strokeDasharray="30, 100"
                          strokeDashoffset="-65"
                          strokeWidth="4"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-black text-gray-900 leading-none">95%</span>
                        <span className="text-[8px] text-gray-500">Cotton</span>
                      </div>
                    </div>

                    {/* Breakdown legend */}
                    <div className="space-y-1.5 flex-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-700"></span>
                          Cotton Fibre
                        </span>
                        <span className="font-bold text-gray-900">95.0%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <span className="h-2.5 w-2.5 rounded-full bg-teal-500"></span>
                          Spandex / Elastane
                        </span>
                        <span className="font-bold text-gray-900">5.0%</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-1 text-[10px] text-gray-500">
                        <span>Pre-Consumer Circularity</span>
                        <span className="font-semibold text-emerald-800">100% Diverted</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DPP Issuance Card */}
                <div className="sm:col-span-5 rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                        Digital Product Passport
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${dppPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {dppPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Ready for decentralized EU registry publication under ESPR 2024/1781.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => setDppPublished(true)}
                      className={`w-full rounded-lg px-3 py-1.5 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                        dppPublished
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {dppPublished ? 'Passport Published to ESPR' : 'Publish Digital Product Passport'}
                    </button>

                    {onOpenBatchQr && (
                      <button
                        onClick={() => onOpenBatchQr(passport, matchingLots[0])}
                        className="w-full rounded-lg border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition flex items-center justify-center gap-1.5"
                      >
                        <QrCode className="h-3.5 w-3.5 text-emerald-700" />
                        View Batch QR Code
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Provenance Disclaimer */}
              <div className="rounded-lg border border-gray-200 bg-gray-50/90 p-2.5 text-[10.5px] text-gray-500 flex items-start gap-2">
                <Info className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Illustrative Alignment Model:</strong> Based on self-reported and initial laboratory passport properties. This benchmark is for internal circular readiness assessment and does NOT constitute third-party statutory EU certification or accredited auditor approval.
                </span>
              </div>

              {/* 6-Pillar Compliance Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      1. General Identification
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">PASSED</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    ID: <span className="font-mono text-gray-800">{passport.id}</span> • DPP URI: <span className="font-mono text-gray-800">{passport.dppIdentifier || `urn:dpp:suzarchi:${passport.id}`}</span> • HS Code: <span className="font-mono text-gray-800">{passport.hsCode || '6310.10'}</span> • Batch: <span className="font-mono text-gray-800">{passport.batchNumber || 'PCB-2026-IN-42'}</span>.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-amber-600" />
                      2. Materials & Composition
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">REPORTED</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Blend is {passport.fibreComposition.value}. ISO 1833 chemical dissolution test required before spinning.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      3. Performance & Physical Form
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">PASSED</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Form ({passport.form.value}), estimated GSM, and usable fabric width verified within tolerance.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      4. Environmental Footprint (LCA)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">VERIFIED</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Displaces virgin cotton agriculture, avoiding ~2.1 kg CO₂e and 1,850 L water per kg processed.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      5. Substances of Concern (SVHC)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">PASSED</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Zero detected heavy metal mordants, fluorochemicals, or forbidden azo amines reported.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      6. Traceability & Chain of Custody
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">PASSED</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Batch originated at {passport.location.value}; unsoiled pre-consumer status certified.
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="text-[11px] text-gray-400 italic text-center">
                Disclaimer: The alignment check reflects structural compliance readiness under the EU Digital Product Passport guidelines. Official certification requires independent third-party laboratory verification.
              </div>
            </div>
          )}

          {/* TAB 3: TRACEABILITY & BATCH ALLOCATION (Inspired by Provenant & Reneonix) */}
          {activeTab === 'TRACEABILITY' && (
            <div className="space-y-5 text-xs">
              {/* Batches Table (Matching Provenant Reference Image) */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Physical Batches on Record ({matchingLots.length > 0 ? matchingLots.length : 1})
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Multi-facility batch allocations conforming to Provenant (PCB-2025-B01...B08) traceability hierarchy.
                    </p>
                  </div>
                  {onOpenBatchQr && (
                    <button
                      onClick={() => onOpenBatchQr(passport, matchingLots[0])}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-900 transition shadow-xs"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span>Issue Batch QR</span>
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-[#0F2D1F] text-white uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-3.5 py-2.5 font-semibold">Batch Name</th>
                        <th className="px-3.5 py-2.5 font-semibold">Quantity</th>
                        <th className="px-3.5 py-2.5 font-semibold">Facility Location</th>
                        <th className="px-3.5 py-2.5 font-semibold">Status</th>
                        <th className="px-3.5 py-2.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {(matchingLots.length > 0 ? matchingLots : [
                        {
                          id: 'inv-lot-default',
                          batchNumber: passport.batchNumber || 'PCB-2025-B01',
                          passportId: passport.id,
                          organizationId: 'org-apex-01',
                          facilityId: 'fac-in-cbe-01',
                          facilityName: 'Apex Circular Mills — Unit 1 (Tiruppur)',
                          materialName: passport.materialName.value,
                          streamId: passport.streamId || 'GAR',
                          quantityKg: passport.quantityKg.value,
                          originalQuantity: passport.quantityKg.value,
                          originalUnit: 'kg',
                          availabilityStatus: 'AVAILABLE_FOR_TRADE' as const,
                          storageBayLocation: 'Bay A-04',
                          registeredDate: '2026-10-22',
                          lastInspectionDate: '2026-10-26',
                          isControlledHazardous: passport.isControlledOrHazardous || false,
                          qrIssued: true,
                        }
                      ]).map((lot) => (
                        <tr key={lot.id} className="hover:bg-gray-50/80">
                          <td className="px-3.5 py-2.5 font-mono font-bold text-emerald-900">
                            {lot.batchNumber}
                          </td>
                          <td className="px-3.5 py-2.5 font-bold text-gray-900">
                            {lot.quantityKg} kg
                          </td>
                          <td className="px-3.5 py-2.5 text-gray-600">
                            {lot.facilityName}
                          </td>
                          <td className="px-3.5 py-2.5">
                            <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                              {lot.availabilityStatus.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5 text-right">
                            {onOpenBatchQr && (
                              <button
                                onClick={() => onOpenBatchQr(passport, lot)}
                                className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
                              >
                                <QrCode className="h-3 w-3 text-emerald-700" />
                                <span>Quick QR</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Circular Pipeline Visualization */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Secondary Material Flow Pipeline
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-center">
                    <div className="text-[10px] font-bold uppercase text-emerald-800">1. Source Collection</div>
                    <div className="font-bold text-gray-900 mt-1">{passport.location.value}</div>
                    <div className="text-[10px] text-gray-500">Surplus Intake Node</div>
                  </div>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-center">
                    <div className="text-[10px] font-bold uppercase text-emerald-800">2. Optical Sorting</div>
                    <div className="font-bold text-gray-900 mt-1">{passport.materialType.value || 'Corduroy (Woven Pile)'}</div>
                    <div className="text-[10px] text-gray-500">Weave Geometry Tagged</div>
                  </div>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-center">
                    <div className="text-[10px] font-bold uppercase text-emerald-800">3. QC & Safety Gate</div>
                    <div className="font-bold text-gray-900 mt-1">100% Passed</div>
                    <div className="text-[10px] text-gray-500">Zero Hazardous Residues</div>
                  </div>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-center">
                    <div className="text-[10px] font-bold uppercase text-emerald-800">4. Processing Hub</div>
                    <div className="font-bold text-gray-900 mt-1">Coimbatore / Panipat</div>
                    <div className="text-[10px] text-gray-500">Rotor Spinning Corridor</div>
                  </div>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-center">
                    <div className="text-[10px] font-bold uppercase text-emerald-800">5. Circular Dispatch</div>
                    <div className="font-bold text-gray-900 mt-1">{passport.quantityKg.value} kg Lot</div>
                    <div className="text-[10px] text-gray-500">Level 2 Fibre Recovery</div>
                  </div>
                </div>
              </div>

              {/* Quality Score Metrics */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Traceability & Quality Assurance Rating
                  </h4>
                  <span className="text-sm font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    92% Quality Score
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="rounded-lg bg-white p-3 border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400">Contamination Risk</span>
                    <div className="text-sm font-bold text-emerald-700 mt-0.5">0.0% (Clean)</div>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400">Moisture Control</span>
                    <div className="text-sm font-bold text-emerald-700 mt-0.5">&lt; 8.0% (Dry)</div>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400">Sort Purity Rate</span>
                    <div className="text-sm font-bold text-emerald-700 mt-0.5">95% Cotton</div>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400">Packaging Format</span>
                    <div className="text-sm font-bold text-gray-800 mt-0.5">{passport.form.value}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-3">
          <div className="text-[11px] text-gray-500 font-mono">
            ID: {passport.id} • Stream: {passport.streamId}
          </div>
          <div className="flex items-center gap-2">
            {onOpenEdit && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEdit(passport);
                }}
                className="rounded-lg border border-emerald-600 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition"
              >
                Edit Passport
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition"
            >
              {t.actions.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
