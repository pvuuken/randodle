import type { Puzzle } from "@/types/game";
import type { Localized } from "@/i18n";

export interface YearPuzzle extends Puzzle {
  event: string;
  answer: number;
  /** Optional hint shown before the first guess. */
  hint?: string;
  translations?: Localized<{ event: string; hint?: string }>;
}

export const YEAR_PUZZLES: YearPuzzle[] = [
  { id: "year-001", event: "The first iPhone was released.", answer: 2007, hint: "Somewhere in the 2000s.", translations: { nl: { event: "De eerste iPhone kwam op de markt.", hint: "Ergens in de jaren 2000." } } },
  { id: "year-002", event: "The Berlin Wall came down.", answer: 1989, hint: "Late 20th century.", translations: { nl: { event: "De Berlijnse Muur viel.", hint: "Eind 20e eeuw." } } },
  { id: "year-003", event: "The World Wide Web was made public.", answer: 1991, translations: { nl: { event: "Het World Wide Web werd openbaar." } } },
  { id: "year-004", event: "Humans first walked on the Moon.", answer: 1969, translations: { nl: { event: "De eerste mensen liepen op de maan." } } },
  { id: "year-005", event: "The euro entered circulation as notes and coins.", answer: 2002, translations: { nl: { event: "De euro werd ingevoerd als biljetten en munten." } } },
  { id: "year-006", event: "The Titanic sank on its maiden voyage.", answer: 1912, translations: { nl: { event: "De Titanic zonk tijdens haar eerste reis." } } },
  { id: "year-007", event: "The first modern Olympic Games were held in Athens.", answer: 1896, translations: { nl: { event: "De eerste moderne Olympische Spelen werden in Athene gehouden." } } },
  { id: "year-008", event: "The Chernobyl disaster occurred.", answer: 1986, translations: { nl: { event: "De kernramp van Tsjernobyl vond plaats." } } },
  { id: "year-009", event: "Nelson Mandela was released from prison.", answer: 1990, translations: { nl: { event: "Nelson Mandela werd vrijgelaten uit de gevangenis." } } },
  { id: "year-010", event: "The Hubble Space Telescope was launched.", answer: 1990, translations: { nl: { event: "De Hubble-ruimtetelescoop werd gelanceerd." } } },
];

export const YEAR_RANGE = { min: 1800, max: 2026 };
