/**
 * W-Wing: two cells with the same bivalue pair {x,y} that are linked by a strong
 * link on one of the digits (a unit where that digit fits in exactly two cells,
 * one seeing each {x,y} cell). The two {x,y} cells can never both be the other
 * digit, so it can be removed from any cell that sees both of them.
 */

import { getPeers } from '../rules';
import type { Board, CellIndex, Digit } from '../types';
import { ALL_UNITS } from './units';
import type { Hint, CellAnnotation } from './types';

export function detectWWing(
  board: Board,
  candidates: Map<CellIndex, Set<Digit>>,
): Hint | null {
  const bivalue = [...candidates.entries()].filter(([, c]) => c.size === 2);

  for (let i = 0; i < bivalue.length; i++) {
    for (let j = i + 1; j < bivalue.length; j++) {
      const [a, ca] = bivalue[i];
      const [b, cb] = bivalue[j];
      if (!sameSet(ca, cb)) continue;
      if (getPeers(a).has(b)) continue; // peers → not a W-Wing
      const [x, y] = [...ca] as [Digit, Digit];

      for (const link of [x, y] as Digit[]) {
        const elimDigit = link === x ? y : x;

        for (const unit of ALL_UNITS) {
          const pos = unit.indices.filter((k) => candidates.get(k)?.has(link));
          if (pos.length !== 2) continue;
          const [p, q] = pos;
          if (p === a || p === b || q === a || q === b) continue;

          const linksAB =
            (getPeers(a).has(p) && getPeers(b).has(q)) ||
            (getPeers(b).has(p) && getPeers(a).has(q));
          if (!linksAB) continue;

          const peersB = getPeers(b);
          const eliminations: { index: CellIndex; digit: Digit }[] = [];
          for (const cell of getPeers(a)) {
            if (cell === b || !peersB.has(cell)) continue;
            if (candidates.get(cell)?.has(elimDigit) && board[cell].notes.has(elimDigit)) {
              eliminations.push({ index: cell, digit: elimDigit });
            }
          }
          if (eliminations.length === 0) continue;

          const intro: Record<CellIndex, CellAnnotation> = {
            [a]: { tint: 'unit', highlightNotes: [x, y] },
            [b]: { tint: 'unit', highlightNotes: [x, y] },
            [p]: { tint: 'focus', highlightNotes: [link] },
            [q]: { tint: 'focus', highlightNotes: [link] },
          };
          const reveal: Record<CellIndex, CellAnnotation> = { ...intro };
          for (const e of eliminations) reveal[e.index] = { tint: 'target', strikeNotes: [elimDigit] };

          return {
            technique: 'w_wing',
            title: 'W-Wing',
            steps: [
              {
                text: [
                  { text: 'Two cells share the pair ' },
                  { text: `${x} / ${y}`, emphasis: true },
                  { text: ', joined by a strong link on ' },
                  { text: String(link), emphasis: true },
                  { text: ' (the other two highlighted cells).' },
                ],
                annotations: intro,
              },
              {
                text: [
                  { text: 'They can never both be ' },
                  { text: String(elimDigit), emphasis: true },
                  { text: ', so ' },
                  { text: String(elimDigit), emphasis: true },
                  { text: ' can be removed from any cell seeing ' },
                  { text: 'both pair cells', emphasis: true },
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
  }
  return null;
}

function sameSet(a: Set<Digit>, b: Set<Digit>): boolean {
  if (a.size !== b.size) return false;
  for (const d of a) if (!b.has(d)) return false;
  return true;
}
