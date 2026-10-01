import { dayIndex, dayKey } from "@/services/dateService";
import type { Puzzle, RegisteredGame } from "@/types/game";
import { GAME_REGISTRY, GAME_ROTATION } from "./gameRegistry";

export interface DailyGame {
  /** Randodle edition number, e.g. 271. */
  edition: number;
  dayKey: string;
  dayIndex: number;
  game: RegisteredGame;
  puzzle: Puzzle;
}

/**
 * Local, deterministic schedule for v0.1. Everyone opening Randodle on the
 * same date gets the same game and puzzle. Replace this one function with a
 * database lookup later — nothing else changes.
 */
export function getDailyGame(date: Date = new Date()): DailyGame {
  const index = dayIndex(date);
  const rotation = ((index % GAME_ROTATION.length) + GAME_ROTATION.length) % GAME_ROTATION.length;
  const gameId = GAME_ROTATION[rotation] as string;
  const game = GAME_REGISTRY[gameId] as RegisteredGame;
  return {
    edition: Math.max(1, index + 1),
    dayKey: dayKey(date),
    dayIndex: index,
    game,
    puzzle: game.getPuzzleForDay(index),
  };
}
