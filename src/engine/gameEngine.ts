import type { Attempt, GameState, ShareResult } from "@/types/game";

/** Shared, game-agnostic helpers every module can reuse. */

export function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function createState(gameId: string, puzzleId: string, maxAttempts: number): GameState {
  return { gameId, puzzleId, maxAttempts, attempts: [], status: "playing" };
}

/** Append an attempt and derive the resulting status. */
export function pushAttempt(state: GameState, attempt: Attempt): GameState {
  const attempts = [...state.attempts, attempt];
  const status =
    attempt.tone === "correct"
      ? "won"
      : attempts.length >= state.maxAttempts
        ? "lost"
        : "playing";
  return { ...state, attempts, status };
}

export function isComplete(state: GameState): boolean {
  return state.status !== "playing";
}

const SQUARE: Record<Attempt["tone"], string> = {
  correct: "🟩",
  close: "🟨",
  wrong: "⬛",
};

export function standardShare(state: GameState): ShareResult {
  const filled = state.attempts.map((a) => SQUARE[a.tone]).join("");
  const blanks = "⬜".repeat(Math.max(0, state.maxAttempts - state.attempts.length));
  return {
    squares: filled + blanks,
    progress:
      state.status === "won" ? `${state.attempts.length}/${state.maxAttempts}` : `X/${state.maxAttempts}`,
  };
}

/** Deterministic puzzle pick so everyone gets the same one on the same date. */
export function puzzleForDay<T>(puzzles: T[], dayIndex: number): T {
  const i = ((dayIndex % puzzles.length) + puzzles.length) % puzzles.length;
  return puzzles[i] as T;
}
