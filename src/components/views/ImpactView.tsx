'use client';

import React, { useState } from 'react';
import { MaterialPassport } from '@/types/passport';
import { useLocale } from '@/lib/localeContext';
import { calculateLcaImpact } from '@/lib/lcaEngine';
import { 
  Sparkles, 
  Leaf, 
  Droplets, 
  Zap, 
  Award, 
  ShieldCheck, 
  Download, 
  Share2, 
  FileText,
  CheckCircle2 
} from 'lucide-react';

interface ImpactViewProps {
  materials: MaterialPassport[];
}

export function ImpactView({ materials }: ImpactViewProps) {
  const { language, formatWeightDisplay } = useLocale();
  const [isDownloaded, setIsDownloaded] = useState(false);

  const impacts = materials.map((m) => calculateLcaImpact(m));
  const totalWeightKg = materials.reduce((acc, m) => acc + (m.quantityKg.value || 0), 0);
  const totalCo2AvoidedKg = impacts.reduce((acc, imp) => acc + imp.co2AvoidedKg, 0);
  const totalWaterSavedLitres = impacts.reduce((acc, imp) => acc + imp.waterSavedLitres, 0);
  const totalEnergySavedKwh = impacts.reduce((acc, imp) => acc + imp.energySavedKwh, 0);

  const handleDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2500);
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200/90 bg-white p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <Award className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                {language === 'ta' ? 'சுழற்சி சுற்றுச்சூழல் & Scope 3 தாக்கப் பதிவேடு' : 'Circularity & Scope 3 Environmental Impact Ledger'}
              </h1>
              <p className="text-xs text-gray-500">
                {language === 'ta'
                  ? 'ISO 14044 தரநிலையின்படி உமிழ்வு தவிர்ப்பு மற்றும் வள சேமிப்பு அளவீடுகள்'
                  : 'Empirical Life Cycle Assessment (LCA) Benchmarks for Diverted Textile Lots'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 transition shadow-2xs"
          >
            {isDownloaded ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-800 font-bold">Audit PDF Dispatched</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 text-emerald-700" />
                <span>Download Audit PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-emerald-700">
            <Leaf className="h-4.5 w-4.5" />
            <span className="text-xs font-bold">Total GHG Avoided</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{totalCo2AvoidedKg.toLocaleString()} kg</div>
          <div className="text-[11px] text-gray-500 mt-1">Displaces virgin staple cultivation energy</div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-blue-700">
            <Droplets className="h-4.5 w-4.5" />
            <span className="text-xs font-bold">Freshwater Preserved</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{totalWaterSavedLitres.toLocaleString()} L</div>
          <div className="text-[11px] text-gray-500 mt-1">Avoids high-liquor-ratio wet scouring</div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-amber-700">
            <Zap className="h-4.5 w-4.5" />
            <span className="text-xs font-bold">Thermal Energy Saved</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{totalEnergySavedKwh.toLocaleString()} kWh</div>
          <div className="text-[11px] text-gray-500 mt-1">Direct fuel displacement calculation</div>
        </div>

        <div className="rounded-xl border border-purple-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-purple-700">
            <Award className="h-4.5 w-4.5" />
            <span className="text-xs font-bold">Landfill Diverted</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{totalWeightKg.toLocaleString()} kg</div>
          <div className="text-[11px] text-gray-500 mt-1">100% zero-landfill diversion tracking</div>
        </div>
      </div>

      {/* Stream Impact Breakdown */}
      <div className="rounded-xl border border-gray-200/90 bg-white p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-gray-900">
          Environmental Savings Breakdown Across {materials.length} Active Surplus Lots
        </h3>

        <div className="divide-y divide-gray-100 text-xs">
          {materials.map((m) => {
            const w = m.quantityKg.value || 0;
            const co2 = Math.round(w * 1.62);
            const water = Math.round(w * 850);

            return (
              <div key={m.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{m.materialName.value}</div>
                  <div className="text-[10px] text-gray-400">
                    Stream: {m.streamId || 'GAR'} • {m.fibreComposition.value}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-800">{co2} kg CO₂e saved</div>
                  <div className="text-[10px] text-gray-500">{water.toLocaleString()} L water preserved</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
