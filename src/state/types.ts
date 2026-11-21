export interface TimeOfDay {
  hour: number;
  minute: number;
}

export interface Settings {
  onboarded: boolean;
  /** Epoch milliseconds of the current quit moment. */
  quitAt: number;
  /** Epoch milliseconds of the very first quit, kept across slips. */
  firstQuitAt: number;
  currency: string;
  pricePerPack: number;
  cigarettesPerPack: number;
  cigarettesPerDay: number;
  notificationsEnabled: boolean;
  morningEnabled: boolean;
  eveningEnabled: boolean;
  weeklyEnabled: boolean;
  morningTime: TimeOfDay;
  eveningTime: TimeOfDay;
}

export const TRIGGERS = [
  'Stress',
  'After coffee',
  'After a meal',
  'Social situation',
  'Boredom',
  'Tired',
  'Unknown',
] as const;

export type Trigger = (typeof TRIGGERS)[number];

export interface Craving {
  id: string;
  at: number;
  trigger: Trigger;
  resisted: boolean;
}

export interface BackupData {
  settings: Settings;
  cravings: Craving[];
}

export const DEFAULT_SETTINGS: Settings = {
  onboarded: false,
  quitAt: 0,
  firstQuitAt: 0,
  currency: '₹',
  pricePerPack: 350,
  cigarettesPerPack: 20,
  cigarettesPerDay: 10,
  notificationsEnabled: false,
  morningEnabled: true,
  eveningEnabled: true,
  weeklyEnabled: true,
  morningTime: { hour: 7, minute: 0 },
  eveningTime: { hour: 21, minute: 0 },
};
