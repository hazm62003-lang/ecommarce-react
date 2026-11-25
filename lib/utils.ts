import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export let formatEGP = (n: number) =>
  `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n)} EGP`;

export let discountPercent = (price: number, after?: number) =>
  after && after < price ? Math.round(((price - after) / price) * 100) : 0;
