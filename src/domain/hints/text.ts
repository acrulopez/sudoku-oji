/** Narration helpers for hint text. */

import type { Digit } from '../types';

/** Format a digit list as "2, 5 and 8" (Oxford-free, natural reading). */
export function formatDigits(digits: Digit[]): string {
  const s = digits.map(String);
  if (s.length <= 1) return s.join('');
  if (s.length === 2) return `${s[0]} and ${s[1]}`;
  return `${s.slice(0, -1).join(', ')} and ${s[s.length - 1]}`;
}
