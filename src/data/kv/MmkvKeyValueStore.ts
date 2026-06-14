import { createMMKV, type MMKV } from 'react-native-mmkv';
import type { KeyValueStore } from './KeyValueStore';

/** MMKV-backed key-value store used in the running app. */
export class MmkvKeyValueStore implements KeyValueStore {
  private readonly mmkv: MMKV;

  constructor(id = 'sudoku') {
    this.mmkv = createMMKV({ id });
  }

  getString(key: string): string | undefined {
    return this.mmkv.getString(key);
  }

  set(key: string, value: string): void {
    this.mmkv.set(key, value);
  }

  delete(key: string): void {
    this.mmkv.remove(key);
  }
}
