'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SupportedLanguage, TRANSLATIONS, TranslationDictionary } from './translations';
import { WeightUnit, LengthUnit, UnitSystem, formatWeight, formatLength, formatQuantity } from './units';
import { CurrencyCode, formatCurrency, convertCurrency } from './currencies';
import { CountryCode, GLOBAL_COUNTRY_PROFILES } from './countries';

interface LocaleContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  country: CountryCode;
  setCountry: (country: CountryCode) => void;
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  weightUnit: WeightUnit;
  setWeightUnit: (unit: WeightUnit) => void;
  lengthUnit: LengthUnit;
  setLengthUnit: (unit: LengthUnit) => void;
  t: TranslationDictionary;
  formatWeightDisplay: (canonicalKg: number | null | undefined, decimals?: number) => string;
  formatLengthDisplay: (canonicalCm: number | null | undefined, decimals?: number) => string;
  formatQuantityDisplay: (quantityValue: number | null | undefined, unit?: string, decimals?: number) => string;
  formatPriceDisplay: (amountInOriginal: number, fromCurrency?: CurrencyCode) => {
    displayString: string;
    originalString: string;
    isConverted: boolean;
  };
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // In-memory state only (No persistent storage per hackathon boundaries)
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [country, setCountry] = useState<CountryCode>('IN');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>('cm');

  // Detect browser language on client mount (safe non-persistent signal)
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ta')) {
        setLanguage('ta');
      } else if (browserLang.startsWith('es')) {
        setLanguage('es');
      } else if (browserLang.startsWith('hi')) {
        setLanguage('hi');
      } else if (browserLang.startsWith('zh-cn') || browserLang === 'zh') {
        setLanguage('zh-CN');
      } else if (browserLang.startsWith('zh-tw') || browserLang.startsWith('zh-hk')) {
        setLanguage('zh-TW');
      } else if (browserLang.startsWith('vi')) {
        setLanguage('vi');
      } else if (browserLang.startsWith('de')) {
        setLanguage('de');
      } else if (browserLang.startsWith('fr')) {
        setLanguage('fr');
      } else if (browserLang.startsWith('it')) {
        setLanguage('it');
      }
    }
  }, []);

  // When country changes, intelligently suggest defaults while respecting user override capability
  const handleSetCountry = (newCountry: CountryCode) => {
    setCountry(newCountry);
    const profile = GLOBAL_COUNTRY_PROFILES[newCountry];
    if (profile) {
      setCurrency(profile.defaultCurrency);
      handleSetUnitSystem(profile.measurementConvention);
    }
  };

  // Sync default units when unitSystem toggles
  const handleSetUnitSystem = (system: UnitSystem) => {
    setUnitSystem(system);
    if (system === 'imperial') {
      setWeightUnit('lb');
      setLengthUnit('inch');
    } else {
      setWeightUnit('kg');
      setLengthUnit('cm');
    }
  };

  const t = useMemo(() => TRANSLATIONS[language] || TRANSLATIONS.en, [language]);

  const formatWeightDisplay = (canonicalKg: number | null | undefined, decimals = 1): string => {
    return formatWeight(canonicalKg, weightUnit, decimals).formattedString;
  };

  const formatLengthDisplay = (canonicalCm: number | null | undefined, decimals = 1): string => {
    return formatLength(canonicalCm, lengthUnit, decimals).formattedString;
  };

  const formatQuantityDisplay = (quantityValue: number | null | undefined, unit?: string, decimals = 1): string => {
    return formatQuantity(quantityValue, unit, weightUnit, decimals);
  };

  const formatPriceDisplay = (
    amountInOriginal: number,
    fromCurrency: CurrencyCode = 'INR'
  ): {
    displayString: string;
    originalString: string;
    isConverted: boolean;
  } => {
    const originalString = formatCurrency(amountInOriginal, fromCurrency);
    if (fromCurrency === currency) {
      return {
        displayString: originalString,
        originalString,
        isConverted: false,
      };
    }

    const { convertedAmount } = convertCurrency(amountInOriginal, fromCurrency, currency);
    const displayString = formatCurrency(convertedAmount, currency);

    return {
      displayString,
      originalString,
      isConverted: true,
    };
  };

  return (
    <LocaleContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        country,
        setCountry: handleSetCountry,
        unitSystem,
        setUnitSystem: handleSetUnitSystem,
        weightUnit,
        setWeightUnit,
        lengthUnit,
        setLengthUnit,
        t,
        formatWeightDisplay,
        formatLengthDisplay,
        formatQuantityDisplay,
        formatPriceDisplay,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
