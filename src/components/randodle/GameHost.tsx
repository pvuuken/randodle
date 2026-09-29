import type { Puzzle, RegisteredGame } from "@/types/game";
import { useGameSession } from "@/hooks/useGameSession";
import { ResultScreen } from "./ResultScreen";

interface GameHostProps {
  edition: number;
  dayKey: string;
  game: RegisteredGame;
  puzzle: Puzzle;
  /** Practice/test runs don't persist or affect the streak. */
  practice?: boolean;
  /** Test mode controls rendered above the board. */
  toolbar?: (session: ReturnType<typeof useGameSession>) => React.ReactNode;
}

/**
 * The platform's game shell: it renders any registered module without
 * knowing a single rule of the game inside it.
 */
export function GameHost({ edition, dayKey, game, puzzle, practice = false, toolbar }: GameHostProps) {
  const session = useGameSession({ game, puzzle, dayKey, persist: !practice });
  const complete = game.isComplete(session.state);

  return (
    <div className="space-y-6">
      {toolbar?.(session)}

      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {practice ? "Practice" : `Randodle #${String(edition).padStart(3, "0")}`}
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl">
          <span aria-hidden="true">{game.emoji} </span>
          {game.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{game.prompt}</p>
      </header>

      {complete ? (
        <ResultScreen
          edition={edition}
          game={game}
          state={session.state}
          score={session.score}
          streak={session.streak.current}
          practice={practice}
          {...(practice ? { onPlayAgain: session.restart } : {})}
        />
      ) : (
        <>
          <game.Play puzzle={puzzle} state={session.state} onSubmit={session.submit} />
          <p role="status" aria-live="polite" className="min-h-6 text-center text-sm font-medium text-foreground">
            {session.message}
          </p>
        </>
      )}
    </div>
  );
}
