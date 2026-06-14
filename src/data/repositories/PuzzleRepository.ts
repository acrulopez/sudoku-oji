import type { Difficulty, Puzzle } from '../../domain/types';

/**
 * Source of puzzles. Today: a bundled offline bank. Tomorrow: an API-backed or
 * on-device-generated implementation behind the same interface.
 */
export interface PuzzleRepository {
  /** A random puzzle of the given difficulty, optionally avoiding played ids. */
  getPuzzle(difficulty: Difficulty, excludeIds?: string[]): Puzzle;
  /** Look up a specific puzzle by id (for resuming a saved game). */
  getById(id: string): Puzzle | undefined;
}
