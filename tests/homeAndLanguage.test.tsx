import { afterEach, describe, expect, test, setSystemTime } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { getDailyGame } from "../src/engine/dailyGameService";
import { nextDaily, useDailyGame } from "../src/hooks/useDailyGame";
import { restoreSession } from "../src/hooks/useGameSession";
import { GAME_REGISTRY } from "../src/engine/gameRegistry";
import { InitialLanguageContext, getLanguage, setLanguage, useTranslation, type Language } from "../src/i18n";

afterEach(() => { setSystemTime(); setLanguage("en"); });

function Edition() {
  const d = useDailyGame();
  return <p>{`${d.dayKey} #${d.edition}`}</p>;
}
function PlayLabel() {
  const { t } = useTranslation();
  return <p>{t.home.play}</p>;
}
const render = (lang?: Language) =>
  renderToStaticMarkup(
    lang ? <InitialLanguageContext.Provider value={lang}><PlayLabel /></InitialLanguageContext.Provider> : <PlayLabel />,
  );

describe("homepage day at UTC midnight", () => {
  test("shows the current UTC date and number", () => {
    setSystemTime(new Date("2026-11-04T12:00:00Z"));
    const d = getDailyGame();
    expect(renderToStaticMarkup(<Edition />)).toContain(`2026-11-04 #${d.edition}`);
  });

  test("an open page moves to the new day when midnight UTC passes", () => {
    const before = getDailyGame(new Date("2026-11-04T23:59:59Z"));
    expect(nextDaily(before, new Date("2026-11-04T23:59:59.999Z"))).toBe(before); // same day: untouched
    const after = nextDaily(before, new Date("2026-11-05T00:00:00Z"));
    expect(after.dayKey).toBe("2026-11-05");
    expect(after.edition).toBe(before.edition + 1);
  });

  test("daily puzzle selection is unchanged by the rollover", () => {
    const rolled = nextDaily(getDailyGame(new Date("2026-11-04T23:59:59Z")), new Date("2026-11-05T00:00:01Z"));
    const fresh = getDailyGame(new Date("2026-11-05T15:00:00Z"));
    expect(rolled.game.id).toBe(fresh.game.id);
    expect(rolled.puzzle.id).toBe(fresh.puzzle.id);
  });

  test("opening/refreshing after midnight shows the new day", () => {
    setSystemTime(new Date("2026-11-05T00:00:05Z"));
    expect(renderToStaticMarkup(<Edition />)).toContain("2026-11-05");
  });
});

describe("language at first render", () => {
  test("first-time visitors get English", () => {
    expect(render()).toContain("Play today");
    expect(render("en")).toContain("Play today");
  });

  test("saved Dutch users get Dutch on the very first render", () => {
    const html = render("nl");
    expect(html).toContain("Speel");
    expect(html).not.toContain("Play today");
  });

  test("switching EN → NL → EN", () => {
    setLanguage("nl");
    expect(getLanguage()).toBe("nl");
    setLanguage("en");
    expect(getLanguage()).toBe("en");
  });

  test("switching language does not touch game progress", () => {
    const game = GAME_REGISTRY["country"]!;
    const puzzle = game.getPuzzleForDay(400);
    const state = game.submitAnswer(game.initialize(puzzle), puzzle, "France").state;
    const saved = { gameId: game.id, puzzleId: puzzle.id, state, score: 0, recorded: false };
    setLanguage("nl");
    const nl = restoreSession(game, puzzle, saved).state;
    setLanguage("en");
    expect(nl).toEqual(state);
    expect(restoreSession(game, puzzle, saved).state).toEqual(state);
  });
});
