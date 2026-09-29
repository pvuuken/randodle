import { describe, expect, test } from "bun:test";
import { COUNTRIES } from "../src/data/countryList";
import { COUNTRY_PUZZLES } from "../src/data/countries";
import { FLAG_PUZZLES } from "../src/data/flags";

const codes = new Set(COUNTRIES.map((x) => x.code));
const uniq = (xs: string[]) => new Set(xs).size === xs.length;

describe("country puzzle pool", () => {
  test("about 50 puzzles with unique, sequential ids", () => {
    expect(COUNTRY_PUZZLES.length).toBeGreaterThanOrEqual(45);
    expect(uniq(COUNTRY_PUZZLES.map((p) => p.id))).toBe(true);
    COUNTRY_PUZZLES.forEach((p, i) => expect(p.id).toBe(`country-${String(i + 1).padStart(3, "0")}`));
  });
  test("existing puzzles unchanged", () => {
    expect(COUNTRY_PUZZLES.slice(0, 7).map((p) => p.countryCode)).toEqual(["PT", "IS", "NP", "PE", "VN", "MA", "NZ"]);
  });
  test("valid codes, no country repeated", () => {
    for (const p of COUNTRY_PUZZLES) expect(codes.has(p.countryCode)).toBe(true);
    expect(uniq(COUNTRY_PUZZLES.map((p) => p.countryCode))).toBe(true);
  });
  test("five clues with EN and NL text, continent first", () => {
    for (const p of COUNTRY_PUZZLES) {
      expect(p.clues.length).toBe(5);
      expect(p.clues[0]?.label).toBe("Continent");
      for (const c of p.clues) {
        expect(c.label && c.value).toBeTruthy();
        expect(c.translations?.nl?.label && c.translations?.nl?.value).toBeTruthy();
      }
    }
  });
});

describe("flag puzzle pool", () => {
  test("about 50 puzzles with unique, sequential ids", () => {
    expect(FLAG_PUZZLES.length).toBeGreaterThanOrEqual(45);
    FLAG_PUZZLES.forEach((p, i) => expect(p.id).toBe(`flag-${String(i + 1).padStart(3, "0")}`));
  });
  test("existing puzzles unchanged", () => {
    expect(FLAG_PUZZLES[0]?.countries).toEqual(["BE", "JP", "BR", "SE", "CA"]);
    expect(FLAG_PUZZLES[5]?.countries).toEqual(["ES", "GB", "PT", "PL", "TR"]);
  });
  test("five valid, distinct codes per puzzle", () => {
    for (const p of FLAG_PUZZLES) {
      expect(p.countries.length).toBe(5);
      expect(uniq(p.countries)).toBe(true);
      for (const c of p.countries) expect(codes.has(c)).toBe(true);
    }
  });
  test("every country appears somewhere in the pool", () => {
    expect(new Set(FLAG_PUZZLES.flatMap((p) => p.countries)).size).toBe(195);
  });
});
