/**
 * Undo/redo history. A pure, immutable stack of Moves. Undo restores each
 * affected cell's "before" snapshot; redo re-applies "after".
 */

import { applySnapshots } from './engine';
import type { Board, Move } from './types';

export interface History {
  past: Move[];
  future: Move[];
}

export function createHistory(): History {
  return { past: [], future: [] };
}

/** Record a freshly-applied move. Clears the redo stack. */
export function pushMove(history: History, move: Move): History {
  return { past: [...history.past, move], future: [] };
}

export function canUndo(history: History): boolean {
  return history.past.length > 0;
}

export function canRedo(history: History): boolean {
  return history.future.length > 0;
}

export interface UndoResult {
  board: Board;
  history: History;
}

/** Undo the last move. Returns null if nothing to undo. */
export function undo(board: Board, history: History): UndoResult | null {
  const move = history.past[history.past.length - 1];
  if (!move) return null;
  const nextBoard = applySnapshots(board, move.before);
  return {
    board: nextBoard,
    history: {
      past: history.past.slice(0, -1),
      future: [...history.future, move],
    },
  };
}

/** Redo the last undone move. Returns null if nothing to redo. */
export function redo(board: Board, history: History): UndoResult | null {
  const move = history.future[history.future.length - 1];
  if (!move) return null;
  const nextBoard = applySnapshots(board, move.after);
  return {
    board: nextBoard,
    history: {
      past: [...history.past, move],
      future: history.future.slice(0, -1),
    },
  };
}
