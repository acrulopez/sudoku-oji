/**
 * Composition root — the single place that wires repository interfaces to
 * concrete implementations. Swapping to a backend later (API-backed puzzles,
 * remote sync, server analytics) means changing only this file.
 */

import { MmkvKeyValueStore } from './kv/MmkvKeyValueStore';
import { BundledPuzzleRepository } from './local/BundledPuzzleRepository';
import { LocalStatsRepository } from './local/LocalStatsRepository';
import { MmkvGameStorageRepository } from './local/MmkvGameStorageRepository';
import { puzzleBank } from './local/puzzleBank';

import type { PuzzleRepository } from './repositories/PuzzleRepository';
import type { GameStorageRepository } from './repositories/GameStorageRepository';
import type { StatsRepository } from './repositories/StatsRepository';

export interface Repositories {
  puzzles: PuzzleRepository;
  games: GameStorageRepository;
  stats: StatsRepository;
}

let instance: Repositories | null = null;

/** Lazily construct and cache the app's repositories. */
export function getRepositories(): Repositories {
  if (!instance) {
    const kv = new MmkvKeyValueStore();
    instance = {
      puzzles: new BundledPuzzleRepository(puzzleBank),
      games: new MmkvGameStorageRepository(kv),
      stats: new LocalStatsRepository(kv),
    };
  }
  return instance;
}

export * from './repositories/PuzzleRepository';
export * from './repositories/StatsRepository';
export * from './repositories/GameStorageRepository';
