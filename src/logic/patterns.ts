import { Craving, TRIGGERS, Trigger } from '../state/types';

export interface TriggerCount {
  trigger: Trigger;
  count: number;
}

export function topTriggers(cravings: Craving[]): TriggerCount[] {
  const counts = new Map<Trigger, number>();
  for (const c of cravings) counts.set(c.trigger, (counts.get(c.trigger) ?? 0) + 1);
  return TRIGGERS.map((trigger) => ({ trigger, count: counts.get(trigger) ?? 0 }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);
}

export const DAY_PARTS = ['Morning', 'Afternoon', 'Evening', 'Night'] as const;
export type DayPart = (typeof DAY_PARTS)[number];

export function dayPartOf(hour: number): DayPart {
  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
}

export function timeOfDayBreakdown(cravings: Craving[]): { part: DayPart; count: number }[] {
  const counts: Record<DayPart, number> = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
  for (const c of cravings) counts[dayPartOf(new Date(c.at).getHours())] += 1;
  return DAY_PARTS.map((part) => ({ part, count: counts[part] }));
}

export function hourlyBreakdown(cravings: Craving[]): number[] {
  const hours = new Array<number>(24).fill(0);
  for (const c of cravings) hours[new Date(c.at).getHours()] += 1;
  return hours;
}

export function resistRate(cravings: Craving[]): number {
  if (cravings.length === 0) return 0;
  return cravings.filter((c) => c.resisted).length / cravings.length;
}
