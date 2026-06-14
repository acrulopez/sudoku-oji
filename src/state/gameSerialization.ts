/**
 * Converts the live domain state (boards with Set-based notes, history) to and
 * from the JSON-friendly SavedGame shape used by GameStorageRepository.
 */
import { createBoard, boardToString } from '../domain/board';
import type { Board, Cell, Difficulty, Digit, Move } from '../domain/types';
import type { History } from '../domain/history';
import type { SavedGame } from '../data/repositories/GameStorageRepository';

interface SerialCell {
  index: number;
  value: number | null;
  given: boolean;
  notes: number[];
}
interface SerialMove {
  type: Move['type'];
  before: SerialCell[];
  after: SerialCell[];
}

function serialSnap(s: { index: number; cell: Cell }): SerialCell {
  return {
    index: s.index,
    value: s.cell.value,
    given: s.cell.given,
    notes: [...s.cell.notes],
  };
}
function deserialSnap(s: SerialCell): { index: number; cell: Cell } {
  return {
    index: s.index,
    cell: {
      value: (s.value as Digit) ?? null,
      given: s.given,
      notes: new Set(s.notes as Digit[]),
    },
  };
}

function serializeHistory(h: History): { past: SerialMove[]; future: SerialMove[] } {
  const conv = (m: Move): SerialMove => ({
    type: m.type,
    before: m.before.map(serialSnap),
    after: m.after.map(serialSnap),
  });
  return { past: h.past.map(conv), future: h.future.map(conv) };
}

function deserializeHistory(raw: unknown): History {
  const h = raw as { past?: SerialMove[]; future?: SerialMove[] } | undefined;
  const conv = (m: SerialMove): Move => ({
    type: m.type,
    before: m.before.map(deserialSnap),
    after: m.after.map(deserialSnap),
  });
  return {
    past: (h?.past ?? []).map(conv),
    future: (h?.future ?? []).map(conv),
  };
}

/** Notes map: cell index -> array of digits (only non-empty cells). */
function notesToMap(board: Board): Record<number, number[]> {
  const map: Record<number, number[]> = {};
  board.forEach((cell, i) => {
    if (cell.notes.size > 0) map[i] = [...cell.notes];
  });
  return map;
}

export interface GameSnapshot {
  puzzleId: string;
  difficulty: Difficulty;
  givens: string;
  board: Board;
  history: History;
  elapsed: number;
  mistakes: number;
}

export function serializeGame(snap: GameSnapshot): SavedGame {
  return {
    puzzleId: snap.puzzleId,
    difficulty: snap.difficulty,
    givens: snap.givens,
    values: boardToString(snap.board),
    notes: notesToMap(snap.board),
    elapsed: snap.elapsed,
    mistakes: snap.mistakes,
    history: serializeHistory(snap.history),
    updatedAt: Date.now(),
  };
}

export function deserializeGame(saved: SavedGame): GameSnapshot {
  // Rebuild values onto the givens-derived board (preserves `given` flags).
  const board = createBoard(saved.givens);
  for (let i = 0; i < 81; i++) {
    const ch = saved.values[i];
    if (!board[i].given && ch !== '.' && ch !== '0') {
      board[i] = { value: Number(ch) as Digit, given: false, notes: new Set() };
    }
  }
  for (const [k, digits] of Object.entries(saved.notes)) {
    const i = Number(k);
    if (board[i].value === null) {
      board[i] = { ...board[i], notes: new Set(digits as Digit[]) };
    }
  }
  return {
    puzzleId: saved.puzzleId,
    difficulty: saved.difficulty,
    givens: saved.givens,
    board,
    history: deserializeHistory(saved.history),
    elapsed: saved.elapsed,
    mistakes: saved.mistakes,
  };
}
