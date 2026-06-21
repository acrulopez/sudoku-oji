/**
 * Hint orchestrator: scans the board and returns the easiest applicable
 * technique, or null if none of the supported techniques apply. Detectors are
 * tried in increasing difficulty so the player always learns the simplest next
 * move first.
 *
 * Every returned hint is guaranteed to change the board when applied — it
 * either places a value or removes at least one of the player's penciled notes.
 * A logically-correct hint that wouldn't actually change anything is skipped.
 */

import { allCandidates } from '../candidates';
import type { Board, CellIndex, Digit } from '../types';
import { detectNakedSingle } from './nakedSingle';
import { detectHiddenSingle } from './hiddenSingle';
import { detectNakedSubset } from './nakedSubset';
import { detectHiddenSubset } from './hiddenSubset';
import { detectPointingPair } from './pointingPair';
import { detectClaiming } from './claiming';
import { detectFish } from './fish';
import { detectXYWing } from './xyWing';
import { detectXYZWing } from './xyzWing';
import { detectUniqueRectangle } from './uniqueRectangle';
import { detectSimpleColoring } from './simpleColoring';
import type { Hint, HintAction } from './types';

type Detector = (board: Board, candidates: Map<CellIndex, Set<Digit>>) => Hint | null;

// Easiest → hardest. The first detector whose move actually changes the board
// wins, so the player always learns the simplest available technique.
const DETECTORS: Detector[] = [
  detectNakedSingle,
  detectHiddenSingle,
  (b, c) => detectNakedSubset(b, c, 2), // naked pair
  (b, c) => detectHiddenSubset(b, c, 2), // hidden pair
  detectPointingPair,
  detectClaiming,
  (b, c) => detectNakedSubset(b, c, 3), // naked triple
  (b, c) => detectHiddenSubset(b, c, 3), // hidden triple
  (b, c) => detectNakedSubset(b, c, 4), // naked quad
  (b, c) => detectHiddenSubset(b, c, 4), // hidden quad
  (b, c) => detectFish(b, c, 2), // X-Wing
  detectXYWing,
  detectXYZWing,
  (b, c) => detectFish(b, c, 3), // Swordfish
  (b, c) => detectFish(b, c, 4), // Jellyfish
  detectUniqueRectangle,
  detectSimpleColoring,
];

export function findHint(board: Board): Hint | null {
  const candidates = allCandidates(board);
  for (const detect of DETECTORS) {
    const hint = detect(board, candidates);
    if (hint && actionChangesBoard(board, hint.action)) return hint;
  }
  return null;
}

/** True if applying the action would place a value or remove an existing note. */
function actionChangesBoard(board: Board, action: HintAction): boolean {
  if (action.kind === 'place') {
    return (action.placements ?? []).some(
      ({ index, digit }) => !board[index].given && board[index].value !== digit,
    );
  }
  return (action.eliminations ?? []).some(
    ({ index, digit }) => board[index].notes.has(digit),
  );
}
