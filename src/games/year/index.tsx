import { YEAR_PUZZLES, YEAR_RANGE, type YearPuzzle } from "@/data/years";
import {
  createState,
  isComplete,
  pushAttempt,
  puzzleForDay,
  standardShare,
} from "@/engine/gameEngine";
import type { GameModule, GamePlayProps, GameState } from "@/types/game";
import { AttemptCounter, AttemptTrail } from "@/components/game/AttemptTrail";
import { GuessForm } from "@/components/game/GuessForm";

const ID = "year";
const MAX_ATTEMPTS = 5;

function YearPlay({ puzzle, state, onSubmit }: GamePlayProps<YearPuzzle>) {
  const done = state.status !== "playing";
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card px-5 py-6 text-center shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <span aria-hidden="true">📅 </span>The event
        </p>
        <p className="mt-2 text-2xl font-bold leading-snug text-foreground">{puzzle.event}</p>
        {puzzle.hint && state.attempts.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{puzzle.hint}</p>
        ) : null}
      </div>
      <AttemptCounter state={state} />
      <GuessForm
        label="Which year?"
        placeholder="e.g. 1994"
        inputMode="numeric"
        disabled={done}
        helpText={`Answers fall between ${YEAR_RANGE.min} and ${YEAR_RANGE.max}. You'll be told if you're too high or too low.`}
        onSubmit={onSubmit}
      />
      <AttemptTrail state={state} />
    </div>
  );
}

/** Closer guesses keep more points than the flat platform curve. */
function yearScore(state: GameState): number {
  if (state.status !== "won") return 0;
  return Math.max(100 - (state.attempts.length - 1) * 15, 25);
}

export const yearGame: GameModule<YearPuzzle> = {
  id: ID,
  name: "Guess the Year",
  category: "History",
  emoji: "📅",
  prompt: "One event, five guesses. Pin down the year.",
  howToPlay: "Guess the year the event happened. After each guess you learn whether you were too high or too low.",
  maxAttempts: MAX_ATTEMPTS,

  puzzles: YEAR_PUZZLES,
  getPuzzle: (id) => YEAR_PUZZLES.find((p) => p.id === id),
  getPuzzleForDay: (dayIndex) => puzzleForDay(YEAR_PUZZLES, dayIndex),

  initialize: (puzzle) => createState(ID, puzzle.id, MAX_ATTEMPTS),

  submitAnswer(state, puzzle, answer) {
    const trimmed = answer.trim();
    if (!/^\d{1,4}$/.test(trimmed)) {
      return { state, message: "Enter a year as a number, for example 1994." };
    }
    const guess = Number.parseInt(trimmed, 10);
    if (guess < YEAR_RANGE.min || guess > YEAR_RANGE.max) {
      return { state, message: `Enter a year between ${YEAR_RANGE.min} and ${YEAR_RANGE.max}.` };
    }
    if (guess === puzzle.answer) {
      return {
        state: pushAttempt(state, { value: String(guess), tone: "correct", feedback: "Correct" }),
        message: "Exactly right.",
      };
    }
    const diff = Math.abs(guess - puzzle.answer);
    const direction = guess > puzzle.answer ? "Too high ↑" : "Too low ↓";
    const next = pushAttempt(state, {
      value: String(guess),
      tone: diff <= 5 ? "close" : "wrong",
      feedback: diff <= 5 ? `${direction} · within 5 years` : direction,
    });
    return {
      state: next,
      message:
        next.status === "lost"
          ? `Out of guesses — it was ${puzzle.answer}.`
          : `${direction}${diff <= 5 ? " — and very close." : ""}`,
    };
  },

  getLossAnswer: (puzzle) => String(puzzle.answer),
  isComplete,
  calculateScore: yearScore,
  getShareResult: standardShare,
  Play: YearPlay,
};
