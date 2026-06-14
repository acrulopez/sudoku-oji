/**
 * Active-game state. Orchestrates the pure domain engine, the repositories
 * (puzzles, persistence, analytics), and UI interaction modes.
 *
 * Interaction model:
 *  - Pencil toggle: digit input writes a note instead of a value.
 *  - Fast Mode (number-first): pick a digit, then tap cells to apply it
 *    repeatedly. When off, pick a cell, then tap a digit.
 */
import { create } from 'zustand';
import { boardFromPuzzle } from '../domain/board';
import {
  applyAutoNotes,
  eraseCell,
  isSolved,
  placeValue,
  toggleNote,
} from '../domain/engine';
import {
  canUndo,
  createHistory,
  pushMove,
  undo as undoHistory,
} from '../domain/history';
import type { Board, CellIndex, Difficulty, Digit, Puzzle } from '../domain/types';
import type { History } from '../domain/history';
import { getRepositories } from '../data';
import { useSettingsStore } from './settingsStore';
import { deserializeGame, serializeGame } from './gameSerialization';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'won' | 'lost';

interface GameState {
  status: GameStatus;
  puzzle: Puzzle | null;
  board: Board;
  history: History;
  difficulty: Difficulty;
  selectedIndex: CellIndex | null;
  /** Active digit in Fast Mode (number-first input). */
  selectedDigit: Digit | null;
  pencilMode: boolean;
  fastMode: boolean;
  mistakes: number;
  elapsed: number;

  // lifecycle
  newGame: (difficulty: Difficulty) => void;
  resumeSavedGame: () => boolean;
  hasSavedGame: () => boolean;

  // interaction
  selectCell: (index: CellIndex) => void;
  pressDigit: (digit: Digit) => void;
  erase: () => void;
  undo: () => void;
  fastPencil: () => void;
  togglePencil: () => void;
  toggleFastMode: () => void;

  // timer
  tick: () => void;
  setPaused: (paused: boolean) => void;
}

function emit(event: Parameters<ReturnType<typeof getRepositories>['stats']['recordEvent']>[0]) {
  getRepositories().stats.recordEvent(event);
}

function persist(get: () => GameState) {
  const s = get();
  if (!s.puzzle) return;
  getRepositories().games.saveGame(
    serializeGame({
      puzzleId: s.puzzle.id,
      difficulty: s.difficulty,
      givens: s.puzzle.givens,
      board: s.board,
      history: s.history,
      elapsed: s.elapsed,
      mistakes: s.mistakes,
    }),
  );
}

