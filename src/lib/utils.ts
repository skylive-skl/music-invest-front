import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format seconds → mm:ss */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Format large number → K/M suffix */
export function formatAmount(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;
  return amount.toLocaleString();
}

/** Format currency in ₸ (Tenge) or $ */
export function formatCurrency(amount: number, currency = '₸'): string {
  return `${amount.toLocaleString('ru-RU')} ${currency}`;
}

/** Calculate funding percentage */
export function calcFundingPercent(current: number, goal: number): number {
  if (goal === 0) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
}

/** Get status color class */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: 'text-success',
    FUNDED: 'text-accent-cyan',
    EXPIRED: 'text-text-muted',
    CANCELLED: 'text-danger',
  };
  return map[status] ?? 'text-text-secondary';
}

/** Get status label in Russian */
export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: 'Активный',
    FUNDED: 'Профинансирован',
    EXPIRED: 'Истёк',
    CANCELLED: 'Отменён',
  };
  return map[status] ?? status;
}

/** Format ISO date → DD.MM.YYYY */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU');
}

/** Generate gradient from string (for avatars / placeholders) */
export function stringToGradient(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = hash & 0xff;
  const h2 = (hash >> 8) & 0xff;
  return `linear-gradient(135deg, hsl(${h1 * 1.4}, 70%, 45%), hsl(${h2 * 1.4}, 60%, 35%))`;
}
