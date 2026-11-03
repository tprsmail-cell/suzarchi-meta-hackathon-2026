'use client';

import React from 'react';
import { RefreshCw, TrendingUp, Globe2, Network, UserCheck, ChevronDown } from 'lucide-react';
import { useLocale } from '@/lib/localeContext';
import { useRole } from '@/lib/roleContext';

export function HeroBanner() {
  const { t, language } = useLocale();
  const { roleProfile, openRoleModal } = useRole();

  const values = [
    { label: t.heroValues.reduceWaste, icon: RefreshCw },
    { label: t.heroValues.createValue, icon: TrendingUp },
    { label: t.heroValues.supportCircular, icon: Globe2 },
    { label: t.heroValues.connectMarkets, icon: Network },
  ];

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200/90 shadow-sm min-h-[185px] sm:min-h-[195px] flex items-center">
      {/* Vibrant Alpine Nature Mountain Landscape (Exact Photo from Reference) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-[center_35%] filter brightness-[1.02]"
        style={{
          backgroundImage: "url('/assets/nature-banner.jpg')",
        }}
      />

      {/* Subtle, soft ambient gradient to ensure text readability without washing out the mountain scenery */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-white/75 via-white/40 to-transparent lg:from-white/80 lg:via-white/30 lg:to-transparent" />

      {/* Hero Banner Content */}
      <div className="relative z-10 flex w-full flex-col justify-between gap-4 p-5 sm:p-6 lg:flex-row lg:items-center">
        {/* Left Headline */}
        <div className="max-w-xl">
          {/* Role Status Tag */}
          <div className="mb-2 flex items-center gap-2">
            <button
              onClick={openRoleModal}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/30 bg-white/95 px-3 py-0.5 text-[11px] font-bold text-[#0D3822] shadow-xs backdrop-blur-md hover:bg-emerald-50 transition"
              title="Click to switch your professional role"
            >
              <UserCheck className="h-3 w-3 text-emerald-700" />
              <span>{language === 'ta' ? roleProfile.titleTa : roleProfile.title}</span>
              <ChevronDown className="h-2.5 w-2.5 text-gray-500" />
            </button>
            <span className="text-[10px] font-semibold text-emerald-950/80 hidden sm:inline">
              • {t.dashboard.roleAdaptiveDashboard}
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-[#0D3822] sm:text-3xl lg:text-[32px] lg:leading-[1.15] drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
            One Material.
            <br />
            <span className="text-[#0F4A2E]">Multiple Possibilities.</span>
          </h1>
          <p className="mt-1.5 text-xs font-bold text-[#143D28] sm:text-sm max-w-lg leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
            {language === 'ta' ? roleProfile.welcomeSublineTa : roleProfile.welcomeSubline}
          </p>
        </div>

        {/* Center Circular Globe & Recycling Leaf Emblem (Perfect Circular Cutout) */}
        <div className="hidden lg:flex items-center justify-center shrink-0">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full overflow-hidden border-2 border-white/95 shadow-xl ring-2 ring-emerald-500/30 bg-emerald-950/20 backdrop-blur-xs transition-transform hover:scale-105 duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/globe-recycle.png"
              alt="Circular Economy Globe"
              className="h-full w-full object-cover scale-110"
            />
          </div>
        </div>

        {/* Right Circular Value Badges */}
        <div className="flex flex-col gap-2 shrink-0 sm:min-w-[210px]">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.label}
                className="flex items-center gap-2.5 rounded-full border border-gray-200/90 bg-white/95 px-3.5 py-1.5 shadow-xs backdrop-blur-md transition hover:bg-white hover:shadow-sm"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#0F4A2E]">
                  <Icon className="h-3 w-3" />
                </div>
                <span className="text-xs font-bold text-[#183626] tracking-tight">{v.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
