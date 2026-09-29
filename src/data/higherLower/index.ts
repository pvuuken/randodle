import type { HigherLowerItem, HigherLowerMetric, HigherLowerPuzzle } from "./types";
import { HIGHER_LOWER_DEMO_ITEMS } from "./demo";
import { HIGHER_LOWER_COUNTRIES } from "./countries";
import { HIGHER_LOWER_METRICS } from "./metrics";
import { HIGHER_LOWER_DATASETS } from "./datasets";

export * from "./types";
export { HIGHER_LOWER_METRICS, HIGHER_LOWER_DATASETS };

/** Every item across all datasets. */
export const HIGHER_LOWER_ITEMS: HigherLowerItem[] = [...HIGHER_LOWER_DEMO_ITEMS, ...HIGHER_LOWER_COUNTRIES];

export const getHigherLowerItem = (id: string | undefined) => HIGHER_LOWER_ITEMS.find((i) => i.id === id);
export const getHigherLowerMetric = (id: string): HigherLowerMetric | undefined =>
  HIGHER_LOWER_METRICS.find((m) => m.id === id);
export const getHigherLowerDataset = (id: string) => HIGHER_LOWER_DATASETS.find((d) => d.id === id);

const chain = (id: string, ids: string[]): HigherLowerPuzzle => ({
  id,
  datasetId: "demo-countries",
  metricId: "population",
  chain: ids,
});

/** Daily puzzles (same ids and order as before, so the schedule is unchanged). */
export const HIGHER_LOWER_PUZZLES: HigherLowerPuzzle[] = [
  chain("hol-001", ["valmora", "estrenia", "karvassa", "lunaris", "doravia", "pellucia"]),
  chain("hol-002", ["tarnheim", "osmara", "brevik", "caldera", "norvania", "sunthra"]),
  chain("hol-003", ["melquor", "ardentis", "quillon", "zephyra", "halvard", "isomer"]),
  chain("hol-004", ["rovana", "tessaly", "estrenia", "norvania", "osmara", "valmora"]),
  chain("hol-005", ["caldera", "lunaris", "sunthra", "melquor", "brevik", "doravia"]),
];
