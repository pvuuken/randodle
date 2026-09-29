import { createFileRoute, Link } from "@tanstack/react-router";
import { listGames } from "@/engine/gameRegistry";

export const Route = createFileRoute("/how-to-play")({
  head: () => ({
    meta: [
      { title: "How to play Randodle" },
      {
        name: "description",
        content:
          "How Randodle works: one game a day, scoring out of 100, a platform-wide streak and spoiler-free sharing.",
      },
      { property: "og:title", content: "How to play Randodle" },
      { property: "og:description", content: "One game a day, scored out of 100, with a streak that spans every game." },
    ],
  }),
  component: HowToPlay,
});

function HowToPlay() {
  const games = listGames();
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-20 pt-10">
      <h1 className="font-display text-4xl font-extrabold uppercase tracking-tight text-foreground">
        How to play
      </h1>
      <p className="mt-3 text-muted-foreground">
        Randodle gives everyone the same single puzzle each day — but the type of game changes. Solve it in as
        few attempts as you can, keep your streak alive, and share a spoiler-free result.
      </p>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-xl font-bold uppercase tracking-[0.14em] text-foreground">
          Today's rotation
        </h2>
        {games.map((game) => (
          <article key={game.id} className="surface-card p-5">
            <h3 className="font-display text-lg font-bold text-foreground">
              <span aria-hidden="true">{game.emoji} </span>
              {game.name}
            </h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {game.category} · {game.maxAttempts} attempts
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{game.howToPlay}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 space-y-4 text-sm text-muted-foreground">
        <h2 className="font-display text-xl font-bold uppercase tracking-[0.14em] text-foreground">
          Scoring &amp; streaks
        </h2>
        <p>
          Scoring depends on the game. Single-answer games reward solving in fewer attempts, while games
          with several rounds add up points for every round you get right. Your result screen always shows
          your score against that game's maximum.
        </p>
        <p>
          Your streak belongs to Randodle, not to a single game: finishing the day's puzzle keeps it alive
          whether you win or lose. Miss a day and it resets.
        </p>
        <p>Progress is stored on this device only — no account needed.</p>
      </section>

      <Link
        to="/play"
        className="mt-10 inline-flex min-h-13 w-full items-center justify-center rounded-xl bg-accent px-8 text-base font-bold uppercase tracking-[0.12em] text-accent-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
      >
        Play today's game
      </Link>
    </main>
  );
}
