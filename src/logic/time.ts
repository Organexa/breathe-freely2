export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;

export interface DurationParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Elapsed ms since quitAt, clamped at zero if the clock moved backwards. */
export function elapsedMs(quitAt: number, now: number): number {
  return Math.max(0, now - quitAt);
}

export function splitDuration(ms: number): DurationParts {
  const total = Math.max(0, Math.floor(ms / SECOND));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const pad = (n: number): string => String(n).padStart(2, '0');

export function formatClock(parts: DurationParts): string {
  return `${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`;
}

const plural = (n: number, word: string): string => `${n} ${word}${n === 1 ? '' : 's'}`;

/** "3 days, 4 hours, 12 minutes" — largest three non-zero units, spelled out. */
export function formatDuration(ms: number): string {
  const p = splitDuration(ms);
  const units: [number, string][] = [
    [p.days, 'day'],
    [p.hours, 'hour'],
    [p.minutes, 'minute'],
  ];
  const parts = units.filter(([n]) => n > 0).map(([n, w]) => plural(n, w));
  if (parts.length === 0) return plural(p.seconds, 'second');
  return parts.join(', ');
}

/** Compact countdown such as "in 5 days" or "in 3 hours". */
export function formatUntil(ms: number): string {
  if (ms <= 0) return 'now';
  if (ms >= 2 * DAY) return `in ${plural(Math.ceil(ms / DAY), 'day')}`;
  if (ms >= 2 * HOUR) return `in ${plural(Math.ceil(ms / HOUR), 'hour')}`;
  return `in ${plural(Math.max(1, Math.ceil(ms / MINUTE)), 'minute')}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatTimeOfDay(hour: number, minute: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${pad(minute)} ${hour < 12 ? 'AM' : 'PM'}`;
}

export function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateTime(ts: number): string {
  const d = new Date(ts);
  return `${formatDate(ts)}, ${formatTimeOfDay(d.getHours(), d.getMinutes())}`;
}
