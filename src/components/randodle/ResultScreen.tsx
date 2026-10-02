import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { GameState, RegisteredGame } from "@/types/game";
import { buildShareText, copyText, shareText } from "@/services/shareService";
import { Countdown } from "./Countdown";
import { StreakBadge } from "./StreakBadge";
import { useTranslation } from "@/i18n";

interface ResultScreenProps {
  edition: number;
  game: RegisteredGame;
  state: GameState;
  score: number;
  streak: number;
  /** Shown in test mode instead of the daily framing. */
  practice?: boolean;
  onPlayAgain?: () => void;
  /** Revealed only after a definitive loss. */
  correctAnswer?: string;
}

export function ResultScreen({
  edition,
  game,
  state,
  score,
  streak,
  practice = false,
  onPlayAgain,
  correctAnswer,
}: ResultScreenProps) {
  const { t } = useTranslation();
  const r = t.result;
  const [status, setStatus] = useState("");
  const text = buildShareText({ edition, game, state, streak, labels: t.share });
  const won = state.status === "won";

  return (
    <section
      aria-labelledby="result-heading"
      className="animate-rise rounded-3xl border border-border bg-card p-6 shadow-glow sm:p-8"
    >
      <p className="text-center text-4xl" aria-hidden="true">
        {won ? "🎉" : "🎲"}
      </p>
      <h2
        id="result-heading"
        className="mt-2 text-center font-display text-2xl font-extrabold uppercase tracking-[0.12em] text-foreground"
      >
        {won ? r.complete : r.betterLuck}
      </h2>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        {practice ? r.practiceRun : `Randodle #${String(edition).padStart(3, "0")}`} ·{" "}
        <span aria-hidden="true">{game.emoji} </span>
        {game.name}
      </p>
      {!won && correctAnswer ? (
        <div className="mt-4 rounded-2xl border border-border bg-muted px-4 py-3 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-foreground">{r.gameOver}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {r.correctAnswer} <span className="font-bold text-foreground">{correctAnswer}</span>
          </p>
        </div>
      ) : null}

      <dl className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-muted px-4 py-4 text-center">
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{r.score}</dt>
          <dd className="mt-1 text-3xl font-bold text-accent">{score}</dd>
          <dd className="text-xs text-muted-foreground">{r.outOf(game.maxScore ?? 100)}</dd>
        </div>
        <div className="rounded-2xl bg-muted px-4 py-4 text-center">
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{r.attempts}</dt>
          <dd className="mt-1 text-3xl font-bold text-foreground">
            {state.attempts.length} / {state.maxAttempts}
          </dd>
          <dd className="text-xs text-muted-foreground">{won ? r.solved : r.noSolve}</dd>
        </div>
      </dl>

      <p className="mt-4 text-center font-mono text-xl tracking-[0.2em]" aria-hidden="true">
        {game.getShareResult(state).squares}
      </p>

      {!practice ? (
        <div className="mt-4 flex justify-center">
          <StreakBadge days={streak} label={r.streakLabel} />
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={async () => {
            const outcome = await shareText(text);
            setStatus(
              outcome === "shared"
                ? r.shared
                : outcome === "copied"
                  ? r.copied
                  : r.shareFailed,
            );
          }}
          className="min-h-13 flex-1 rounded-xl bg-accent px-5 text-base font-bold uppercase tracking-wide text-accent-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
        >
          {r.share}
        </button>
        <button
          type="button"
          onClick={async () => {
            const outcome = await copyText(text);
            setStatus(outcome === "copied" ? r.copied : r.copyFailed);
          }}
          className="min-h-13 flex-1 rounded-xl border border-border bg-transparent px-5 text-base font-bold uppercase tracking-wide text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
        >
          {r.copy}
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-5 text-center text-sm text-muted-foreground">
        {status}
      </p>

      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-muted px-4 py-3 text-center text-sm text-muted-foreground">
        {text}
      </pre>

      {!practice ? (
        <div className="mt-4 text-center">
          <Link
            to="/answers"
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {r.viewAnswers}
          </Link>
        </div>
      ) : null}

      {practice ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {onPlayAgain ? (
            <button
              type="button"
              onClick={onPlayAgain}
              className="min-h-13 flex-1 rounded-xl border border-border px-5 text-sm font-bold uppercase tracking-wide text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {r.playAgain}
            </button>
          ) : null}
          <Link
            to="/play"
            className="min-h-13 flex-1 rounded-xl border border-border px-5 text-center text-sm font-bold uppercase leading-[3.25rem] tracking-wide text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {r.todays}
          </Link>
        </div>
      ) : (
        <div className="mt-8 border-t border-border pt-6">
          <Countdown />
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {r.comeBack}
          </p>
        </div>
      )}
    </section>
  );
}
