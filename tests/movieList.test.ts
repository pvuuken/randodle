import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "fs";
import { MOVIE_LIST } from "../src/data/movieList";

const SRC = "/mnt/documents/randodle-200-movies.md";

describe("movie database", () => {
  test("exactly 200 movies", () => expect(MOVIE_LIST.length).toBe(200));
  test("unique Randodle ids", () => expect(new Set(MOVIE_LIST.map((m) => m.id)).size).toBe(200));
  test("unique TMDB ids", () => expect(new Set(MOVIE_LIST.map((m) => m.tmdbId)).size).toBe(200));
  test("no duplicate title+year", () =>
    expect(new Set(MOVIE_LIST.map((m) => `${m.title.en}|${m.year}`)).size).toBe(200));
  test("valid fields, no placeholders", () => {
    for (const m of MOVIE_LIST) {
      expect(m.year).toBeGreaterThanOrEqual(1900);
      expect(m.year).toBeLessThanOrEqual(2026);
      expect(Number.isInteger(m.tmdbId) && m.tmdbId > 0).toBe(true);
      expect(m.posterPath).toMatch(/^\/[A-Za-z0-9]{10,}\.(jpg|png)$/);
      expect(m.title.en.trim()).not.toBe("");
      expect(m.title.nl.trim()).not.toBe("");
      expect(m.id).not.toBe(String(m.tmdbId));
    }
  });
  test.if(existsSync(SRC))("matches the approved list exactly, in order", () => {
    const approved = [...readFileSync(SRC, "utf8").matchAll(/\*\*(\d+)\. (.+?)\*\*\s*\nYear: (\d{4})/g)].map(
      (m) => `${m[2]}|${m[3]}`,
    );
    expect(approved.length).toBe(200);
    expect(MOVIE_LIST.map((m) => `${m.title.en}|${m.year}`)).toEqual(approved);
  });
});
