'use client';

import React from 'react';
import { OpportunityDestination, MaterialPassport } from '@/types/passport';
import { useLocale } from '@/lib/localeContext';
import {
  X,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  MapPin,
  Truck,
  Building2,
  ArrowRight,
  Info,
  Check,
  Scale,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { evaluateCrossBorderTrade } from '@/lib/crossBorderEngine';

interface DestinationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: OpportunityDestination | null;
  passport: MaterialPassport;
  onOpenRfqModal?: (destinationTitle: string) => void;
}

export function DestinationDetailModal({
  isOpen,
  onClose,
  destination,
  passport,
  onOpenRfqModal,
}: DestinationDetailModalProps) {
  const { language, country } = useLocale();

  if (!isOpen || !destination) return null;

  const fourDims = destination.fourDimensions;
  const corridor = destination.regionalCorridor;
  const originCountry = passport.countryOfOrigin || 'IN';
  const targetCountry = country || 'IN';
  const crossBorder = evaluateCrossBorderTrade(passport, originCountry, targetCountry);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'PASSED':
      case 'ELIGIBLE':
      case 'QUALIFIED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Passed / Eligible',
          icon: CheckCircle2,
        };
      case 'CONDITIONALLY_PASSED':
      case 'CONDITIONALLY_ELIGIBLE':
      case 'CONDITIONALLY_VIABLE':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Conditional',
          icon: AlertTriangle,
        };
      case 'VERIFICATION_REQUIRED':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          label: 'Verification Required',
          icon: AlertTriangle,
        };
      case 'BLOCKED':
      case 'NOT_ELIGIBLE':
      case 'DISQUALIFIED_SAFETY':
      case 'INCOMPATIBLE_TECHNICAL':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Blocked / Disqualified',
          icon: XCircle,
        };
      default:
        return {
          bg: 'bg-gray-50 text-gray-700 border-gray-200',
          dot: 'bg-gray-400',
          label: 'Pending',
          icon: Info,
        };
    }
  };

  const recBadge = getStatusBadge(destination.recommendationStatus || destination.eligibilityState);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="destination-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative flex flex-col max-h-[92vh] w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#133827] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 text-xl">
              {destination.thumbnailEmoji || '🎯'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  {destination.thumbnailTitle || 'Circular Destination'} • Phase 7 Intelligence
                </span>
                <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold border ${recBadge.bg}`}>
                  <recBadge.icon className="h-3 w-3" />
                  {recBadge.label}
                </span>
              </div>
              <h2 id="destination-modal-title" className="text-base font-bold text-white tracking-tight sm:text-lg">
                {destination.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Top Banner: Compatibility Score & Material Context */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50/70 p-4">
            <div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                Target Material Record
              </div>
              <div className="text-sm font-bold text-gray-900 mt-0.5">
                {passport.materialName.value} ({passport.taxonomyId || passport.streamId || 'Textile Surplus'})
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                Declared: {passport.quantityKg.value} {passport.quantityUnit?.value || 'kg'} • {passport.form.value} • {passport.location.value}
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0 sm:pl-4">
              <div>
                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide text-right">
                  Compatibility Rating
                </div>
                <div className="text-xl font-black text-right text-gray-900">
                  {destination.matchScore === 0 ? (
                    <span className="text-rose-700">Disqualified (0%)</span>
                  ) : (
                    <span className="text-emerald-700">{destination.matchScore}%</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hard Gating Alert (if rejected or restricted) */}
          {destination.safetyEligibility === 'BLOCKED' && (
            <div className="flex items-start gap-2.5 rounded-lg border border-rose-300 bg-rose-50/90 p-3.5 text-xs text-rose-900">
              <ShieldAlert className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong className="font-bold text-rose-950">Mandatory Safety Gate Failure:</strong>
                <p className="mt-0.5 leading-relaxed">
                  {destination.eligibilityReason || 'Severe contamination, fire hazard, or biohazard restrictions bar this material from this destination. Safety is an absolute constraint that cannot be offset by high technical suitability.'}
                </p>
              </div>
            </div>
          )}

          {/* 1. Four Independent Matching Dimensions Overview */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
              Four Independent Matching Dimensions
            </h3>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Dim A: Technical */}
              <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">A. Technical</span>
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${getStatusBadge(fourDims?.technicalCompatibility.status).bg}`}>
                    {fourDims?.technicalCompatibility.status || 'CHECKED'}
                  </span>
                </div>
                <div className="mt-1 text-base font-extrabold text-gray-900">
                  {fourDims?.technicalCompatibility.score ?? 85}% Fit
                </div>
                <p className="mt-1 text-[10px] text-gray-600 leading-tight">
                  {fourDims?.technicalCompatibility.summary || 'Substrate construction matches processing setup.'}
                </p>
              </div>

              {/* Dim B: Safety */}
              <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">B. Safety Gate</span>
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${getStatusBadge(fourDims?.safetyEligibility.status).bg}`}>
                    {fourDims?.safetyEligibility.status || (destination.safetyEligibility === 'BLOCKED' ? 'BLOCKED' : 'PASSED')}
                  </span>
                </div>
                <div className="mt-1 text-base font-extrabold text-gray-900">
                  {destination.safetyEligibility === 'BLOCKED' ? (
                    <span className="text-rose-700">Blocked (0)</span>
                  ) : (
                    <span className="text-emerald-700">Passed (100)</span>
                  )}
                </div>
                <p className="mt-1 text-[10px] text-gray-600 leading-tight">
                  {fourDims?.safetyEligibility.summary || 'Freedom from biohazard and petroleum grease.'}
                </p>
              </div>

              {/* Dim C: Evidence */}
              <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">C. Evidence</span>
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${getStatusBadge(fourDims?.evidenceCompleteness.status).bg}`}>
                    {fourDims?.evidenceCompleteness.status || (passport.fibreComposition.status === 'CONFIRMED' ? 'PASSED' : 'VERIFY')}
                  </span>
                </div>
                <div className="mt-1 text-base font-extrabold text-gray-900">
                  {fourDims?.evidenceCompleteness.score ?? (passport.fibreComposition.status === 'CONFIRMED' ? 100 : 70)}% Data
                </div>
                <p className="mt-1 text-[10px] text-gray-600 leading-tight">
                  {fourDims?.evidenceCompleteness.summary || 'Laboratory confirmation status of fibre matrix.'}
                </p>
              </div>

              {/* Dim D: Commercial */}
              <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">D. Commercial</span>
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${getStatusBadge(fourDims?.commercialSuitability.status).bg}`}>
                    {fourDims?.commercialSuitability.status || 'VIABLE'}
                  </span>
                </div>
                <div className="mt-1 text-base font-extrabold text-gray-900">
                  {fourDims?.commercialSuitability.score ?? 85}% Viable
                </div>
                <p className="mt-1 text-[10px] text-gray-600 leading-tight">
                  {fourDims?.commercialSuitability.summary || 'Batch scale and handling requirements evaluated.'}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Rule-Checked Requirements & Technical Criteria */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
              Technical & Safety Rule Audit ({destination.checks.length} Criteria)
            </h3>
            <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-3.5">
              {destination.checks.map((check) => (
                <div key={check.id} className="flex items-start gap-2.5 pb-2 border-b border-gray-100 last:border-b-0 last:pb-0">
                  <div className="mt-0.5 shrink-0">
                    {check.verdict === 'SATISFIED' && (
                      <Check className="h-4 w-4 text-emerald-600" />
                    )}
                    {check.verdict === 'PENDING_VERIFICATION' && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    {check.verdict === 'BLOCKED' && (
                      <XCircle className="h-4 w-4 text-rose-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-semibold ${check.verdict === 'BLOCKED' ? 'text-rose-900' : 'text-gray-900'}`}>
                        {check.label}
                      </span>
                      {check.dimension && (
                        <span className="rounded bg-gray-100 px-1 py-0.2 text-[8.5px] font-bold uppercase text-gray-600">
                          {check.dimension}
                        </span>
                      )}
                    </div>
                    {check.note && (
                      <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                        {check.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Missing Information & Verification Checklist */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-blue-700" />
              Laboratory Standards & Verification Checklist
            </h3>
            <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-3.5 text-xs text-blue-950 space-y-2">
              <div className="font-semibold text-blue-900">
                Required Laboratory Tests Prior to Physical Dispatch:
              </div>
              <ul className="space-y-1.5 pl-1">
                {(destination.requiredVerificationChecklist || destination.mandatoryVerifications).map((std, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px]">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-200 text-blue-900 text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span>{std}</span>
                  </li>
                ))}
              </ul>
              {destination.missingEvidenceList && destination.missingEvidenceList.length > 0 && (
                <div className="mt-2.5 rounded bg-amber-100/70 border border-amber-300/80 p-2 text-[10.5px] text-amber-950">
                  <strong>Pending Evidence Gap:</strong> {destination.missingEvidenceList.join('; ')}
                </div>
              )}
            </div>
          </div>

          {/* 4. Regional Corridor Assessment */}
          {corridor && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-emerald-700" />
                Regional Corridor Logistics Assessment
              </h3>
              <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <div className="text-[10px] font-semibold text-gray-400 uppercase">Trade Route</div>
                    <div className="text-xs font-bold text-gray-900 mt-0.5">
                      {corridor.corridorName}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-gray-600">
                      Est. ~{corridor.distanceKmEstimated} km
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        corridor.transportFeasibility === 'HIGH'
                          ? 'bg-emerald-100 text-emerald-800'
                          : corridor.transportFeasibility === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      Feasibility: {corridor.transportFeasibility}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-[10.5px] font-bold text-gray-700 mb-1">
                      Verified Source Facts:
                    </div>
                    <ul className="space-y-1 text-[11px] text-gray-600">
                      {corridor.verifiedSourceFacts.map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-[10.5px] font-bold text-gray-700 mb-1">
                      Cluster Processing Availability:
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      {corridor.clusterProcessingAvailability}
                    </p>
                  </div>
                </div>

                {corridor.missingRegionalInformation.length > 0 && (
                  <div className="rounded bg-gray-50 border border-gray-200 p-2 text-[10px] text-gray-600">
                    <strong>Missing Regional Logistics Info:</strong>{' '}
                    {corridor.missingRegionalInformation.join(' • ')}
                  </div>
                )}

                <div className="flex items-start gap-1.5 text-[9.5px] text-gray-400 leading-tight">
                  <Info className="h-3 w-3 shrink-0 mt-0.2" />
                  <span>{corridor.transparencyLimitationNotice}</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. Cross-Border Trade & Basel Convention Assessment */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-blue-700" />
                Cross-Border Trade & Basel Convention Assessment
              </span>
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-800 uppercase">
                {crossBorder.isCrossBorder ? `${crossBorder.originCountry} → ${crossBorder.destinationCountry}` : 'Domestic Transfer'}
              </span>
            </h3>

            <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase">Basel Waste Classification</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5">
                    {crossBorder.baselClassification === 'ANNEX_IX_B3030_NON_HAZARDOUS_TEXTILE' && 'Basel Annex IX (Code B3030) • Non-Hazardous Textile Scrap'}
                    {crossBorder.baselClassification === 'ANNEX_VIII_A4140_HAZARDOUS_WASTE' && 'Basel Annex VIII (Code A4140) • Hazardous Contaminated Waste'}
                    {crossBorder.baselClassification === 'DOMESTIC_CONTROL_ONLY' && 'Domestic Territory Movement • National Regulations Apply'}
                  </div>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                    crossBorder.isTradePermitted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800 font-extrabold'
                  }`}
                >
                  {crossBorder.isTradePermitted ? '✓ Trade Permitted' : '✗ Export Prohibited'}
                </span>
              </div>

              {crossBorder.prohibitionReason ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-900 leading-relaxed font-medium">
                  {crossBorder.prohibitionReason}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-[10.5px] font-bold text-gray-700 mb-1">Indicative Tariffs & Landed Costs:</div>
                    <div className="space-y-1 text-[11px] text-gray-600">
                      <div>WTO MFN Tariff: <span className="font-semibold text-gray-900">{crossBorder.indicativeTariffPercent}%</span></div>
                      <div>Ocean Freight (FCL Model): <span className="font-semibold text-gray-900">~${crossBorder.oceanFreightEstimatedUsdPerKg}/kg</span></div>
                      <div>Incoterms: <span className="font-semibold text-gray-900">{crossBorder.applicableIncoterms.join(', ')}</span></div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10.5px] font-bold text-gray-700 mb-1">Required Customs Documentation:</div>
                    <ul className="space-y-1 text-[11px] text-gray-600">
                      {crossBorder.customsDocumentationRequirements.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[9px] text-gray-400 pt-2 border-t border-gray-100">
                <span>Model Source: WTO Tariff Database & Basel Convention Secretariat Rules</span>
                <span className="font-semibold uppercase text-gray-500">[{crossBorder.evidenceTier}]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Close Explanation
          </button>

          {destination.safetyEligibility !== 'BLOCKED' && onOpenRfqModal && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRfqModal(destination.title);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg bg-[#133827] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1b4d35] transition shadow-xs"
            >
              <span>
                {destination.id === 'dest-tsdf-cement' || passport.isControlledOrHazardous
                  ? 'Draft Statutory TSDF Waste Manifest'
                  : 'Create Local RFQ Draft for this Route'}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
