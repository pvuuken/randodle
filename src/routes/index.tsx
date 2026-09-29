import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getDailyGame } from "@/engine/dailyGameService";
import { streakService } from "@/services/streakService";
import { sessionService } from "@/services/sessionService";
import { StreakBadge } from "@/components/randodle/StreakBadge";
import { Countdown } from "@/components/randodle/Countdown";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Randodle — A different game every day" },
      {
        name: "description",
        content:
          "Randodle is a daily game platform. Every day brings a different type of puzzle — movie, country, year and more. Build your streak.",
      },
      { property: "og:title", content: "Randodle — A different game every day" },
      {
        property: "og:description",
        content: "You never know what today's challenge will be. One new game, every day.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const daily = useMemo(() => getDailyGame(), []);
  const [streak, setStreak] = useState(0);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    setStreak(streakService.displayStreak());
    const session = sessionService.load(daily.dayKey);
    setPlayed(Boolean(session && session.state.status !== "playing"));
  }, [daily.dayKey]);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-10 sm:pt-16">
      <section className="text-center">
        <span className="animate-float inline-block text-6xl" aria-hidden="true">
          🎲
        </span>
        <h1 className="mt-4 font-display text-5xl font-extrabold uppercase tracking-[0.06em] text-gradient sm:text-7xl">
          Randodle
        </h1>
        <p className="mt-3 text-lg font-semibold text-foreground sm:text-xl">A different game every day.</p>
        <p className="mt-1 text-sm text-muted-foreground">You never know what today's challenge will be.</p>
        {streak > 0 ? (
          <div className="mt-5">
            <StreakBadge days={streak} />
          </div>
        ) : null}
      </section>

      <section className="surface-card animate-rise mt-10 p-6 text-center sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Today's Randodle · #{String(daily.edition).padStart(3, "0")}
        </p>
        <p className="mt-4 text-5xl" aria-hidden="true">
          {daily.game.emoji}
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl">
          {daily.game.name}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{daily.game.prompt}</p>

        <Link
          to="/play"
          className="mt-7 inline-flex min-h-13 w-full items-center justify-center rounded-xl bg-accent px-8 text-base font-bold uppercase tracking-[0.12em] text-accent-foreground shadow-glow transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] sm:w-auto"
        >
          {played ? "See today's result" : "Play today"}
        </Link>
      </section>

      <section className="mt-10">
        <Countdown label="New game in" />
      </section>
    </div>
  );
}
