import { describe, expect, test } from "bun:test";
import { MOVIE_PUZZLES } from "../src/data/movies";
import { MOVIE_ALIASES } from "../src/data/movieAliases";
import { MOVIE_LIST } from "../src/data/movieList";
import { isAnswerCorrect, normalizeAnswer } from "../src/services/answerService";

const byId = (id: string) => MOVIE_PUZZLES.find((p) => p.id === id)!;
const ok = (id: string, guess: string) => {
  const p = byId(id);
  return isAnswerCorrect(guess, p.answer, p.aliases);
};
const compact = (s: string) => normalizeAnswer(s).replace(/[^a-z0-9]/g, "");

describe("movie aliases", () => {
  test("every alias key is a real movie", () => {
    const ids = new Set(MOVIE_LIST.map((m) => m.id));
    for (const id of Object.keys(MOVIE_ALIASES)) expect(ids.has(id)).toBe(true);
  });

  test("no accepted answer matches two different movies", () => {
    const owner = new Map<string, string>();
    for (const p of MOVIE_PUZZLES) {
      for (const a of new Set([p.answer, ...(p.aliases ?? [])].map(compact))) {
        const prev = owner.get(a);
        if (prev && prev !== p.id) throw new Error(`"${a}" accepted for ${prev} and ${p.id}`);
        owner.set(a, p.id);
      }
    }
  });

  test("every movie accepts its own answers and no other movie's", () => {
    for (const p of MOVIE_PUZZLES) {
      for (const a of [p.answer, ...(p.aliases ?? [])]) {
        expect(isAnswerCorrect(a, p.answer, p.aliases)).toBe(true);
        for (const q of MOVIE_PUZZLES) if (q.id !== p.id) expect(isAnswerCorrect(a, q.answer, q.aliases)).toBe(false);
      }
    }
  });

  test("canonical titles unchanged", () => {
    for (const m of MOVIE_LIST) expect(byId(m.id).answer).toBe(m.title.en);
  });

  test("new aliases accepted", () => {
    expect(ok("the-lord-of-the-rings-the-return-of-the-king-2003", "Return of the King")).toBe(true);
    expect(ok("pirates-of-the-caribbean-the-curse-of-the-black-pearl-2003", "pirates of the caribbean")).toBe(true);
    expect(ok("terminator-2-judgment-day-1991", "T2")).toBe(true);
    expect(ok("the-shawshank-redemption-1994", "Shawshank")).toBe(true);
    expect(ok("harry-potter-and-the-philosopher-s-stone-2001", "Harry Potter and the Sorcerers Stone")).toBe(true);
    expect(ok("the-godfather-1972", "godfather")).toBe(true);
    expect(ok("the-adventures-of-tintin-2011", "Kuifje")).toBe(true);
  });

  test("EN/NL titles still work", () => {
    expect(ok("the-lion-king-1994", "De Leeuwenkoning")).toBe(true);
    expect(ok("moana-2016", "Vaiana")).toBe(true);
    expect(ok("se7en-1995", "Seven")).toBe(true);
  });

  test("normalization preserved", () => {
    expect(ok("amelie-2001", "AMELIE")).toBe(true);
    expect(ok("spider-man-2002", "spiderman")).toBe(true);
    expect(ok("e-t-the-extra-terrestrial-1982", " e.t. ")).toBe(true);
    expect(ok("leon-the-professional-1994", "Leon")).toBe(true);
  });

  test("ambiguous and wrong answers rejected", () => {
    expect(ok("star-wars-the-force-awakens-2015", "Star Wars")).toBe(false);
    expect(ok("spider-man-no-way-home-2021", "Spider-Man")).toBe(false);
    expect(ok("top-gun-maverick-2022", "Top Gun")).toBe(false);
    expect(ok("harry-potter-and-the-philosopher-s-stone-2001", "Harry Potter")).toBe(false);
    expect(ok("the-lord-of-the-rings-the-return-of-the-king-2003", "Lord of the Rings")).toBe(false);
    expect(ok("the-dark-knight-2008", "Batman")).toBe(false);
    expect(ok("the-mask-1994", "Mask")).toBe(false);
    expect(ok("jaws-1975", "Titanic")).toBe(false);
    for (const g of ["The", "It", "Us", "Her", "Up"]) expect(ok("the-godfather-1972", g)).toBe(false);
  });
});
