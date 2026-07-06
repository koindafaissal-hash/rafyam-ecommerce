import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export { clsx, twMerge };

export function formatPrice(cents: number, currency = 'XOF') {
  const amount = cents / 100;
  if (currency === 'XOF') {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(amount) + ' FCFA';
  }
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
}

export function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getDiscountPercent(priceCents: number, compareCents?: number | null) {
  if (!compareCents || compareCents <= priceCents) return null;
  return Math.round(((compareCents - priceCents) / compareCents) * 100);
}