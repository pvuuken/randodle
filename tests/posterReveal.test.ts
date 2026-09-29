import { test, expect } from "bun:test";
import { movieGame } from "../src/games/movie";
import { revealScale } from "../src/games/movie/PosterReveal";
import { MOVIE_LIST, moviePosterUrl } from "../src/data/movieList";

const p = movieGame.puzzles[0];
const start = () => movieGame.initialize(p);
const wrong = (s: any) => movieGame.submitAnswer(s, p, "Definitely Not A Film").state;

test("starts at max zoom (scale 5); typing/empty submissions don't count", () => {
  const s = start();
  expect(revealScale(s)).toBe(5);
  expect(revealScale(s)).toBe(5); // typing touches no session state
});
test("reveals exactly 5 → 4 → 3 → 2 → 1 as wrong guesses add up", () => {
  expect(REVEAL_SCALES).toEqual([5, 4, 3, 2, 1]);
  let s = start(); const seen = [revealScale(s)];
  for (let i = 0; i < 6; i++) { s = wrong(s); seen.push(revealScale(s)); }
  // 0..5 wrong guesses: 5, 4, 3, 2, then scale 1 from the 4th wrong on
  expect(seen).toEqual([5, 4, 3, 2, 1, 1, 1]);
});
test("correct answer keeps the current zoom", () => {
  let s = wrong(start());
  s = movieGame.submitAnswer(s, p, p.answer).state;
  expect(s.status).toBe("won");
  expect(revealScale(s)).toBe(4);
});
test("game over shows the full poster (scale 1)", () => {
  let s = start();
  while (s.status === "playing") s = wrong(s);
  expect(s.status).toBe("lost");
  expect(revealScale(s)).toBe(1);
});
test("a new daily game resets the reveal", () => {
  expect(revealScale(movieGame.initialize(movieGame.getPuzzleForDay(5)))).toBe(3);
});
test("poster URL comes from posterPath", () => {
  expect(p.posterUrl).toBe(moviePosterUrl(MOVIE_LIST[0]));
  expect(p.posterUrl).toContain(MOVIE_LIST[0].posterPath);
});
