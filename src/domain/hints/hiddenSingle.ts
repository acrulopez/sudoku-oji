/**
 * Hidden Single — taught as "Cross-Hatching". Within one unit (box, row or
 * column) a digit has exactly one cell where it can still legally go: every
 * other empty cell in the unit is blocked by a copy of that digit in an
 * intersecting row, column or box.
 */

import { getPeers } from '../rules';
import { DIGITS } from '../types';
import type { Board, CellIndex, Digit } from '../types';
import { ALL_UNITS, unitLabel } from './units';
import type { Unit } from './units';
import type { Hint, CellAnnotation } from './types';

// Boxes read most naturally as cross-hatching, so try them first.
const UNIT_ORDER: Unit['kind'][] = ['box', 'row', 'col'];

export function detectHiddenSingle(
  board: Board,
  candidates: Map<CellIndex, Set<Digit>>,
): Hint | null {
  const units = [...ALL_UNITS].sort(
    (a, b) => UNIT_ORDER.indexOf(a.kind) - UNIT_ORDER.indexOf(b.kind),
  );

  for (const unit of units) {
    for (const digit of DIGITS) {
      // Skip digits already placed in this unit.
      if (unit.indices.some((i) => board[i].value === digit)) continue;

      const candidateCells = unit.indices.filter((i) => candidates.get(i)?.has(digit));
      if (candidateCells.length !== 1) continue;

      const answer = candidateCells[0];

      // Every other empty cell in the unit is blocked → mark it with an "×".
      const crossCells = unit.indices.filter(
        (i) => i !== answer && board[i].value === null,
      );

      // The copies of `digit` whose row/column/box blocks those cells.
      const sources = new Set<CellIndex>();
      for (const cell of crossCells) {
        for (const p of getPeers(cell)) {
          if (board[p].value === digit) sources.add(p);
        }
      }

      const where = unitLabel(unit);
      const title =
        unit.kind === 'box'
          ? 'Cross-Hatching in Box'
          : unit.kind === 'row'
            ? 'Cross-Hatching in Row'
            : 'Cross-Hatching in Column';

      // Step 1: the unit + the blocking copies of the digit.
      const intro: Record<CellIndex, CellAnnotation> = {};
      for (const i of unit.indices) intro[i] = { tint: 'unit' };
      for (const s of sources) intro[s] = { tint: 'focus' };

      // Step 2: cross the blocked cells, ghost the answer.
      const reveal: Record<CellIndex, CellAnnotation> = { ...intro };
      for (const cell of crossCells) reveal[cell] = { cross: true };
      reveal[answer] = { tint: 'target', ghost: digit };

      return {
        technique: 'hidden_single',
        title,
        steps: [
          {
            text: [
              { text: "Let's focus on number " },
              { text: String(digit), emphasis: true },
              { text: ' and the ' },
              { text: 'highlighted area', emphasis: true },
              { text: '. A single number can not appear twice in the same row, column or box.' },
            ],
            annotations: intro,
          },
          {
            text: [
              { text: 'Therefore, ' },
              { text: String(digit), emphasis: true },
              { text: ' can not be filled in the cells marked with "×" in ' },
              { text: `this ${where}`, emphasis: true },
              { text: ', so the only cell left that can hold ' },
              { text: String(digit), emphasis: true },
              { text: ' is the highlighted one.' },
            ],
            annotations: reveal,
          },
        ],
        action: { kind: 'place', placements: [{ index: answer, digit }] },
      };
    }
  }
  return null;
}
