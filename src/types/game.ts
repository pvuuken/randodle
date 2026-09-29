import type { ComponentType } from "react";

/** Status of a single play session. */
export type GameStatus = "playing" | "won" | "lost";

/** How an individual guess scored. Never colour-only: every tone has a label. */
export type AttemptTone = "correct" | "close" | "wrong";

export interface Attempt {
  /** What the player entered (display form). */
  value: string;
  tone: AttemptTone;
  /** Accessible, spoiler-free feedback, e.g. "Too high". */
  feedback: string;
}

/**
 * Generic play state. The core platform only ever reads these fields —
 * anything game specific belongs in the puzzle data, not here.
 */
export interface GameState {
  gameId: string;
  puzzleId: string;
  maxAttempts: number;
  attempts: Attempt[];
  status: GameStatus;
}

export interface GameResult {
  state: GameState;
  /** Message shown to the player after the guess. */
  message: string;
}

export interface Clue {
  icon: string;
  label: string;
  value: string;
}

export interface ShareResult {
  /** Emoji grid, spoiler free. */
  squares: string;
  /** e.g. "3/6" */
  progress: string;
}

export interface GamePlayProps<P> {
  puzzle: P;
  state: GameState;
  onSubmit: (answer: string) => void;
}

export interface Puzzle {
  id: string;
}

/**
 * Contract every game must satisfy. The engine, streak, score, share and
 * result screens are written against this interface only.
 */
export interface GameModule<P extends Puzzle = Puzzle> {
  id: string;
  name: string;
  category: string;
  emoji: string;
  /** One line shown on the homepage card. */
  prompt: string;
  /** How-to-play summary. */
  howToPlay: string;
  maxAttempts: number;
  /** Highest possible score shown on the result screen. Defaults to 100. */
  maxScore?: number;

  puzzles: P[];
  getPuzzle(puzzleId: string): P | undefined;
  /** Deterministic puzzle for a given day index. */
  getPuzzleForDay(dayIndex: number): P;
  /** Optional spoiler text shown only in test mode. */
  getAnswerKey?(puzzle: P): string;

  initialize(puzzle: P): GameState;
  submitAnswer(state: GameState, puzzle: P, answer: string): GameResult;
  isComplete(state: GameState): boolean;
  calculateScore(state: GameState): number;
  getShareResult(state: GameState): ShareResult;

  /** Game-owned UI. The platform renders it without knowing the rules. */
  Play: ComponentType<GamePlayProps<P>>;
}

/** Type-erased module as stored in the registry. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegisteredGame = GameModule<any>;
