import type { HigherLowerDataset } from "./types";
import { HIGHER_LOWER_COUNTRIES } from "./countries";

export const HIGHER_LOWER_DATASETS: HigherLowerDataset[] = [
  {
    id: "countries",
    name: { en: "Countries", nl: "Landen" },
    category: "countries",
    itemIds: HIGHER_LOWER_COUNTRIES.map((i) => i.id),
    metricIds: ["population", "area"],
  },
];
