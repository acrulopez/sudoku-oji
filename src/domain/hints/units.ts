/**
 * Unit helpers for the hint engine. A "unit" is one of the 27 groups that must
 * contain each digit exactly once: 9 rows, 9 columns, 9 boxes.
 */

import { boxOf, colOf, indexOf, rowOf, SIDE, BOX } from '../board';
import type { CellIndex } from '../types';

export type UnitKind = 'row' | 'col' | 'box';

export interface Unit {
  kind: UnitKind;
  /** 0-8 index of the row / column / box. */
  n: number;
  indices: CellIndex[];
}

export function getRowIndices(row: number): CellIndex[] {
  const out: CellIndex[] = [];
  for (let c = 0; c < SIDE; c++) out.push(indexOf(row, c));
  return out;
}

export function getColIndices(col: number): CellIndex[] {
  const out: CellIndex[] = [];
  for (let r = 0; r < SIDE; r++) out.push(indexOf(r, col));
  return out;
}

export function getBoxIndices(box: number): CellIndex[] {
  const baseRow = Math.floor(box / BOX) * BOX;
  const baseCol = (box % BOX) * BOX;
  const out: CellIndex[] = [];
  for (let r = 0; r < BOX; r++) {
    for (let c = 0; c < BOX; c++) out.push(indexOf(baseRow + r, baseCol + c));
  }
  return out;
}

/** All 27 units, rows first, then columns, then boxes. */
export const ALL_UNITS: Unit[] = buildUnits();

function buildUnits(): Unit[] {
  const units: Unit[] = [];
  for (let n = 0; n < SIDE; n++) units.push({ kind: 'row', n, indices: getRowIndices(n) });
  for (let n = 0; n < SIDE; n++) units.push({ kind: 'col', n, indices: getColIndices(n) });
  for (let n = 0; n < SIDE; n++) units.push({ kind: 'box', n, indices: getBoxIndices(n) });
  return units;
}

/** The unit of the given kind that contains `index`. */
export function unitOf(kind: UnitKind, index: CellIndex): Unit {
  const n = kind === 'row' ? rowOf(index) : kind === 'col' ? colOf(index) : boxOf(index);
  const indices =
    kind === 'row' ? getRowIndices(n) : kind === 'col' ? getColIndices(n) : getBoxIndices(n);
  return { kind, n, indices };
}

export function unitLabel(unit: Unit): string {
  if (unit.kind === 'box') return 'box';
  if (unit.kind === 'row') return `row ${unit.n + 1}`;
  return `column ${unit.n + 1}`;
}

/** All size-`k` combinations of `items`, preserving input order. */
export function combinations<T>(items: T[], k: number): T[][] {
  const out: T[][] = [];
  const combo: T[] = [];
  const recurse = (start: number) => {
    if (combo.length === k) {
      out.push(combo.slice());
      return;
    }
    for (let i = start; i <= items.length - (k - combo.length); i++) {
      combo.push(items[i]);
      recurse(i + 1);
      combo.pop();
    }
  };
  if (k >= 0 && k <= items.length) recurse(0);
  return out;
}
