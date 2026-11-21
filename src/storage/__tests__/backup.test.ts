import { createHash } from 'crypto';
import { decodeBackup, encodeBackup, RestoreError } from '../backupCodec';
import { fromBase64, toBase64 } from '../base64';
import { DEFAULT_SETTINGS, BackupData } from '../../state/types';

const hash = async (t: string) => createHash('sha256').update(t, 'utf8').digest('hex');
const NOW = Date.UTC(2026, 10, 21);

const data: BackupData = {
  settings: { ...DEFAULT_SETTINGS, onboarded: true, quitAt: NOW - 86400000, firstQuitAt: NOW - 2 * 86400000, currency: '₹' },
  cravings: [
    { id: 'a1', at: NOW - 3600000, trigger: 'After coffee', resisted: true },
    { id: 'b2', at: NOW - 7200000, trigger: 'Stress', resisted: false },
  ],
};

describe('base64', () => {
  it('round-trips unicode text', () => {
    for (const s of ['', 'a', 'ab', 'abc', '₹ €£ 🫁 hello']) expect(fromBase64(toBase64(s))).toBe(s);
  });
  it('matches Node for ASCII', () => {
    const s = '{"v":1,"x":"hello world"}';
    expect(toBase64(s)).toBe(Buffer.from(s).toString('base64url'));
  });
});

describe('backup codes', () => {
  it('round-trips all data', async () => {
    const code = await encodeBackup(data, hash);
    expect(code.startsWith('BF1.')).toBe(true);
    expect(await decodeBackup(code, hash, NOW)).toEqual(data);
  });
  it('tolerates whitespace and line breaks from copy/paste', async () => {
    const code = await encodeBackup(data, hash);
    const messy = `  ${code.slice(0, 20)}\n${code.slice(20)} `;
    expect(await decodeBackup(messy, hash, NOW)).toEqual(data);
  });
  it('rejects tampered codes', async () => {
    const code = await encodeBackup(data, hash);
    const parts = code.split('.');
    const body = parts[1];
    const flipped = body.slice(0, 10) + (body[10] === 'A' ? 'B' : 'A') + body.slice(11);
    await expect(decodeBackup(`BF1.${flipped}.${parts[2]}`, hash, NOW)).rejects.toThrow(RestoreError);
  });
  it('rejects garbage and invalid values', async () => {
    await expect(decodeBackup('', hash, NOW)).rejects.toThrow('Paste a restore code first.');
    await expect(decodeBackup('hello', hash, NOW)).rejects.toThrow(RestoreError);
    const bad = { ...data, settings: { ...data.settings, cigarettesPerDay: -3 } };
    const code = await encodeBackup(bad, hash);
    await expect(decodeBackup(code, hash, NOW)).rejects.toThrow('cigarettes per day');
  });
});
