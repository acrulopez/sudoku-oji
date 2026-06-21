/**
 * Backtracking solver and the last-resort hint.
 *
 * `solveBoard` returns the unique solution as a digit-per-index array (used both
 * to validate that every hint is sound and to drive the brute-force fallback).
 * The fallback fires only when no learnable technique applies, placing the
 * solved value in the most-constrained empty cell.
 */

import { PEERS } from '../rules';
import type { Board, CellIndex, Digit } from '../types';
import { candidatesFor } from '../candidates';
import type { Hint } from './types';

/** Solve the board by backtracking (MRV heuristic). Returns null if unsolvable. */
export function solveBoard(board: Board): Digit[] | null {
  const vals = board.map((c) => c.value ?? 0) as number[];

  const candsAt = (i: number): number[] => {
    const used = new Set<number>();
    for (const p of PEERS[i]) if (vals[p] !== 0) used.add(vals[p]);
    const out: number[] = [];
    for (let d = 1; d <= 9; d++) if (!used.has(d)) out.push(d);
    return out;
  };

  const solve = (): boolean => {
    // Most-constrained empty cell.
    let best = -1;
    let bestCands: number[] = [];
    for (let i = 0; i < 81; i++) {
      if (vals[i] !== 0) continue;
      const c = candsAt(i);
      if (c.length === 0) return false;
      if (best === -1 || c.length < bestCands.length) {
        best = i;
        bestCands = c;
        if (c.length === 1) break;
      }
    }
    if (best === -1) return true; // no empty cells → solved
    for (const d of bestCands) {
      vals[best] = d;
      if (solve()) return true;
      vals[best] = 0;
    }
    return false;
  };

  if (!solve()) return null;
  return vals as Digit[];
}

/** Place the solved value in the most-constrained empty cell. */
export function bruteForceHint(board: Board, solution: Digit[]): Hint | null {
  let target = -1;
  let fewest = 10;
  for (let i = 0; i < 81; i++) {
    if (board[i].value !== null) continue;
    const n = candidatesFor(board, i).length;
    if (n < fewest) {
      fewest = n;
      target = i;
    }
  }
  if (target === -1) return null;
  const digit = solution[target];

  return {
    technique: 'brute_force',
    title: 'Last Resort',
    steps: [
      {
        text: [
          { text: 'No simpler technique applies here. This step needs ' },
          { text: 'trial and error', emphasis: true },
          { text: ' — testing a candidate and following the consequences.' },
        ],
        annotations: { [target]: { tint: 'focus' } },
      },
      {
        text: [
          { text: 'The only value that leads to a consistent solution in this cell is ' },
          { text: String(digit), emphasis: true },
          { text: '.' },
        ],
        annotations: { [target as CellIndex]: { tint: 'target', ghost: digit } },
      },
    ],
    action: { kind: 'place', placements: [{ index: target, digit }] },
  };
}
