'use client';

import React, { useState } from 'react';
import { MaterialPassport, getEvidenceBadgeStyle, getEvidenceLabel } from '@/types/passport';
import { useLocale } from '@/lib/localeContext';
import { 
  FileSpreadsheet, 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  MapPin,
  Tag,
  ArrowRight
} from 'lucide-react';

interface PassportsViewProps {
  materials: MaterialPassport[];
  onSelectPassport: (passport: MaterialPassport) => void;
  onOpenDetailModal: (passport: MaterialPassport) => void;
  onOpenEditModal: (passport: MaterialPassport) => void;
  onOpenPostModal: () => void;
}

export function PassportsView({
  materials,
  onSelectPassport,
  onOpenDetailModal,
  onOpenEditModal,
  onOpenPostModal,
}: PassportsViewProps) {
  const { t, language, formatWeightDisplay } = useLocale();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState('ALL');

  const filtered = materials.filter((m) => {
    const q = filterQuery.toLowerCase();
    const matchesQ = 
      m.materialName.value.toLowerCase().includes(q) ||
      m.fibreComposition.value.toLowerCase().includes(q) ||
      m.location.value.toLowerCase().includes(q) ||
      (m.streamId && m.streamId.toLowerCase().includes(q));
    const matchesStream = selectedStream === 'ALL' || m.streamId === selectedStream;
    return matchesQ && matchesStream;
  });

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200/90 bg-white p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <FileSpreadsheet className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                {language === 'ta' ? 'பொருள் பாஸ்போர்ட் பதிவேடு' : 'Universal Material Passports Registry'}
              </h1>
              <p className="text-xs text-gray-500">
                {language === 'ta'
                  ? 'அனைத்து டிஜிட்டல் தயாரிப்பு பாஸ்போர்ட்கள் மற்றும் சரிபார்ப்பு நிலைகள்'
                  : 'Digital Product Passports (DPP) with 4-Tier Verification & Chain-of-Custody'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenPostModal}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#00A86B] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#00925D] transition active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" />
          <span>{t.actions.postNewMaterial}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-gray-200/90 bg-white p-3 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={language === 'ta' ? 'பாஸ்போர்ட்களைத் தேடுக...' : 'Search passports by name, fiber, or location...'}
            className="w-full rounded-lg border border-gray-300 py-1.5 pl-8 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-hidden"
          />
        </div>

        <select
          value={selectedStream}
          onChange={(e) => setSelectedStream(e.target.value)}
          className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
        >
          <option value="ALL">All Streams ({materials.length})</option>
          <option value="GAR">Garment Production (GAR)</option>
          <option value="SPN">Spinning & Fibres (SPN)</option>
          <option value="HLM">Handloom & Crafts (HLM)</option>
          <option value="YRN">Yarn & Cones (YRN)</option>
          <option value="HOS">Hotels & Linens (HOS)</option>
          <option value="WRK">Mechanical Wipers (WRK)</option>
        </select>
      </div>

      {/* Passports Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center space-y-3">
          <FileSpreadsheet className="mx-auto h-8 w-8 text-gray-400" />
          <p className="text-xs font-semibold text-gray-700">No matching Material Passports found</p>
          <button
            onClick={() => {
              setFilterQuery('');
              setSelectedStream('ALL');
            }}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => {
            const compBadge = getEvidenceBadgeStyle(m.fibreComposition.status);
            const compLabel = getEvidenceLabel(m.fibreComposition.status);

            return (
              <div
                key={m.id}
                className="flex flex-col justify-between rounded-xl border border-gray-200/90 bg-white p-4 shadow-2xs transition hover:shadow-xs hover:border-emerald-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-gray-400">
                      {m.taxonomyId || m.id}
                    </span>
                    {m.isUserCreated ? (
                      <span className="flex items-center gap-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[8.5px] font-bold text-white uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        USER CREATED
                      </span>
                    ) : (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[8.5px] font-bold text-gray-600 uppercase">
                        DEMO DATA
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-gray-900 line-clamp-1">
                    {m.materialName.value}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span>{m.location.value}</span>
                  </div>

                  {/* Photo Preview if available */}
                  {m.images && m.images.length > 0 && (
                    <div className="mt-2 aspect-[16/9] max-h-28 w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.images[0].url} alt={m.materialName.value} className="h-full w-full object-cover" />
                    </div>
                  )}

                  <div className="mt-2.5 rounded-lg bg-gray-50 p-2.5 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Composition:</span>
                      <span className="font-semibold text-gray-800 text-right truncate max-w-[150px]">
                        {m.fibreComposition.value}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Evidence Tier:</span>
                      <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[9.5px] font-semibold ${compBadge.bg}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${compBadge.dot}`} />
                        {compLabel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Net Quantity:</span>
                      <span className="font-bold text-emerald-800">
                        {formatWeightDisplay(m.quantityKg.value)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectPassport(m)}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    <span>Load on Dashboard</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenEditModal(m)}
                      className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
                      title="Edit Material"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenDetailModal(m)}
                      className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
                      title="View Full Passport"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
