import { useEffect, useState } from "react";
import {
  HIGHER_LOWER_ITEMS,
  HIGHER_LOWER_PUZZLES,
  type HigherLowerItem,
  type HigherLowerPuzzle,
} from "@/data/higherLower";
import { createState, isComplete, puzzleForDay } from "@/engine/gameEngine";
import type { Attempt, GameModule, GamePlayProps, GameState } from "@/types/game";

const ID = "higher-lower";
const ROUNDS = 5;
const POINTS_PER_ROUND = 100;
/** Correct rounds needed for the day to count as a win for the streak. */
const WIN_THRESHOLD = 3;

const itemById = (id: string | undefined): HigherLowerItem =>
  (HIGHER_LOWER_ITEMS.find((i) => i.id === id) ?? HIGHER_LOWER_ITEMS[0]) as HigherLowerItem;

function formatPopulation(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

const correctCount = (state: GameState) => state.attempts.filter((a) => a.tone === "correct").length;

function ItemCard({ item, value, label }: { item: HigherLowerItem; value: string; label: string }) {
  return (
    <div className="flex-1 rounded-2xl border border-border bg-card px-4 py-5 text-center shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-4xl" aria-hidden="true">{item.flag}</p>
      <p className="mt-2 text-xl font-bold text-foreground">{item.name}</p>
      <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-accent">{value}</p>
    </div>
  );
}

function HigherLowerPlay({ puzzle, state, onSubmit }: GamePlayProps<HigherLowerPuzzle>) {
  // Round just answered, kept on screen until the player moves on.
  const [revealed, setRevealed] = useState<number | null>(null);
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
        Round <span className="text-foreground">{showing + 1}</span> / {ROUNDS} · {puzzle.category} · Score{" "}
        <span className="text-foreground">{correctCount(state) * POINTS_PER_ROUND}</span>
      </p>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <ItemCard item={reference} label="Known" value={formatPopulation(reference.population)} />
        <p className="text-center font-display text-lg font-extrabold text-muted-foreground">VS</p>
        <ItemCard
          item={challenger}
          label="Higher or lower?"
          value={result ? formatPopulation(challenger.population) : "???"}
        />
      </div>

      {result ? (
        <div className="space-y-4 text-center">
          <p role="status" className="text-lg font-bold text-foreground">
            {result.tone === "correct" ? "✅ Correct! +100" : "❌ Wrong. +0"}
          </p>
          <button
            type="button"
            onClick={() => setRevealed(null)}
            className={`${big} w-full bg-accent text-accent-foreground shadow-glow hover:brightness-110`}
          >
            Next round
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button type="button" onClick={() => choose("higher")} className={`${big} bg-accent text-accent-foreground hover:brightness-110`}>
            ▲ Higher
          </button>
          <button type="button" onClick={() => choose("lower")} className={`${big} border border-border bg-muted text-foreground hover:bg-card`}>
            ▼ Lower
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
  maxAttempts: ROUNDS,
  maxScore: ROUNDS * POINTS_PER_ROUND,

  puzzles: HIGHER_LOWER_PUZZLES,
  getPuzzle: (id) => HIGHER_LOWER_PUZZLES.find((p) => p.id === id),
  getPuzzleForDay: (dayIndex) => puzzleForDay(HIGHER_LOWER_PUZZLES, dayIndex),

  initialize: (puzzle) => createState(ID, puzzle.id, ROUNDS),

  submitAnswer(state, puzzle, answer) {
    const choice = answer.toLowerCase();
    if (choice !== "higher" && choice !== "lower") {
      return { state, message: "Choose Higher or Lower." };
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
      message: `${challenger.name}: ${formatPopulation(challenger.population)} — ${correct ? "correct" : "wrong"}.`,
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
