import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { GameHost } from "@/components/randodle/GameHost";
import { Countdown } from "@/components/randodle/Countdown";
import { getGame, listGames } from "@/engine/gameRegistry";
import { storageService } from "@/services/storageService";
import { streakService } from "@/services/streakService";
import { statsService } from "@/services/statsService";
import { dayKey } from "@/services/dateService";

export const Route = createFileRoute("/dev")({
  // Development-only: production builds treat /dev as a missing page.
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: () => ({
    meta: [
      { title: "Randodle test mode" },
      { name: "description", content: "Internal test harness for Randodle game modules." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Randodle test mode" },
      { property: "og:description", content: "Internal test harness for Randodle game modules." },
    ],
  }),
  component: DevPage,
});

const buttonClass =
  "min-h-11 rounded-lg border border-border px-3 text-xs font-bold uppercase tracking-wide text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function DevPage() {
  if (!import.meta.env.DEV) return null;
  return <DevHarness />;
}

function DevHarness() {
  const games = listGames();
  const fallback = games[0]!;
  const [gameId, setGameId] = useState(fallback.id);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [notice, setNotice] = useState("");

  const game = getGame(gameId) ?? fallback;
  const puzzle = game.puzzles[Math.min(puzzleIndex, game.puzzles.length - 1)]!;

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-20 pt-8">
      <h1 className="font-display text-2xl font-extrabold uppercase tracking-[0.14em] text-foreground">
        Test mode
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Practice runs never touch the daily session, the streak or stored statistics.
      </p>

      <section className="surface-card mt-6 space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-foreground">
            Game module
            <select
              value={gameId}
              onChange={(e) => {
                setGameId(e.target.value);
                setPuzzleIndex(0);
              }}
              className="mt-1 min-h-11 w-full rounded-lg border border-input bg-input-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.emoji} {g.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-foreground">
            Puzzle
            <select
              value={puzzleIndex}
              onChange={(e) => setPuzzleIndex(Number(e.target.value))}
              className="mt-1 min-h-11 w-full rounded-lg border border-input bg-input-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {game.puzzles.map((p, i) => (
                <option key={p.id} value={i}>
                  {p.id}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={buttonClass}
            onClick={() => {
              streakService.reset();
              statsService.clear();
              setNotice("Streak, statistics and history reset.");
            }}
          >
            Reset streak
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => {
              // Sample history for the last 6 UTC days (today excluded), through the real services.
              const now = Date.now();
              for (let i = 6; i >= 1; i--) {
                const date = new Date(now - i * 86_400_000);
                const g = games[i % games.length]!;
                const max = g.maxScore ?? 100;
                const score = Math.round((max * ((i * 37) % 100)) / 100 / 10) * 10;
                const day = dayKey(date);
                const won = score >= max / 2;
                streakService.recordCompletion({ won, score, day });
                statsService.recordResult({ day, gameId: g.id, score, maxScore: max, won });
              }
              setNotice("Seeded 6 days of sample history. Open /stats.");
            }}
          >
            Seed history
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => {
              storageService.clearAll();
              setNotice("All Randodle storage cleared.");
            }}
          >
            Clear storage
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => {
              const s = streakService.get();
              const stats = streakService.getStats();
              setNotice(
                `Streak ${s.current} (best ${s.best}, last ${s.lastPlayedDay ?? "never"}) · played ${stats.played}, won ${stats.won}, points ${stats.totalScore} · today ${dayKey()}`,
              );
            }}
          >
            Inspect state
          </button>
        </div>
        <p role="status" aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
          {notice}
        </p>
        {game.getAnswerKey ? (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Answer key:</span> {game.getAnswerKey(puzzle)}
          </p>
        ) : null}
      </section>

      <section className="surface-card mt-6 p-5">
        <Countdown label="Countdown check" />
      </section>

      <section className="mt-8">
        <GameHost
          key={`${game.id}:${puzzle.id}`}
          edition={0}
          dayKey={`practice:${game.id}:${puzzle.id}`}
          game={game}
          puzzle={puzzle}
          practice
          toolbar={(session) => (
            <div className="flex flex-wrap gap-2">
              <button type="button" className={buttonClass} onClick={() => session.forceFinish("win")}>
                Simulate win
              </button>
              <button type="button" className={buttonClass} onClick={() => session.forceFinish("lose")}>
                Simulate loss
              </button>
              <button type="button" className={buttonClass} onClick={session.restart}>
                Restart puzzle
              </button>
            </div>
          )}
        />
      </section>
    </main>
  );
}
