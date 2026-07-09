// ============================================================
// Currency Formatting Utilities (Indian Format)
// ============================================================

/**
 * Formats a number as Indian currency (INR).
 * Uses the Indian numbering system: ₹12,34,567.00
 */
export function formatINR(amount: number, showDecimals = true): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  return formatter.format(amount);
}

/**
 * Formats amount in lakhs/crores for display.
 * e.g., 5000000 → "₹50 Lakhs"
 */
export function formatINRCompact(amount: number): string {
  if (amount >= 10000000) {
    const crores = amount / 10000000;
    return `₹${crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(2)} L`;
  }
  if (amount >= 1000) {
    const thousands = amount / 1000;
    return `₹${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  }
  return formatINR(amount, false);
}

/**
 * Parse an INR formatted string back to a number.
 */
export function parseINR(value: string): number {
  return Number(value.replace(/[₹,\s]/g, '')) || 0;
}
