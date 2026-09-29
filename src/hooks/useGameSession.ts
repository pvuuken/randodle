import { useCallback, useEffect, useRef, useState } from "react";
import type { GameState, Puzzle, RegisteredGame } from "@/types/game";
import { sessionService } from "@/services/sessionService";
import { streakService, type StreakState } from "@/services/streakService";

interface Options {
  game: RegisteredGame;
  puzzle: Puzzle;
  dayKey: string;
  /** Test mode plays without touching the daily record. */
  persist?: boolean;
}

export interface GameSession {
  state: GameState;
  message: string;
  score: number;
  streak: StreakState;
  hydrated: boolean;
  submit: (answer: string) => void;
  restart: () => void;
  /** Test-mode helpers. */
  forceFinish: (outcome: "win" | "lose") => void;
}

export function useGameSession({ game, puzzle, dayKey, persist = true }: Options): GameSession {
  const [state, setState] = useState<GameState>(() => game.initialize(puzzle));
  const [message, setMessage] = useState("");
  const [streak, setStreak] = useState<StreakState>({ current: 0, best: 0, lastPlayedDay: null });
  const [hydrated, setHydrated] = useState(false);
  const recorded = useRef(false);

  // Restore progress after hydration (localStorage is browser-only).
  useEffect(() => {
    recorded.current = false;
    const stored = persist ? sessionService.load(dayKey) : null;
    if (stored && stored.gameId === game.id && stored.puzzleId === puzzle.id) {
      setState(stored.state);
      recorded.current = stored.recorded;
    } else {
      setState(game.initialize(puzzle));
    }
    setMessage("");
    setStreak(streakService.get());
    setHydrated(true);
  }, [game, puzzle, dayKey, persist]);

  const commit = useCallback(
    (next: GameState, nextMessage: string) => {
      setState(next);
      setMessage(nextMessage);
      const score = game.calculateScore(next);
      const complete = game.isComplete(next);

      if (complete && persist && !recorded.current) {
        recorded.current = true;
        setStreak(streakService.recordCompletion({ won: next.status === "won", score, day: dayKey }));
      }
      if (persist) {
        sessionService.save(dayKey, {
          gameId: game.id,
          puzzleId: next.puzzleId,
          state: next,
          score,
          recorded: recorded.current,
        });
      }
    },
    [game, dayKey, persist],
  );

  const submit = useCallback(
    (answer: string) => {
      if (game.isComplete(state)) return;
      const result = game.submitAnswer(state, puzzle, answer);
      commit(result.state, result.message);
    },
    [game, puzzle, state, commit],
  );

  const restart = useCallback(() => {
    if (persist) sessionService.clear(dayKey);
    recorded.current = false;
    setState(game.initialize(puzzle));
    setMessage("");
  }, [game, puzzle, dayKey, persist]);

  const forceFinish = useCallback(
    (outcome: "win" | "lose") => {
      const base = game.initialize(puzzle);
      const next: GameState =
        outcome === "win"
          ? { ...base, attempts: [{ value: "Simulated", tone: "correct", feedback: "Correct" }], status: "won" }
          : {
              ...base,
              attempts: Array.from({ length: base.maxAttempts }, () => ({
                value: "Simulated",
                tone: "wrong" as const,
                feedback: "Not this one",
              })),
              status: "lost",
            };
      commit(next, outcome === "win" ? "Simulated win." : "Simulated loss.");
    },
    [game, puzzle, commit],
  );

  return {
    state,
    message,
    score: game.calculateScore(state),
    streak,
    hydrated,
    submit,
    restart,
    forceFinish,
  };
}
