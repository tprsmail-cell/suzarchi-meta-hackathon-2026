/**
 * SUZARCHI Global Platform — Multi-Currency Conversion Architecture
 * Provides currency formatting, immutable original currency preservation,
 * and indicative conversion with explicit exchange rate timestamps.
 */

export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'INR'
  | 'CNY'
  | 'TWD'
  | 'VND'
  | 'CAD'
  | 'JPY'
  | 'KRW'
  | 'THB'
  | 'IDR'
  | 'MYR'
  | 'SGD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  minorUnits: number; // Decimal places (e.g. 0 for JPY/VND, 2 for USD/EUR/INR)
  symbolPosition: 'prefix' | 'suffix';
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', minorUnits: 2, symbolPosition: 'prefix' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', minorUnits: 2, symbolPosition: 'prefix' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', minorUnits: 2, symbolPosition: 'prefix' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', minorUnits: 2, symbolPosition: 'prefix' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', minorUnits: 2, symbolPosition: 'prefix' },
  TWD: { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar', minorUnits: 2, symbolPosition: 'prefix' },
  VND: { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', minorUnits: 0, symbolPosition: 'suffix' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', minorUnits: 2, symbolPosition: 'prefix' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', minorUnits: 0, symbolPosition: 'prefix' },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', minorUnits: 0, symbolPosition: 'prefix' },
  THB: { code: 'THB', symbol: '฿', name: 'Thai Baht', minorUnits: 2, symbolPosition: 'prefix' },
  IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', minorUnits: 0, symbolPosition: 'prefix' },
  MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', minorUnits: 2, symbolPosition: 'prefix' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', minorUnits: 2, symbolPosition: 'prefix' },
};

/**
 * Indicative reference exchange rates (relative to USD = 1.0)
 * Timestamped reference: November 2, 2026, 10:00 UTC
 */
export const INDICATIVE_RATES_TO_USD: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  INR: 84.15,
  CNY: 7.24,
  TWD: 32.10,
  VND: 25350,
  CAD: 1.38,
  JPY: 152.4,
  KRW: 1378,
  THB: 35.8,
  IDR: 15650,
  MYR: 4.68,
  SGD: 1.34,
};

export const EXCHANGE_RATE_TIMESTAMP = 'Nov 2, 2026, 10:00 UTC';

/**
 * Converts an amount from one currency to another using indicative reference rates.
 */
export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): { convertedAmount: number; rateUsed: number; timestamp: string } {
  if (from === to) {
    return { convertedAmount: amount, rateUsed: 1.0, timestamp: EXCHANGE_RATE_TIMESTAMP };
  }

  // Convert via USD anchor
  const amountInUsd = amount / INDICATIVE_RATES_TO_USD[from];
  const converted = amountInUsd * INDICATIVE_RATES_TO_USD[to];
  const rate = INDICATIVE_RATES_TO_USD[to] / INDICATIVE_RATES_TO_USD[from];

  return {
    convertedAmount: converted,
    rateUsed: rate,
    timestamp: EXCHANGE_RATE_TIMESTAMP,
  };
}

/**
 * Formats a monetary value with proper currency symbol and decimals.
 */
export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const config = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  const rounded = amount.toFixed(config.minorUnits);
  const formattedNumber = Number(rounded).toLocaleString(undefined, {
    minimumFractionDigits: config.minorUnits,
    maximumFractionDigits: config.minorUnits,
  });

  if (config.symbolPosition === 'suffix') {
    return `${formattedNumber} ${config.symbol}`;
  }
  return `${config.symbol}${formattedNumber}`;
}
