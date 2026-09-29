import type { GameState } from "@/types/game";

export const MAX_SCORE = 100;

/**
 * Default Randodle scoring curve. Games may override calculateScore(), the
 * platform only ever consumes the final number.
 */
export function standardScore(state: GameState): number {
  if (state.status !== "won") return 0;
  const used = state.attempts.length;
  return Math.max(MAX_SCORE - (used - 1) * 10, 10);
}
