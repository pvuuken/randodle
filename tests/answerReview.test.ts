import { describe, expect, test } from "bun:test";
import { getTodaysAnswers } from "../src/engine/answerReview";
import { getDailyGame, type DailyGame } from "../src/engine/dailyGameService";
import { GAME_REGISTRY } from "../src/engine/gameRegistry";
import { en } from "../src/i18n/en";
import { nl } from "../src/i18n/nl";
import type { GameState, RegisteredGame } from "../src/types/game";
import type { StoredSession } from "../src/services/sessionService";

const dailyFor = (game: RegisteredGame, dayIndex = 300): DailyGame => ({
  edition: dayIndex + 1,
  dayKey: "2026-10-28",
  dayIndex,
  game,
  puzzle: game.getPuzzleForDay(dayIndex),
});

const session = (d: DailyGame, state: GameState): StoredSession => ({
  gameId: d.game.id,
  puzzleId: d.puzzle.id,
  state,
  score: d.game.calculateScore(state),
  recorded: true,
});

/** Plays every attempt with a wrong-but-valid answer until the game ends. */
function finish(game: RegisteredGame, puzzle: { id: string }): GameState {
  const wrong: Record<string, string> = {
    movie: "zzz not a film",
    country: "Antarctica-nope",
    year: "1",
    "higher-lower": "higher",
    flag: "Belgium",
  };
  let state = game.initialize(puzzle);
  for (let i = 0; i < 40 && !game.isComplete(state); i++) {
    let r = game.submitAnswer(state, puzzle, wrong[game.id]!);
    if (r.state === state) r = game.submitAnswer(state, puzzle, "France");
    if (r.state === state) r = game.submitAnswer(state, puzzle, "2");
    state = r.state;
  }
  if (!game.isComplete(state)) state = { ...state, status: "lost" };
  return state;
}

const games = Object.values(GAME_REGISTRY);

describe("today's answers view", () => {
  test("all 5 games are covered", () => {
    expect(games.map((g) => g.id).sort()).toEqual(["country", "flag", "higher-lower", "movie", "year"]);
  });

  for (const game of games) {
    test(`${game.id}: unfinished game reveals nothing`, () => {
      const d = dailyFor(game);
      expect(getTodaysAnswers(d, null, "en")).toBeNull();
      expect(getTodaysAnswers(d, session(d, game.initialize(d.puzzle)), "en")).toBeNull();
    });

    test(`${game.id}: completed game lists answers for today's puzzle in EN and NL`, () => {
      const d = dailyFor(game);
      const s = session(d, finish(game, d.puzzle));
      const items = getTodaysAnswers(d, s, "en");
      expect(items).not.toBeNull();
      expect(items!.length).toBeGreaterThan(0);
      for (const it of items!) {
        expect(it.question.length).toBeGreaterThan(0);
        expect(it.correctAnswer.length).toBeGreaterThan(0);
      }
      expect(items).toEqual(game.getAnswerReview(d.puzzle, s.state, "en"));
      expect(getTodaysAnswers(d, s, "nl")!.length).toBe(items!.length);
      // Refresh = reading the same stored session again: identical result.
      expect(getTodaysAnswers(d, JSON.parse(JSON.stringify(s)), "en")).toEqual(items);
    });

    test(`${game.id}: a finished session for another puzzle or game is rejected`, () => {
      const d = dailyFor(game);
      const s = session(d, finish(game, d.puzzle));
      expect(getTodaysAnswers(d, { ...s, puzzleId: "other" }, "en")).toBeNull();
      expect(getTodaysAnswers(d, { ...s, gameId: "other" }, "en")).toBeNull();
    });
  }

  test("correct answers match today's puzzle data", () => {
    const year = GAME_REGISTRY["year"]!;
    const d = dailyFor(year);
    const items = getTodaysAnswers(d, session(d, finish(year, d.puzzle)), "en")!;
    expect(items[0]!.correctAnswer).toBe(String((d.puzzle as unknown as { answer: number }).answer));
    expect(items[0]!.correct).toBe(false);

    const movie = GAME_REGISTRY["movie"]!;
    const m = dailyFor(movie);
    const title = (m.puzzle as unknown as { title: { en: string; nl: string } }).title;
    const st = finish(movie, m.puzzle);
    expect(getTodaysAnswers(m, session(m, st), "en")![0]!.correctAnswer).toBe(title.en);
    expect(getTodaysAnswers(m, session(m, st), "nl")![0]!.correctAnswer).toBe(title.nl);
  });

  test("works with the real daily game for today", () => {
    const d = getDailyGame();
    expect(getTodaysAnswers(d, session(d, finish(d.game, d.puzzle)), "en")).not.toBeNull();
  });

  test("EN/NL labels", () => {
    expect(en.result.viewAnswers).toBe("View today's answers");
    expect(nl.result.viewAnswers).toBe("Bekijk de antwoorden van vandaag");
    expect(Object.keys(nl.answers).sort()).toEqual(Object.keys(en.answers).sort());
  });
});
