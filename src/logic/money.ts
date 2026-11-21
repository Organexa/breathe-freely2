import { Settings } from '../state/types';
import { DAY } from './time';

type CostInputs = Pick<Settings, 'pricePerPack' | 'cigarettesPerPack' | 'cigarettesPerDay'>;

export function costPerDay(s: CostInputs): number {
  if (s.cigarettesPerPack <= 0) return 0;
  return (s.cigarettesPerDay * s.pricePerPack) / s.cigarettesPerPack;
}

export function moneySaved(s: CostInputs, elapsed: number): number {
  return (elapsed / DAY) * costPerDay(s);
}

export function cigarettesAvoided(s: Pick<Settings, 'cigarettesPerDay'>, elapsed: number): number {
  return Math.floor((elapsed / DAY) * s.cigarettesPerDay);
}

/** Groups digits with commas; no reliance on Intl so it behaves the same on every device. */
export function groupDigits(n: number): string {
  return String(Math.trunc(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatMoney(currency: string, amount: number, decimals = 2): string {
  const safe = Number.isFinite(amount) ? Math.max(0, amount) : 0;
  const fixed = safe.toFixed(decimals);
  const [whole, frac] = fixed.split('.');
  const grouped = groupDigits(Number(whole));
  return `${currency} ${frac ? `${grouped}.${frac}` : grouped}`;
}
