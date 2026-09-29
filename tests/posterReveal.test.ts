import { test, expect } from "bun:test";
import { movieGame } from "../src/games/movie";
import { REVEAL_SCALES, revealScale } from "../src/games/movie/PosterReveal";
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
test("a new daily game resets the reveal to scale 5", () => {
  expect(revealScale(movieGame.initialize(movieGame.getPuzzleForDay(5)))).toBe(5);
});
test("poster URL comes from posterPath", () => {
  expect(p.posterUrl).toBe(moviePosterUrl(MOVIE_LIST[0]));
  expect(p.posterUrl).toContain(MOVIE_LIST[0].posterPath);
});

import { posterMaskStyle } from "../src/games/movie/PosterReveal";
import { MOVIE_PUZZLES } from "../src/data/movies";

test("no posterMask → no mask", () => {
  expect(posterMaskStyle(undefined)).toBeNull();
  expect(posterMaskStyle({ enabled: false, position: "top", size: 20 })).toBeNull();
  const plain = MOVIE_LIST.find((m) => !m.posterMask)!;
  expect(MOVIE_PUZZLES.find((p) => p.id === plain.id)!.posterMask).toBeUndefined();
});
test("enabled posterMask is passed from data to puzzle", () => {
  const sw = MOVIE_PUZZLES.find((p) => p.id === "snow-white-and-the-seven-dwarfs-1937")!;
  expect(sw.posterMask).toEqual({ enabled: true, position: "bottom", size: 35 });
});
test("all four positions are supported", () => {
  expect(posterMaskStyle({ enabled: true, position: "bottom", size: 25 })).toMatchObject({ bottom: 0, left: 0, right: 0, height: "25%" });
  expect(posterMaskStyle({ enabled: true, position: "top", size: 20 })).toMatchObject({ top: 0, height: "20%" });
  expect(posterMaskStyle({ enabled: true, position: "left", size: 30 })).toMatchObject({ left: 0, top: 0, bottom: 0, width: "30%" });
  expect(posterMaskStyle({ enabled: true, position: "right", size: 15 })).toMatchObject({ right: 0, width: "15%" });
});
test("mask does not affect the zoom", () => {
  const style = posterMaskStyle({ enabled: true, position: "bottom", size: 25 })!;
  expect(style.transform).toBeUndefined();
  const masked = MOVIE_PUZZLES.find((m) => m.posterMask)!;
  let s: any = movieGame.initialize(masked); const seen = [revealScale(s)];
  for (let i = 0; i < 4; i++) { s = movieGame.submitAnswer(s, masked, "Definitely Not A Film").state; seen.push(revealScale(s)); }
  expect(seen).toEqual([5, 4, 3, 2, 1]);
});
