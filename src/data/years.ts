import type { Puzzle } from "@/types/game";
import type { Localized } from "@/i18n";
import { YEAR_EVENTS } from "@/data/yearEvents";

/** Puzzle view of a YearEvent, in the shape the Year game already reads. */
export interface YearPuzzle extends Puzzle {
  event: string;
  answer: number;
  /** Optional hint shown before the first guess. */
  hint?: string;
  translations?: Localized<{ event: string; hint?: string }>;
}

/** Puzzle-only hints (not part of the event data). */
const HINTS: Record<string, { en: string; nl: string }> = {
  "year-001": { en: "Somewhere in the 2000s.", nl: "Ergens in de jaren 2000." },
  "year-002": { en: "Late 20th century.", nl: "Eind 20e eeuw." },
};

export const YEAR_PUZZLES: YearPuzzle[] = YEAR_EVENTS.map((e) => {
  const hint = HINTS[e.id];
  return {
    id: e.id,
    event: e.event.en,
    answer: e.year,
    ...(hint ? { hint: hint.en } : {}),
    translations: { nl: { event: e.event.nl, ...(hint ? { hint: hint.nl } : {}) } },
  };
});

export const YEAR_RANGE = { min: 1800, max: 2026 };
