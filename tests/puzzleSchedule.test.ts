import { describe, expect, test } from "bun:test";
import { rendezvousPick, resolvePuzzle } from "@/engine/puzzleSchedule";
import { getDailyGame } from "@/engine/dailyGameService";
import { DAILY_SCHEDULE } from "@/data/dailySchedule";
import { dayKey } from "@/services/dateService";

const pool = Array.from({ length: 40 }, (_, i) => ({ id: `p-${String(i).padStart(3, "0")}` }));
const days = Array.from({ length: 365 }, (_, i) => dayKey(new Date(Date.UTC(2027, 0, 1) + i * 86_400_000)));
const pick = (ps: { id: string }[]) => days.map((d) => resolvePuzzle(ps, d, {}).id);

describe("stable date → puzzle mapping", () => {
  test("same date always returns the same puzzle", () => {
    expect(pick(pool)).toEqual(pick(pool));
    expect(getDailyGame(new Date("2026-11-05T10:00:00Z")).puzzle.id).toBe(
      getDailyGame(new Date("2026-11-05T22:00:00Z")).puzzle.id,
    );
  });

  test("reordering the dataset does not change results", () => {
    expect(pick([...pool].reverse())).toEqual(pick(pool));
    expect(pick([...pool].sort(() => 0.5 - Math.random()))).toEqual(pick(pool));
  });

  test("pinned dates never change when a puzzle is added", () => {
    const schedule = Object.fromEntries(days.map((d) => [d, rendezvousPick(pool, d).id]));
    const bigger = [...pool, { id: "p-new" }];
    expect(days.map((d) => resolvePuzzle(bigger, d, schedule).id)).toEqual(pick(pool));
  });

  test("adding a puzzle only affects dates the new puzzle wins (unpinned)", () => {
    const before = pick(pool);
    const after = pick([...pool, { id: "p-new" }]);
    after.forEach((id, i) => expect(id === before[i] || id === "p-new").toBe(true));
  });

  test("removing an unrelated puzzle does not change other dates", () => {
    const before = pick(pool);
    const removed = "p-007";
    const after = pick(pool.filter((p) => p.id !== removed));
    before.forEach((id, i) => {
      if (id !== removed) expect(after[i]).toBe(id);
    });
  });

  test("already-played dates are frozen in the schedule", () => {
    expect(getDailyGame(new Date("2026-10-01T12:00:00Z")).puzzle.id).toBe(DAILY_SCHEDULE["2026-10-01"]!);
    for (const [day, id] of Object.entries(DAILY_SCHEDULE)) {
      expect(getDailyGame(new Date(`${day}T00:00:00Z`)).puzzle.id).toBe(id);
    }
  });

  test("UTC boundaries", () => {
    const late = getDailyGame(new Date("2026-12-31T23:59:59.999Z"));
    const early = getDailyGame(new Date("2027-01-01T00:00:00Z"));
    expect(late.dayKey).toBe("2026-12-31");
    expect(early.dayKey).toBe("2027-01-01");
    expect(getDailyGame(new Date("2027-01-01T23:59:59Z")).puzzle.id).toBe(early.puzzle.id);
  });
});
