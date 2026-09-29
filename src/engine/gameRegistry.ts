import { countryGame } from "@/games/country";
import { movieGame } from "@/games/movie";
import { yearGame } from "@/games/year";
import type { RegisteredGame } from "@/types/game";

/**
 * The only place that knows which games exist.
 * Adding a game = write a module + add one line here.
 */
export const GAME_REGISTRY: Record<string, RegisteredGame> = {
  [movieGame.id]: movieGame,
  [countryGame.id]: countryGame,
  [yearGame.id]: yearGame,
};

/** Rotation order used by the daily schedule. */
export const GAME_ROTATION: string[] = [movieGame.id, countryGame.id, yearGame.id];

export function getGame(id: string): RegisteredGame | undefined {
  return GAME_REGISTRY[id];
}

export function listGames(): RegisteredGame[] {
  return GAME_ROTATION.map((id) => GAME_REGISTRY[id]);
}
