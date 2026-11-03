'use client';

import React from 'react';
import { OpportunityDestination } from '@/types/passport';
import { Sparkles, Info, Settings2, ArrowRight, Check, AlertTriangle, XCircle } from 'lucide-react';

interface AiMatchAnalysisProps {
  destinations: OpportunityDestination[];
  onSelectDestination?: (destinationTitle: string) => void;
  onInspectDestination?: (destination: OpportunityDestination) => void;
}

export function AiMatchAnalysis({
  destinations,
  onSelectDestination,
  onInspectDestination,
}: AiMatchAnalysisProps) {
  const getHeaderTheme = (theme: OpportunityDestination['colorTheme']) => {
    switch (theme) {
      case 'green':
        return {
          indexBg: 'bg-[#15803D] text-white',
          scoreColor: 'text-[#15803D]',
          topBorder: 'border-t-4 border-t-[#15803D]',
          btnHover: 'hover:bg-emerald-50 hover:text-emerald-900',
        };
      case 'blue':
        return {
          indexBg: 'bg-[#1D4ED8] text-white',
          scoreColor: 'text-[#1D4ED8]',
          topBorder: 'border-t-4 border-t-[#1D4ED8]',
          btnHover: 'hover:bg-blue-50 hover:text-blue-900',
        };
      case 'purple':
        return {
          indexBg: 'bg-[#7E22CE] text-white',
          scoreColor: 'text-[#7E22CE]',
          topBorder: 'border-t-4 border-t-[#7E22CE]',
          btnHover: 'hover:bg-purple-50 hover:text-purple-900',
        };
      case 'mauve':
        return {
          indexBg: 'bg-[#475569] text-white',
          scoreColor: 'text-[#475569]',
          topBorder: 'border-t-4 border-t-[#475569]',
          btnHover: 'hover:bg-slate-50 hover:text-slate-900',
        };
      case 'amber':
        return {
          indexBg: 'bg-[#B45309] text-white',
          scoreColor: 'text-[#B45309]',
          topBorder: 'border-t-4 border-t-[#B45309]',
          btnHover: 'hover:bg-amber-50 hover:text-amber-900',
        };
      default:
        return {
          indexBg: 'bg-[#15803D] text-white',
          scoreColor: 'text-[#15803D]',
          topBorder: 'border-t-4 border-t-[#15803D]',
          btnHover: 'hover:bg-emerald-50 hover:text-emerald-900',
        };
    }
  };

  // Bespoke SVG Illustrations matching mockup visuals
  const renderThumbnail = (id: string) => {
    switch (id) {
      case 'dest-apparel':
        return (
          // Crisp Blue Folded T-shirt Vector
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none">
            <rect width="48" height="48" rx="6" fill="#EFF6FF" />
            <path
              d="M15 12 L20 16 C22 17 26 17 28 16 L33 12 L39 17 L35 22 L32 20 L32 38 L16 38 L16 20 L13 22 L9 17 Z"
              fill="#3B82F6"
              stroke="#1D4ED8"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M20 16 C22 18 26 18 28 16" stroke="#1E40AF" strokeWidth="1.5" />
          </svg>
        );

      case 'dest-wiping':
        return (
          // Stack of Folded Wiping Cloths Vector
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none">
            <rect width="48" height="48" rx="6" fill="#F0FDF4" />
            <rect x="10" y="27" width="28" height="9" rx="2" fill="#94A3B8" stroke="#64748B" strokeWidth="1.2" />
            <rect x="12" y="20" width="26" height="8" rx="2" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.2" />
            <rect x="11" y="13" width="27" height="8" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
          </svg>
        );

      case 'dest-recycler':
        return (
          // Shredded Textile Fibres & Recycling Yarn Vector
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none">
            <rect width="48" height="48" rx="6" fill="#FAF5FF" />
            <circle cx="24" cy="24" r="14" fill="#E9D5FF" opacity="0.6" />
            <path d="M16 20 Q24 14 30 22 T34 32" stroke="#9333EA" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M14 26 Q20 34 28 28 T32 18" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
            <path d="M22 16 Q28 26 18 34" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'dest-designers':
      default:
        return (
          // Clothing Rack with Hangers Vector
          <svg viewBox="0 0 48 48" className="h-full w-full" fill="none">
            <rect width="48" height="48" rx="6" fill="#F8FAFC" />
            <line x1="10" y1="14" x2="38" y2="14" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="12" y1="14" x2="12" y2="38" stroke="#64748B" strokeWidth="2" />
            <line x1="36" y1="14" x2="36" y2="38" stroke="#64748B" strokeWidth="2" />
            <path d="M18 15 L22 19 L14 19 Z" fill="#F59E0B" />
            <path d="M28 15 L32 19 L24 19 Z" fill="#10B981" />
            <rect x="15" y="19" width="6" height="15" rx="1" fill="#FCD34D" opacity="0.8" />
            <rect x="25" y="19" width="6" height="17" rx="1" fill="#6EE7B7" opacity="0.8" />
          </svg>
        );
    }
  };

  return (
    <div className="rounded-xl border border-gray-200/90 bg-white p-4 shadow-2xs">
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-700" />
            <h3 className="text-sm font-bold tracking-tight text-gray-900">
              AI Match Analysis — Potential Destinations
            </h3>
            <span title="Illustrative destinations generated for demonstration">
              <Info className="h-3.5 w-3.5 text-gray-400" />
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Based on material details, available quantity and current market needs{' '}
            <span className="font-semibold text-emerald-800">(illustrative results)</span>
          </p>
        </div>

        <button className="flex items-center gap-1.5 self-start rounded-md border border-gray-300/80 px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-50 sm:self-auto">
          <Settings2 className="h-3 w-3" />
          <span>Configure</span>
        </button>
      </div>

      {/* 4 Cards Grid: 2 columns on tablet / mid desktop, 4 columns on wide desktop (>=1280px) */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {destinations.map((dest) => {
          const theme = getHeaderTheme(dest.colorTheme);

          return (
            <div
              key={dest.id}
              className={`flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-3.5 shadow-2xs transition-all hover:shadow-xs ${theme.topBorder}`}
            >
              <div>
                {/* Header: Number Badge + Title + Optional Best Match Tag */}
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-bold ${theme.indexBg}`}>
                      {dest.index}
                    </span>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">
                      {dest.title}
                    </h4>
                  </div>
                  {dest.badgeText && (
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        dest.eligibilityState === 'DISQUALIFIED_SAFETY' || dest.eligibilityState === 'INCOMPATIBLE_TECHNICAL' || dest.matchScore === 0
                          ? 'bg-rose-700 text-white'
                          : dest.eligibilityState === 'CONDITIONALLY_VIABLE' || dest.badgeText.includes('Conditional')
                          ? 'bg-amber-600 text-white'
                          : 'bg-[#15803D] text-white'
                      }`}
                    >
                      {dest.badgeText}
                    </span>
                  )}
                </div>

                {/* Score & Vector Thumbnail Row */}
                <div className="mt-2.5 flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-gray-200 shadow-2xs">
                      {renderThumbnail(dest.id)}
                    </div>
                    <div>
                      <div className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-wide">
                        {dest.matchScore === 0 ? 'Eligibility Status' : 'Compatibility Score'}
                      </div>
                      <div className={`text-lg font-black tracking-tight ${dest.matchScore === 0 ? 'text-rose-700 text-sm' : theme.scoreColor}`}>
                        {dest.matchScore === 0 ? 'Disqualified (0%)' : `${dest.matchScore}%`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rule-checked Requirements List */}
                <div className="mt-2.5 space-y-1.5 text-[11px]">
                  {dest.checks.map((c) => (
                    <div key={c.id} className="flex items-start gap-1.5">
                      {c.verdict === 'SATISFIED' && (
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                      )}
                      {c.verdict === 'PENDING_VERIFICATION' && (
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                      )}
                      {c.verdict === 'BLOCKED' && (
                        <XCircle className="mt-0.5 h-3 w-3 shrink-0 text-rose-600" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className={c.verdict === 'BLOCKED' ? 'text-rose-700 line-through' : 'text-gray-700 font-medium'}>
                          {c.label}
                        </span>
                        {c.dimension && (
                          <span className="ml-1 rounded bg-gray-100 px-1 py-0.2 text-[8.5px] font-semibold text-gray-500 uppercase">
                            {c.dimension}
                          </span>
                        )}
                        {c.note && (
                          <div className="text-[9.5px] text-gray-400 mt-0.5 italic leading-tight">{c.note}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Eligibility Gate Reason if not fully qualified */}
                {dest.eligibilityReason && (
                  <div className="mt-2 rounded bg-amber-50/80 border border-amber-200 p-1.5 text-[10px] text-amber-900 leading-tight">
                    <strong>Gate Verdict:</strong> {dest.eligibilityReason}
                  </div>
                )}

                {/* Rationale explanation */}
                <p className="mt-2.5 rounded-md bg-[#F8FAF9] p-2 text-[10.5px] leading-relaxed text-gray-600 border border-gray-100">
                  {dest.rationale}
                </p>
                {/* 4 Dimension Status Indicators */}
                <div className="mt-2.5 flex items-center justify-between gap-1 border-t border-gray-100 pt-2 text-[9px] font-semibold">
                  <span className={`px-1 py-0.5 rounded ${dest.technicalCompatibility === 'INCOMPATIBLE' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-50 text-emerald-800'}`}>
                    Tech: {dest.technicalCompatibility === 'INCOMPATIBLE' ? 'Blocked' : 'Fit'}
                  </span>
                  <span className={`px-1 py-0.5 rounded ${dest.safetyEligibility === 'BLOCKED' ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-emerald-50 text-emerald-800'}`}>
                    Safety: {dest.safetyEligibility === 'BLOCKED' ? 'Blocked' : 'Pass'}
                  </span>
                  <span className={`px-1 py-0.5 rounded ${dest.evidenceCompleteness === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                    Evid: {dest.evidenceCompleteness === 'CONFIRMED' ? 'Confirmed' : 'Verify'}
                  </span>
                  <span className="px-1 py-0.5 rounded bg-blue-50 text-blue-800">
                    Comm: {dest.commercialSuitability === 'LIMITED' ? 'Limited' : 'Viable'}
                  </span>
                </div>

                {/* Inspect / Explain Destination button */}
                <button
                  type="button"
                  onClick={() => onInspectDestination?.(dest)}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded border border-emerald-800/30 bg-emerald-50/50 py-1 text-[11px] font-bold text-emerald-900 transition hover:bg-emerald-100/70"
                >
                  <Sparkles className="h-3 w-3 text-emerald-700" />
                  <span>Explain Match & Logistics</span>
                </button>
              </div>

              {/* Action Link Button */}
              <button
                onClick={() => onSelectDestination && onSelectDestination(dest.title)}
                className={`mt-2.5 flex w-full items-center justify-center gap-1 rounded-md border border-gray-200 py-1.5 text-xs font-semibold text-gray-800 transition ${theme.btnHover}`}
              >
                <span>
                  {dest.actionLabel} ({dest.actionCount})
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
