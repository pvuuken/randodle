import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDailyGame } from "@/hooks/useDailyGame";
import { getTodaysAnswers } from "@/engine/answerReview";
import { sessionService } from "@/services/sessionService";
import { localizeGame, useTranslation } from "@/i18n";
import type { AnswerReviewItem } from "@/types/game";

export const Route = createFileRoute("/answers")({
  head: () => ({
    meta: [
      { title: "Today's answers — Randodle" },
      { name: "description", content: "See the correct answers to today's Randodle after you've finished it." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Today's answers — Randodle" },
      { property: "og:description", content: "The answers to today's Randodle, unlocked once you've played." },
    ],
  }),
  component: AnswersPage,
});

const linkClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-bold uppercase tracking-wide text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function AnswersPage() {
  const daily = useDailyGame();
  const { lang, t } = useTranslation();
  const a = t.answers;
  // Saved progress is browser-only: read it after hydration.
  const [items, setItems] = useState<AnswerReviewItem[] | null | undefined>(undefined);
  useEffect(() => {
    setItems(getTodaysAnswers(daily, sessionService.load(daily.dayKey), lang));
  }, [daily, lang]);

  const text = localizeGame(daily.game, lang);

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-20 pt-8 sm:pt-12">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Randodle #{String(daily.edition).padStart(3, "0")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-foreground">
          {a.title}
        </h1>
        {items ? (
          <p className="mt-2 text-sm text-muted-foreground">
            <span aria-hidden="true">{daily.game.emoji} </span>
            {text.name}
          </p>
        ) : null}
      </header>

      {items === undefined ? null : items === null ? (
        <section className="surface-card mt-8 p-6 text-center">
          <h2 className="font-display text-lg font-bold text-foreground">{a.locked}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{a.lockedText}</p>
          <Link to="/play" className={`${linkClass} mt-5`}>
            {a.play}
          </Link>
        </section>
      ) : (
        <>
          <ol className="mt-8 space-y-3">
            {items.map((item, i) => (
              <li key={i} className="surface-card flex gap-4 p-4">
                {item.image ? (
                  <img src={item.image} alt="" className="h-16 w-auto shrink-0 rounded border border-border object-cover" />
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-foreground">{item.question}</p>
                    {item.correct !== undefined ? (
                      <span
                        className={`shrink-0 text-xs font-bold uppercase tracking-wide ${item.correct ? "text-accent" : "text-destructive"}`}
                      >
                        {item.correct ? `✓ ${a.correct}` : `✗ ${a.incorrect}`}
                      </span>
                    ) : null}
                  </div>
                  <dl className="mt-2 grid gap-1 text-sm">
                    <div>
                      <dt className="inline text-muted-foreground">{a.yourAnswer}: </dt>
                      <dd className="inline text-foreground">{item.yourAnswer ?? a.noAnswer}</dd>
                    </div>
                    <div>
                      <dt className="inline text-muted-foreground">{a.correctAnswer}: </dt>
                      <dd className="inline font-bold text-foreground">{item.correctAnswer}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 text-center">
            <Link to="/play" className={linkClass}>
              {a.back}
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
