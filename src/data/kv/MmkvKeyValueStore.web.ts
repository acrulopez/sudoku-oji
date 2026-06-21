import type { KeyValueStore } from './KeyValueStore';

/**
 * Web build of the key-value store. MMKV is native-only, so on web we back the
 * same synchronous interface with `localStorage` (falling back to an in-memory
 * map when storage is unavailable, e.g. private mode). Native builds use the
 * MMKV implementation in `MmkvKeyValueStore.ts`.
 */
export class MmkvKeyValueStore implements KeyValueStore {
  private readonly prefix: string;
  private readonly mem = new Map<string, string>();

  constructor(id = 'sudoku') {
    this.prefix = `${id}:`;
  }

  private get ls(): Storage | null {
    try {
      return typeof localStorage !== 'undefined' ? localStorage : null;
    } catch {
      return null;
    }
  }

  getString(key: string): string | undefined {
    const v = this.ls?.getItem(this.prefix + key) ?? this.mem.get(key);
    return v ?? undefined;
  }

  set(key: string, value: string): void {
    this.mem.set(key, value);
    this.ls?.setItem(this.prefix + key, value);
  }

  delete(key: string): void {
    this.mem.delete(key);
    this.ls?.removeItem(this.prefix + key);
  }
}