export const useGameStore = create<GameState>((set, get) => ({
  status: 'idle',
  puzzle: null,
  board: [],
  history: createHistory(),
  difficulty: 'easy',
  selectedIndex: null,
  selectedDigit: null,
  pencilMode: false,
  fastMode: false,
  mistakes: 0,
  elapsed: 0,

  newGame: (difficulty) => {
    const repos = getRepositories();
    const played = repos.games.getPlayedIds();
    const puzzle = repos.puzzles.getPuzzle(difficulty, played);
    repos.games.markPlayed(puzzle.id);
    set({
      status: 'playing',
      puzzle,
      board: boardFromPuzzle(puzzle),
      history: createHistory(),
      difficulty,
      selectedIndex: null,
      selectedDigit: null,
      pencilMode: false,
      fastMode: useSettingsStore.getState().fastModeDefault,
      mistakes: 0,
      elapsed: 0,
    });
    emit({ type: 'game_started', difficulty, puzzleId: puzzle.id, at: Date.now() });
    persist(get);
  },

  hasSavedGame: () => getRepositories().games.loadGame() !== undefined,

  resumeSavedGame: () => {
    const saved = getRepositories().games.loadGame();
    if (!saved) return false;
    const repos = getRepositories();
    const puzzle =
      repos.puzzles.getById(saved.puzzleId) ?? {
        id: saved.puzzleId,
        difficulty: saved.difficulty,
        givens: saved.givens,
        solution: '', // unknown; solved-check disabled if missing
      };
    const snap = deserializeGame(saved);
    set({
      status: 'playing',
      puzzle: { ...puzzle, solution: puzzle.solution || '' },
      board: snap.board,
      history: snap.history,
      difficulty: snap.difficulty,
      selectedIndex: null,
      selectedDigit: null,
      pencilMode: false,
      fastMode: useSettingsStore.getState().fastModeDefault,
      mistakes: snap.mistakes,
      elapsed: snap.elapsed,
    });
    return true;
  },

  selectCell: (index) => {
    const { fastMode, selectedDigit } = get();
    if (fastMode && selectedDigit !== null) {
      applyDigit(set, get, index, selectedDigit);
      set({ selectedIndex: index });
    } else {
      set({ selectedIndex: index });
    }
  },

  pressDigit: (digit) => {
    const { fastMode, selectedIndex } = get();
    if (fastMode) {
      set((s) => ({ selectedDigit: s.selectedDigit === digit ? null : digit }));
    } else if (selectedIndex !== null) {
      applyDigit(set, get, selectedIndex, digit);
    }
  },

  erase: () => {
    const { board, selectedIndex, history } = get();
    if (selectedIndex === null) return;
    const res = eraseCell(board, selectedIndex);
    if (!res) return;
    set({ board: res.board, history: pushMove(history, res.move) });
    emit({ type: 'move_made', moveType: 'erase', at: Date.now() });
    persist(get);
  },

  undo: () => {
    const { board, history } = get();
    if (!canUndo(history)) return;
    const res = undoHistory(board, history);
    if (!res) return;
    set({ board: res.board, history: res.history });
    persist(get);
  },

  fastPencil: () => {
    const { board, history } = get();
    const res = applyAutoNotes(board);
    if (!res) return;
    set({ board: res.board, history: pushMove(history, res.move) });
    emit({ type: 'move_made', moveType: 'autoNotes', at: Date.now() });
    persist(get);
  },

  togglePencil: () => set((s) => ({ pencilMode: !s.pencilMode })),

  toggleFastMode: () =>
    set((s) => ({ fastMode: !s.fastMode, selectedDigit: null })),

  tick: () =>
    set((s) => (s.status === 'playing' ? { elapsed: s.elapsed + 1 } : s)),

  setPaused: (paused) =>
    set((s) => {
      if (s.status !== 'playing' && s.status !== 'paused') return s;
      return { status: paused ? 'paused' : 'playing' };
    }),
}));

/** Shared logic for placing a value or note into a cell. */
function applyDigit(
  set: (partial: Partial<GameState>) => void,
  get: () => GameState,
  index: CellIndex,
  digit: Digit,
) {
  const { board, history, pencilMode, puzzle, mistakes } = get();
  if (!puzzle) return;
  const validate = useSettingsStore.getState().validateNotes;

  const res = pencilMode
    ? toggleNote(board, index, digit, validate)
    : placeValue(board, index, digit);
  if (!res) return;

  let nextMistakes = mistakes;
  let status: GameStatus = get().status;

  if (!pencilMode && res.board[index].value !== null) {
    const correct =
      puzzle.solution && puzzle.solution[index] === String(digit);
    if (puzzle.solution && !correct) {
      nextMistakes = mistakes + 1;
      emit({ type: 'mistake_made', difficulty: get().difficulty, at: Date.now() });
      const max = useSettingsStore.getState().maxMistakes;
      if (max > 0 && nextMistakes >= max) status = 'lost';
    }
  }

  if (puzzle.solution && isSolved(res.board, puzzle.solution)) {
    status = 'won';
    emit({
      type: 'game_completed',
      difficulty: get().difficulty,
      puzzleId: puzzle.id,
      elapsed: get().elapsed,
      mistakes: nextMistakes,
      at: Date.now(),
    });
    getRepositories().games.clearGame();
  }

  set({
    board: res.board,
    history: pushMove(history, res.move),
    mistakes: nextMistakes,
    status,
  });
  emit({ type: 'move_made', moveType: res.move.type, at: Date.now() });
  if (status !== 'won') persist(get);
}
