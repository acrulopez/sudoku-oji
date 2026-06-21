/**
 * Fish: a single digit D whose candidates in `size` "base" lines are confined to
 * the same `size` "cover" lines. D must occupy those cover lines within the base
 * lines, so it can be removed from the cover lines elsewhere.
 *
 * Size 2 is the X-Wing, 3 the Swordfish, 4 the Jellyfish. Each is checked with
 * rows as the base (columns as cover) and the mirror orientation.
 */

import { colOf, rowOf } from '../board';
import { DIGITS } from '../types';
import type { Board, CellIndex, Digit } from '../types';
import { combinations, getColIndices, getRowIndices } from './units';
import type { Hint, CellAnnotation, TechniqueId } from './types';

type FishSize = 2 | 3 | 4;

const META: Record<FishSize, { id: TechniqueId; title: string }> = {
  2: { id: 'x_wing', title: 'X-Wing' },
  3: { id: 'swordfish', title: 'Swordfish' },
  4: { id: 'jellyfish', title: 'Jellyfish' },
};

interface Orientation {
  base: 'row' | 'column';
  cover: 'row' | 'column';
  lineCells: (n: number) => CellIndex[];
  coverCells: (n: number) => CellIndex[];
  coverIndexOf: (cell: CellIndex) => number;
  baseIndexOf: (cell: CellIndex) => number;
}

const ORIENTATIONS: Orientation[] = [
  {
    base: 'row',
    cover: 'column',
    lineCells: getRowIndices,
    coverCells: getColIndices,
    coverIndexOf: colOf,
    baseIndexOf: rowOf,
  },
  {
    base: 'column',
    cover: 'row',
    lineCells: getColIndices,
    coverCells: getRowIndices,
    coverIndexOf: rowOf,
    baseIndexOf: colOf,
  },
];

const plural = (kind: 'row' | 'column') => (kind === 'row' ? 'rows' : 'columns');

export function detectFish(
  board: Board,
  candidates: Map<CellIndex, Set<Digit>>,
  size: FishSize,
): Hint | null {
  for (const digit of DIGITS) {
    for (const orient of ORIENTATIONS) {
      // Base lines where the digit has 2..size candidate cells.
      const baseLines: { n: number; covers: number[]; cells: CellIndex[] }[] = [];
      for (let n = 0; n < 9; n++) {
        const cells = orient.lineCells(n).filter((i) => candidates.get(i)?.has(digit));
        if (cells.length >= 2 && cells.length <= size) {
          baseLines.push({ n, covers: cells.map(orient.coverIndexOf), cells });
        }
      }
      if (baseLines.length < size) continue;

      for (const combo of combinations(baseLines, size)) {
        const coverSet = new Set<number>();
        for (const bl of combo) for (const c of bl.covers) coverSet.add(c);
        if (coverSet.size !== size) continue;

        const baseSet = new Set(combo.map((bl) => bl.n));

        // Remove the digit from the cover lines in cells off the base lines.
        const eliminations: { index: CellIndex; digit: Digit }[] = [];
        for (const cv of coverSet) {
          for (const cell of orient.coverCells(cv)) {
            if (baseSet.has(orient.baseIndexOf(cell))) continue;
            if (candidates.get(cell)?.has(digit) && board[cell].notes.has(digit)) {
              eliminations.push({ index: cell, digit });
            }
          }
        }
        if (eliminations.length === 0) continue;

        const { id, title } = META[size];
        const corners = combo.flatMap((bl) => bl.cells);

        const intro: Record<CellIndex, CellAnnotation> = {};
        for (const bl of combo) for (const cell of orient.lineCells(bl.n)) intro[cell] = { tint: 'unit' };
        for (const cv of coverSet) for (const cell of orient.coverCells(cv)) intro[cell] ??= { tint: 'unit' };
        for (const cell of corners) intro[cell] = { tint: 'unit', highlightNotes: [digit] };

        const reveal: Record<CellIndex, CellAnnotation> = { ...intro };
        for (const e of eliminations) reveal[e.index] = { tint: 'target', strikeNotes: [digit] };

        return {
          technique: id,
          title,
          steps: [
            {
              text: [
                { text: 'The digit ' },
                { text: String(digit), emphasis: true },
                { text: ` appears in only ${size} ${plural(orient.cover)} across these ${size} ` },
                { text: `${plural(orient.base)}`, emphasis: true },
                { text: ` (the highlighted cells) — an ${title}.` },
              ],
              annotations: intro,
            },
            {
              text: [
                { text: 'So ' },
                { text: String(digit), emphasis: true },
                { text: ` must use those ${plural(orient.cover)} inside the ${plural(orient.base)}, and can be removed from the rest of those ` },
                { text: `${plural(orient.cover)}`, emphasis: true },
                { text: '.' },
              ],
              annotations: reveal,
            },
          ],
          action: { kind: 'eliminate', eliminations },
        };
      }
    }
  }
  return null;
}
