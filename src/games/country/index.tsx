import { COUNTRY_NAMES, COUNTRY_PUZZLES, type CountryPuzzle } from "@/data/countries";
import {
  createState,
  isComplete,
  normalise,
  pushAttempt,
  puzzleForDay,
  standardShare,
} from "@/engine/gameEngine";
import { standardScore } from "@/services/scoreService";
import type { GameModule, GamePlayProps } from "@/types/game";
import { AttemptCounter, AttemptTrail } from "@/components/game/AttemptTrail";
import { ClueList } from "@/components/game/ClueList";
import { GuessForm } from "@/components/game/GuessForm";

const ID = "country";
const MAX_ATTEMPTS = 5;

function CountryPlay({ puzzle, state, onSubmit }: GamePlayProps<CountryPuzzle>) {
  const done = state.status !== "playing";
  return (
    <div className="space-y-6">
      <ClueList clues={puzzle.clues} revealed={state.attempts.length + 1} />
      <AttemptCounter state={state} />
      <GuessForm
        label="Which country is it?"
        placeholder="Type a country…"
        suggestions={COUNTRY_NAMES}
        disabled={done}
        helpText="Clues get easier with every wrong guess."
        onSubmit={onSubmit}
      />
      <AttemptTrail state={state} />
    </div>
  );
}

function continentOf(puzzle: CountryPuzzle): string {
  return puzzle.clues.find((c) => c.label === "Continent")?.value ?? "";
}

export const countryGame: GameModule<CountryPuzzle> = {
  id: ID,
  name: "Guess the Country",
  category: "Geography",
  emoji: "🌍",
  prompt: "Five clues, five guesses. Which country is it?",
  howToPlay: "You get one clue to start. Each wrong guess reveals an easier clue — five attempts in total.",
  maxAttempts: MAX_ATTEMPTS,

  puzzles: COUNTRY_PUZZLES,
  getPuzzle: (id) => COUNTRY_PUZZLES.find((p) => p.id === id),
  getPuzzleForDay: (dayIndex) => puzzleForDay(COUNTRY_PUZZLES, dayIndex),

  initialize: (puzzle) => createState(ID, puzzle.id, MAX_ATTEMPTS),

  submitAnswer(state, puzzle, answer) {
    const guess = normalise(answer);
    const accepted = [puzzle.answer, ...(puzzle.aliases ?? [])].map(normalise);
    if (accepted.includes(guess)) {
      return {
        state: pushAttempt(state, { value: answer, tone: "correct", feedback: "Correct" }),
        message: "Correct — nicely placed.",
      };
    }

    // "Close" = right continent, which is a spoiler-free nudge.
    const continent = continentOf(puzzle);
    const guessedPuzzle = COUNTRY_PUZZLES.find((p) => normalise(p.answer) === guess);
    const sameContinent = Boolean(guessedPuzzle && continentOf(guessedPuzzle) === continent);

    const next = pushAttempt(state, {
      value: answer,
      tone: sameContinent ? "close" : "wrong",
      feedback: sameContinent ? "Right continent" : "Wrong country",
    });
    return {
      state: next,
      message:
        next.status === "lost"
          ? `Out of guesses — it was ${puzzle.answer}.`
          : sameContinent
            ? "Right part of the world. New clue unlocked."
            : "Not it. A new clue is unlocked.",
    };
  },

  isComplete,
  calculateScore: standardScore,
  getShareResult: standardShare,
  Play: CountryPlay,
};
