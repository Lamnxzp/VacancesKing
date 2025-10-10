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
