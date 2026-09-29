import { describe, expect, test } from "bun:test";
import { YEAR_EVENTS } from "@/data/yearEvents";
import { YEAR_PUZZLES, YEAR_RANGE } from "@/data/years";
import {
  HIGHER_LOWER_DATASETS,
  HIGHER_LOWER_ITEMS,
  HIGHER_LOWER_METRICS,
  HIGHER_LOWER_PUZZLES,
} from "@/data/higherLower";

const unique = (xs: string[]) => new Set(xs).size === xs.length;

describe("YearEvent", () => {
  test("all 200 production events load", () => expect(YEAR_EVENTS.length).toBe(200));
  test("ids are unique", () => expect(unique(YEAR_EVENTS.map((e) => e.id))).toBe(true));
  test("event texts are unique", () => expect(unique(YEAR_EVENTS.map((e) => e.event.en))).toBe(true));
  test("valid years, EN+NL text, category, source", () => {
    for (const e of YEAR_EVENTS) {
      expect(Number.isInteger(e.year)).toBe(true);
      expect(e.year).toBeGreaterThanOrEqual(YEAR_RANGE.min);
      expect(e.year).toBeLessThanOrEqual(YEAR_RANGE.max);
      expect(["easy", "medium", "hard"]).toContain(e.difficulty);
      expect(e.source.url).toMatch(/^https:\/\//);
      expect(e.event.en.trim().length).toBeGreaterThan(0);
      expect(e.event.nl.trim().length).toBeGreaterThan(0);
      expect(e.category).toBeTruthy();
      expect(e.source.name).toBeTruthy();
      expect(e.source.url).toBeTruthy();
    }
  });
  test("puzzles derive from events", () => {
    expect(YEAR_PUZZLES.map((p) => [p.id, p.answer])).toEqual(YEAR_EVENTS.map((e) => [e.id, e.year]));
  });
});

describe("Higher/Lower", () => {
  const itemIds = new Set(HIGHER_LOWER_ITEMS.map((i) => i.id));
  const metricIds = new Set(HIGHER_LOWER_METRICS.map((m) => m.id));

  test("item ids unique", () => expect(unique(HIGHER_LOWER_ITEMS.map((i) => i.id))).toBe(true));
  test("metric ids unique", () => expect(unique(HIGHER_LOWER_METRICS.map((m) => m.id))).toBe(true));
  test("items have EN+NL names, numeric metrics, source", () => {
    for (const i of HIGHER_LOWER_ITEMS) {
      expect(i.name.en).toBeTruthy();
      expect(i.name.nl).toBeTruthy();
      expect(i.source.name).toBeTruthy();
      for (const [k, v] of Object.entries(i.metrics)) {
        expect(metricIds.has(k)).toBe(true);
        expect(Number.isFinite(v)).toBe(true);
      }
    }
  });
  test("datasets reference valid items and metrics", () => {
    for (const d of HIGHER_LOWER_DATASETS) {
      for (const id of d.itemIds) expect(itemIds.has(id)).toBe(true);
      for (const m of d.metricIds) expect(metricIds.has(m)).toBe(true);
    }
  });
  test("puzzles use their dataset's items and a metric every item has", () => {
    for (const p of HIGHER_LOWER_PUZZLES) {
      const d = HIGHER_LOWER_DATASETS.find((x) => x.id === p.datasetId)!;
      expect(d.metricIds).toContain(p.metricId);
      expect(p.chain).toHaveLength(6);
      for (const id of p.chain) {
        expect(d.itemIds).toContain(id);
        expect(typeof HIGHER_LOWER_ITEMS.find((i) => i.id === id)!.metrics[p.metricId]).toBe("number");
      }
    }
  });
});
