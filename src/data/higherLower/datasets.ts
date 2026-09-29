import type { HigherLowerDataset } from "./types";
import { HIGHER_LOWER_DEMO_ITEMS } from "./demo";
import { HIGHER_LOWER_COUNTRIES } from "./countries";

export const HIGHER_LOWER_DATASETS: HigherLowerDataset[] = [
  {
    id: "demo-countries",
    name: { en: "Fictional countries (demo)", nl: "Fictieve landen (demo)" },
    category: "countries",
    itemIds: HIGHER_LOWER_DEMO_ITEMS.map((i) => i.id),
    metricIds: ["population"],
  },
  {
    id: "countries",
    name: { en: "Countries (example)", nl: "Landen (voorbeeld)" },
    category: "countries",
    itemIds: HIGHER_LOWER_COUNTRIES.map((i) => i.id),
    metricIds: ["population", "area"],
  },
];
