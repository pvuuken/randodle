import { COUNTRY_NAMES, COUNTRY_NAMES_NL, COUNTRY_PUZZLES, type CountryPuzzle } from "@/data/countries";
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
import { getLanguage, useLanguage, type Language } from "@/i18n";

const TEXT = {
  en: {
    label: "Which country is it?",
    placeholder: "Type a country…",
    help: "Clues get easier with every wrong guess.",
    correct: "Correct — nicely placed.",
    lost: (a: string) => `Out of guesses — it was ${a}.`,
    close: "Right part of the world. New clue unlocked.",
    wrong: "Not it. A new clue is unlocked.",
  },
  nl: {
    label: "Welk land is het?",
    placeholder: "Typ een land…",
    help: "De hints worden makkelijker na elke foute gok.",
    correct: "Juist — goed geplaatst.",
    lost: (a: string) => `Geen pogingen meer — het was ${a}.`,
    close: "Juiste deel van de wereld. Nieuwe hint vrijgespeeld.",
    wrong: "Dat is het niet. Er is een nieuwe hint vrijgespeeld.",
  },
};

const displayName = (name: string, lang: Language) => (lang === "nl" ? (COUNTRY_NAMES_NL[name] ?? name) : name);

/** Maps a guess in any supported language to the English name used by the data. */
const toEnglish = (guess: string) =>
  COUNTRY_NAMES.find((n) => normalise(n) === guess || normalise(COUNTRY_NAMES_NL[n] ?? "") === guess);

const ID = "country";
const MAX_ATTEMPTS = 5;

function CountryPlay({ puzzle, state, onSubmit }: GamePlayProps<CountryPuzzle>) {
  const done = state.status !== "playing";
  const lang = useLanguage();
  const tx = TEXT[lang];
  return (
    <div className="space-y-6">
      <ClueList clues={puzzle.clues} revealed={state.attempts.length + 1} />
      <AttemptCounter state={state} />
      <GuessForm
        label={tx.label}
        placeholder={tx.placeholder}
        suggestions={COUNTRY_NAMES.map((n) => displayName(n, lang))}
        disabled={done}
        helpText={tx.help}
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
  locales: {
    nl: {
      name: "Raad het land",
      category: "Aardrijkskunde",
      prompt: "Vijf hints, vijf gokken. Welk land is het?",
      howToPlay: "Je start met één hint. Elke foute gok onthult een makkelijkere hint — vijf pogingen in totaal.",
    },
  },
  maxAttempts: MAX_ATTEMPTS,

  puzzles: COUNTRY_PUZZLES,
  getPuzzle: (id) => COUNTRY_PUZZLES.find((p) => p.id === id),
  getPuzzleForDay: (dayIndex) => puzzleForDay(COUNTRY_PUZZLES, dayIndex),

  initialize: (puzzle) => createState(ID, puzzle.id, MAX_ATTEMPTS),

  submitAnswer(state, puzzle, answer) {
    const lang = getLanguage();
    const tx = TEXT[lang];
    const english = toEnglish(normalise(answer));
    const guess = normalise(english ?? answer);
    const accepted = [puzzle.answer, ...(puzzle.aliases ?? [])].map(normalise);
    if (accepted.includes(guess)) {
      return {
        state: pushAttempt(state, { value: answer, tone: "correct", feedback: "Correct" }),
        message: tx.correct,
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
          ? tx.lost(displayName(puzzle.answer, lang))
          : sameContinent
            ? tx.close
            : tx.wrong,
    };
  },

  getLossAnswer: (puzzle) => displayName(puzzle.answer, getLanguage()),
  isComplete,
  calculateScore: standardScore,
  getShareResult: standardShare,
  Play: CountryPlay,
};
