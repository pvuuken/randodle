import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDailyGame } from "@/hooks/useDailyGame";
import { streakService } from "@/services/streakService";
import { sessionService } from "@/services/sessionService";
import { Countdown } from "@/components/randodle/Countdown";
import { useTranslation } from "@/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Randodle — A different game every day" },
      {
        name: "description",
        content:
          "Randodle is a daily game platform. Every day brings a different type of puzzle — and you never know which one. Build your streak.",
      },
      { property: "og:title", content: "Randodle — A different game every day" },
      {
        property: "og:description",
        content: "You never know what today's game will be. One new game, every day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

/** Mystery homepage: shows today's edition only — never which game it is. */
function Home() {
  const { t } = useTranslation();
  const h = t.home;
  const [edition, setEdition] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [played, setPlayed] = useState(false);

  // Same UTC day tracker as /play: re-runs when the day rolls over at midnight.
  const daily = useDailyGame();

  useEffect(() => {
    setEdition(daily.edition);
    setStreak(streakService.displayStreak());
    const session = sessionService.load(daily.dayKey);
    setPlayed(Boolean(session && session.state.status !== "playing"));
  }, [daily.dayKey, daily.edition]);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-8 sm:pt-14">
      <section className="text-center">
        <h1 className="font-display text-5xl font-extrabold uppercase tracking-[0.06em] text-gradient sm:text-7xl">
          Randodle
        </h1>
        <p className="mt-3 text-xl font-bold text-foreground sm:text-2xl">{h.tagline}</p>
        <p className="mt-1 text-sm text-muted-foreground">{h.sub}</p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.12em] text-warning">
          <span aria-hidden="true">🔥</span>
          {streak > 0 ? h.streak(streak) : h.startStreak}
        </p>
      </section>

      <section className="surface-card animate-rise mt-8 p-6 text-center sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {h.today}{edition ? ` · #${String(edition).padStart(3, "0")}` : ""}
        </p>
        <p
          aria-hidden="true"
          className="mx-auto mt-5 flex h-24 w-24 items-center justify-center rounded-2xl border border-border bg-muted font-display text-6xl font-extrabold text-accent"
        >
          ?
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          {played ? h.played : h.mystery}
        </p>

        <Link
          to="/play"
          className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-accent px-8 text-base font-bold uppercase tracking-[0.12em] text-accent-foreground shadow-glow transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] sm:w-auto"
        >
          {played ? h.seeResult : h.play}
        </Link>
      </section>

      <section className="surface-card mt-6 p-5">
        <Countdown label={h.newGameIn} />
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {h.comeBack}
        </p>
      </section>
    </div>
  );
}
