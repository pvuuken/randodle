import type { Puzzle } from "@/types/game";

/** Country names and flag assets come from the shared dataset in countryList.ts. */
export interface FlagPuzzle extends Puzzle {
  /** Exactly 5 ISO alpha-2 country codes, one per round. */
  countries: string[];
}

export const FLAG_PUZZLES: FlagPuzzle[] = [
  { id: "flag-001", countries: ["BE", "JP", "BR", "SE", "CA"] },
  { id: "flag-002", countries: ["FR", "KR", "MX", "FI", "ZA"] },
  { id: "flag-003", countries: ["DE", "IN", "AR", "NO", "AU"] },
  { id: "flag-004", countries: ["IT", "CN", "CH", "IE", "NG"] },
  { id: "flag-005", countries: ["NL", "US", "GR", "DK", "EG"] },
  { id: "flag-006", countries: ["ES", "GB", "PT", "PL", "TR"] },
];
