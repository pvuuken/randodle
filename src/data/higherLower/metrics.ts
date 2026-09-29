import type { HigherLowerMetric } from "./types";

export const HIGHER_LOWER_METRICS: HigherLowerMetric[] = [
  {
    id: "population",
    label: { en: "Population", nl: "Inwoners" },
    description: { en: "Number of inhabitants", nl: "Aantal inwoners" },
  },
  {
    id: "area",
    label: { en: "Area", nl: "Oppervlakte" },
    unit: "km²",
    description: { en: "Total surface area", nl: "Totale oppervlakte" },
  },
];
