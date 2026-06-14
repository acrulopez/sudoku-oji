/**
 * Board construction and coordinate helpers. Pure functions; boards are treated
 * immutably — every mutation returns a new array with new cell objects for the
 * cells that changed.
 */

import type { Board, Cell, CellIndex, Digit, Puzzle } from './types';

export const BOARD_SIZE = 81;
export const SIDE = 9;
export const BOX = 3;

export function rowOf(index: CellIndex): number {
  return Math.floor(index / SIDE);
}

export function colOf(index: CellIndex): number {
  return index % SIDE;
}

export function boxOf(index: CellIndex): number {
  return Math.floor(rowOf(index) / BOX) * BOX + Math.floor(colOf(index) / BOX);
}

export function indexOf(row: number, col: number): CellIndex {
  return row * SIDE + col;
}

function parseChar(ch: string): Digit | null {
  if (ch === '.' || ch === '0') return null;
  const n = Number(ch);
  return n >= 1 && n <= 9 ? (n as Digit) : null;
}

/** Build a fresh, immutable board from a puzzle's givens string. */
export function boardFromPuzzle(puzzle: Puzzle): Board {
  return createBoard(puzzle.givens);
}

/** Build a board from an 81-char givens string. */
export function createBoard(givens: string): Board {
  if (givens.length !== BOARD_SIZE) {
    throw new Error(`Expected ${BOARD_SIZE} chars, got ${givens.length}`);
  }
  const board: Board = new Array(BOARD_SIZE);
  for (let i = 0; i < BOARD_SIZE; i++) {
    const value = parseChar(givens[i]);
    board[i] = { value, given: value !== null, notes: new Set<Digit>() };
  }
  return board;
}

/** Deep-clone a single cell (notes Set is copied). */
export function cloneCell(cell: Cell): Cell {
  return { value: cell.value, given: cell.given, notes: new Set(cell.notes) };
}

/** Return a new board with the given cell replaced. Original is untouched. */
export function withCell(board: Board, index: CellIndex, cell: Cell): Board {
  const next = board.slice();
  next[index] = cell;
  return next;
}

/** Serialize current values to an 81-char string ('.' for empty). */
export function boardToString(board: Board): string {
  return board.map((c) => (c.value === null ? '.' : String(c.value))).join('');
}

export function isComplete(board: Board): boolean {
  return board.every((c) => c.value !== null);
}
