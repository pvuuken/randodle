import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { COUNTRIES } from "../src/data/countryList";
import { COUNTRY_PUZZLES } from "../src/data/countries";
import { FLAG_PUZZLES } from "../src/data/flags";
import { normalizeAnswer } from "../src/services/answerService";
import { countrySuggestions, resolveCountry } from "../src/services/countryService";

const code = (input: string) => resolveCountry(input)?.code;

describe("country dataset", () => {
  test("contains exactly 195 countries", () => expect(COUNTRIES.length).toBe(195));
  test("every country is complete", () => {
    for (const x of COUNTRIES) {
      expect(x.code).toMatch(/^[A-Z]{2}$/);
      expect(x.name.en.length).toBeGreaterThan(0);
      expect(x.name.nl.length).toBeGreaterThan(0);
      expect(x.flag).toBe(`/flags/${x.code.toLowerCase()}.svg`);
      expect(existsSync(`public${x.flag}`)).toBe(true);
    }
  });
  test("codes and names are unique", () => {
    const uniq = (xs: string[]) => new Set(xs).size === xs.length;
    expect(uniq(COUNTRIES.map((x) => x.code))).toBe(true);
    expect(uniq(COUNTRIES.map((x) => normalizeAnswer(x.name.en)))).toBe(true);
    expect(uniq(COUNTRIES.map((x) => normalizeAnswer(x.name.nl)))).toBe(true);
  });
  test("no name or alias points to two different countries", () => {
    const owner = new Map<string, string>();
    for (const x of COUNTRIES) {
      const terms = new Set([x.name.en, x.name.nl, ...x.aliases.en, ...x.aliases.nl].map(normalizeAnswer));
      for (const t of terms) {
        expect(owner.get(t) ?? x.code).toBe(x.code);
        owner.set(t, x.code);
      }
    }
  });
  test("every name and alias resolves to its own country", () => {
    for (const x of COUNTRIES) {
      for (const t of [x.name.en, x.name.nl, ...x.aliases.en, ...x.aliases.nl]) expect(code(t)).toBe(x.code);
    }
  });
  test("puzzles reference known codes", () => {
    const codes = new Set(COUNTRIES.map((x) => x.code));
    for (const p of COUNTRY_PUZZLES) expect(codes.has(p.countryCode)).toBe(true);
    for (const p of FLAG_PUZZLES) for (const c of p.countries) expect(codes.has(c)).toBe(true);
  });
});

describe("resolveCountry", () => {
  test("Belgium", () => {
    for (const t of ["Belgium", "belgium", "België", "Belgie", "  BELGIË "]) expect(code(t)).toBe("BE");
  });
  test("France / Germany", () => {
    expect(code("France")).toBe("FR");
    expect(code("Frankrijk")).toBe("FR");
    expect(code("Germany")).toBe("DE");
    expect(code("Duitsland")).toBe("DE");
  });
  test("aliases", () => {
    expect(code("Türkiye")).toBe("TR");
    expect(code("Czech Republic")).toBe("CZ");
    expect(code("Tjechië")).toBe("CZ");
    expect(code("Holland")).toBe("NL");
  });
  test("no cross matches", () => {
    expect(code("Belgium")).not.toBe("FR");
    expect(code("France")).not.toBe("BE");
    expect(code("Niger")).toBe("NE");
    expect(code("Guinea")).toBe("GN");
    expect(code("")).toBeUndefined();
    expect(code("Atlantis")).toBeUndefined();
  });
});

describe("autocomplete", () => {
  test("uses the same dataset, localized", () => {
    expect(countrySuggestions("en").length).toBe(COUNTRIES.length);
    const bel = (lang: "en" | "nl") =>
      countrySuggestions(lang).filter((s) => normalizeAnswer(s.value).startsWith("bel")).map((s) => s.value);
    expect(bel("en")).toContain("Belgium");
    expect(bel("nl")).toContain("België");
    for (const s of countrySuggestions("nl")) expect(resolveCountry(s.value)).toBeDefined();
  });
});
