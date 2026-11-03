'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  BookOpen,
  ChevronDown,
  ChevronUp,
  UserCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useLocale } from '@/lib/localeContext';
import { useRole } from '@/lib/roleContext';

export function RoleContextGuidance() {
  const { language } = useLocale();
  const { roleProfile, openRoleModal } = useRole();
  const [isExpanded, setIsExpanded] = useState(false);

  const help = roleProfile.contextualHelp;
  if (!help) return null;

  return (
    <div className="rounded-xl border border-emerald-900/15 bg-white p-4 shadow-2xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900">
              {language === 'ta' ? help.titleTa : help.title}
            </h3>
            <span className="text-[10px] text-gray-500">
              {language === 'ta' ? 'தொழில்துறை நடைமுறை & தொழில்நுட்ப வழிகாட்டல்' : 'Industry Context & Technical Due Diligence'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openRoleModal}
            className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-600/30 px-2 py-1 text-[10.5px] font-bold text-emerald-900 hover:bg-emerald-100 transition"
          >
            <UserCheck className="h-3 w-3 text-emerald-700" />
            <span>{language === 'ta' ? roleProfile.shortTitleTa : roleProfile.shortTitle}</span>
            <span className="text-[9px] text-emerald-600 font-normal">(Change)</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-gray-900 px-1 py-0.5"
          >
            <span>{isExpanded ? (language === 'ta' ? 'குறைக்க' : 'Less') : (language === 'ta' ? 'விளக்கம்' : 'Details')}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Safety Alert (Prominently rendered if the role has critical safety constraints) */}
      {help.safetyAlert && (
        <div className="mt-2.5 flex items-start gap-2.5 rounded-lg border border-rose-300 bg-rose-50/80 p-2.5 text-rose-950">
          <ShieldAlert className="h-4 w-4 text-rose-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="font-bold text-rose-900">
              {language === 'ta' ? 'கட்டாய பாதுகாப்பு உத்தரவு: ' : 'Mandatory Safety Directive: '}
            </strong>
            <span>{language === 'ta' ? help.safetyAlertTa : help.safetyAlert}</span>
          </div>
        </div>
      )}

      {/* Primary Guidance Prose */}
      <p className="mt-2 text-xs leading-relaxed text-gray-700">
        {language === 'ta' ? help.guidanceTextTa : help.guidanceText}
      </p>

      {/* Expandable Key Terms */}
      {isExpanded && help.keyTerms && help.keyTerms.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 animate-in fade-in duration-200">
          <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wider block">
            {language === 'ta' ? 'முக்கிய கலைச்சொற்கள் & வரைமுறைகள்' : 'Key Industry Terminology & Standards'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {help.keyTerms.map((term) => (
              <div key={term.term} className="rounded-lg border border-gray-100 bg-gray-50/70 p-2 text-xs">
                <span className="font-bold text-emerald-950 block">
                  {language === 'ta' ? `${term.termTa} (${term.term})` : term.term}
                </span>
                <p className="text-[11px] text-gray-600 mt-0.5 leading-normal">
                  {language === 'ta' ? term.definitionTa : term.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
