'use client';

import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Search,
  Inbox,
  ArrowLeftRight,
  ListOrdered,
  FileQuestion,
  Sparkles,
  ShieldCheck,
  BarChart3,
  MessageSquare,
  Bookmark,
  HelpCircle,
  PlusCircle,
  Settings,
  X,
  User,
  QrCode,
  Building2,
  Leaf,
  CreditCard,
  Globe
} from 'lucide-react';
import { useLocale } from '@/lib/localeContext';
import { useRole } from '@/lib/roleContext';
import { SUPPORTED_LANGUAGES_META } from '@/lib/translations';
import { GLOBAL_COUNTRY_PROFILES } from '@/lib/countries';

export type NavViewType = 
  | 'dashboard' 
  | 'passports' 
  | 'traceability'
  | 'scope3'
  | 'escrow'
  | 'clearinghouse'
  | 'taxonomy' 
  | 'requests' 
  | 'listings' 
  | 'impact' 
  | 'analytics';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPostModal: () => void;
  activeNavView: NavViewType;
  onSelectNavView: (view: NavViewType) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  onOpenPostModal,
  activeNavView,
  onSelectNavView,
}: SidebarProps) {
  const { t, language, setLanguage, country } = useLocale();
  const { roleProfile, openRoleModal } = useRole();

  const handleNavClick = (view: NavViewType) => {
    onSelectNavView(view);
    onClose();
  };

  const navItems: { label: string; icon: React.ElementType; view: NavViewType; badge?: number }[] = [
    { label: t.nav.dashboard, icon: LayoutDashboard, view: 'dashboard' },
    { label: t.nav.materialPassport, icon: FileSpreadsheet, view: 'passports' },
    { label: t.nav.traceabilityBatches, icon: QrCode, view: 'traceability', badge: 12 },
    { label: t.nav.scope3Ghg, icon: Leaf, view: 'scope3' },
    { label: t.nav.b2bEscrow, icon: CreditCard, view: 'escrow' },
    { label: t.nav.recyclerClearinghouse, icon: Globe, view: 'clearinghouse' },
    { label: t.nav.browseTaxonomy, icon: Search, view: 'taxonomy' },
    { label: t.nav.buyerRequests, icon: Inbox, view: 'requests' },
    { label: t.nav.tradeAndRfq, icon: ArrowLeftRight, view: 'requests' },
    { label: t.nav.myListings, icon: ListOrdered, view: 'listings' },
    { label: t.nav.impactLca, icon: Sparkles, view: 'impact' },
    { label: t.nav.verificationLog, icon: ShieldCheck, view: 'passports' },
    { label: t.nav.analytics, icon: BarChart3, view: 'analytics' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-2xs"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-[#0F2D1F] text-white transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-[#1B4332] px-4 py-3 shrink-0">
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer hover:opacity-95 transition"
          >
            {/* Authentic SUZARCHI Logo Emblem */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden bg-[#1B4332] shadow-inner p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/suzarchi-logo.png"
                alt="SUZARCHI Emblem"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-emerald-400">சுழற்சி</div>
              <div className="text-base font-extrabold tracking-tight text-white leading-tight">SUZARCHI</div>
              <div className="text-[8.5px] leading-tight text-emerald-200/60 font-medium">One Material. Multiple Possibilities.</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-emerald-200 hover:bg-[#1B4332] lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Active Role Badge */}
        <div className="px-3 pt-2 pb-1">
          <button
            onClick={openRoleModal}
            className="flex w-full items-center justify-between rounded-lg border border-emerald-800/60 bg-[#163D2B]/80 px-2.5 py-1.5 text-left text-xs text-emerald-100 hover:bg-[#1C4D37] transition"
          >
            <div className="flex items-center gap-2 min-w-0">
              <User className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[9px] font-semibold uppercase text-emerald-400 leading-none">Role Mode</div>
                <div className="text-[11px] font-bold text-white truncate leading-tight">
                  {language === 'ta' ? roleProfile.titleTa : roleProfile.title}
                </div>
              </div>
            </div>
            <span className="text-[9px] text-emerald-300 shrink-0">Switch ▾</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-2 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavView === item.view;

            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.view)}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-[#0F2D1F] font-bold shadow-xs'
                    : 'text-emerald-100/75 hover:bg-[#163D2B] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-[#0F2D1F]' : 'text-emerald-300/70'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[8.5px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button: + Post a Material */}
        <div className="p-2.5 shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenPostModal();
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#00A86B] px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#00925D] active:scale-[0.99]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t.actions.postNewMaterial}</span>
          </button>
        </div>

        {/* Global Language & Market Controls in Sidebar (Accessible on Mobile & Desktop) */}
        <div className="border-t border-[#1B4332] px-3 py-2 bg-[#0E281C] shrink-0 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-emerald-300/80">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {t.actions.selectLanguage}
            </span>
            <span className="text-[9px] text-emerald-400 font-semibold">10 Languages</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="w-full rounded bg-[#163D2B] border border-emerald-800/80 px-2 py-1.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-medium"
            aria-label="Select Interface Language"
          >
            {SUPPORTED_LANGUAGES_META.map((l) => (
              <option key={l.code} value={l.code} className="bg-gray-900 text-white">
                {l.flagEmoji} {l.nativeName} ({l.englishName})
              </option>
            ))}
          </select>
          <div className="flex items-center justify-between pt-0.5 text-[10px] text-emerald-200/70">
            <span>Market: {GLOBAL_COUNTRY_PROFILES[country]?.flagEmoji} {GLOBAL_COUNTRY_PROFILES[country]?.name}</span>
            <span className="text-emerald-400 font-mono font-bold">{country}</span>
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="border-t border-[#1B4332] p-2.5 bg-[#0C2419] shrink-0">
          <div className="flex items-center justify-between">
            <div
              onClick={openRoleModal}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition min-w-0"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-700 text-xs font-bold text-white shadow-xs">
                RS
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs font-semibold text-white truncate">Ravi Shankar</div>
                <div className="text-[10px] text-emerald-200/60 truncate">
                  {language === 'ta' ? roleProfile.titleTa : roleProfile.title}
                </div>
              </div>
            </div>
            <button
              onClick={openRoleModal}
              className="text-emerald-300/70 hover:text-white transition p-1"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
