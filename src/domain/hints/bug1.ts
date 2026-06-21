/**
 * BUG+1 (Bivalue Universal Grave + 1): if every unsolved cell has exactly two
 * candidates except one cell with three, the puzzle would have multiple
 * solutions unless that cell takes the candidate appearing three times in one
 * of its units. That digit is therefore the answer.
 */

import { boxOf, colOf, rowOf } from '../board';
import type { Board, CellIndex, Digit } from '../types';
import { getBoxIndices, getColIndices, getRowIndices } from './units';
import type { Hint, CellAnnotation } from './types';

export function detectBug1(
  board: Board,
  candidates: Map<CellIndex, Set<Digit>>,
): Hint | null {
  if (candidates.size === 0) return null;

  let tri: CellIndex | null = null;
  for (const [i, c] of candidates) {
    if (c.size === 2) continue;
    if (c.size === 3 && tri === null) tri = i;
    else return null; // a non-bivalue cell other than the single trivalue → not BUG+1
  }
  if (tri === null) return null;

  // The answer is the candidate that appears three times in a unit of `tri`.
  const units = [
    getRowIndices(rowOf(tri)),
    getColIndices(colOf(tri)),
    getBoxIndices(boxOf(tri)),
  ];
  let answer: Digit | null = null;
  for (const d of candidates.get(tri)!) {
    if (units.some((u) => u.filter((i) => candidates.get(i)?.has(d)).length === 3)) {
      answer = d;
      break;
    }
  }
  if (answer === null) return null;

  const r = rowOf(tri) + 1;
  const c = colOf(tri) + 1;
  const focus: Record<CellIndex, CellAnnotation> = { [tri]: { tint: 'focus' } };

  return {
    technique: 'bug1',
    title: 'BUG + 1',
    steps: [
      {
        text: [
          { text: 'Every empty cell has just two candidates except the ' },
          { text: 'highlighted cell', emphasis: true },
          { text: ` at row ${r}, column ${c}, which has three.` },
        ],
        annotations: focus,
      },
      {
        text: [
          { text: 'A puzzle with one solution can not be all-bivalue, so this cell must take the candidate that appears three times in its unit: ' },
          { text: String(answer), emphasis: true },
          { text: '.' },
        ],
        annotations: { [tri]: { tint: 'target', ghost: answer } },
      },
    ],
    action: { kind: 'place', placements: [{ index: tri, digit: answer }] },
  };
}
