import type { Language } from "@/i18n";
import type { StoredSession } from "@/services/sessionService";
import type { AnswerReviewItem } from "@/types/game";
import type { DailyGame } from "./dailyGameService";

/**
 * Today's answers, or null while today's game is unfinished. The stored
 * session must belong to today's exact game and puzzle and be complete —
 * so this can never reveal answers for a game still being played.
 */
export function getTodaysAnswers(
  daily: DailyGame,
  stored: StoredSession | null,
  lang: Language,
): AnswerReviewItem[] | null {
  const { game, puzzle } = daily;
  if (!stored || stored.gameId !== game.id || stored.puzzleId !== puzzle.id) return null;
  if (!game.isComplete(stored.state)) return null;
  return game.getAnswerReview(puzzle, stored.state, lang);
}
