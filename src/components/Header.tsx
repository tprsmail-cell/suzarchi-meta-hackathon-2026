'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Globe, Bell, Menu, Scale, User, Check, X, DollarSign, MapPin } from 'lucide-react';
import { useLocale } from '@/lib/localeContext';
import { useRole } from '@/lib/roleContext';
import { ALL_SAMPLE_CASES } from '@/data/sampleCases';
import { MaterialPassport } from '@/types/passport';
import { SUPPORTED_LANGUAGES_META, SupportedLanguage } from '@/lib/translations';
import { SUPPORTED_CURRENCIES, CurrencyCode } from '@/lib/currencies';
import { GLOBAL_COUNTRY_PROFILES, CountryCode } from '@/lib/countries';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onSelectMaterial?: (passport: MaterialPassport) => void;
}

export function Header({ onOpenMobileMenu, onSelectMaterial }: HeaderProps) {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    country,
    setCountry,
    unitSystem,
    setUnitSystem,
    weightUnit,
    setWeightUnit,
    lengthUnit,
    setLengthUnit,
    t,
  } = useLocale();
  const { roleProfile, openRoleModal } = useRole();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMarketMenu, setShowMarketMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'LANG' | 'COUNTRY' | 'CURR' | 'UNITS'>('CURR');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const sampleList = Object.values(ALL_SAMPLE_CASES);
  const searchResults = searchQuery.trim() === ''
    ? []
    : sampleList.filter((m) => {
        const q = searchQuery.toLowerCase();
        return (
          m.materialName.value.toLowerCase().includes(q) ||
          m.fibreComposition.value.toLowerCase().includes(q) ||
          m.location.value.toLowerCase().includes(q) ||
          m.form.value.toLowerCase().includes(q) ||
          (m.streamId && m.streamId.toLowerCase().includes(q))
        );
      });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangMeta = SUPPORTED_LANGUAGES_META.find((l) => l.code === language) || SUPPORTED_LANGUAGES_META[0];
  const currentCountry = GLOBAL_COUNTRY_PROFILES[country] || GLOBAL_COUNTRY_PROFILES.IN;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#E2E8E4] bg-white px-3 sm:px-4 shadow-xs lg:px-6">
      {/* Mobile Menu Trigger & Search Bar */}
      <div className="flex flex-1 min-w-0 items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="shrink-0 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Live Search Bar with Results Dropdown */}
        <div ref={searchRef} className="relative flex min-w-0 max-w-xl flex-1 items-center">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder={t.actions.searchPlaceholder}
            className="w-full min-w-0 rounded-l-md border border-r-0 border-gray-300 py-1.5 pl-9 pr-2 sm:pr-3 text-xs text-gray-800 placeholder-gray-400 focus:border-emerald-600 focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-20 sm:right-24 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex shrink-0 items-center justify-center rounded-r-md bg-[#133827] px-2.5 sm:px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1b4d35]"
          >
            <span className="hidden sm:inline">Search</span>
            <Search className="h-3.5 w-3.5 sm:hidden" />
          </button>

          {/* Search Dropdown Panel */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1.5 shadow-xl z-50 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Matching Material Passports ({searchResults.length})
              </div>
              <div className="divide-y divide-gray-100">
                {searchResults.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => {
                      if (onSelectMaterial) onSelectMaterial(res);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex w-full items-center justify-between p-2 text-left hover:bg-emerald-50 rounded transition"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{res.materialName.value}</div>
                      <div className="text-[10px] text-gray-500">
                        {res.fibreComposition.value} • {res.location.value}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {res.quantityKg.value} kg
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5 pl-2 sm:pl-4">
        {/* Role Switcher Pill */}
        <button
          onClick={openRoleModal}
          className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-900/20 bg-emerald-50/70 px-2.5 py-1 text-xs font-semibold text-emerald-900 hover:bg-emerald-100/70 transition shadow-2xs"
          title="Change Industry Role"
        >
          <User className="h-3.5 w-3.5 text-emerald-700" />
          <span className="max-w-[120px] truncate">{language === 'ta' ? roleProfile.titleTa : roleProfile.title}</span>
          <span className="text-[9px] text-emerald-700">▾</span>
        </button>

        {/* Dedicated Global Market & Jurisdiction Selector (14 Countries) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowMarketMenu(!showMarketMenu);
              setShowLangMenu(false);
              setShowSettingsMenu(false);
            }}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 sm:px-2.5 py-1 text-xs font-semibold text-gray-800 hover:bg-emerald-50 transition shadow-2xs"
            title="Operating Country & Regulatory Jurisdiction"
            aria-label="Market and country selector"
          >
            <span>{currentCountry.flagEmoji}</span>
            <span className="font-bold text-gray-900 hidden sm:inline">{currentCountry.name}</span>
            <span className="font-bold text-gray-900 sm:hidden">{currentCountry.code}</span>
            <span className="text-gray-300">•</span>
            <span className="text-emerald-800 font-semibold">{currency}</span>
            <span className="text-[9px] text-gray-400">▾</span>
          </button>

          {showMarketMenu && (
            <div className="absolute right-0 mt-1.5 w-80 sm:w-96 rounded-xl border border-gray-200 bg-white p-3 shadow-2xl z-50 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                  <MapPin className="h-4 w-4 text-emerald-700" />
                  {t.actions.selectMarket}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  14 Jurisdictions
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-0.5">
                {Object.values(GLOBAL_COUNTRY_PROFILES).map((cp) => (
                  <button
                    key={cp.code}
                    onClick={() => {
                      setCountry(cp.code);
                      setShowMarketMenu(false);
                    }}
                    className={`flex items-center gap-2 rounded-lg p-2 text-left border transition ${
                      country === cp.code
                        ? 'border-emerald-600 bg-emerald-50/80 font-bold text-emerald-950'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base">{cp.flagEmoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold truncate">{cp.name}</div>
                      <div className="text-[9px] text-gray-400 font-normal truncate">{cp.globalRegion}</div>
                    </div>
                    {country === cp.code && <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="rounded border border-gray-100 bg-gray-50 p-2 text-[10px] text-gray-500">
                <span className="font-bold text-gray-700">Active Jurisdiction: </span>
                {currentCountry.regulatoryJurisdiction}
              </div>
            </div>
          )}
        </div>

        {/* Dedicated Global Language Selector (10 Languages) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowMarketMenu(false);
              setShowSettingsMenu(false);
            }}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 sm:px-2.5 py-1 text-xs font-semibold text-gray-800 hover:bg-emerald-50 transition shadow-2xs"
            title="Select Language (10 Available)"
            aria-label="Language selector"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
            <span className="font-bold text-gray-900">{currentLangMeta.flagEmoji}</span>
            <span className="truncate max-w-[70px] sm:max-w-[85px]">{currentLangMeta.nativeName}</span>
            <span className="text-[9px] text-gray-400">▾</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-1.5 w-72 sm:w-80 rounded-xl border border-gray-200 bg-white p-3 shadow-2xl z-50 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                  <Globe className="h-4 w-4 text-emerald-700" />
                  {t.actions.selectLanguage}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  10 Languages
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-0.5">
                {SUPPORTED_LANGUAGES_META.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`flex items-center justify-between rounded-lg p-2 text-left border transition ${
                      language === l.code
                        ? 'border-emerald-600 bg-emerald-50/80 font-bold text-emerald-950'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate flex items-center gap-1">
                        <span>{l.flagEmoji}</span>
                        <span>{l.nativeName}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 font-normal truncate">{l.englishName}</div>
                    </div>
                    {language === l.code && <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Currency & Technical Units Settings */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSettingsMenu(!showSettingsMenu);
              setShowLangMenu(false);
              setShowMarketMenu(false);
            }}
            className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50/80 p-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition shadow-2xs"
            title="Currency & Measurement Units"
            aria-label="Currency and units"
          >
            <Scale className="h-3.5 w-3.5 text-emerald-700" />
          </button>

          {/* Expanded Global Multi-Tab Settings Menu */}
          {showSettingsMenu && (
            <div className="absolute right-0 mt-1.5 w-80 sm:w-96 rounded-xl border border-gray-200 bg-white p-3 shadow-2xl z-50 text-xs space-y-3">
              {/* Header Navigation Tabs */}
              <div className="flex items-center border-b border-gray-100 pb-2 gap-1">
                <button
                  onClick={() => setActiveSettingsTab('LANG')}
                  className={`flex-1 py-1 rounded text-center font-bold text-[11px] transition ${
                    activeSettingsTab === 'LANG'
                      ? 'bg-emerald-100 text-emerald-950'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Language
                </button>
                <button
                  onClick={() => setActiveSettingsTab('COUNTRY')}
                  className={`flex-1 py-1 rounded text-center font-bold text-[11px] transition ${
                    activeSettingsTab === 'COUNTRY'
                      ? 'bg-emerald-100 text-emerald-950'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Market
                </button>
                <button
                  onClick={() => setActiveSettingsTab('CURR')}
                  className={`flex-1 py-1 rounded text-center font-bold text-[11px] transition ${
                    activeSettingsTab === 'CURR'
                      ? 'bg-emerald-100 text-emerald-950'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Currency
                </button>
                <button
                  onClick={() => setActiveSettingsTab('UNITS')}
                  className={`flex-1 py-1 rounded text-center font-bold text-[11px] transition ${
                    activeSettingsTab === 'UNITS'
                      ? 'bg-emerald-100 text-emerald-950'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Units
                </button>
              </div>

              {/* TAB 1: Language Selection */}
              {activeSettingsTab === 'LANG' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Select Display Language (10 Available)
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                    {SUPPORTED_LANGUAGES_META.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setShowSettingsMenu(false);
                        }}
                        className={`flex items-center justify-between rounded-lg p-2 text-left border transition ${
                          language === l.code
                            ? 'border-emerald-600 bg-emerald-50/80 font-bold text-emerald-950'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold">{l.nativeName}</div>
                          <div className="text-[10px] text-gray-400 font-normal">{l.englishName}</div>
                        </div>
                        {language === l.code && <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: Operating Country & Regulatory Jurisdiction */}
              {activeSettingsTab === 'COUNTRY' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Select Operating Market & Regulatory Context
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                    {Object.values(GLOBAL_COUNTRY_PROFILES).map((cp) => (
                      <button
                        key={cp.code}
                        onClick={() => {
                          setCountry(cp.code);
                          setShowSettingsMenu(false);
                        }}
                        className={`flex items-center gap-2 rounded-lg p-2 text-left border transition ${
                          country === cp.code
                            ? 'border-emerald-600 bg-emerald-50/80 font-bold text-emerald-950'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-base">{cp.flagEmoji}</span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold truncate">{cp.name}</div>
                          <div className="text-[9px] text-gray-400 font-normal truncate">{cp.globalRegion}</div>
                        </div>
                        {country === cp.code && <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />}
                      </button>
                    ))}
                  </div>
                  <div className="rounded border border-gray-100 bg-gray-50 p-2 text-[10px] text-gray-500">
                    <span className="font-bold text-gray-700">Active Jurisdiction: </span>
                    {currentCountry.regulatoryJurisdiction}
                  </div>
                </div>
              )}

              {/* TAB 3: Commercial Currency */}
              {activeSettingsTab === 'CURR' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Select Commercial Display Currency (14 Available)
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                    {Object.values(SUPPORTED_CURRENCIES).map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          setCurrency(curr.code);
                          setShowSettingsMenu(false);
                        }}
                        className={`flex items-center justify-between rounded-lg p-2 text-left border transition ${
                          currency === curr.code
                            ? 'border-emerald-600 bg-emerald-50/80 font-bold text-emerald-950'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-emerald-800">{curr.symbol}</span>
                          <div>
                            <div className="text-xs font-semibold">{curr.code}</div>
                            <div className="text-[9px] text-gray-400 truncate max-w-[90px]">{curr.name}</div>
                          </div>
                        </div>
                        {currency === curr.code && <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-gray-400 text-center">
                    Original listing currencies remain immutable; indicative conversion shown on demand.
                  </div>
                </div>
              )}

              {/* TAB 4: Technical Unit Systems */}
              {activeSettingsTab === 'UNITS' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setUnitSystem('metric')}
                      className={`flex items-center justify-center gap-1.5 rounded-lg p-2 font-bold text-xs border transition ${
                        unitSystem === 'metric'
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Scale className="h-3.5 w-3.5" />
                      <span>Metric (kg, m)</span>
                    </button>
                    <button
                      onClick={() => setUnitSystem('imperial')}
                      className={`flex items-center justify-center gap-1.5 rounded-lg p-2 font-bold text-xs border transition ${
                        unitSystem === 'imperial'
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Scale className="h-3.5 w-3.5" />
                      <span>Imperial (lb, in)</span>
                    </button>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Weight Unit Override
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(['kg', 'lb', 'tonne', 'g', 'oz'] as const).map((u) => (
                        <button
                          key={u}
                          onClick={() => setWeightUnit(u)}
                          className={`rounded px-2 py-0.5 text-xs font-semibold ${
                            weightUnit === u
                              ? 'bg-emerald-700 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Length Unit Override
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(['cm', 'inch', 'm', 'yard', 'ft'] as const).map((lu) => (
                        <button
                          key={lu}
                          onClick={() => setLengthUnit(lu)}
                          className={`rounded px-2 py-0.5 text-xs font-semibold ${
                            lengthUnit === lu
                              ? 'bg-emerald-700 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {lu}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* In-Memory Persistence Footer */}
              <div className="border-t border-gray-100 pt-2 text-[10px] text-gray-400 text-center">
                SUZARCHI Global Platform • In-Memory Session Preferences
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-1.5 text-gray-600 hover:bg-gray-100 transition"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-white animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-72 rounded-lg border border-gray-200 bg-white p-2.5 shadow-xl z-50 text-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 mb-1.5">
                <span className="font-bold text-gray-900">Notifications</span>
                <span className="text-[10px] text-emerald-700 font-semibold">1 New</span>
              </div>
              <div className="space-y-1.5">
                <div className="rounded bg-emerald-50/70 p-2 text-emerald-950 border border-emerald-100">
                  <div className="font-bold text-[11px]">Global DPP Compliance Ready</div>
                  <div className="text-[10px] text-emerald-800/80">
                    Material Passport mat-001 satisfies EU ESPR DPP trace guidelines for secondary fibre.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
