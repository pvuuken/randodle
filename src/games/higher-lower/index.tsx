import { useEffect, useState } from "react";
import {
  HIGHER_LOWER_ITEMS,
  HIGHER_LOWER_PUZZLES,
  getHigherLowerItem,
  getHigherLowerMetric,
  type HigherLowerItem,
  type HigherLowerPuzzle,
} from "@/data/higherLower";
import { createState, isComplete, puzzleForDay } from "@/engine/gameEngine";
import type { Attempt, GameModule, GamePlayProps, GameState } from "@/types/game";
import { getLanguage, useLanguage, type Language } from "@/i18n";

const TEXT = {
  en: {
    round: "Round",
    score: "Score",
    known: "Known",
    guess: "Higher or lower?",
    correct: "✅ Correct! +100",
    wrong: "❌ Wrong. +0",
    next: "Next round",
    higher: "▲ Higher",
    lower: "▼ Lower",
    choose: "Choose Higher or Lower.",
    verdict: (ok: boolean) => (ok ? "correct" : "wrong"),
  },
  nl: {
    round: "Ronde",
    score: "Score",
    known: "Bekend",
    guess: "Hoger of lager?",
    correct: "✅ Juist! +100",
    wrong: "❌ Fout. +0",
    next: "Volgende ronde",
    higher: "▲ Hoger",
    lower: "▼ Lager",
    choose: "Kies Hoger of Lager.",
    verdict: (ok: boolean) => (ok ? "juist" : "fout"),
  },
};

const ID = "higher-lower";
const ROUNDS = 5;
const POINTS_PER_ROUND = 100;
/** Correct rounds needed for the day to count as a win for the streak. */
const WIN_THRESHOLD = 3;

const itemById = (id: string | undefined): HigherLowerItem =>
  (getHigherLowerItem(id) ?? HIGHER_LOWER_ITEMS[0]) as HigherLowerItem;

/** Value of the puzzle's metric — the engine never assumes which metric it is. */
const valueOf = (item: HigherLowerItem, metricId: string): number => item.metrics[metricId] ?? 0;

function formatValue(n: number, metricId: string): string {
  const unit = getHigherLowerMetric(metricId)?.unit;
  let s: string;
  if (n >= 1_000_000) s = `${(n / 1_000_000).toFixed(1)}M`;
  else if (n >= 1_000) s = `${Math.round(n / 1_000)}K`;
  else s = String(n);
  return unit ? `${s} ${unit}` : s;
}

const itemName = (item: HigherLowerItem, lang: Language) => item.name[lang] ?? item.name.en;

const correctCount = (state: GameState) => state.attempts.filter((a) => a.tone === "correct").length;

function ItemCard({ item, value, label }: { item: HigherLowerItem; value: string; label: string }) {
  const lang = useLanguage();
  const emoji = item.metadata?.emoji;
  return (
    <div className="flex-1 rounded-2xl border border-border bg-card px-4 py-5 text-center shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      {emoji ? (
        <p className="mt-2 text-4xl" aria-hidden="true">{emoji}</p>
      ) : item.image ? (
        <img src={item.image.url} alt="" className="mx-auto mt-2 h-10 w-auto rounded" />
      ) : null}
      <p className="mt-2 text-xl font-bold text-foreground">{itemName(item, lang)}</p>
      <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-accent">{value}</p>
    </div>
  );
}


