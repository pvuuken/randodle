import type { Puzzle } from "@/types/game";

export interface YearPuzzle extends Puzzle {
  event: string;
  answer: number;
  /** Optional hint shown before the first guess. */
  hint?: string;
}

export const YEAR_PUZZLES: YearPuzzle[] = [
  { id: "year-001", event: "The first iPhone was released.", answer: 2007, hint: "Somewhere in the 2000s." },
  { id: "year-002", event: "The Berlin Wall came down.", answer: 1989, hint: "Late 20th century." },
  { id: "year-003", event: "The World Wide Web was made public.", answer: 1991 },
  { id: "year-004", event: "Humans first walked on the Moon.", answer: 1969 },
  { id: "year-005", event: "The euro entered circulation as notes and coins.", answer: 2002 },
  { id: "year-006", event: "The Titanic sank on its maiden voyage.", answer: 1912 },
  { id: "year-007", event: "The first modern Olympic Games were held in Athens.", answer: 1896 },
  { id: "year-008", event: "The Chernobyl disaster occurred.", answer: 1986 },
  { id: "year-009", event: "Nelson Mandela was released from prison.", answer: 1990 },
  { id: "year-010", event: "The Hubble Space Telescope was launched.", answer: 1990 },
];

export const YEAR_RANGE = { min: 1800, max: 2026 };
