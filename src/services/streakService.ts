import { storageService } from "./storageService";
import { dayKey, daysBetween } from "./dateService";

export interface StreakState {
  current: number;
  best: number;
  lastPlayedDay: string | null;
}

export interface Statistics {
  played: number;
  won: number;
  totalScore: number;
}

const STREAK_KEY = "streak";
const STATS_KEY = "stats";

const EMPTY_STREAK: StreakState = { current: 0, best: 0, lastPlayedDay: null };
const EMPTY_STATS: Statistics = { played: 0, won: 0, totalScore: 0 };

/** Platform-wide streak — not tied to any single game. */
export const streakService = {
  get(): StreakState {
    return storageService.read<StreakState>(STREAK_KEY, EMPTY_STREAK);
  },

  getStats(): Statistics {
    return storageService.read<Statistics>(STATS_KEY, EMPTY_STATS);
  },

  /** Idempotent per day: playing twice on one day counts once. */
  recordCompletion(options: { won: boolean; score: number; day?: string }): StreakState {
    const today = options.day ?? dayKey();
    const streak = this.get();
    if (streak.lastPlayedDay === today) return streak;

    const gap = streak.lastPlayedDay ? daysBetween(streak.lastPlayedDay, today) : null;
    const current = gap === 1 ? streak.current + 1 : 1;
    const next: StreakState = {
      current,
      best: Math.max(current, streak.best),
      lastPlayedDay: today,
    };
    storageService.write(STREAK_KEY, next);

    const stats = this.getStats();
    storageService.write<Statistics>(STATS_KEY, {
      played: stats.played + 1,
      won: stats.won + (options.won ? 1 : 0),
      totalScore: stats.totalScore + options.score,
    });

    return next;
  },

  /** A streak only counts today if it was continued today or yesterday. */
  displayStreak(): number {
    const streak = this.get();
    if (!streak.lastPlayedDay) return 0;
    const gap = daysBetween(streak.lastPlayedDay, dayKey());
    return gap <= 1 ? streak.current : 0;
  },

  reset(): void {
    storageService.write(STREAK_KEY, EMPTY_STREAK);
    storageService.write(STATS_KEY, EMPTY_STATS);
  },
};