function HigherLowerPlay({ puzzle, state, onSubmit }: GamePlayProps<HigherLowerPuzzle>) {
  // Round just answered, kept on screen until the player moves on.
  const [revealed, setRevealed] = useState<number | null>(null);
  const tx = TEXT[useLanguage()];
  const answered = state.attempts.length;
  useEffect(() => setRevealed(null), [puzzle.id]);

  const showing = revealed ?? answered;
  const reference = itemById(puzzle.chain[showing]);
  const challenger = itemById(puzzle.chain[showing + 1]);
  const result: Attempt | undefined = revealed !== null ? state.attempts[revealed] : undefined;

  const choose = (choice: "higher" | "lower") => {
    setRevealed(answered);
    onSubmit(choice);
  };

  const big =
    "min-h-16 flex-1 rounded-xl px-5 text-lg font-extrabold uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]";

  return (
    <div className="space-y-6">
      <p className="text-center text-sm font-semibold text-muted-foreground">
        {tx.round} <span className="text-foreground">{showing + 1}</span> / {ROUNDS} ·{" "}
        {tx.categories[puzzle.category] ?? puzzle.category} · {tx.score}{" "}
        <span className="text-foreground">{correctCount(state) * POINTS_PER_ROUND}</span>
      </p>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <ItemCard item={reference} label={tx.known} value={formatPopulation(reference.population)} />
        <p className="text-center font-display text-lg font-extrabold text-muted-foreground">VS</p>
        <ItemCard
          item={challenger}
          label={tx.guess}
          value={result ? formatPopulation(challenger.population) : "???"}
        />
      </div>

      {result ? (
        <div className="space-y-4 text-center">
          <p role="status" className="text-lg font-bold text-foreground">
            {result.tone === "correct" ? tx.correct : tx.wrong}
          </p>
          <button
            type="button"
            onClick={() => setRevealed(null)}
            className={`${big} w-full bg-accent text-accent-foreground shadow-glow hover:brightness-110`}
          >
            {tx.next}
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button type="button" onClick={() => choose("higher")} className={`${big} bg-accent text-accent-foreground hover:brightness-110`}>
            {tx.higher}
          </button>
          <button type="button" onClick={() => choose("lower")} className={`${big} border border-border bg-muted text-foreground hover:bg-card`}>
            {tx.lower}
          </button>
        </div>
      )}
    </div>
  );
}

export const higherLowerGame: GameModule<HigherLowerPuzzle> = {
  id: ID,
  name: "Higher or Lower",
  category: "Comparison",
  emoji: "⚖️",
  prompt: "Five rounds. Is the next one higher or lower?",
  howToPlay:
    "You see a country's population and a second country with its value hidden. Guess whether it's higher or lower. The revealed country becomes the next reference. 5 rounds, 100 points per correct answer.",
  locales: {
    nl: {
      name: "Hoger of lager",
      category: "Vergelijking",
      prompt: "Vijf rondes. Is de volgende hoger of lager?",
      howToPlay:
        "Je ziet het inwonertal van een land en een tweede land waarvan de waarde verborgen is. Raad of die hoger of lager is. Het onthulde land wordt de nieuwe referentie. 5 rondes, 100 punten per juist antwoord.",
    },
  },
  maxAttempts: ROUNDS,
  maxScore: ROUNDS * POINTS_PER_ROUND,

  puzzles: HIGHER_LOWER_PUZZLES,
  getPuzzle: (id) => HIGHER_LOWER_PUZZLES.find((p) => p.id === id),
  getPuzzleForDay: (dayIndex) => puzzleForDay(HIGHER_LOWER_PUZZLES, dayIndex),

  initialize: (puzzle) => createState(ID, puzzle.id, ROUNDS),

  submitAnswer(state, puzzle, answer) {
    const tx = TEXT[getLanguage()];
    const choice = answer.toLowerCase();
    if (choice !== "higher" && choice !== "lower") {
      return { state, message: tx.choose };
    }
    const round = state.attempts.length;
    const reference = itemById(puzzle.chain[round]);
    const challenger = itemById(puzzle.chain[round + 1]);
    const isHigher = challenger.population > reference.population;
    const correct = (choice === "higher") === isHigher;

    const attempts: Attempt[] = [
      ...state.attempts,
      { value: choice, tone: correct ? "correct" : "wrong", feedback: correct ? "Correct" : "Wrong" },
    ];
    const done = attempts.length >= ROUNDS;
    const next: GameState = {
      ...state,
      attempts,
      status: done ? (attempts.filter((a) => a.tone === "correct").length >= WIN_THRESHOLD ? "won" : "lost") : "playing",
    };
    return {
      state: next,
      message: `${challenger.name}: ${formatPopulation(challenger.population)} — ${tx.verdict(correct)}.`,
    };
  },

  isComplete,
  calculateScore: (state) => correctCount(state) * POINTS_PER_ROUND,
  getShareResult: (state) => ({
    squares: state.attempts.map((a) => (a.tone === "correct" ? "🟩" : "🟥")).join(" "),
    progress: `${correctCount(state)}/${ROUNDS}\nScore: ${correctCount(state) * POINTS_PER_ROUND}`,
  }),
  Play: HigherLowerPlay,
};
