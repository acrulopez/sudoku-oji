/**
 * Smart Hint data model — pure TypeScript, no framework/storage imports.
 *
 * A `Hint` is a self-contained teaching walkthrough: an ordered list of steps,
 * each carrying narration text and a set of per-cell board annotations, plus a
 * final action to apply once the player understands the technique.
 */

import type { CellIndex, Digit } from '../types';

export type TechniqueId =
  | 'naked_single'
  | 'hidden_single'
  | 'naked_pair'
  | 'hidden_pair'
  | 'pointing_pair'
  | 'claiming'
  | 'naked_triple'
  | 'hidden_triple'
  | 'naked_quad'
  | 'hidden_quad'
  | 'x_wing'
  | 'swordfish'
  | 'jellyfish'
  | 'xy_wing'
  | 'xyz_wing'
  | 'unique_rectangle'
  | 'simple_coloring';

/** A run of narration text; `emphasis` runs are rendered in the accent color. */
export interface TextSegment {
  text: string;
  emphasis?: boolean;
}

/**
 * How a single cell should be drawn during one step.
 *  - `tint`  paints the cell background: `unit` for the scanned row/col/box,
 *            `focus` for the source cells driving the deduction, `target` for
 *            the cell(s) the technique resolves.
 *  - `cross` draws a gray "×" — the digit cannot go in this (empty) cell.
 *  - `ghost` shows a faded preview of the answer digit.
 */
export interface CellAnnotation {
  tint?: 'unit' | 'focus' | 'target';
  cross?: boolean;
  ghost?: Digit;
  /** Note digits to emphasize within this cell's 3x3 notes grid (the candidates
   *  driving the deduction). */
  highlightNotes?: Digit[];
  /** Note digits being eliminated — drawn struck-through in the notes grid. */
  strikeNotes?: Digit[];
}

export interface HintStep {
  text: TextSegment[];
  annotations: Record<CellIndex, CellAnnotation>;
}

/**
 * What "Apply" does. `place` writes definitive values; `eliminate` removes
 * candidates from the player's pencil notes.
 */
export interface HintAction {
  kind: 'place' | 'eliminate';
  placements?: { index: CellIndex; digit: Digit }[];
  eliminations?: { index: CellIndex; digit: Digit }[];
}

export interface Hint {
  technique: TechniqueId;
  /** Player-facing title, e.g. "Cross-Hatching in Box". */
  title: string;
  steps: HintStep[];
  action: HintAction;
}
