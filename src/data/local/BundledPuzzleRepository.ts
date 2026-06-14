import type { Difficulty, Puzzle } from '../../domain/types';
import type { PuzzleRepository } from '../repositories/PuzzleRepository';

export type PuzzleBank = Record<Difficulty, Puzzle[]>;

/**
 * Serves puzzles from an in-memory bank built at app start from bundled JSON
 * assets. Prefers puzzles the player has not seen; falls back to the full set
 * once every puzzle in a tier has been played.
 */
export class BundledPuzzleRepository implements PuzzleRepository {
  private readonly byId = new Map<string, Puzzle>();

  constructor(private readonly bank: PuzzleBank) {
    for (const list of Object.values(bank)) {
      for (const p of list) this.byId.set(p.id, p);
    }
  }

  getPuzzle(difficulty: Difficulty, excludeIds: string[] = []): Puzzle {
    const all = this.bank[difficulty] ?? [];
    if (all.length === 0) {
      throw new Error(`No puzzles bundled for difficulty "${difficulty}"`);
    }
    const exclude = new Set(excludeIds);
    const fresh = all.filter((p) => !exclude.has(p.id));
    const pool = fresh.length > 0 ? fresh : all;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  getById(id: string): Puzzle | undefined {
    return this.byId.get(id);
  }
}
