import type { Puzzle } from "@/types/game";

/** Local flag dataset. Flag SVGs live in public/flags/<code>.svg. */
export interface FlagCountry {
  code: string;
  name: string;
  aliases?: string[];
  flag: string;
}

export interface FlagPuzzle extends Puzzle {
  /** Exactly 5 country codes, one per round. */
  countries: string[];
}

const c = (code: string, name: string, aliases?: string[]): FlagCountry => ({
  code,
  name,
  flag: `/flags/${code}.svg`,
  ...(aliases ? { aliases } : {}),
});

export const FLAG_COUNTRIES: FlagCountry[] = [
  c("ar", "Argentina"),
  c("at", "Austria"),
  c("au", "Australia"),
  c("be", "Belgium"),
  c("br", "Brazil"),
  c("ca", "Canada"),
  c("ch", "Switzerland"),
  c("cn", "China"),
  c("de", "Germany"),
  c("dk", "Denmark"),
  c("eg", "Egypt"),
  c("es", "Spain"),
  c("fi", "Finland"),
  c("fr", "France"),
  c("gb", "United Kingdom", ["UK", "Great Britain", "Britain"]),
  c("gr", "Greece"),
  c("ie", "Ireland"),
  c("in", "India"),
  c("it", "Italy"),
  c("jp", "Japan"),
  c("kr", "South Korea", ["Korea"]),
  c("mx", "Mexico"),
  c("ng", "Nigeria"),
  c("nl", "Netherlands", ["Holland"]),
  c("no", "Norway"),
  c("pl", "Poland"),
  c("pt", "Portugal"),
  c("se", "Sweden"),
  c("tr", "Turkey", ["Türkiye"]),
  c("us", "United States", ["USA", "US", "America"]),
  c("za", "South Africa"),
];

export const FLAG_PUZZLES: FlagPuzzle[] = [
  { id: "flag-001", countries: ["be", "jp", "br", "se", "ca"] },
  { id: "flag-002", countries: ["fr", "kr", "mx", "fi", "za"] },
  { id: "flag-003", countries: ["de", "in", "ar", "no", "au"] },
  { id: "flag-004", countries: ["it", "cn", "ch", "ie", "ng"] },
  { id: "flag-005", countries: ["nl", "us", "gr", "dk", "eg"] },
  { id: "flag-006", countries: ["es", "gb", "pt", "pl", "tr"] },
];
