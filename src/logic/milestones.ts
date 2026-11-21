import { DAY, HOUR, MINUTE } from './time';

export interface Milestone {
  id: string;
  short: string;
  title: string;
  description: string;
  at: number;
}

export const MILESTONES: Milestone[] = [
  {
    id: '20m',
    short: '20m',
    title: '20 minutes',
    description: 'Your heart rate and blood pressure are starting to come down.',
    at: 20 * MINUTE,
  },
  {
    id: '8h',
    short: '8h',
    title: '8 hours',
    description: 'Carbon monoxide in your blood is falling, and oxygen levels are climbing back.',
    at: 8 * HOUR,
  },
  {
    id: '1d',
    short: '1d',
    title: 'One day',
    description: 'Most of the carbon monoxide is gone. Your lungs begin clearing out mucus.',
    at: DAY,
  },
  {
    id: '2d',
    short: '2d',
    title: 'Two days',
    description: 'Nicotine has mostly left your body. Taste and smell start to sharpen.',
    at: 2 * DAY,
  },
  {
    id: '3d',
    short: '3d',
    title: 'Three days',
    description:
      'Breathing often feels easier as your airways relax. Cravings can peak now — they pass.',
    at: 3 * DAY,
  },
  {
    id: '2w',
    short: '2w',
    title: 'Two weeks',
    description: 'Your circulation is improving, and walking can feel easier.',
    at: 14 * DAY,
  },
  {
    id: '1mo',
    short: '1mo',
    title: 'One month',
    description: 'Coughing and shortness of breath usually begin to ease.',
    at: 30 * DAY,
  },
  {
    id: '3mo',
    short: '3mo',
    title: 'Three months',
    description: 'Lung function can improve noticeably. Exercise starts to feel lighter.',
    at: 90 * DAY,
  },
  {
    id: '6mo',
    short: '6mo',
    title: 'Six months',
    description: 'Less coughing and congestion, and more energy for the things you enjoy.',
    at: 182 * DAY,
  },
  {
    id: '1y',
    short: '1y',
    title: 'One year',
    description: 'Your added risk of coronary heart disease is about half that of a smoker.',
    at: 365 * DAY,
  },
  {
    id: '5y',
    short: '5y',
    title: 'Five years',
    description: 'Your risk of stroke can fall close to that of someone who has never smoked.',
    at: 5 * 365 * DAY,
  },
  {
    id: '10y',
    short: '10y',
    title: 'Ten years',
    description: 'Your risk of dying from lung cancer is about half that of a person who smokes.',
    at: 10 * 365 * DAY,
  },
];

export type MilestoneStatus = 'done' | 'next' | 'future';

export interface MilestoneProgress {
  /** Most recent milestone reached, or null before the first one. */
  current: Milestone | null;
  /** Next milestone to reach, or null once all are reached. */
  next: Milestone | null;
  /** 0..1 progress from the previous milestone to the next one. */
  progress: number;
  /** Milliseconds remaining until the next milestone. */
  remaining: number;
  reachedCount: number;
}

export function milestoneProgress(elapsed: number): MilestoneProgress {
  const reached = MILESTONES.filter((m) => elapsed >= m.at);
  const current = reached.length > 0 ? reached[reached.length - 1] : null;
  const next = MILESTONES[reached.length] ?? null;
  if (!next) {
    return { current, next: null, progress: 1, remaining: 0, reachedCount: reached.length };
  }
  const start = current ? current.at : 0;
  const progress = Math.min(1, Math.max(0, (elapsed - start) / (next.at - start)));
  return { current, next, progress, remaining: next.at - elapsed, reachedCount: reached.length };
}

export function milestoneStatus(m: Milestone, elapsed: number): MilestoneStatus {
  if (elapsed >= m.at) return 'done';
  const next = MILESTONES.find((x) => elapsed < x.at);
  return next?.id === m.id ? 'next' : 'future';
}
