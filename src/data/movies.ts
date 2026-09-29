import type { Puzzle } from "@/types/game";
import { MOVIE_LIST, moviePosterUrl, type Movie } from "@/data/movieList";

/** A Movie Game puzzle: one real film from MOVIE_LIST, guessed from its poster. */
export interface MoviePuzzle extends Puzzle {
  /** Canonical (English) title to guess. */
  answer: string;
  /** Accepted alternatives, e.g. the Dutch title. */
  aliases?: string[];
  title: Movie["title"];
  posterUrl: string;
}

export const MOVIE_PUZZLES: MoviePuzzle[] = MOVIE_LIST.map((m) => ({
  id: m.id,
  answer: m.title.en,
  aliases: m.title.nl !== m.title.en ? [m.title.nl] : undefined,
  title: m.title,
  posterUrl: moviePosterUrl(m),
}));

/** Autocomplete only — never used to decide if an answer is correct. */
export const MOVIE_TITLES: string[] = Array.from(
  new Set(MOVIE_LIST.flatMap((m) => [m.title.en, m.title.nl])),
).sort((a, b) => a.localeCompare(b));
