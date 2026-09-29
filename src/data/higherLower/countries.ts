import type { HigherLowerItem } from "./types";

/**
 * EXAMPLE RECORDS ONLY — PLACEHOLDER VALUES, NOT VERIFIED PRODUCTION DATA.
 * These three entries prove the architecture (one item, several metrics).
 * Replace with a sourced import before using them in any puzzle.
 * Ids reuse the ISO alpha-2 codes from countryList.ts.
 */
const PLACEHOLDER_SOURCE = {
  name: "PLACEHOLDER — example values, not verified",
  url: "https://example.invalid/placeholder",
  referenceDate: "0000",
};

export const HIGHER_LOWER_COUNTRIES: HigherLowerItem[] = [
  {
    id: "BE",
    name: { en: "Belgium", nl: "België" },
    category: "countries",
    metrics: { population: 11_000_000, area: 30_000 },
    source: PLACEHOLDER_SOURCE,
    image: { url: "/flags/be.svg" },
    metadata: { placeholder: 1 },
  },
  {
    id: "NL",
    name: { en: "Netherlands", nl: "Nederland" },
    category: "countries",
    metrics: { population: 17_000_000, area: 41_000 },
    source: PLACEHOLDER_SOURCE,
    image: { url: "/flags/nl.svg" },
    metadata: { placeholder: 1 },
  },
  {
    id: "FR",
    name: { en: "France", nl: "Frankrijk" },
    category: "countries",
    metrics: { population: 68_000_000, area: 550_000 },
    source: PLACEHOLDER_SOURCE,
    image: { url: "/flags/fr.svg" },
    metadata: { placeholder: 1 },
  },
];
