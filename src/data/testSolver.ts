/**
 * Test-only solution counter (used to assert bundled puzzles are uniquely
 * solvable). Kept out of the domain layer since the app doesn't solve.
 */
export function countSolutionsSlow(givens: string, limit = 2): number {
  const grid = [...givens].map((c) => (c === '.' || c === '0' ? 0 : Number(c)));
  let count = 0;
  const canPlace = (g: number[], idx: number, v: number): boolean => {
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let k = 0; k < 9; k++) {
      if (g[r * 9 + k] === v) return false;
      if (g[k * 9 + c] === v) return false;
      if (g[(br + Math.floor(k / 3)) * 9 + (bc + (k % 3))] === v) return false;
    }
    return true;
  };
  const solve = (g: number[]): void => {
    if (count >= limit) return;
    const i = g.indexOf(0);
    if (i === -1) {
      count++;
      return;
    }
    for (let v = 1; v <= 9; v++) {
      if (canPlace(g, i, v)) {
        g[i] = v;
        solve(g);
        g[i] = 0;
        if (count >= limit) return;
      }
    }
  };
  solve(grid);
  return count;
}
