import { createBoard } from '../domain/board';
import { placeValue, applyAutoNotes } from '../domain/engine';
import { createHistory, pushMove } from '../domain/history';
import { remainingCounts, computeHighlights } from './selectors';
import { serializeGame, deserializeGame } from './gameSerialization';
import type { Digit } from '../domain/types';

const SOLUTION =
  '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

describe('selectors', () => {
  it('remainingCounts reflects placed values', () => {
    const board = createBoard(SOLUTION);
    const counts = remainingCounts(board);
    // a complete board has 0 remaining for every digit
    for (let d = 1 as Digit; d <= 9; d = (d + 1) as Digit) {
      expect(counts[d]).toBe(0);
    }
  });

  it('computeHighlights marks peers and same-value cells', () => {
    const board = createBoard('5'.padEnd(81, '.'));
    const h = computeHighlights(board, 0, null);
    expect(h.peers.size).toBe(20);
    expect(h.sameValue.has(0)).toBe(true);
  });
});

describe('game serialization', () => {
  it('round-trips board, notes, history, timer and mistakes', () => {
    let board = createBoard('.'.repeat(81));
    let history = createHistory();

    const placed = placeValue(board, 0, 7 as Digit)!;
    board = placed.board;
    history = pushMove(history, placed.move);

    const noted = applyAutoNotes(board)!;
    board = noted.board;
    history = pushMove(history, noted.move);

    const saved = serializeGame({
      puzzleId: 'p1',
      difficulty: 'medium',
      givens: '.'.repeat(81),
      board,
      history,
      elapsed: 42,
      mistakes: 2,
    });

    // survives a JSON boundary (as it would through MMKV)
    const restored = deserializeGame(JSON.parse(JSON.stringify(saved)));

    expect(restored.board[0].value).toBe(7);
    expect(restored.elapsed).toBe(42);
    expect(restored.mistakes).toBe(2);
    expect(restored.history.past).toHaveLength(2);
    // notes restored as a Set
    const someNoted = restored.board.find((c) => c.notes.size > 0);
    expect(someNoted).toBeDefined();
  });
});
