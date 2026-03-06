import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fmt = (n: number | null | undefined) => n?.toLocaleString('en-US') ?? '\u2014';
export const fmtK = (n: number) => `${(n / 1e3).toFixed(0)}K`;
export const fmtM = (n: number) => `${(n / 1e6).toFixed(1)}M`;
export const fmtDollar = (n: number) => `$${n.toLocaleString('en-US')}`;
export const fmtPct = (n: number) => `${n.toFixed(0)}%`;
export const pct = (n: number) => `${(n * 100).toFixed(0)}%`;
