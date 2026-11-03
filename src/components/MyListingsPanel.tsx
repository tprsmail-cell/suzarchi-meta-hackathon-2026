'use client';

import React from 'react';
import { Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MaterialPassport } from '@/types/passport';
import { ALL_SAMPLE_CASES } from '@/data/sampleCases';
import { useLocale } from '@/lib/localeContext';

interface MyListingsPanelProps {
  currentPassportId: string;
  onSelectPassport: (passport: MaterialPassport) => void;
  onOpenAllListings?: () => void;
}

export function MyListingsPanel({
  currentPassportId,
  onSelectPassport,
  onOpenAllListings,
}: MyListingsPanelProps) {
  const { t } = useLocale();

  const myListingCases = [
    ALL_SAMPLE_CASES['mat-001'],
    ALL_SAMPLE_CASES['mat-003'],
    ALL_SAMPLE_CASES['mat-005'],
  ];

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-gray-200/80 bg-white p-4 shadow-2xs">
      <div>
        <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-gray-900">
              {t.dashboard.myListings}
            </h3>
          </div>
          <button
            onClick={onOpenAllListings}
            className="flex items-center gap-1 text-[11px] font-medium text-emerald-800 hover:text-emerald-950"
          >
            <span>{t.actions.viewAll}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {myListingCases.map((p) => {
            const isSelected = p.id === currentPassportId;

            return (
              <div
                key={p.id}
                onClick={() => onSelectPassport(p)}
                className={`flex items-center justify-between py-2 text-xs cursor-pointer rounded-lg px-1.5 transition ${
                  isSelected ? 'bg-emerald-50/80 font-semibold' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-100 text-sm border border-gray-200 shadow-2xs overflow-hidden">
                    {p.images && p.images.length > 0 ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.images[0].url} alt={p.materialName.value} className="h-full w-full object-cover" />
                    ) : (
                      <span>🧵</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate max-w-[170px] sm:max-w-[140px] lg:max-w-[120px] xl:max-w-[160px]">
                      {p.materialName.value}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">
                      {p.quantityKg.value} kg • {p.location.value}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`rounded border px-1.5 py-0.5 text-[9px] font-bold ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {isSelected ? 'Active' : 'Listed'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
