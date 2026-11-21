import AsyncStorage from '@react-native-async-storage/async-storage';
import { Craving, DEFAULT_SETTINGS, Settings } from '../state/types';

const SETTINGS_KEY = 'bf.settings.v1';
const CRAVINGS_KEY = 'bf.cravings.v1';

export interface LoadResult {
  settings: Settings;
  cravings: Craving[];
  failed: boolean;
}

export async function loadAll(): Promise<LoadResult> {
  try {
    const [[, rawSettings], [, rawCravings]] = await AsyncStorage.multiGet([
      SETTINGS_KEY,
      CRAVINGS_KEY,
    ]);
    const parsedSettings: unknown = rawSettings ? JSON.parse(rawSettings) : null;
    const settings: Settings =
      parsedSettings && typeof parsedSettings === 'object'
        ? { ...DEFAULT_SETTINGS, ...(parsedSettings as Partial<Settings>) }
        : DEFAULT_SETTINGS;
    const parsedCravings: unknown = rawCravings ? JSON.parse(rawCravings) : [];
    const cravings = Array.isArray(parsedCravings)
      ? parsedCravings.filter(
          (c): c is Craving =>
            c && typeof c.id === 'string' && typeof c.at === 'number' && typeof c.resisted === 'boolean',
        )
      : [];
    return { settings, cravings, failed: false };
  } catch (e) {
    console.warn('Breathe Freely: could not load saved data', e);
    return { settings: DEFAULT_SETTINGS, cravings: [], failed: true };
  }
}

async function writeWithRetry(key: string, value: string, attempts = 3): Promise<boolean> {
  for (let i = 0; i < attempts; i += 1) {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (e) {
      if (i === attempts - 1) console.warn(`Breathe Freely: could not save ${key}`, e);
      await new Promise((r) => setTimeout(r, 200 * (i + 1)));
    }
  }
  return false;
}

export function saveSettings(settings: Settings): Promise<boolean> {
  return writeWithRetry(SETTINGS_KEY, JSON.stringify(settings));
}

export function saveCravings(cravings: Craving[]): Promise<boolean> {
  return writeWithRetry(CRAVINGS_KEY, JSON.stringify(cravings));
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove([SETTINGS_KEY, CRAVINGS_KEY]);
}
