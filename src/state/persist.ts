/**
 * Zustand `persist` storage adapter backed by MMKV. Used by settingsStore.
 */
import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const storage = createMMKV({ id: 'sudoku-settings' });

export const mmkvStateStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => storage.remove(name),
};
