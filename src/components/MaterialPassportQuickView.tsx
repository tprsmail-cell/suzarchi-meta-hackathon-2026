'use client';

import React from 'react';
import { MaterialPassport, getEvidenceLabel, getEvidenceBadgeStyle } from '@/types/passport';
import { ArrowRight, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { useLocale } from '@/lib/localeContext';
import { getCategoryTechnicalSpecs } from '@/lib/passportDisplay';

interface MaterialPassportQuickViewProps {
  passport: MaterialPassport;
  onOpenDetailsModal?: () => void;
}

export function MaterialPassportQuickView({ passport, onOpenDetailsModal }: MaterialPassportQuickViewProps) {
  const { t, formatLengthDisplay, language } = useLocale();
  const categorySpecs = getCategoryTechnicalSpecs(passport, formatLengthDisplay);

  const rows = [
    {
      label: 'Material Type',
      value: passport.materialType.value,
      status: passport.materialType.status,
    },
    {
      label: 'Composition',
      value: passport.fibreComposition.value,
      status: passport.fibreComposition.status,
    },
    {
      label: 'Colour',
      value: passport.colour.value,
      status: passport.colour.status,
    },
    {
      label: categorySpecs[0]?.label || 'Specification',
      value: categorySpecs[0]?.value || 'Standard',
      status: categorySpecs[0]?.status || 'CONFIRMED',
    },
    {
      label: categorySpecs[1]?.label || 'Dimension / Core',
      value: categorySpecs[1]?.value || 'Standard',
      status: categorySpecs[1]?.status || 'CONFIRMED',
    },
    {
      label: 'Condition',
      value: passport.condition.value,
      status: passport.condition.status,
    },
    {
      label: 'Form',
      value: passport.form.value,
      status: passport.form.status,
    },
    {
      label: 'Location',
      value: passport.location.value,
      status: passport.location.status,
    },
  ];

  const getStatusIcon = (status: MaterialPassport['materialType']['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />;
      case 'REPORTED':
      case 'ESTIMATED':
        return <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />;
      case 'UNKNOWN':
        return <HelpCircle className="h-3 w-3 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-gray-200/90 bg-white p-4 shadow-2xs">
      <div>
        {/* Header */}
        <div className="mb-2.5 flex items-center justify-between border-b border-gray-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-50 text-emerald-800">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-gray-900 tracking-tight sm:text-sm">
              {language === 'ta' ? 'பொருள் பாஸ்போர்ட்' : 'Material Passport'}{' '}
              <span className="font-normal text-gray-500">(Quick View)</span>
            </h3>
          </div>
          <button
            onClick={onOpenDetailsModal}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 transition hover:text-emerald-950"
          >
            <span>{t.actions.viewFullPassport}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* 8-Row Key-Value Table */}
        <div className="divide-y divide-gray-100/90 text-xs">
          {rows.map((row) => {
            const badgeStyle = getEvidenceBadgeStyle(row.status);
            const badgeText = getEvidenceLabel(row.status);

            return (
              <div key={row.label} className="flex items-center justify-between py-1.5 gap-2 min-w-0">
                <span className="w-28 shrink-0 text-gray-500 text-[11.5px] font-medium">{row.label}</span>
                <span className="flex-1 font-semibold text-gray-900 truncate text-[11.5px] min-w-0">
                  {row.value}
                </span>
                <div className="flex shrink-0 justify-end">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9.5px] font-medium transition ${badgeStyle.bg}`}
                    title={`Evidence Status: ${row.status}`}
                  >
                    {getStatusIcon(row.status)}
                    <span className="truncate max-w-[125px]">{badgeText}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onOpenDetailsModal}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-50/70 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition shadow-2xs"
      >
        <span>{t.actions.viewFullPassport}</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
