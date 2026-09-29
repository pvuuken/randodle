import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { statsService, type HistoryEntry, type OverviewStats } from "@/services/statsService";
import { getGame, listGames } from "@/engine/gameRegistry";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Your Randodle stats — streaks, scores and history" },
      { name: "description", content: "Your Randodle streak, average score, per-game performance and recent daily results." },
      { property: "og:title", content: "Your Randodle stats" },
      { property: "og:description", content: "Streaks, scores and your recent daily Randodles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StatsPage,
});

function formatDay(key: string) {
  const [y = 1970, m = 1, d = 1] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(undefined, { day: "numeric", month: "short", timeZone: "UTC" });
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted px-4 py-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function StatsPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setStats(statsService.getStats());
    setHistory(statsService.getGameHistory(10));
  }, []);

  const heading = (
    <h1 className="font-display text-3xl font-extrabold uppercase tracking-[0.12em] text-foreground">Stats</h1>
  );

  if (!stats) return <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-8">{heading}</main>;

  if (stats.played === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-8">
        {heading}
        <section className="surface-card mt-6 p-8 text-center">
          <p className="text-5xl" aria-hidden="true">🎲</p>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-foreground">Your Randodle journey starts today.</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Finish a daily game and your streak, scores and results will appear here.
          </p>
          <Link
            to="/play"
            className="mt-6 inline-flex min-h-13 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold uppercase tracking-[0.12em] text-accent-foreground shadow-glow transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Play today
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-8">
      {heading}

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Tile label="Current streak" value={String(stats.currentStreak)} />
        <Tile label="Best streak" value={String(stats.bestStreak)} />
        <Tile label="Games played" value={String(stats.played)} />
        <Tile label="Average score" value={stats.averagePercent === null ? "—" : `${Math.round(stats.averagePercent)}%`} />
        <Tile label="Completion" value={stats.completionRate === null ? "—" : `${Math.round(stats.completionRate * 100)}%`} />
      </section>

      <section className="surface-card mt-8 p-5">
        <h2 className="font-display text-lg font-extrabold uppercase tracking-[0.12em] text-foreground">Game performance</h2>
        <ul className="mt-3 divide-y divide-border">
          {listGames().map((g) => {
            const s = stats.perGame[g.id];
            return (
              <li key={g.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="font-semibold text-foreground">
                  <span aria-hidden="true">{g.emoji} </span>
                  {g.name}
                </span>
                <span className="text-right text-muted-foreground">
                  {s && s.averageScore !== null
                    ? `${s.played} played · avg ${Math.round(s.averageScore)}/${s.maxScore}`
                    : "Not played yet"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="surface-card mt-6 p-5">
        <h2 className="font-display text-lg font-extrabold uppercase tracking-[0.12em] text-foreground">Recent Randodles</h2>
        <ul className="mt-3 divide-y divide-border">
          {history.map((h) => {
            const game = getGame(h.gameId);
            return (
              <li key={h.day} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 py-3 text-sm">
                <span className="font-mono text-muted-foreground">{formatDay(h.day)}</span>
                <span className="truncate font-semibold text-foreground">
                  <span aria-hidden="true">{game?.emoji ?? "🎲"} </span>
                  {game?.name ?? h.gameId}
                </span>
                <span className="text-right">
                  <span className="font-bold text-foreground">
                    {h.score}/{h.maxScore}
                  </span>{" "}
                  <span className={h.won ? "text-accent" : "text-muted-foreground"}>{h.won ? "✓ Won" : "✗ Lost"}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
