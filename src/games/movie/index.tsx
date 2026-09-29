import { MOVIE_PUZZLES, MOVIE_TITLES, type MoviePuzzle } from "@/data/movies";
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
import { getLanguage, useLanguage } from "@/i18n";

const TEXT = {
  en: {
    label: "Which film is it?",
    placeholder: "Search a title…",
    help: "Every wrong guess unlocks one more clue.",
    correct: "Correct — that's today's film.",
    lost: (a: string) => `Out of guesses — it was ${a}.`,
    close: "Close — you've got part of the title. New clue unlocked.",
    wrong: "Not quite. A new clue is unlocked.",
  },
  nl: {
    label: "Welke film is het?",
    placeholder: "Zoek een titel…",
    help: "Elke foute gok geeft je een extra hint.",
    correct: "Juist — dat is de film van vandaag.",
    lost: (a: string) => `Geen pogingen meer — het was ${a}.`,
    close: "Bijna — je hebt een deel van de titel. Nieuwe hint vrijgespeeld.",
    wrong: "Net niet. Er is een nieuwe hint vrijgespeeld.",
  },
};

const ID = "movie";
const MAX_ATTEMPTS = 6;

function MoviePlay({ puzzle, state, onSubmit }: GamePlayProps<MoviePuzzle>) {
  const done = state.status !== "playing";
  const tx = TEXT[useLanguage()];
  return (
    <div className="space-y-6">
      <ClueList clues={puzzle.clues} revealed={state.attempts.length + 1} />
      <AttemptCounter state={state} />
      <GuessForm
        label={tx.label}
        placeholder={tx.placeholder}
        suggestions={MOVIE_TITLES}
        disabled={done}
        helpText={tx.help}
        onSubmit={onSubmit}
      />
      <AttemptTrail state={state} />
    </div>
  );
}

export const movieGame: GameModule<MoviePuzzle> = {
  id: ID,
  name: "Guess the Movie",
  category: "Film",
  emoji: "🎬",
  prompt: "Can you identify today's movie from a single quote?",
  howToPlay: "You start with one quote. Each wrong guess reveals another clue — six attempts in total.",
  locales: {
    nl: {
      name: "Raad de film",
      prompt: "Herken jij de film van vandaag aan één enkel citaat?",
      howToPlay: "Je begint met één citaat. Elke foute gok onthult een extra hint — zes pogingen in totaal.",
    },
  },
  maxAttempts: MAX_ATTEMPTS,

  puzzles: MOVIE_PUZZLES,
  getPuzzle: (id) => MOVIE_PUZZLES.find((p) => p.id === id),
  getPuzzleForDay: (dayIndex) => puzzleForDay(MOVIE_PUZZLES, dayIndex),

  initialize: (puzzle) => createState(ID, puzzle.id, MAX_ATTEMPTS),

  submitAnswer(state, puzzle, answer) {
    const tx = TEXT[getLanguage()];
    const guess = normalise(answer);
    const target = normalise(puzzle.answer);
    if (guess === target) {
      return {
        state: pushAttempt(state, { value: answer, tone: "correct", feedback: "Correct" }),
        message: tx.correct,
      };
    }
    const sharesWord = puzzle.answer
      .toLowerCase()
      .split(/\s+/)
      .some((word) => word.length > 3 && normalise(answer).includes(normalise(word)));
    const next = pushAttempt(state, {
      value: answer,
      tone: sharesWord ? "close" : "wrong",
      feedback: sharesWord ? "Part of the title" : "Not this one",
    });
    return {
      state: next,
      message:
        next.status === "lost"
          ? tx.lost(puzzle.answer)
          : sharesWord
            ? tx.close
            : tx.wrong,
    };
  },

  getLossAnswer: (puzzle) => puzzle.answer,
  isComplete,
  calculateScore: standardScore,
  getShareResult: standardShare,
  Play: MoviePlay,
};
