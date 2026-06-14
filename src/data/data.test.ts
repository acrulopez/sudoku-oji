import { BundledPuzzleRepository } from './local/BundledPuzzleRepository';
import { MmkvGameStorageRepository } from './local/MmkvGameStorageRepository';
import { LocalStatsRepository } from './local/LocalStatsRepository';
import { MemoryKeyValueStore } from './kv/MemoryKeyValueStore';
import { puzzleBank } from './local/puzzleBank';
import { createBoard, boardToString } from '../domain/board';
import { countSolutionsSlow } from './testSolver';
import { DIFFICULTIES } from '../domain/types';
import type { SavedGame } from './repositories/GameStorageRepository';

describe('BundledPuzzleRepository', () => {
  const repo = new BundledPuzzleRepository(puzzleBank);

  it('serves a puzzle for every difficulty', () => {
    for (const d of DIFFICULTIES) {
      const p = repo.getPuzzle(d);
      expect(p.difficulty).toBe(d);
      expect(p.givens).toHaveLength(81);
      expect(p.solution).toHaveLength(81);
    }
  });

  it('every bundled puzzle is uniquely solvable and matches its solution', () => {
    for (const d of DIFFICULTIES) {
      // Sample the first few per tier to keep the test fast.
      for (const p of puzzleBank[d].slice(0, 3)) {
        const board = createBoard(p.givens);
        // givens are a subset of the solution
        for (let i = 0; i < 81; i++) {
          if (board[i].value !== null) {
            expect(String(board[i].value)).toBe(p.solution[i]);
          }
        }
        expect(countSolutionsSlow(p.givens)).toBe(1);
      }
    }
  });

  it('prefers unplayed puzzles', () => {
    const exclude = puzzleBank.easy.slice(0, -1).map((p) => p.id);
    const p = repo.getPuzzle('easy', exclude);
    expect(p.id).toBe(puzzleBank.easy[puzzleBank.easy.length - 1].id);
  });

  it('getById round-trips', () => {
    const id = puzzleBank.hard[0].id;
    expect(repo.getById(id)?.id).toBe(id);
  });
});

describe('MmkvGameStorageRepository', () => {
  it('saves, loads, and clears the game', () => {
    const repo = new MmkvGameStorageRepository(new MemoryKeyValueStore());
    const game: SavedGame = {
      puzzleId: 'easy-0000',
      difficulty: 'easy',
      givens: boardToString(createBoard('.'.repeat(81))),
      values: '.'.repeat(81),
      notes: { 0: [1, 2] },
      elapsed: 12,
      mistakes: 1,
      history: { past: [], future: [] },
      updatedAt: 1,
    };
    expect(repo.loadGame()).toBeUndefined();
    repo.saveGame(game);
    expect(repo.loadGame()?.puzzleId).toBe('easy-0000');
    repo.clearGame();
    expect(repo.loadGame()).toBeUndefined();
  });

  it('tracks played ids without duplicates', () => {
    const repo = new MmkvGameStorageRepository(new MemoryKeyValueStore());
    repo.markPlayed('a');
    repo.markPlayed('a');
    repo.markPlayed('b');
    expect(repo.getPlayedIds()).toEqual(['a', 'b']);
  });
});

describe('LocalStatsRepository', () => {
  it('aggregates completions and best times', () => {
    const repo = new LocalStatsRepository(new MemoryKeyValueStore());
    repo.recordEvent({
      type: 'game_completed',
      difficulty: 'easy',
      puzzleId: 'x',
      elapsed: 100,
      mistakes: 0,
      at: 1,
    });
    repo.recordEvent({
      type: 'game_completed',
      difficulty: 'easy',
      puzzleId: 'y',
      elapsed: 60,
      mistakes: 0,
      at: 2,
    });
    const stats = repo.getStats();
    expect(stats.gamesCompleted).toBe(2);
    expect(stats.bestTimes.easy).toBe(60);
  });
});
