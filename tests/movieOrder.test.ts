import { describe, expect, test } from "bun:test";
import { getDailyGame } from "@/engine/dailyGameService";
import { resolvePuzzle } from "@/engine/puzzleSchedule";
import { DAILY_SCHEDULE } from "@/data/dailySchedule";
import { MOVIE_LIST } from "@/data/movieList";
import { MOVIE_PUZZLES } from "@/data/movies";
import { movieGame } from "@/games/movie";
import { setLanguage } from "@/i18n";
import { dayKey } from "@/services/dateService";

const year = Object.fromEntries(MOVIE_LIST.map((m) => [m.id, m.year]));
/** Upcoming movie days (unpinned), as the real daily engine serves them. */
const movieDays = Array.from({ length: 1000 }, (_, i) => getDailyGame(new Date(Date.UTC(2026, 9, 2) + i * 86_400_000)))
  .filter((d) => d.game.id === "movie" && !DAILY_SCHEDULE[d.dayKey]);
const years = movieDays.map((d) => year[d.puzzle.id]!);

/** Spearman-style rank correlation between serve order and release year. */
function rankCorrelation(xs: number[]): number {
  const n = xs.length;
  const idx = xs.map((_, i) => i);
  const mx = (n - 1) / 2;
  const my = xs.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  idx.forEach((i) => { num += (i - mx) * (xs[i]! - my); dx += (i - mx) ** 2; dy += (xs[i]! - my) ** 2; });
  return num / Math.sqrt(dx * dy);
}

describe("movie order is unpredictable", () => {
  test("upcoming movies are not in chronological order", () => {
    expect(movieDays.length).toBeGreaterThan(150);
    expect(Math.abs(rankCorrelation(years))).toBeLessThan(0.15);
    let rising = 0;
    for (let i = 1; i < years.length; i++) if (years[i]! >= years[i - 1]!) rising++;
    expect(rising / (years.length - 1)).toBeLessThan(0.65);
  });

  test("same date → same movie (refresh / reopen)", () => {
    for (const d of movieDays.slice(0, 50)) {
      expect(getDailyGame(new Date(`${d.dayKey}T00:00:01Z`)).puzzle.id).toBe(d.puzzle.id);
      expect(getDailyGame(new Date(`${d.dayKey}T23:59:59Z`)).puzzle.id).toBe(d.puzzle.id);
    }
  });

  test("changing language does not change the movie", () => {
    setLanguage("nl");
    const nl = movieDays.slice(0, 50).map((d) => getDailyGame(new Date(`${d.dayKey}T12:00:00Z`)).puzzle.id);
    setLanguage("en");
    expect(nl).toEqual(movieDays.slice(0, 50).map((d) => d.puzzle.id));
  });

  test("reordering the movie list (e.g. by year) changes nothing", () => {
    const keys = movieDays.map((d) => d.dayKey);
    const base = keys.map((k) => resolvePuzzle(MOVIE_PUZZLES, k).id);
    const byYearDesc = [...MOVIE_PUZZLES].sort((a, b) => year[b.id]! - year[a.id]!);
    expect(keys.map((k) => resolvePuzzle(byYearDesc, k).id)).toEqual(base);
    expect(keys.map((k) => resolvePuzzle([...MOVIE_PUZZLES].reverse(), k).id)).toEqual(base);
    expect(base).toEqual(movieDays.map((d) => d.puzzle.id));
  });

  test("frozen movie dates are unchanged", () => {
    const frozen = Object.entries(DAILY_SCHEDULE).filter(([, id]) => year[id] !== undefined);
    expect(frozen.length).toBeGreaterThan(0);
    for (const [k, id] of frozen) {
      expect(getDailyGame(new Date(`${k}T12:00:00Z`)).puzzle.id).toBe(id);
      expect(resolvePuzzle([...MOVIE_PUZZLES].reverse(), k).id).toBe(id);
    }
  });

  test("dataset untouched: 200 movies, game still uses them all", () => {
    expect(MOVIE_PUZZLES.length).toBe(200);
    expect(movieGame.puzzles).toBe(MOVIE_PUZZLES);
    expect(dayKey(new Date(Date.UTC(2026, 9, 2)))).toBe("2026-10-02");
  });
});
