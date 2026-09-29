import { storageService } from "./storageService";
import { streakService } from "./streakService";
import { dayKey, daysBetween } from "./dateService";

/** One completed daily Randodle. Keyed by UTC day, so at most one per day. */
export interface HistoryEntry {
  day: string;
  gameId: string;
  score: number;
  maxScore: number;
  won: boolean;
}

export interface GameStats {
  played: number;
  /** Average points, or null when never played. */
  averageScore: number | null;
  maxScore: number;
}

export interface OverviewStats {
  currentStreak: number;
  bestStreak: number;
  played: number;
  /** Average score as a percentage of each game's maximum, or null with no history. */
  averagePercent: number | null;
  /** Completed days / days since the first recorded day, or null with no history. */
  completionRate: number | null;
  perGame: Record<string, GameStats>;
}

const HISTORY_KEY = "history";
type HistoryMap = Record<string, HistoryEntry>;

const readMap = () => storageService.read<HistoryMap>(HISTORY_KEY, {});

/**
 * Daily result history + derived statistics. The UI only calls these
 * functions, so the storage behind them can be swapped later.
 */
export const statsService = {
  /** Idempotent: the first result for a day wins; refreshes and revisits are ignored. */
  recordResult(entry: HistoryEntry): void {
    const map = readMap();
    if (map[entry.day]) return;
    storageService.write<HistoryMap>(HISTORY_KEY, { ...map, [entry.day]: entry });
  },

  /** Newest first. */
  getGameHistory(limit?: number): HistoryEntry[] {
    const list = Object.values(readMap()).sort((a, b) => b.day.localeCompare(a.day));
    return limit ? list.slice(0, limit) : list;
  },

  getStats(): OverviewStats {
    const history = this.getGameHistory();
    const streak = streakService.get();
    const perGame: Record<string, GameStats> = {};
    for (const h of history) {
      const g = (perGame[h.gameId] ??= { played: 0, averageScore: 0, maxScore: h.maxScore });
      g.averageScore = ((g.averageScore ?? 0) * g.played + h.score) / (g.played + 1);
      g.played += 1;
    }
    const oldest = history[history.length - 1];
    const span = oldest ? daysBetween(oldest.day, dayKey()) + 1 : 0;
    return {
      currentStreak: streakService.displayStreak(),
      bestStreak: streak.best,
      played: history.length,
      averagePercent: history.length
        ? (history.reduce((s, h) => s + h.score / (h.maxScore || 100), 0) / history.length) * 100
        : null,
      completionRate: span > 0 ? Math.min(1, history.length / span) : null,
      perGame,
    };
  },

  clear(): void {
    storageService.remove(HISTORY_KEY);
  },
};
