import { useCallback, useEffect, useRef, useState } from "react";
import type { GameState, Puzzle, RegisteredGame } from "@/types/game";
import { sessionService, type StoredSession } from "@/services/sessionService";
import { streakService, type StreakState } from "@/services/streakService";
import { statsService } from "@/services/statsService";

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

/** Saved progress for this exact game + puzzle, or a fresh session. */
export function restoreSession(
  game: RegisteredGame,
  puzzle: Puzzle,
  stored: StoredSession | null,
): { state: GameState; recorded: boolean } {
  if (stored && stored.gameId === game.id && stored.puzzleId === puzzle.id) {
    return { state: stored.state, recorded: stored.recorded };
  }
  return { state: game.initialize(puzzle), recorded: false };
}

/** Input is accepted only after saved progress has loaded, and never on a finished game. */
export function canAcceptInput(hydrated: boolean, game: RegisteredGame, state: GameState): boolean {
  return hydrated && !game.isComplete(state);
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
    const restored = restoreSession(game, puzzle, stored);
    setState(restored.state);
    recorded.current = restored.recorded;
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
        const won = next.status === "won";
        setStreak(streakService.recordCompletion({ won, score, day: dayKey }));
        statsService.recordResult({ day: dayKey, gameId: game.id, score, maxScore: game.maxScore ?? 100, won });
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
      if (!canAcceptInput(hydrated, game, state)) return;
      const result = game.submitAnswer(state, puzzle, answer);
      commit(result.state, result.message);
    },
    [game, puzzle, state, commit, hydrated],
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
