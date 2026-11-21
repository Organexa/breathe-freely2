import { BackupData, Craving, Settings, TimeOfDay, TRIGGERS, Trigger } from '../state/types';
import { fromBase64, toBase64 } from './base64';

export type HashFn = (text: string) => Promise<string>;

const PREFIX = 'BF1';
const CHECKSUM_LENGTH = 16;
export const MAX_CODE_LENGTH = 200_000;
export const MAX_CRAVINGS = 2000;

// Earliest plausible quit moment (1 Jan 1970 is invalid; allow from 1950 for long-time quitters).
const MIN_TS = Date.UTC(1950, 0, 1);

export class RestoreError extends Error {}

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isNum = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;

const isInt = (v: unknown, min: number, max: number): v is number =>
  isNum(v, min, max) && Number.isInteger(v);

function validTime(v: unknown): v is TimeOfDay {
  return isObj(v) && isInt(v.hour, 0, 23) && isInt(v.minute, 0, 59);
}

export function validateSettings(v: unknown, now: number): Settings {
  if (!isObj(v)) throw new RestoreError('Settings are missing from this code.');
  const maxTs = now + 60 * 60 * 1000;
  const checks: [boolean, string][] = [
    [v.onboarded === true, 'onboarded'],
    [isNum(v.quitAt, MIN_TS, maxTs), 'quit moment'],
    [isNum(v.firstQuitAt, MIN_TS, maxTs), 'first quit moment'],
    [typeof v.currency === 'string' && v.currency.length >= 1 && v.currency.length <= 3, 'currency'],
    [isNum(v.pricePerPack, 0, 1_000_000), 'price per pack'],
    [isInt(v.cigarettesPerPack, 1, 100), 'cigarettes per pack'],
    [isInt(v.cigarettesPerDay, 1, 200), 'cigarettes per day'],
    [typeof v.notificationsEnabled === 'boolean', 'notifications'],
    [typeof v.morningEnabled === 'boolean', 'morning reminder'],
    [typeof v.eveningEnabled === 'boolean', 'evening reminder'],
    [typeof v.weeklyEnabled === 'boolean', 'weekly reminder'],
    [validTime(v.morningTime), 'morning time'],
    [validTime(v.eveningTime), 'evening time'],
  ];
  const bad = checks.find(([ok]) => !ok);
  if (bad) throw new RestoreError(`This code has an invalid ${bad[1]}.`);
  const s = v as unknown as Settings;
  return {
    onboarded: true,
    quitAt: s.quitAt,
    firstQuitAt: Math.min(s.firstQuitAt, s.quitAt),
    currency: s.currency,
    pricePerPack: s.pricePerPack,
    cigarettesPerPack: s.cigarettesPerPack,
    cigarettesPerDay: s.cigarettesPerDay,
    notificationsEnabled: s.notificationsEnabled,
    morningEnabled: s.morningEnabled,
    eveningEnabled: s.eveningEnabled,
    weeklyEnabled: s.weeklyEnabled,
    morningTime: { hour: s.morningTime.hour, minute: s.morningTime.minute },
    eveningTime: { hour: s.eveningTime.hour, minute: s.eveningTime.minute },
  };
}

export function validateCravings(v: unknown, now: number): Craving[] {
  if (!Array.isArray(v)) throw new RestoreError('The craving log in this code is damaged.');
  if (v.length > MAX_CRAVINGS) throw new RestoreError('This code has too many craving entries.');
  return v.map((c): Craving => {
    if (
      !isObj(c) ||
      typeof c.id !== 'string' ||
      c.id.length === 0 ||
      c.id.length > 40 ||
      !isNum(c.at, MIN_TS, now + 60 * 60 * 1000) ||
      !TRIGGERS.includes(c.trigger as Trigger) ||
      typeof c.resisted !== 'boolean'
    ) {
      throw new RestoreError('A craving entry in this code is damaged.');
    }
    return { id: c.id, at: c.at, trigger: c.trigger as Trigger, resisted: c.resisted };
  });
}

/** Compact JSON with short keys so codes stay small. */
function pack(data: BackupData): string {
  return JSON.stringify({
    v: 1,
    s: data.settings,
    c: data.cravings.map((c) => [c.id, c.at, TRIGGERS.indexOf(c.trigger), c.resisted ? 1 : 0]),
  });
}

function unpack(json: string): { settings: unknown; cravings: unknown } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new RestoreError('This code could not be read.');
  }
  if (!isObj(parsed) || parsed.v !== 1 || !Array.isArray(parsed.c)) {
    throw new RestoreError('This code is from an unsupported version.');
  }
  const cravings = parsed.c.map((row: unknown) => {
    if (!Array.isArray(row) || row.length !== 4) return null;
    return { id: row[0], at: row[1], trigger: TRIGGERS[row[2] as number], resisted: row[3] === 1 };
  });
  return { settings: parsed.s, cravings };
}

export async function encodeBackup(data: BackupData, hash: HashFn): Promise<string> {
  const json = pack(data);
  const digest = (await hash(json)).slice(0, CHECKSUM_LENGTH);
  return `${PREFIX}.${toBase64(json)}.${digest}`;
}

export async function decodeBackup(code: string, hash: HashFn, now: number): Promise<BackupData> {
  const trimmed = code.replace(/\s+/g, '');
  if (trimmed.length === 0) throw new RestoreError('Paste a restore code first.');
  if (trimmed.length > MAX_CODE_LENGTH) throw new RestoreError('This code is too long.');
  const parts = trimmed.split('.');
  if (parts.length !== 3 || parts[0] !== PREFIX || parts[2].length !== CHECKSUM_LENGTH) {
    throw new RestoreError("This doesn't look like a Breathe Freely code.");
  }
  let json: string;
  try {
    json = fromBase64(parts[1]);
  } catch {
    throw new RestoreError('This code contains invalid characters.');
  }
  const digest = (await hash(json)).slice(0, CHECKSUM_LENGTH);
  if (digest !== parts[2].toLowerCase()) {
    throw new RestoreError('This code is incomplete or was changed. Copy it again in full.');
  }
  const raw = unpack(json);
  return {
    settings: validateSettings(raw.settings, now),
    cravings: validateCravings(raw.cravings, now),
  };
}
