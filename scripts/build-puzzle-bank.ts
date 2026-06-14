/**
 * Offline puzzle-bank builder. Run at dev time, never in the app:
 *
 *   npm run build:puzzles                 # generate a starter bank
 *   PUZZLE_CSV=path/to/kaggle.csv npm run build:puzzles
 *
 * With PUZZLE_CSV pointing at the Kaggle "3 million Sudoku puzzles with ratings"
 * dataset (columns: puzzle, solution, clues, difficulty), puzzles are bucketed
 * into our 5 tiers by their rating. Without it, a self-contained generator
 * produces uniquely-solvable puzzles bucketed by clue count.
 *
 * Output: assets/puzzles/<difficulty>.json
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'extreme';
const DIFFICULTIES: Difficulty[] = [
  'easy',
  'medium',
  'hard',
  'expert',
  'extreme',
];

interface Puzzle {
  id: string;
  difficulty: Difficulty;
  givens: string;
  solution: string;
}

const PER_TIER = Number(process.env.PER_TIER ?? 30);
const OUT_DIR = path.resolve(__dirname, '..', 'assets', 'puzzles');

// --- Solver (used for uniqueness checks during generation) ----------------

/** Count solutions up to `limit`. Returns 0, 1, or `limit`. */
function countSolutions(grid: number[], limit = 2): number {
  let count = 0;
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
  solve(grid.slice());
  return count;
}

function canPlace(g: number[], idx: number, v: number): boolean {
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
}

// --- Generator ------------------------------------------------------------

function shuffled<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build a complete, valid solution via randomized backtracking. */
function generateSolution(): number[] {
  const g = new Array<number>(81).fill(0);
  const fill = (i: number): boolean => {
    if (i === 81) return true;
    for (const v of shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
      if (canPlace(g, i, v)) {
        g[i] = v;
        if (fill(i + 1)) return true;
        g[i] = 0;
      }
    }
    return false;
  };
  fill(0);
  return g;
}

const CLUE_TARGET: Record<Difficulty, number> = {
  easy: 42,
  medium: 36,
  hard: 32,
  expert: 28,
  extreme: 25,
};

/** Dig holes from a solution, keeping a unique solution, toward a clue target. */
function makePuzzle(solution: number[], targetClues: number): number[] {
  const puzzle = solution.slice();
  let clues = 81;
  for (const idx of shuffled([...Array(81).keys()])) {
    if (clues <= targetClues) break;
    const backup = puzzle[idx];
    if (backup === 0) continue;
    puzzle[idx] = 0;
    if (countSolutions(puzzle, 2) === 1) {
      clues--;
    } else {
      puzzle[idx] = backup; // removal broke uniqueness — restore
    }
  }
  return puzzle;
}

function gridToString(g: number[]): string {
  return g.map((n) => (n === 0 ? '.' : String(n))).join('');
}

function generateTier(difficulty: Difficulty, count: number): Puzzle[] {
  const out: Puzzle[] = [];
  for (let n = 0; n < count; n++) {
    const solution = generateSolution();
    const puzzle = makePuzzle(solution, CLUE_TARGET[difficulty]);
    out.push({
      id: `${difficulty}-${String(n).padStart(4, '0')}`,
      difficulty,
      givens: gridToString(puzzle),
      solution: gridToString(solution),
    });
    process.stdout.write(`\r  ${difficulty}: ${n + 1}/${count}   `);
  }
  process.stdout.write('\n');
  return out;
}

// --- Kaggle CSV path ------------------------------------------------------

function ratingToDifficulty(rating: number): Difficulty {
  if (rating < 2) return 'easy';
  if (rating < 3.5) return 'medium';
  if (rating < 5.5) return 'hard';
  if (rating < 7.5) return 'expert';
  return 'extreme';
}

async function buildFromCsv(csvPath: string): Promise<Record<Difficulty, Puzzle[]>> {
  const banks: Record<Difficulty, Puzzle[]> = {
    easy: [],
    medium: [],
    hard: [],
    expert: [],
    extreme: [],
  };
  const rl = readline.createInterface({
    input: fs.createReadStream(csvPath),
    crlfDelay: Infinity,
  });
  let header: string[] | null = null;
  let counter = 0;
  for await (const line of rl) {
    if (!header) {
      header = line.split(',').map((s) => s.trim());
      continue;
    }
    if (DIFFICULTIES.every((d) => banks[d].length >= PER_TIER)) break;
    const cols = line.split(',');
    const puzzle = cols[header.indexOf('puzzle')]?.trim();
    const solution = cols[header.indexOf('solution')]?.trim();
    const rating = Number(cols[header.indexOf('difficulty')]);
    if (!puzzle || !solution || Number.isNaN(rating)) continue;
    const difficulty = ratingToDifficulty(rating);
    if (banks[difficulty].length >= PER_TIER) continue;
    banks[difficulty].push({
      id: `${difficulty}-${String(counter++).padStart(5, '0')}`,
      difficulty,
      givens: puzzle.replace(/0/g, '.'),
      solution,
    });
  }
  return banks;
}

// --- Main -----------------------------------------------------------------

async function main(): Promise<void> {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const csv = process.env.PUZZLE_CSV;

  let banks: Record<Difficulty, Puzzle[]>;
  if (csv && fs.existsSync(csv)) {
    console.log(`Building from Kaggle CSV: ${csv}`);
    banks = await buildFromCsv(csv);
  } else {
    console.log(`No PUZZLE_CSV set — generating ${PER_TIER} puzzles per tier.`);
    banks = {} as Record<Difficulty, Puzzle[]>;
    for (const d of DIFFICULTIES) banks[d] = generateTier(d, PER_TIER);
  }

  for (const d of DIFFICULTIES) {
    const file = path.join(OUT_DIR, `${d}.json`);
    fs.writeFileSync(file, JSON.stringify(banks[d]));
    console.log(`Wrote ${banks[d].length} puzzles -> ${file}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
