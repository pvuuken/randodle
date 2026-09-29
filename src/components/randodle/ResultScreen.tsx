import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { GameState, RegisteredGame } from "@/types/game";
import { buildShareText, copyText, shareText } from "@/services/shareService";
import { Countdown } from "./Countdown";
import { StreakBadge } from "./StreakBadge";

interface ResultScreenProps {
  edition: number;
  game: RegisteredGame;
  state: GameState;
  score: number;
  streak: number;
  /** Shown in test mode instead of the daily framing. */
  practice?: boolean;
  onPlayAgain?: () => void;
}

export function ResultScreen({
  edition,
  game,
  state,
  score,
  streak,
  practice = false,
  onPlayAgain,
}: ResultScreenProps) {
  const [status, setStatus] = useState("");
  const text = buildShareText({ edition, game, state, streak });
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
        {won ? "Randodle complete" : "Better luck tomorrow"}
      </h2>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        {practice ? "Practice run" : `Randodle #${String(edition).padStart(3, "0")}`} ·{" "}
        <span aria-hidden="true">{game.emoji} </span>
        {game.name}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-muted px-4 py-4 text-center">
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Score</dt>
          <dd className="mt-1 text-3xl font-bold text-accent">{score}</dd>
          <dd className="text-xs text-muted-foreground">out of {game.maxScore ?? 100}</dd>
        </div>
        <div className="rounded-2xl bg-muted px-4 py-4 text-center">
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Attempts</dt>
          <dd className="mt-1 text-3xl font-bold text-foreground">
            {state.attempts.length} / {state.maxAttempts}
          </dd>
          <dd className="text-xs text-muted-foreground">{won ? "solved" : "no solve"}</dd>
        </div>
      </dl>

      <p className="mt-4 text-center font-mono text-xl tracking-[0.2em]" aria-hidden="true">
        {game.getShareResult(state).squares}
      </p>

      {!practice ? (
        <div className="mt-4 flex justify-center">
          <StreakBadge days={streak} label="day Randodle streak" />
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={async () => {
            const outcome = await shareText(text);
            setStatus(
              outcome === "shared"
                ? "Result shared."
                : outcome === "copied"
                  ? "Result copied to your clipboard."
                  : "Sharing wasn't possible — you can select and copy the text below.",
            );
          }}
          className="min-h-13 flex-1 rounded-xl bg-accent px-5 text-base font-bold uppercase tracking-wide text-accent-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
        >
          Share result
        </button>
        <button
          type="button"
          onClick={async () => {
            const outcome = await copyText(text);
            setStatus(outcome === "copied" ? "Result copied to your clipboard." : "Copying failed.");
          }}
          className="min-h-13 flex-1 rounded-xl border border-border bg-transparent px-5 text-base font-bold uppercase tracking-wide text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
        >
          Copy result
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-5 text-center text-sm text-muted-foreground">
        {status}
      </p>

      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-muted px-4 py-3 text-center text-sm text-muted-foreground">
        {text}
      </pre>

      {practice ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {onPlayAgain ? (
            <button
              type="button"
              onClick={onPlayAgain}
              className="min-h-13 flex-1 rounded-xl border border-border px-5 text-sm font-bold uppercase tracking-wide text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Play again
            </button>
          ) : null}
          <Link
            to="/play"
            className="min-h-13 flex-1 rounded-xl border border-border px-5 text-center text-sm font-bold uppercase leading-[3.25rem] tracking-wide text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Today's Randodle
          </Link>
        </div>
      ) : (
        <div className="mt-8 border-t border-border pt-6">
          <Countdown />
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Come back tomorrow for a new game.
          </p>
        </div>
      )}
    </section>
  );
}
