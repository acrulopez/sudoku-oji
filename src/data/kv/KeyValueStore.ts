/**
 * Minimal synchronous key-value store interface. Decouples repositories from
 * the concrete storage engine (MMKV in the app, in-memory in tests).
 */
export interface KeyValueStore {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  delete(key: string): void;
}
