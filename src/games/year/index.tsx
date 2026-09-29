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
import { getLanguage, pickLocale, useLanguage } from "@/i18n";

const TEXT = {
  en: {
    event: "The event",
    label: "Which year?",
    placeholder: "e.g. 1994",
    help: (min: number, max: number) =>
      `Answers fall between ${min} and ${max}. You'll be told if you're too high or too low.`,
    notNumber: "Enter a year as a number, for example 1994.",
    range: (min: number, max: number) => `Enter a year between ${min} and ${max}.`,
    exact: "Exactly right.",
    high: "Too high ↑",
    low: "Too low ↓",
    veryClose: " — and very close.",
    lost: (a: number) => `Out of guesses — it was ${a}.`,
  },
  nl: {
    event: "De gebeurtenis",
    label: "Welk jaar?",
    placeholder: "bv. 1994",
    help: (min: number, max: number) =>
      `Antwoorden liggen tussen ${min} en ${max}. Je hoort of je te hoog of te laag zit.`,
    notNumber: "Vul een jaartal in als getal, bijvoorbeeld 1994.",
    range: (min: number, max: number) => `Vul een jaartal in tussen ${min} en ${max}.`,
    exact: "Precies goed.",
    high: "Te hoog ↑",
    low: "Te laag ↓",
    veryClose: " — en heel dichtbij.",
    lost: (a: number) => `Geen pogingen meer — het was ${a}.`,
  },
};

const ID = "year";
const MAX_ATTEMPTS = 5;

function YearPlay({ puzzle: base, state, onSubmit }: GamePlayProps<YearPuzzle>) {
  const done = state.status !== "playing";
  const lang = useLanguage();
  const tx = TEXT[lang];
  const puzzle = pickLocale(base, base.translations, lang);
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card px-5 py-6 text-center shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <span aria-hidden="true">📅 </span>{tx.event}
        </p>
        <p className="mt-2 text-2xl font-bold leading-snug text-foreground">{puzzle.event}</p>
        {puzzle.hint && state.attempts.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{puzzle.hint}</p>
        ) : null}
      </div>
      <AttemptCounter state={state} />
      <GuessForm
        label={tx.label}
        placeholder={tx.placeholder}
        inputMode="numeric"
        disabled={done}
        helpText={tx.help(YEAR_RANGE.min, YEAR_RANGE.max)}
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
  locales: {
    nl: {
      name: "Raad het jaar",
      category: "Geschiedenis",
      prompt: "Eén gebeurtenis, vijf gokken. Bepaal het jaar.",
      howToPlay: "Raad in welk jaar de gebeurtenis plaatsvond. Na elke gok hoor je of je te hoog of te laag zat.",
    },
  },
  maxAttempts: MAX_ATTEMPTS,

  puzzles: YEAR_PUZZLES,
  getPuzzle: (id) => YEAR_PUZZLES.find((p) => p.id === id),
  getPuzzleForDay: (dayIndex) => puzzleForDay(YEAR_PUZZLES, dayIndex),

  initialize: (puzzle) => createState(ID, puzzle.id, MAX_ATTEMPTS),

  submitAnswer(state, puzzle, answer) {
    const tx = TEXT[getLanguage()];
    const trimmed = answer.trim();
    if (!/^\d{1,4}$/.test(trimmed)) {
      return { state, message: tx.notNumber };
    }
    const guess = Number.parseInt(trimmed, 10);
    if (guess < YEAR_RANGE.min || guess > YEAR_RANGE.max) {
      return { state, message: tx.range(YEAR_RANGE.min, YEAR_RANGE.max) };
    }
    if (guess === puzzle.answer) {
      return {
        state: pushAttempt(state, { value: String(guess), tone: "correct", feedback: "Correct" }),
        message: tx.exact,
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
          ? tx.lost(puzzle.answer)
          : `${guess > puzzle.answer ? tx.high : tx.low}${diff <= 5 ? tx.veryClose : ""}`,
    };
  },

  getLossAnswer: (puzzle) => String(puzzle.answer),
  isComplete,
  calculateScore: yearScore,
  getShareResult: standardShare,
  Play: YearPlay,
};
