import { DAILY_SCHEDULE } from "@/data/dailySchedule";

/**
 * Stable date → puzzle mapping.
 *
 * 1. A pinned date (DAILY_SCHEDULE) always resolves to its stored puzzle id,
 *    as long as that puzzle still exists.
 * 2. Any other date uses rendezvous hashing: every puzzle gets a score from
 *    hash(dayKey + puzzle id) and the highest score wins. The result depends
 *    only on the set of ids, never on array order or length.
 */

/** FNV-1a 32-bit — tiny, deterministic, identical in every browser. */
export function hash32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // Final avalanche so similar ids spread well.
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

export function rendezvousPick<T extends { id: string }>(puzzles: T[], dayKey: string): T {
  let best: T | undefined;
  let bestScore = -1;
  for (const p of puzzles) {
    const score = hash32(`${dayKey}|${p.id}`);
    if (score > bestScore || (score === bestScore && best && p.id < best.id)) {
      best = p;
      bestScore = score;
    }
  }
  if (!best) throw new Error("Puzzle pool is empty");
  return best;
}

export function resolvePuzzle<T extends { id: string }>(
  puzzles: T[],
  dayKey: string,
  schedule: Record<string, string> = DAILY_SCHEDULE,
): T {
  const pinned = schedule[dayKey];
  if (pinned) {
    const found = puzzles.find((p) => p.id === pinned);
    if (found) return found;
  }
  return rendezvousPick(puzzles, dayKey);
}
