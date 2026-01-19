// Currency utilities

import currency from 'currency.js';

/**
 * Format currency value
 */
export function formatCurrency(
  value: number | string,
  currencyCode: string = 'USD'
): string {
  return currency(value, {
    symbol: getCurrencySymbol(currencyCode),
    precision: 2,
  }).format();
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  return currency(value).value;
}

/**
 * Calculate percentage discount
 */
export function applyDiscount(
  amount: number | string,
  discountPercentage: number
): number {
  const base = currency(amount);
  const discount = base.multiply(discountPercentage / 100);
  return base.subtract(discount).value;
}

/**
 * Calculate VAT/tax
 */
export function calculateVAT(
  amount: number | string,
  vatPercentage: number
): number {
  return currency(amount).multiply(vatPercentage / 100).value;
}

/**
 * Calculate order total
 */
export function calculateTotal(params: {
  subtotal: number | string;
  shipping?: number | string;
  discount?: number | string;
  tax?: number | string;
  vat?: number | string;
}): number {
  let total = currency(params.subtotal);

  if (params.shipping) {
    total = total.add(params.shipping);
  }

  if (params.discount) {
    total = total.subtract(params.discount);
  }

  if (params.tax) {
    total = total.add(params.tax);
  }

  if (params.vat) {
    total = total.add(params.vat);
  }

  return total.value;
}

/**
 * Get currency symbol from code
 */
export function getCurrencySymbol(currencyCode: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'CA$',
    AUD: 'A$',
    CHF: 'CHF',
    CNY: '¥',
    SEK: 'kr',
    NZD: 'NZ$',
  };

  return symbols[currencyCode.toUpperCase()] || currencyCode;
}

/**
 * Format currency for PayPal (always 2 decimals, no symbols)
 */
export function formatForPayPal(value: number | string): string {
  return currency(value, { symbol: '', precision: 2 }).format();
}
