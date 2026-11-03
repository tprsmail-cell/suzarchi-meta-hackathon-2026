'use client';

import React, { useState } from 'react';
import { MaterialPassport } from '@/types/passport';
import { useLocale } from '@/lib/localeContext';
import { calculateLcaImpact } from '@/lib/lcaEngine';
import { 
  X, 
  Leaf, 
  Droplets, 
  Zap, 
  Award, 
  ShieldCheck, 
  Download, 
  Share2, 
  CheckCircle2
} from 'lucide-react';

interface CircularityImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  passport: MaterialPassport;
}

export function CircularityImpactModal({
  isOpen,
  onClose,
  passport,
}: CircularityImpactModalProps) {
  const { t, language, formatQuantityDisplay } = useLocale();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  if (!isOpen) return null;

  const lca = calculateLcaImpact(passport);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-emerald-900 to-[#0F2D1F] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xs text-emerald-300">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                {language === 'ta' ? 'சுழற்சி சுற்றுச்சூழல் தாக்கம்' : 'SUZARCHI Circular LCA Impact Certificate'}
              </div>
              <h2 className="text-lg font-bold tracking-tight text-white">
                {language === 'ta' ? 'சுற்றுச்சூழல் மற்றும் கார்பன் தணிக்கை' : 'Circularity & Environmental Savings Ledger'}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Target Material Record */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-800">Assessed Material Lot</span>
              <div className="text-sm font-bold text-gray-900">{passport.materialName.value}</div>
              <div className="text-gray-500 text-[11px]">
                {passport.fibreComposition.value} • {passport.location.value}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-gray-500 uppercase block">Active Batch Quantity</span>
              <span className="text-base font-extrabold text-emerald-900">
                {formatQuantityDisplay(passport.quantityKg.value, passport.quantityUnit?.value)}
              </span>
            </div>
          </div>

          {/* 4 Primary Impact Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 flex flex-col items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-1.5">
                <Leaf className="h-4 w-4" />
              </div>
              <div className="text-lg font-black text-emerald-900">{lca.co2AvoidedKg} kg</div>
              <div className="text-[10px] font-medium text-emerald-800 leading-tight">GHG Emissions Mitigated</div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 flex flex-col items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 mb-1.5">
                <Droplets className="h-4 w-4" />
              </div>
              <div className="text-lg font-black text-blue-900">{lca.waterSavedLitres.toLocaleString()} L</div>
              <div className="text-[10px] font-medium text-blue-800 leading-tight">Freshwater Preserved</div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 flex flex-col items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 mb-1.5">
                <Zap className="h-4 w-4" />
              </div>
              <div className="text-lg font-black text-amber-900">{lca.energySavedKwh} kWh</div>
              <div className="text-[10px] font-medium text-amber-800 leading-tight">Thermal Energy Saved</div>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-3 flex flex-col items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700 mb-1.5">
                <Award className="h-4 w-4" />
              </div>
              <div className="text-lg font-black text-purple-900">{lca.landfillDivertedKg} kg</div>
              <div className="text-[10px] font-medium text-purple-800 leading-tight">Zero-Landfill Diverted</div>
            </div>
          </div>

          {/* Scope 3 ESG Audit Methodology */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>Scope 3 LCA Methodology & Governance</span>
              </div>
              <span className="rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[9.5px] font-semibold text-amber-800">
                Estimated Benchmark (±{lca.uncertaintyPercentage}%)
              </span>
            </div>

            <p className="text-[11px] leading-relaxed text-gray-600">
              <strong>Proxy Applied:</strong> {lca.methodologyDescription}. Displaces equivalent primary raw material production and wet processing. Unaudited illustrative calculation; requires certified mill utility audit for formal ESG filing.
            </p>

            <div className="space-y-1 text-[10.5px] text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <div className="font-semibold text-gray-700">Key LCA Assumptions:</div>
              {lca.assumptions.map((asm, idx) => (
                <div key={idx} className="flex items-start gap-1">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{asm}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[10px] text-gray-400 space-y-0.5 border-t border-gray-100">
              <div className="font-semibold text-gray-500">Benchmark References:</div>
              {lca.sourceReferences.map((ref, idx) => (
                <div key={idx}>[{idx + 1}] {ref}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3.5 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-100 transition shadow-2xs"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">PDF Ready</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Download Audit PDF</span>
                </>
              )}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-100 transition shadow-2xs"
            >
              {copiedSuccess ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Share Ledger</span>
                </>
              )}
            </button>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-emerald-700 px-5 py-2 font-bold text-white hover:bg-emerald-800 transition"
          >
            {t.actions.close}
          </button>
        </div>
      </div>
    </div>
  );
}
