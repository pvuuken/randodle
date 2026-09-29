import type { HigherLowerItem, HigherLowerMetric, HigherLowerPuzzle } from "./types";
import { HIGHER_LOWER_COUNTRIES } from "./countries";
import { HIGHER_LOWER_METRICS } from "./metrics";
import { HIGHER_LOWER_DATASETS } from "./datasets";

export * from "./types";
export { HIGHER_LOWER_METRICS, HIGHER_LOWER_DATASETS };

/** Every item across all datasets. */
export const HIGHER_LOWER_ITEMS: HigherLowerItem[] = [...HIGHER_LOWER_COUNTRIES];

export const getHigherLowerItem = (id: string | undefined) => HIGHER_LOWER_ITEMS.find((i) => i.id === id);
export const getHigherLowerMetric = (id: string): HigherLowerMetric | undefined =>
  HIGHER_LOWER_METRICS.find((m) => m.id === id);
export const getHigherLowerDataset = (id: string) => HIGHER_LOWER_DATASETS.find((d) => d.id === id);

const chain = (id: string, metricId: string, ids: string[]): HigherLowerPuzzle => ({
  id,
  datasetId: "countries",
  metricId,
  chain: ids,
});

/** Daily puzzles on the real 195-country dataset (fixed data, alternating population / area). */
export const HIGHER_LOWER_PUZZLES: HigherLowerPuzzle[] = [
  chain("hol-001", "population", ["KM", "MX", "FR", "RS", "LA", "NL"]),
  chain("hol-002", "area", ["BZ", "NO", "DZ", "IQ", "MK", "SM"]),
  chain("hol-003", "population", ["SA", "MH", "MA", "MD", "MK", "MC"]),
  chain("hol-004", "area", ["TH", "TD", "TR", "BB", "DJ", "NZ"]),
  chain("hol-005", "population", ["MX", "CF", "DJ", "GH", "SS", "IE"]),
  chain("hol-006", "area", ["NE", "KM", "DZ", "TD", "MK", "PL"]),
  chain("hol-007", "population", ["MD", "ME", "TN", "TV", "TH", "LB"]),
  chain("hol-008", "area", ["TJ", "BS", "VC", "LB", "AG", "ML"]),
  chain("hol-009", "population", ["GH", "ZW", "PS", "VC", "GM", "JO"]),
  chain("hol-010", "area", ["MX", "VA", "SO", "NI", "TT", "NZ"]),
  chain("hol-011", "population", ["EG", "AD", "DJ", "CI", "CL", "UG"]),
  chain("hol-012", "area", ["RW", "DK", "BR", "CM", "SI", "MD"]),
  chain("hol-013", "population", ["BJ", "BY", "HR", "DE", "KZ", "FJ"]),
  chain("hol-014", "area", ["ES", "EC", "CI", "TD", "ID", "ZA"]),
  chain("hol-015", "population", ["MY", "PW", "PY", "ID", "SL", "YE"]),
  chain("hol-016", "area", ["SI", "CG", "SG", "AO", "BN", "TN"]),
  chain("hol-017", "population", ["RW", "MR", "CO", "SS", "ZW", "ID"]),
  chain("hol-018", "area", ["QA", "NZ", "ZW", "PT", "PS", "BF"]),
  chain("hol-019", "population", ["SA", "BY", "CG", "GT", "PA", "FR"]),
  chain("hol-020", "area", ["CA", "UZ", "UG", "NP", "GD", "GR"]),
  chain("hol-021", "population", ["MT", "CH", "DE", "TD", "JM", "CL"]),
  chain("hol-022", "area", ["BY", "AM", "GM", "PE", "JM", "BJ"]),
  chain("hol-023", "population", ["NP", "KM", "MH", "HN", "MR", "GE"]),
  chain("hol-024", "area", ["SV", "YE", "IN", "CD", "JM", "CI"]),
  chain("hol-025", "population", ["EE", "PT", "SA", "SR", "CZ", "IS"]),
  chain("hol-026", "area", ["GM", "CZ", "KG", "TH", "IL", "QA"]),
  chain("hol-027", "population", ["WS", "CR", "SY", "BZ", "CD", "GM"]),
  chain("hol-028", "area", ["UZ", "GN", "DM", "AT", "ZM", "BZ"]),
  chain("hol-029", "population", ["SZ", "BH", "ME", "BJ", "CG", "TH"]),
  chain("hol-030", "area", ["NP", "CL", "BF", "CV", "NL", "PT"]),
  chain("hol-031", "population", ["ER", "SS", "CD", "BF", "NL", "AE"]),
  chain("hol-032", "area", ["ID", "FI", "TL", "IE", "KR", "KN"]),
  chain("hol-033", "population", ["MH", "AL", "BJ", "GW", "DJ", "BT"]),
  chain("hol-034", "area", ["PG", "UG", "AZ", "GB", "RU", "ML"]),
  chain("hol-035", "population", ["AZ", "YE", "FJ", "BD", "CG", "GM"]),
  chain("hol-036", "area", ["NA", "PL", "VC", "SG", "MN", "MM"]),
  chain("hol-037", "population", ["NL", "JP", "CD", "MR", "CI", "US"]),
  chain("hol-038", "area", ["VA", "VN", "SY", "CF", "KZ", "ES"]),
  chain("hol-039", "population", ["UY", "CF", "BA", "BB", "HN", "LC"]),
  chain("hol-040", "area", ["TT", "CD", "GR", "ME", "AE", "KW"]),
  chain("hol-041", "population", ["SG", "LC", "ML", "AD", "FJ", "MU"]),
  chain("hol-042", "area", ["AD", "ZM", "MG", "BN", "TV", "LU"]),
  chain("hol-043", "population", ["SG", "ST", "JP", "KR", "VU", "HN"]),
  chain("hol-044", "area", ["GM", "LU", "TZ", "GY", "AG", "ET"]),
  chain("hol-045", "population", ["AU", "RS", "MY", "JM", "TH", "LA"]),
  chain("hol-046", "area", ["BT", "MV", "AF", "NG", "SG", "DO"]),
  chain("hol-047", "population", ["IR", "HU", "MA", "CM", "SE", "DZ"]),
  chain("hol-048", "area", ["RO", "VA", "NP", "ZM", "MA", "MK"]),
  chain("hol-049", "population", ["LV", "MM", "BY", "LT", "LU", "CY"]),
  chain("hol-050", "area", ["LK", "SA", "QA", "SS", "AG", "SM"]),
];
