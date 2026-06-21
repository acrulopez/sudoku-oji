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
  | 'w_wing'
  | 'skyscraper'
  | 'two_string_kite'
  | 'remote_pair'
  | 'empty_rectangle'
  | 'unique_rectangle'
  | 'unique_rectangle_2'
  | 'unique_rectangle_4'
  | 'bug1'
  | 'simple_coloring'
  | 'aic'
  | 'als_xz'
  | 'brute_force';

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

/**
 * A directed link between two chain candidates, drawn as an arrow on the board.
 * `strong` links are conjugate ("if not A then B") — drawn solid; weak links
 * ("not both A and B") are drawn dashed. Each endpoint is a candidate node: a
 * cell plus the digit within it that the chain reasons about.
 */
export interface ChainLink {
  from: { index: CellIndex; digit: Digit };
  to: { index: CellIndex; digit: Digit };
  strong: boolean;
}

export interface HintStep {
  text: TextSegment[];
  annotations: Record<CellIndex, CellAnnotation>;
  /** Chain arrows to draw over the board — present only for chain techniques
   *  (X-Chain/AIC, Remote Pair, Simple Coloring). */
  links?: ChainLink[];
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
