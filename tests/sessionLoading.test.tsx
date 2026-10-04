import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { GameHost } from "../src/components/randodle/GameHost";
import { canAcceptInput, restoreSession } from "../src/hooks/useGameSession";
import { GAME_REGISTRY } from "../src/engine/gameRegistry";
import { setLanguage } from "../src/i18n";
import type { StoredSession } from "../src/services/sessionService";
import type { GameState, RegisteredGame } from "../src/types/game";

const games = Object.values(GAME_REGISTRY);
const VALID: Record<string, string> = { movie: "zzz", country: "France", year: "1900", "higher-lower": "higher", flag: "France" };

const stored = (game: RegisteredGame, state: GameState): StoredSession => ({
  gameId: game.id, puzzleId: state.puzzleId, state, score: game.calculateScore(state), recorded: false,
});

/** Mirrors useGameSession: fresh state, hydrated=false, then a (delayed) storage read. */
function simulateSession(game: RegisteredGame, read: () => Promise<StoredSession | null>) {
  const puzzle = game.getPuzzleForDay(400);
  const s = { state: game.initialize(puzzle), hydrated: false };
  const submit = (answer: string) => {
    if (!canAcceptInput(s.hydrated, game, s.state)) return false;
    s.state = game.submitAnswer(s.state, puzzle, answer).state;
    return true;
  };
  const loaded = read().then((saved) => {
    s.state = restoreSession(game, puzzle, saved).state;
    s.hydrated = true;
  });
  return { s, submit, loaded, puzzle };
}

const delayed = <T,>(v: T, ms = 30) => new Promise<T>((r) => setTimeout(() => r(v), ms));

describe("saved progress loads before input is accepted", () => {
  for (const game of games) {
    test(`${game.id}: input is blocked during a delayed storage read, then progress is restored`, async () => {
      const puzzle = game.getPuzzleForDay(400);
      const saved = game.submitAnswer(game.initialize(puzzle), puzzle, VALID[game.id]!).state;
      expect(saved.attempts.length).toBe(1);

      const { s, submit, loaded } = simulateSession(game, () => delayed(stored(game, saved)));
      expect(submit(VALID[game.id]!)).toBe(false); // too early: ignored
      expect(s.state.attempts.length).toBe(0);
      await loaded;
      expect(s.state).toEqual(saved); // restored, nothing overwritten
      expect(submit(VALID[game.id]!)).toBe(true); // interactive afterwards
      expect(s.state.attempts.length).toBe(2);
    });

    test(`${game.id}: no saved progress → fresh session`, async () => {
      const { s, loaded, puzzle } = simulateSession(game, () => delayed(null));
      await loaded;
      expect(s.state).toEqual(game.initialize(puzzle));
      expect(canAcceptInput(true, game, s.state)).toBe(true);
    });

    test(`${game.id}: a finished game stays finished after reload`, async () => {
      const puzzle = game.getPuzzleForDay(400);
      const done: GameState = { ...game.initialize(puzzle), status: "lost" };
      const { s, submit, loaded } = simulateSession(game, () => delayed(stored(game, done)));
      await loaded;
      expect(s.state.status).toBe("lost");
      expect(submit(VALID[game.id]!)).toBe(false);
    });

    test(`${game.id}: first render shows no game board, only the loading text`, () => {
      const puzzle = game.getPuzzleForDay(400);
      const html = renderToStaticMarkup(<GameHost edition={1} dayKey="2026-11-04" game={game} puzzle={puzzle} />);
      expect(html).not.toContain("<input");
      expect(html).not.toContain("<button");
      expect(html).toContain("Loading your game");
    });
  }

  test("saved progress for another puzzle is never restored", () => {
    const game = GAME_REGISTRY["year"]!;
    const puzzle = game.getPuzzleForDay(400);
    const other = { ...game.initialize(puzzle), puzzleId: "someone-else" };
    expect(restoreSession(game, puzzle, stored(game, other)).state).toEqual(game.initialize(puzzle));
  });

  test("refresh (same stored data read again) restores identical progress", () => {
    const game = GAME_REGISTRY["country"]!;
    const puzzle = game.getPuzzleForDay(400);
    const saved = stored(game, game.submitAnswer(game.initialize(puzzle), puzzle, "France").state);
    const a = restoreSession(game, puzzle, JSON.parse(JSON.stringify(saved)));
    const b = restoreSession(game, puzzle, JSON.parse(JSON.stringify(saved)));
    expect(a).toEqual(b);
    expect(a.state.attempts.length).toBe(1);
  });

  test("switching language keeps the restored progress", () => {
    const game = GAME_REGISTRY["flag"]!;
    const puzzle = game.getPuzzleForDay(400);
    const saved = stored(game, game.submitAnswer(game.initialize(puzzle), puzzle, "France").state);
    setLanguage("nl");
    const nl = restoreSession(game, puzzle, saved);
    setLanguage("en");
    expect(nl.state).toEqual(restoreSession(game, puzzle, saved).state);
  });
});
