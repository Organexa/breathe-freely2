import * as Crypto from 'expo-crypto';
import { BackupData } from '../state/types';
import { decodeBackup, encodeBackup, HashFn, RestoreError } from './backupCodec';

const sha256: HashFn = (text) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text, {
    encoding: Crypto.CryptoEncoding.HEX,
  });

export function exportCode(data: BackupData): Promise<string> {
  return encodeBackup(data, sha256);
}

export function parseCode(code: string): Promise<BackupData> {
  return decodeBackup(code, sha256, Date.now());
}

export { RestoreError };
