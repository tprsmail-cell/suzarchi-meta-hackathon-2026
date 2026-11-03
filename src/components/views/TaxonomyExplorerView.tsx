'use client';

import React, { useState } from 'react';
import { MASTER_LIFECYCLE_STREAMS } from '@/data/taxonomyData';
import { LifecycleStream, TaxonomySubcategory } from '@/types/taxonomy';
import { useLocale } from '@/lib/localeContext';
import { 
  Search, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  HelpCircle,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';

interface TaxonomyExplorerViewProps {
  onSelectSubcategoryForIntake?: (streamId: string, subId: string) => void;
}

export function TaxonomyExplorerView({
  onSelectSubcategoryForIntake,
}: TaxonomyExplorerViewProps) {
  const { language } = useLocale();
  const [selectedStreamId, setSelectedStreamId] = useState<string>('GAR');
  const [searchTerm, setSearchTerm] = useState('');

  const activeStream = MASTER_LIFECYCLE_STREAMS.find((s) => s.id === selectedStreamId) || MASTER_LIFECYCLE_STREAMS[0];

  const filteredStreams = MASTER_LIFECYCLE_STREAMS.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.nameTa && s.nameTa.toLowerCase().includes(q)) ||
      s.subcategories.some((sub) => sub.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200/90 bg-white p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                {language === 'ta' ? '18-நிலை ஜவுளி வாழ்க்கைச் சுழற்சி வகைப்பாடு' : '18-Stream Master Lifecycle Taxonomy'}
              </h1>
              <p className="text-xs text-gray-500">
                {language === 'ta'
                  ? 'விவசாய நார் முதல் மறுசுழற்சி மற்றும் மறுபயன்பாடு வரையிலான முழுமையான வகைப்பாட்டுத் தரவுத்தளம்'
                  : 'Configurable Industrial By-Product, Waste, and Circular Material Specifications'}
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'ta' ? 'வகைப்பாட்டைத் தேடுக...' : 'Search 18 streams or subcategories...'}
            className="w-full rounded-lg border border-gray-300 py-1.5 pl-8 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* 2-Column Taxonomy Layout: Stream Selector (left) + Subcategories Spec (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: 18 Streams Navigator */}
        <div className="lg:col-span-5 rounded-xl border border-gray-200/90 bg-white p-3 shadow-2xs space-y-1.5 max-h-[750px] overflow-y-auto">
          <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider px-2 py-1 block">
            {language === 'ta' ? 'தொழில்துறை நிலைகள் (18)' : 'Industrial Lifecycle Streams (18)'}
          </span>
          {filteredStreams.map((st) => {
            const isSelected = st.id === selectedStreamId;

            return (
              <button
                key={st.id}
                onClick={() => setSelectedStreamId(st.id)}
                className={`flex w-full items-start justify-between rounded-lg p-2.5 text-left transition ${
                  isSelected
                    ? 'border border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-600/30'
                    : 'border border-transparent hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-gray-200/80 px-1.5 py-0.2 text-[9px] font-mono font-bold text-gray-700">
                      {st.code}
                    </span>
                    <span className="text-xs font-bold truncate">
                      {language === 'ta' ? st.nameTa : st.name}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-gray-500 line-clamp-1">
                    {st.description}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] font-semibold text-emerald-800 bg-emerald-100/60 rounded px-1.5 py-0.5">
                  {st.subcategories.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Subcategories Inspection */}
        <div className="lg:col-span-7 rounded-xl border border-gray-200/90 bg-white p-5 shadow-2xs space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-100 text-emerald-800 font-mono text-xs font-bold px-2 py-0.5">
                  Stream {activeStream.code} • {activeStream.id}
                </span>
                <h2 className="text-base font-bold text-gray-900">
                  {language === 'ta' ? activeStream.nameTa : activeStream.name}
                </h2>
              </div>
              <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                {activeStream.description}
              </p>
            </div>
          </div>

          {/* Subcategories Specification Cards */}
          <div className="space-y-4">
            {activeStream.subcategories.map((sub) => (
              <div
                key={sub.id}
                className={`rounded-xl border p-4 transition shadow-2xs ${
                  sub.isControlledOrHazardous
                    ? 'border-rose-300 bg-rose-50/40'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 block">
                      {sub.id}
                    </span>
                    <h3 className="text-xs font-bold text-gray-900">
                      {language === 'ta' ? sub.nameTa || sub.name : sub.name}
                    </h3>
                  </div>
                  {sub.isControlledOrHazardous ? (
                    <span className="flex items-center gap-1 rounded bg-rose-600 px-2 py-0.5 text-[9.5px] font-bold text-white uppercase">
                      <ShieldAlert className="h-3 w-3" />
                      HAZARDOUS / CONTROLLED
                    </span>
                  ) : (
                    <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[9.5px] font-bold">
                      Default Unit: {sub.defaultUnit}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
                  {sub.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[10.5px] bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <div>
                    <strong className="text-gray-700 block mb-0.5">Physical Material Form:</strong>
                    <span className="text-gray-600">{sub.materialForm}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700 block mb-0.5">Typical Fibre Composition:</strong>
                    <span className="text-gray-600">{sub.typicalComposition}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <strong className="text-gray-700 block mb-0.5 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-amber-600" />
                      Contamination Risks & Gate Controls:
                    </strong>
                    <span className="text-gray-600">{sub.contaminationRisks.join('; ')}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <strong className="text-gray-700 block mb-0.5 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Approved Candidate Destinations:
                    </strong>
                    <span className="text-emerald-900 font-medium">{sub.candidateDestinations.join(' • ')}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => onSelectSubcategoryForIntake && onSelectSubcategoryForIntake(activeStream.id, sub.id)}
                    className="flex items-center gap-1 rounded-md bg-[#0F4A2E] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#145d3a] transition"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Create Material in this Subcategory</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
