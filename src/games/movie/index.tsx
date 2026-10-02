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
import { isAnswerCorrect } from "@/services/answerService";
import type { GameModule, GamePlayProps } from "@/types/game";
import { AttemptCounter, AttemptTrail } from "@/components/game/AttemptTrail";
import { PosterReveal, revealScale } from "./PosterReveal";
import { ClueList } from "@/components/game/ClueList";
import type { GameState } from "@/types/game";
import { GuessForm } from "@/components/game/GuessForm";
import { getLanguage, useLanguage } from "@/i18n";

const TEXT = {
  en: {
    label: "Which film is it?",
    placeholder: "Search a title…",
    help: "Every wrong guess reveals more of the poster and a new clue.",
    poster: "Today's movie poster",
    noPoster: "Poster unavailable",
    correct: "Correct — that's today's film.",
    lost: (a: string) => `Out of guesses — it was ${a}.`,
    close: "Close — you've got part of the title. More of the poster is revealed.",
    wrong: "Not quite. More of the poster is revealed.",
  },
  nl: {
    label: "Welke film is het?",
    placeholder: "Zoek een titel…",
    help: "Elke foute gok toont meer van de affiche en een nieuwe hint.",
    poster: "Filmaffiche van vandaag",
    noPoster: "Affiche niet beschikbaar",
    correct: "Juist — dat is de film van vandaag.",
    lost: (a: string) => `Geen pogingen meer — het was ${a}.`,
    close: "Bijna — je hebt een deel van de titel. Er wordt meer van de affiche getoond.",
    wrong: "Net niet. Er wordt meer van de affiche getoond.",
  },
};

/** Clues shown: 1 at start, +1 per wrong guess (max 5); all 5 once lost. Correct guesses add none. */
export function visibleClueCount(state: GameState, total = 5): number {
  if (state.status === "lost") return total;
  const wrong = state.attempts.filter((a) => a.tone !== "correct").length;
  return Math.min(wrong + 1, total);
}

const ID = "movie";
const MAX_ATTEMPTS = 6;

function MoviePlay({ puzzle, state, onSubmit }: GamePlayProps<MoviePuzzle>) {
  const done = state.status !== "playing";
  const tx = TEXT[useLanguage()];
  return (
    <div className="space-y-6">
      <PosterReveal src={puzzle.posterUrl} mask={puzzle.posterMask} scale={revealScale(state)} alt={tx.poster} fallback={tx.noPoster} />
      <ClueList clues={puzzle.clues} revealed={visibleClueCount(state, puzzle.clues.length)} />
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
  prompt: "Can you identify today's movie from a zoomed-in poster?",
  howToPlay: "The poster starts zoomed in. Each wrong guess zooms out — six attempts in total.",
  locales: {
    nl: {
      name: "Raad de film",
      prompt: "Herken jij de film van vandaag aan een ingezoomde affiche?",
      howToPlay: "De affiche start ingezoomd. Elke foute gok zoomt verder uit — zes pogingen in totaal.",
    },
  },
  maxAttempts: MAX_ATTEMPTS,

  puzzles: MOVIE_PUZZLES,
  getPuzzle: (id) => MOVIE_PUZZLES.find((p) => p.id === id),
  getPuzzleForDay: (dayIndex) => puzzleForDay(MOVIE_PUZZLES, dayIndex),

  initialize: (puzzle) => createState(ID, puzzle.id, MAX_ATTEMPTS),

  submitAnswer(state, puzzle, answer) {
    const tx = TEXT[getLanguage()];
    if (isAnswerCorrect(answer, puzzle.answer, puzzle.aliases)) {
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
          ? tx.lost(puzzle.title[getLanguage()])
          : sharesWord
            ? tx.close
            : tx.wrong,
    };
  },

  getLossAnswer: (puzzle) => puzzle.title[getLanguage()],
  getAnswerReview: (puzzle, state, lang) => [
    {
      question: lang === "nl" ? "Welke film is dit?" : "Which movie is this?",
      image: puzzle.posterUrl,
      yourAnswer: state.attempts.map((a) => a.value).join(" → ") || undefined,
      correctAnswer: puzzle.title[lang],
      correct: state.status === "won",
    },
  ],
  isComplete,
  calculateScore: standardScore,
  getShareResult: standardShare,
  Play: MoviePlay,
};
