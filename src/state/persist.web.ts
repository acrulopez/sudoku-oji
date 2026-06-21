/**
 * Web build of the Zustand `persist` storage adapter. MMKV is native-only, so
 * on web we back it with `localStorage` (no-op fallback when unavailable).
 * Native builds use the MMKV adapter in `persist.ts`.
 */
import type { StateStorage } from 'zustand/middleware';

function ls(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

export const mmkvStateStorage: StateStorage = {
  getItem: (name) => ls()?.getItem(name) ?? null,
  setItem: (name, value) => ls()?.setItem(name, value),
  removeItem: (name) => ls()?.removeItem(name),
};
