/**
 * Naked Single: a cell with exactly one remaining candidate. The simplest
 * technique — the cell's row, column and box together rule out all but one
 * digit, so that digit must go there.
 */

import { rowOf, colOf } from '../board';
import { getPeers } from '../rules';
import type { Board, CellIndex, Digit } from '../types';
import type { Hint, CellAnnotation } from './types';

export function detectNakedSingle(
  board: Board,
  candidates: Map<CellIndex, Set<Digit>>,
): Hint | null {
  for (const [index, cands] of candidates) {
    if (cands.size !== 1) continue;
    const digit = [...cands][0];

    // Peers holding a value are what eliminate the other eight digits.
    const filledPeers = [...getPeers(index)].filter((p) => board[p].value !== null);

    const r = rowOf(index) + 1;
    const c = colOf(index) + 1;

    const focus: Record<CellIndex, CellAnnotation> = { [index]: { tint: 'target' } };
    const withPeers: Record<CellIndex, CellAnnotation> = { ...focus };
    for (const p of filledPeers) withPeers[p] = { tint: 'unit' };

    return {
      technique: 'naked_single',
      title: 'Naked Single',
      steps: [
        {
          text: [
            { text: 'Focus on the ' },
            { text: 'highlighted cell', emphasis: true },
            { text: ` at row ${r}, column ${c}. Look at every filled cell in its row, column and box.` },
          ],
          annotations: withPeers,
        },
        {
          text: [
            { text: 'Together those cells already use every digit except ' },
            { text: String(digit), emphasis: true },
            { text: '. So ' },
            { text: String(digit), emphasis: true },
            { text: ' is the only candidate left — it must go here.' },
          ],
          annotations: { ...withPeers, [index]: { tint: 'target', ghost: digit } },
        },
      ],
      action: { kind: 'place', placements: [{ index, digit }] },
    };
  }
  return null;
}
