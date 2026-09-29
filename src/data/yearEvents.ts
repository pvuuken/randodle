import type { BilingualText, DataSource } from "@/data/higherLower/types";

export type YearCategory =
  | "history"
  | "technology"
  | "science"
  | "sport"
  | "entertainment"
  | "culture"
  | "internet"
  | "business"
  | "space"
  | "other";

/** One precisely-defined event; `year` is the year of exactly that event. */
export interface YearEvent {
  id: string;
  event: BilingualText;
  year: number;
  category: YearCategory;
  difficulty?: "easy" | "medium" | "hard";
  source: DataSource;
  image?: { url: string; alt?: BilingualText };
}

const wiki = (page: string): DataSource => ({ name: "Wikipedia", url: `https://en.wikipedia.org/wiki/${page}` });

/**
 * The events behind the current Guess the Year puzzles (ids unchanged).
 * Small starter set — not the full dataset.
 */
export const YEAR_EVENTS: YearEvent[] = [
  { id: "year-001", year: 2007, category: "technology", difficulty: "easy", source: wiki("IPhone_(1st_generation)"),
    event: { en: "The first iPhone was released.", nl: "De eerste iPhone kwam op de markt." } },
  { id: "year-002", year: 1989, category: "history", difficulty: "easy", source: wiki("Fall_of_the_Berlin_Wall"),
    event: { en: "The Berlin Wall came down.", nl: "De Berlijnse Muur viel." } },
  { id: "year-003", year: 1991, category: "internet", difficulty: "medium", source: wiki("World_Wide_Web"),
    event: { en: "The World Wide Web was made public.", nl: "Het World Wide Web werd openbaar." } },
  { id: "year-004", year: 1969, category: "space", difficulty: "easy", source: wiki("Apollo_11"),
    event: { en: "Humans first walked on the Moon.", nl: "De eerste mensen liepen op de maan." } },
  { id: "year-005", year: 2002, category: "business", difficulty: "medium", source: wiki("Euro_banknotes"),
    event: { en: "The euro entered circulation as notes and coins.", nl: "De euro werd ingevoerd als biljetten en munten." } },
  { id: "year-006", year: 1912, category: "history", difficulty: "medium", source: wiki("Titanic"),
    event: { en: "The Titanic sank on its maiden voyage.", nl: "De Titanic zonk tijdens haar eerste reis." } },
  { id: "year-007", year: 1896, category: "sport", difficulty: "hard", source: wiki("1896_Summer_Olympics"),
    event: { en: "The first modern Olympic Games were held in Athens.", nl: "De eerste moderne Olympische Spelen werden in Athene gehouden." } },
  { id: "year-008", year: 1986, category: "history", difficulty: "medium", source: wiki("Chernobyl_disaster"),
    event: { en: "The Chernobyl disaster occurred.", nl: "De kernramp van Tsjernobyl vond plaats." } },
  { id: "year-009", year: 1990, category: "history", difficulty: "medium", source: wiki("Nelson_Mandela"),
    event: { en: "Nelson Mandela was released from prison.", nl: "Nelson Mandela werd vrijgelaten uit de gevangenis." } },
  { id: "year-010", year: 1990, category: "space", difficulty: "hard", source: wiki("Hubble_Space_Telescope"),
    event: { en: "The Hubble Space Telescope was launched.", nl: "De Hubble-ruimtetelescoop werd gelanceerd." } },
];
