/**
 * Randodle-day helpers shared by the daily schedule, streak and countdown.
 * UTC is the canonical Randodle timezone: every player gets the same day key.
 */

const DAY_MS = 86_400_000;

/** Randodle #001 = 2026-01-01 (UTC). */
export const RANDODLE_EPOCH = Date.UTC(2026, 0, 1);

/** Canonical Randodle date key, e.g. "2026-10-01" (UTC). */
export function dayKey(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function dayIndex(date: Date = new Date()): number {
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.round((today - RANDODLE_EPOCH) / DAY_MS);
}

function parseDayKey(key: string): number {
  const [y = 1970, m = 1, d = 1] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function daysBetween(aKey: string, bKey: string): number {
  return Math.round((parseDayKey(bKey) - parseDayKey(aKey)) / DAY_MS);
}

/** Milliseconds until the next UTC Randodle day begins. */
export function msUntilTomorrow(now: Date = new Date()): number {
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return next - now.getTime();
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}
