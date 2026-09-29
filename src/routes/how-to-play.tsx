import { createFileRoute, Link } from "@tanstack/react-router";
import { listGames } from "@/engine/gameRegistry";
import { localizeGame, useTranslation } from "@/i18n";

export const Route = createFileRoute("/how-to-play")({
  head: () => ({
    meta: [
      { title: "How to play Randodle" },
      {
        name: "description",
        content:
          "How Randodle works: one game a day, points for every solve, a platform-wide streak and spoiler-free sharing.",
      },
      { property: "og:title", content: "How to play Randodle" },
      { property: "og:description", content: "One game a day, with points to earn and a streak that spans every game." },
    ],
  }),
  component: HowToPlay,
});

function HowToPlay() {
  const { lang, t } = useTranslation();
  const h = t.howTo;
  const games = listGames().map((g) => localizeGame(g, lang));
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-20 pt-10">
      <h1 className="font-display text-4xl font-extrabold uppercase tracking-tight text-foreground">
        {h.title}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {h.intro}
      </p>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-xl font-bold uppercase tracking-[0.14em] text-foreground">
          {h.rotation}
        </h2>
        {games.map((game) => (
          <article key={game.id} className="surface-card p-5">
            <h3 className="font-display text-lg font-bold text-foreground">
              <span aria-hidden="true">{game.emoji} </span>
              {game.name}
            </h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {game.category} · {h.attempts(game.maxAttempts)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{game.howToPlay}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 space-y-4 text-sm text-muted-foreground">
        <h2 className="font-display text-xl font-bold uppercase tracking-[0.14em] text-foreground">
          {h.scoringTitle}
        </h2>
        <p>{h.scoring}</p>
        <p>{h.streaks}</p>
        <p>{h.device}</p>
      </section>

      <Link
        to="/play"
        className="mt-10 inline-flex min-h-13 w-full items-center justify-center rounded-xl bg-accent px-8 text-base font-bold uppercase tracking-[0.12em] text-accent-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
      >
        {h.cta}
      </Link>
    </main>
  );
}
