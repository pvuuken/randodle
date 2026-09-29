import { useEffect, useState } from "react";
import { FLAG_COUNTRIES, FLAG_PUZZLES, type FlagCountry, type FlagPuzzle } from "@/data/flags";
import { createState, isComplete, normalise, puzzleForDay } from "@/engine/gameEngine";
import type { Attempt, GameModule, GamePlayProps, GameState } from "@/types/game";
import { GuessForm } from "@/components/game/GuessForm";

const ID = "flag";
const ROUNDS = 5;
const TRIES = 3;
const POINTS = [100, 75, 50];
/** Flags guessed needed for the day to count as a win for the streak. */
const WIN_THRESHOLD = 3;

const countryByCode = (code: string | undefined): FlagCountry =>
  (FLAG_COUNTRIES.find((x) => x.code === code) ?? FLAG_COUNTRIES[0]) as FlagCountry;

function matchCountry(input: string): FlagCountry | undefined {
  const n = normalise(input);
  return FLAG_COUNTRIES.find((x) => normalise(x.name) === n || x.aliases?.some((a) => normalise(a) === n));
}

interface Round {
  guesses: Attempt[];
  solved: boolean;
  done: boolean;
  points: number;
}

/** Splits the flat attempt list into rounds: a round ends on a correct guess or after 3 tries. */
function toRounds(state: GameState): Round[] {
  const rounds: Round[] = [];
  let cur: Attempt[] = [];
  for (const a of state.attempts) {
    cur.push(a);
    if (a.tone === "correct" || cur.length >= TRIES) {
      const solved = a.tone === "correct";
      rounds.push({ guesses: cur, solved, done: true, points: solved ? (POINTS[cur.length - 1] ?? 0) : 0 });
      cur = [];
    }
  }
  if (cur.length) rounds.push({ guesses: cur, solved: false, done: false, points: 0 });
  return rounds;
}

const finishedRounds = (state: GameState) => toRounds(state).filter((r) => r.done);
const score = (state: GameState) => finishedRounds(state).reduce((s, r) => s + r.points, 0);

function FlagPlay({ puzzle, state, onSubmit }: GamePlayProps<FlagPuzzle>) {
  const rounds = toRounds(state);
  const finished = rounds.filter((r) => r.done).length;
  // Last finished round stays on screen until the player moves on.
  const [reveal, setReveal] = useState<number | null>(null);
  useEffect(() => setReveal(null), [puzzle.id]);

  const index = reveal ?? finished;
  const country = countryByCode(puzzle.countries[index]);
  const round = rounds[index];
  const shown = reveal !== null ? round : undefined;
  const wrong = round && !round.done ? round.guesses.length : 0;

  const submit = (value: string) => {
    const before = finished;
    onSubmit(value);
    // Detect round end from the answer itself so we can show the reveal.
    const guess = matchCountry(value);
    if (guess?.code === country.code || wrong + 1 >= TRIES) setReveal(before);
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-sm font-semibold text-muted-foreground">
        Round <span className="text-foreground">{index + 1}</span> / {ROUNDS} · Score{" "}
        <span className="text-foreground">{score(state)}</span>
      </p>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <img
          src={country.flag}
          alt="Flag to identify"
          className="mx-auto aspect-[4/3] w-full max-w-sm rounded-lg border border-border object-cover"
        />
      </div>

      {shown ? (
        <div className="space-y-4 text-center">
          <p role="status" className="text-lg font-bold text-foreground">
            {shown.solved ? `✅ Correct! +${shown.points}` : `❌ Out of attempts — it was ${country.name}.`}
          </p>
          <button
            type="button"
            onClick={() => setReveal(null)}
            className="min-h-14 w-full rounded-xl bg-accent px-5 text-lg font-extrabold uppercase tracking-[0.12em] text-accent-foreground shadow-glow transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
          >
            Next flag
          </button>
        </div>
      ) : (
        <>
          <p className="text-center text-sm font-semibold text-foreground">
            Attempts remaining: {TRIES - wrong}
            {wrong > 0 ? <span className="text-destructive"> · ❌ Not that one</span> : null}
          </p>
          <GuessForm
            key={`${index}-${wrong}`}
            label="Which country is this?"
            placeholder="Search for a country"
            suggestions={FLAG_COUNTRIES.map((x) => x.name)}
            onSubmit={submit}
          />
          {round && round.guesses.length > 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Tried: {round.guesses.map((g) => g.value).join(", ")}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}

export const flagGame: GameModule<FlagPuzzle> = {
  id: ID,
  name: "Guess the Flag",
  category: "Geography",
  emoji: "🚩",
  prompt: "Five flags, three tries each. Name the country.",
  howToPlay:
    "Identify 5 flags. You get 3 attempts per flag: 100 points on the first try, 75 on the second, 50 on the third. After 3 misses the answer is revealed.",
  maxAttempts: ROUNDS * TRIES,
  maxScore: ROUNDS * 100,

  puzzles: FLAG_PUZZLES,
  getPuzzle: (id) => FLAG_PUZZLES.find((p) => p.id === id),
  getPuzzleForDay: (dayIndex) => puzzleForDay(FLAG_PUZZLES, dayIndex),
  getAnswerKey: (puzzle) => puzzle.countries.map((code) => countryByCode(code).name).join(" → "),

  initialize: (puzzle) => createState(ID, puzzle.id, ROUNDS * TRIES),

  submitAnswer(state, puzzle, answer) {
    const guess = matchCountry(answer);
    if (!guess) return { state, message: "Pick a country from the list." };
    const target = countryByCode(puzzle.countries[finishedRounds(state).length]);
    const correct = guess.code === target.code;
    const attempts: Attempt[] = [
      ...state.attempts,
      { value: guess.name, tone: correct ? "correct" : "wrong", feedback: correct ? "Correct" : "Wrong" },
    ];
    const next: GameState = { ...state, attempts };
    const done = finishedRounds(next);
    if (done.length >= ROUNDS) {
      next.status = done.filter((r) => r.solved).length >= WIN_THRESHOLD ? "won" : "lost";
    }
    const roundOver = done.length > finishedRounds(state).length;
    return {
      state: next,
      message: correct ? "Correct!" : roundOver ? `It was ${target.name}.` : `Not ${guess.name}.`,
    };
  },

  isComplete,
  calculateScore: score,
  getShareResult: (state) => ({
    squares: finishedRounds(state)
      .map((r) => (r.solved ? "🟩" : "🟥"))
      .join(" "),
    progress: `${score(state)}/${ROUNDS * 100}`,
  }),
  Play: FlagPlay,
};
