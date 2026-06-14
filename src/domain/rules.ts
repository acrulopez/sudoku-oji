/**
 * Sudoku rules: peer relationships, placement validity, conflict detection.
 */

import { boxOf, colOf, rowOf, SIDE } from './board';
import type { Board, CellIndex, Digit } from './types';

/**
 * Precomputed peer sets: for each cell, the 20 other cells sharing its row,
 * column, or box. Built once at module load.
 */
export const PEERS: readonly ReadonlySet<CellIndex>[] = buildPeers();

function buildPeers(): Set<CellIndex>[] {
  const peers: Set<CellIndex>[] = [];
  for (let i = 0; i < SIDE * SIDE; i++) {
    const set = new Set<CellIndex>();
    const r = rowOf(i);
    const c = colOf(i);
    const b = boxOf(i);
    for (let j = 0; j < SIDE * SIDE; j++) {
      if (j === i) continue;
      if (rowOf(j) === r || colOf(j) === c || boxOf(j) === b) set.add(j);
    }
    peers.push(set);
  }
  return peers;
}

export function getPeers(index: CellIndex): ReadonlySet<CellIndex> {
  return PEERS[index];
}

/**
 * Whether `value` can legally be placed at `index` given the current board —
 * i.e. no peer already holds that value. Ignores the cell's own current value.
 */
export function isValidPlacement(
  board: Board,
  index: CellIndex,
  value: Digit,
): boolean {
  for (const peer of PEERS[index]) {
    if (board[peer].value === value) return false;
  }
  return true;
}

/**
 * Indices of all cells that conflict with another cell (same value in a peer).
 * Used to highlight mistakes.
 */
export function getConflicts(board: Board): Set<CellIndex> {
  const conflicts = new Set<CellIndex>();
  for (let i = 0; i < board.length; i++) {
    const v = board[i].value;
    if (v === null) continue;
    for (const peer of PEERS[i]) {
      if (board[peer].value === v) {
        conflicts.add(i);
        conflicts.add(peer);
      }
    }
  }
  return conflicts;
}
