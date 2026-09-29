import { test, expect } from "bun:test";
import { movieGame, visibleClueCount } from "../src/games/movie";
import { MOVIE_CLUES } from "../src/data/movieClues";
import { MOVIE_LIST } from "../src/data/movieList";
import { revealScale } from "../src/games/movie/PosterReveal";
import { setLanguage } from "../src/i18n";

const p = movieGame.puzzles[0];
const wrong = (s: any) => movieGame.submitAnswer(s, p, "Definitely Not A Film").state;

test("all 200 films have exactly 5 non-empty EN and NL clues", () => {
  expect(MOVIE_LIST.length).toBe(200);
  expect(Object.keys(MOVIE_CLUES).length).toBe(200);
  for (const m of MOVIE_LIST) {
    const c = MOVIE_CLUES[m.id];
    expect(c.en.length).toBe(5);
    expect(c.nl.length).toBe(5);
    for (const t of [...c.en, ...c.nl]) expect(t.trim().length).toBeGreaterThan(0);
  }
});
test("every puzzle carries its 5 clues", () => {
  for (const pz of movieGame.puzzles) expect(pz.clues.length).toBe(5);
});
test("clues reveal 1 → 2 → 3 → 4 → 5 alongside zoom 5 → 4 → 3 → 2 → 1", () => {
  let s = movieGame.initialize(p);
  const clues = [visibleClueCount(s)], zoom = [revealScale(s)];
  for (let i = 0; i < 5; i++) { s = wrong(s); clues.push(visibleClueCount(s)); zoom.push(revealScale(s)); }
  expect(clues).toEqual([1, 2, 3, 4, 5, 5]);
  expect(zoom).toEqual([5, 4, 3, 2, 1, 1]);
});
test("a correct guess reveals no extra clue", () => {
  let s = wrong(movieGame.initialize(p));
  s = movieGame.submitAnswer(s, p, p.answer).state;
  expect(s.status).toBe("won");
  expect(visibleClueCount(s)).toBe(2);
});
test("losing reveals all 5 clues", () => {
  let s = movieGame.initialize(p);
  while (s.status === "playing") s = wrong(s);
  expect(visibleClueCount(s)).toBe(5);
});
test("changing language keeps the same puzzle; answers in either language still work", () => {
  setLanguage("en"); const a = movieGame.getPuzzleForDay(42).id;
  setLanguage("nl"); const b = movieGame.getPuzzleForDay(42).id;
  setLanguage("en");
  expect(a).toBe(b);
  const s = movieGame.initialize(p);
  expect(movieGame.submitAnswer(s, p, p.title.nl).state.status).toBe("won");
  expect(movieGame.submitAnswer(s, p, "  " + p.answer.toUpperCase()).state.status).toBe("won");
});
