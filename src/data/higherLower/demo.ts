import type { HigherLowerItem } from "./types";

/**
 * DEMO CONTENT — fictional countries with fictional populations.
 * Powers the current daily puzzles until real sourced data is imported.
 */
const DEMO_SOURCE = { name: "Fictional demo data", url: "https://example.invalid/demo" };

const demo = (id: string, name: string, emoji: string, population: number): HigherLowerItem => ({
  id,
  name: { en: name, nl: name },
  category: "countries",
  metrics: { population },
  source: DEMO_SOURCE,
  metadata: { emoji, demo: 1 },
});

export const HIGHER_LOWER_DEMO_ITEMS: HigherLowerItem[] = [
  demo("valmora", "Valmora", "🏔️", 11_700_000),
  demo("estrenia", "Estrenia", "🌊", 68_400_000),
  demo("karvassa", "Karvassa", "🌲", 83_200_000),
  demo("lunaris", "Lunaris", "🌙", 2_300_000),
  demo("doravia", "Doravia", "🏜️", 45_900_000),
  demo("pellucia", "Pellucia", "💎", 540_000),
  demo("tarnheim", "Tarnheim", "⚓", 17_800_000),
  demo("osmara", "Osmara", "🌺", 124_600_000),
  demo("brevik", "Brevik Isles", "🏝️", 380_000),
  demo("caldera", "Caldera", "🌋", 29_100_000),
  demo("norvania", "Norvania", "❄️", 5_600_000),
  demo("sunthra", "Sunthra", "☀️", 212_300_000),
  demo("melquor", "Melquor", "🍇", 9_400_000),
  demo("ardentis", "Ardentis", "🔥", 57_300_000),
  demo("quillon", "Quillon", "🪶", 1_200_000),
  demo("zephyra", "Zephyra", "🌬️", 38_700_000),
  demo("halvard", "Halvard", "🛡️", 6_900_000),
  demo("isomer", "Isomer", "🔷", 96_500_000),
  demo("rovana", "Rovana", "🌾", 21_400_000),
  demo("tessaly", "Tessaly", "🏛️", 3_800_000),
];
