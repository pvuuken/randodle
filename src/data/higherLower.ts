import type { Puzzle } from "@/types/game";

/**
 * DEMO CONTENT — fictional countries with fictional populations.
 * Replace with real data later; the game module only reads this shape.
 */
export interface HigherLowerItem {
  id: string;
  name: string;
  flag: string;
  population: number;
}

export interface HigherLowerPuzzle extends Puzzle {
  category: string;
  /** Six item ids: the start item plus five comparisons (5 rounds). */
  chain: string[];
}

export const HIGHER_LOWER_ITEMS: HigherLowerItem[] = [
  { id: "valmora", name: "Valmora", flag: "🏔️", population: 11_700_000 },
  { id: "estrenia", name: "Estrenia", flag: "🌊", population: 68_400_000 },
  { id: "karvassa", name: "Karvassa", flag: "🌲", population: 83_200_000 },
  { id: "lunaris", name: "Lunaris", flag: "🌙", population: 2_300_000 },
  { id: "doravia", name: "Doravia", flag: "🏜️", population: 45_900_000 },
  { id: "pellucia", name: "Pellucia", flag: "💎", population: 540_000 },
  { id: "tarnheim", name: "Tarnheim", flag: "⚓", population: 17_800_000 },
  { id: "osmara", name: "Osmara", flag: "🌺", population: 124_600_000 },
  { id: "brevik", name: "Brevik Isles", flag: "🏝️", population: 380_000 },
  { id: "caldera", name: "Caldera", flag: "🌋", population: 29_100_000 },
  { id: "norvania", name: "Norvania", flag: "❄️", population: 5_600_000 },
  { id: "sunthra", name: "Sunthra", flag: "☀️", population: 212_300_000 },
  { id: "melquor", name: "Melquor", flag: "🍇", population: 9_400_000 },
  { id: "ardentis", name: "Ardentis", flag: "🔥", population: 57_300_000 },
  { id: "quillon", name: "Quillon", flag: "🪶", population: 1_200_000 },
  { id: "zephyra", name: "Zephyra", flag: "🌬️", population: 38_700_000 },
  { id: "halvard", name: "Halvard", flag: "🛡️", population: 6_900_000 },
  { id: "isomer", name: "Isomer", flag: "🔷", population: 96_500_000 },
  { id: "rovana", name: "Rovana", flag: "🌾", population: 21_400_000 },
  { id: "tessaly", name: "Tessaly", flag: "🏛️", population: 3_800_000 },
];

export const HIGHER_LOWER_PUZZLES: HigherLowerPuzzle[] = [
  { id: "hol-001", category: "Population", chain: ["valmora", "estrenia", "karvassa", "lunaris", "doravia", "pellucia"] },
  { id: "hol-002", category: "Population", chain: ["tarnheim", "osmara", "brevik", "caldera", "norvania", "sunthra"] },
  { id: "hol-003", category: "Population", chain: ["melquor", "ardentis", "quillon", "zephyra", "halvard", "isomer"] },
  { id: "hol-004", category: "Population", chain: ["rovana", "tessaly", "estrenia", "norvania", "osmara", "valmora"] },
  { id: "hol-005", category: "Population", chain: ["caldera", "lunaris", "sunthra", "melquor", "brevik", "doravia"] },
];
