import type { Clue, Puzzle } from "@/types/game";
import { MOVIE_CLUES } from "@/data/movieClues";
import { MOVIE_LIST, moviePosterUrl, type Movie } from "@/data/movieList";

/** A Movie Game puzzle: one real film from MOVIE_LIST, guessed from its poster. */
export interface MoviePuzzle extends Puzzle {
  /** Canonical (English) title to guess. */
  answer: string;
  /** Accepted alternatives, e.g. the Dutch title. */
  aliases?: string[];
  title: Movie["title"];
  posterUrl: string;
  posterMask?: Movie["posterMask"];
  /** 5 clues, hardest first; text per language lives in movieClues.ts. */
  clues: Clue[];
}

const LEVELS = {
  en: ["Very hard", "Hard", "Medium", "Easy", "Very easy"],
  nl: ["Zeer moeilijk", "Moeilijk", "Gemiddeld", "Makkelijk", "Zeer makkelijk"],
};

function buildClues(id: string): Clue[] {
  const c = MOVIE_CLUES[id] ?? { en: [], nl: [] };
  return c.en.map((value, i) => ({
    icon: "🔍",
    label: LEVELS.en[i] ?? "",
    value,
    translations: { nl: { label: LEVELS.nl[i] ?? "", value: c.nl[i] ?? value } },
  }));
}

export const MOVIE_PUZZLES: MoviePuzzle[] = MOVIE_LIST.map((m) => ({
  id: m.id,
  answer: m.title.en,
  aliases: m.title.nl !== m.title.en ? [m.title.nl] : [],
  title: m.title,
  posterUrl: moviePosterUrl(m),
  clues: buildClues(m.id),
  ...(m.posterMask ? { posterMask: m.posterMask } : {}),
}));

/** Autocomplete only — never used to decide if an answer is correct. */
export const MOVIE_TITLES: string[] = Array.from(
  new Set(MOVIE_LIST.flatMap((m) => [m.title.en, m.title.nl])),
).sort((a, b) => a.localeCompare(b));
