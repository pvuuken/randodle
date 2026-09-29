import type { Puzzle } from "@/types/game";

/** Text in every supported UI language. */
export interface BilingualText {
  en: string;
  nl: string;
}

/** Where a value comes from. `referenceDate` is required in practice for time-sensitive metrics. */
export interface DataSource {
  name: string;
  url: string;
  referenceDate?: string;
}

export type HigherLowerCategory =
  | "countries"
  | "geography"
  | "animals"
  | "science"
  | "technology"
  | "sport"
  | "entertainment"
  | "companies"
  | "random";

/** Something that can be compared. Values live in `metrics`, keyed by metric id. */
export interface HigherLowerItem {
  id: string;
  name: BilingualText;
  category: HigherLowerCategory;
  metrics: Record<string, number>;
  source: DataSource;
  image?: { url: string; alt?: BilingualText };
  metadata?: Record<string, string | number>;
}

/** A measurable property (population, area, weight…). The engine never assumes which one. */
export interface HigherLowerMetric {
  id: string;
  label: BilingualText;
  unit?: string;
  description?: BilingualText;
}

/** A group of items plus the metrics they can be compared on. */
export interface HigherLowerDataset {
  id: string;
  name: BilingualText;
  category: HigherLowerCategory;
  itemIds: string[];
  metricIds: string[];
}

/** A daily puzzle: dataset + metric + a chain of 6 item ids (start + 5 rounds). */
export interface HigherLowerPuzzle extends Puzzle {
  datasetId: string;
  metricId: string;
  chain: string[];
}
