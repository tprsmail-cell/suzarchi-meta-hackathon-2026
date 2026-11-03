'use client';

import React from 'react';
import { useRole, USER_ROLES, UserRoleId } from '@/lib/roleContext';
import { useLocale } from '@/lib/localeContext';
import {
  Factory,
  Briefcase,
  Code,
  Sparkles,
  Recycle,
  Hotel,
  Activity,
  Waves,
  Wrench,
  Globe,
  X,
  Check,
  ArrowRight,
  ShieldCheck,
  Info,
} from 'lucide-react';

export function RoleSelectionModal() {
  const { isRoleModalOpen, closeRoleModal, activeRole, completeOnboarding } = useRole();
  const { language } = useLocale();

  if (!isRoleModalOpen) return null;

  const roleIcons: Record<string, React.ElementType> = {
    Factory,
    Briefcase,
    Code,
    Sparkles,
    Recycle,
    Hotel,
    Activity,
    Waves,
    Wrench,
    Globe,
  };

  const rolesList = Object.values(USER_ROLES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-emerald-900 to-[#0F2D1F] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xs text-emerald-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                {language === 'ta' ? 'சுழற்சி • பயனர் பங்கு தேர்வு (10 தொழில்துறைகள்)' : 'SUZARCHI • 10 Industry Professional Roles'}
              </div>
              <h2 className="text-lg font-bold tracking-tight text-white">
                {language === 'ta' ? 'உங்கள் தொழில்முறைப் பங்கினைத் தேர்ந்தெடுக்கவும்' : 'Choose Your Professional Role'}
              </h2>
            </div>
          </div>
          <button
            onClick={closeRoleModal}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Subtitle explanation & In-Memory boundary alert */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-6 py-2.5 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <Info className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>
              {language === 'ta'
                ? 'உங்கள் தொழில்துறைக்கு ஏற்ப சுழற்சி பலகை, குறுக்குவழிகள் மற்றும் வகைப்பாடுகள் உடனடியாக மாறும்.'
                : 'SUZARCHI dynamically adapts dashboard shortcuts, taxonomy focus, and metrics to your specific industry.'}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
            {language === 'ta' ? 'நினைவக அமர்வு மட்டுமே' : 'In-Memory Session Only'}
          </span>
        </div>

        {/* Ephemeral Notice Banner */}
        <div className="bg-amber-50/80 border-b border-amber-200/80 px-6 py-1.5 text-[11px] text-amber-900 flex items-center justify-between">
          <span>
            {language === 'ta'
              ? 'முக்கிய அறிவிப்பு: தற்போதைய முன்மாதிரி விருப்பத்தேர்வுகள் உலாவி நினைவகத்தில் மட்டுமே இருக்கும்; முழு பக்கத்தை புதுப்பிக்கும்போது மீட்டமைக்கப்படலாம்.'
              : 'Notice: Prototype role and unit preferences apply in browser memory and reset on full page reload.'}
          </span>
        </div>

        {/* Roles Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rolesList.map((role) => {
              const Icon = roleIcons[role.iconName] || Globe;
              const isSelected = activeRole === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => completeOnboarding(role.id)}
                  className={`group relative flex flex-col justify-between rounded-xl border p-4 text-left transition cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-600/30'
                      : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-gray-50/80 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200'
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      {isSelected ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          <Check className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-gray-400 group-hover:text-emerald-700 transition">
                          Select →
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-emerald-950">
                      {language === 'ta' ? role.titleTa : role.title}
                    </h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-gray-500 line-clamp-3">
                      {language === 'ta' ? role.descriptionTa : role.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                    <span>Primary Stream: <strong className="text-gray-700">{role.primaryStream}</strong></span>
                    <span className="text-emerald-700 font-medium capitalize">{role.defaultCategoryFilter}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3.5 text-xs">
          <button
            onClick={() => completeOnboarding('general_user')}
            className="text-gray-600 hover:text-gray-900 font-semibold transition"
          >
            {language === 'ta' ? 'பொது பயனர் பலகைக்குத் திரும்புக' : 'Return to General Dashboard'}
          </button>
          <button
            onClick={() => completeOnboarding(activeRole)}
            className="flex items-center gap-1.5 rounded-lg bg-[#00A86B] px-5 py-2 font-bold text-white shadow-sm hover:bg-[#00925D] transition active:scale-[0.99]"
          >
            <span>{language === 'ta' ? 'தேர்வை உறுதி செய்' : 'Confirm Role & Enter'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
