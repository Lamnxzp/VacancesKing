import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getSchoolYear(array = false) {
  const currentYear = new Date().getFullYear();
  if (array)
    return new Date().getMonth() >= 8
      ? [currentYear, currentYear + 1]
      : [currentYear - 1, currentYear];
  else
    return new Date().getMonth() >= 8
      ? `${currentYear}-${currentYear + 1}`
      : `${currentYear - 1}-${currentYear}`;
}

/**
 * Truncates a number to a fixed number of decimal places without rounding.
 *
 * @param {number} num - The number to truncate.
 * @param {number} decimals - The number of decimal places to keep.
 * @returns {string} The truncated number formatted as a string with exactly `decimals` digits
 *                   after the decimal point (padded with zeros if necessary).
 *
 * @example
 * truncateToDecimals(99.99996, 4);  // -> "99.9999"
 * (99.99996).toFixed(4);           // -> "100.0000" (rounded)
 */
export function truncateToDecimals(num, decimals) {
  const factor = Math.pow(10, decimals);
  return (Math.trunc(num * factor) / factor).toFixed(decimals);
}
