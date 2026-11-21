import { milestoneProgress, MILESTONES } from '../milestones';
import { cigarettesAvoided, formatMoney, moneySaved } from '../money';
import { resistRate, timeOfDayBreakdown, topTriggers } from '../patterns';
import { DAY, elapsedMs, formatClock, formatDuration, formatUntil, HOUR, MINUTE, splitDuration } from '../time';
import { reducer, initialState } from '../../state/reducer';
import { Craving } from '../../state/types';

describe('time', () => {
  it('clamps negative elapsed time to zero', () => {
    expect(elapsedMs(1000, 500)).toBe(0);
  });
  it('splits and formats a duration', () => {
    const ms = 3 * DAY + 4 * HOUR + 5 * MINUTE + 6000;
    expect(splitDuration(ms)).toEqual({ days: 3, hours: 4, minutes: 5, seconds: 6 });
    expect(formatClock(splitDuration(ms))).toBe('04:05:06');
    expect(formatDuration(ms)).toBe('3 days, 4 hours, 5 minutes');
    expect(formatDuration(1 * DAY + MINUTE)).toBe('1 day, 1 minute');
    expect(formatDuration(5000)).toBe('5 seconds');
  });
  it('formats countdowns', () => {
    expect(formatUntil(5 * DAY - 1)).toBe('in 5 days');
    expect(formatUntil(3 * HOUR)).toBe('in 3 hours');
    expect(formatUntil(30 * 1000)).toBe('in 1 minute');
  });
});

describe('money', () => {
  const s = { pricePerPack: 350, cigarettesPerPack: 20, cigarettesPerDay: 10 };
  it('computes savings from elapsed time', () => {
    expect(moneySaved(s, 7 * DAY)).toBeCloseTo(1225);
    expect(cigarettesAvoided(s, 7 * DAY)).toBe(70);
  });
  it('formats money with grouping', () => {
    expect(formatMoney('₹', 1225)).toBe('₹ 1,225.00');
    expect(formatMoney('$', 1234567.891, 0)).toBe('$ 1,234,568');
    expect(formatMoney('€', -5)).toBe('€ 0.00');
  });
});

describe('milestones', () => {
  it('has 12 milestones in order', () => {
    expect(MILESTONES).toHaveLength(12);
    for (let i = 1; i < MILESTONES.length; i += 1) {
      expect(MILESTONES[i].at).toBeGreaterThan(MILESTONES[i - 1].at);
    }
  });
  it('reports progress toward the next milestone', () => {
    const p = milestoneProgress(10 * MINUTE);
    expect(p.current).toBeNull();
    expect(p.next?.id).toBe('20m');
    expect(p.progress).toBeCloseTo(0.5);
    const q = milestoneProgress(7 * DAY);
    expect(q.current?.id).toBe('3d');
    expect(q.next?.id).toBe('2w');
    const done = milestoneProgress(20 * 365 * DAY);
    expect(done.next).toBeNull();
    expect(done.reachedCount).toBe(12);
  });
});

describe('patterns', () => {
  const at = (h: number) => new Date(2026, 0, 1, h, 0).getTime();
  const list: Craving[] = [
    { id: '1', at: at(8), trigger: 'Stress', resisted: true },
    { id: '2', at: at(9), trigger: 'After coffee', resisted: true },
    { id: '3', at: at(22), trigger: 'Stress', resisted: false },
  ];
  it('ranks triggers and time of day', () => {
    expect(topTriggers(list)[0]).toEqual({ trigger: 'Stress', count: 2 });
    expect(timeOfDayBreakdown(list).find((p) => p.part === 'Morning')?.count).toBe(2);
    expect(timeOfDayBreakdown(list).find((p) => p.part === 'Night')?.count).toBe(1);
    expect(resistRate(list)).toBeCloseTo(2 / 3);
    expect(topTriggers([])).toEqual([]);
  });
});

describe('reducer', () => {
  it('onboards, slips and keeps the first quit moment', () => {
    let s = reducer({ ...initialState, loaded: true }, {
      type: 'completeOnboarding',
      settings: { quitAt: 1000 },
      now: 5000,
    });
    expect(s.settings.onboarded).toBe(true);
    expect(s.settings.quitAt).toBe(1000);
    s = reducer(s, { type: 'resetAfterSlip', now: 9000 });
    expect(s.settings.quitAt).toBe(9000);
    expect(s.settings.firstQuitAt).toBe(1000);
  });
  it('never allows a quit moment in the future during onboarding', () => {
    const s = reducer(initialState, { type: 'completeOnboarding', settings: { quitAt: 99999 }, now: 5000 });
    expect(s.settings.quitAt).toBe(5000);
  });
});
