import { describe, expect, test } from "bun:test";
import { DAILY_SCHEDULE } from "@/data/dailySchedule";
import { getDailyGame } from "@/engine/dailyGameService";
import { rendezvousPick, resolvePuzzle } from "@/engine/puzzleSchedule";
import { GAME_REGISTRY } from "@/engine/gameRegistry";

/** Puzzles players actually got 2–6 Oct 2026 (captured before freezing). */
const PLAYED: Record<string, [string, string]> = {
  "2026-10-02": ["flag", "flag-024"],
  "2026-10-03": ["movie", "halloween-1978"],
  "2026-10-04": ["country", "country-019"],
  "2026-10-05": ["year", "year-064"],
  "2026-10-06": ["higher-lower", "hol-030"],
};

describe("frozen dates 2026-10-02 → 2026-10-06", () => {
  test("each played date keeps its game and puzzle", () => {
    for (const [day, [gameId, puzzleId]] of Object.entries(PLAYED)) {
      expect(DAILY_SCHEDULE[day]).toBe(puzzleId);
      const g = getDailyGame(new Date(`${day}T00:00:00Z`));
      expect(g.game.id).toBe(gameId);
      expect(g.puzzle.id).toBe(puzzleId);
      expect(getDailyGame(new Date(`${day}T23:59:59Z`)).puzzle.id).toBe(puzzleId);
    }
  });

  test("frozen ids match what the hashing picked (no recalculation)", () => {
    for (const [day, [gameId, puzzleId]] of Object.entries(PLAYED)) {
      expect(rendezvousPick(GAME_REGISTRY[gameId]!.puzzles, day).id).toBe(puzzleId);
    }
  });

  test("earlier history unchanged and schedule is continuous", () => {
    expect(DAILY_SCHEDULE["2026-01-01"]).toBe("snow-white-and-the-seven-dwarfs-1937");
    expect(DAILY_SCHEDULE["2026-10-01"]).toBe("hol-005");
    expect(Object.keys(DAILY_SCHEDULE).length).toBe(279);
  });

  test("reordering, adding or removing puzzles cannot alter frozen dates", () => {
    for (const [day, [gameId, puzzleId]] of Object.entries(PLAYED)) {
      const pool = GAME_REGISTRY[gameId]!.puzzles as { id: string }[];
      const edited = [{ id: "zzz-new" }, ...pool.filter((p) => p.id !== pool[0]!.id || p.id === puzzleId)].reverse();
      expect(resolvePuzzle(edited, day).id).toBe(puzzleId);
    }
  });

  test("future dates still use deterministic hashing", () => {
    expect(DAILY_SCHEDULE["2026-10-07"]).toBeUndefined();
    const g = getDailyGame(new Date("2026-10-07T12:00:00Z"));
    expect(g.puzzle.id).toBe(rendezvousPick(g.game.puzzles, "2026-10-07").id);
  });
});
