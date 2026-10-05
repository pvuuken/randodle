import { describe, expect, test } from "bun:test";
import { MOVIE_LIST } from "../src/data/movieList";
import { MOVIE_PUZZLES } from "../src/data/movies";
import { REVEAL_SCALES } from "../src/games/movie/PosterReveal";

/** Posters swapped for an official TMDB poster of the same film without a readable title. */
const REPLACED: Record<string, { tmdbId: number; posterPath: string }> = {
  "cinderella-1950": { tmdbId: 11224, posterPath: "/kTsE9TOVrUu05nSz6tDnw9vVfhH.jpg" },
  "some-like-it-hot-1959": { tmdbId: 239, posterPath: "/vcC57lOS13f2eVnZnfj09tcTwAY.jpg" },
  "ben-hur-1959": { tmdbId: 665, posterPath: "/soPa22oNOuKSEHi9vNk3275x2xD.jpg" },
  "mary-poppins-1964": { tmdbId: 433, posterPath: "/lArfzdKe2RyGLwYH5M5upLHsTLT.jpg" },
  "the-good-the-bad-and-the-ugly-1966": { tmdbId: 429, posterPath: "/lDIxtv4nY7oqpkMd7OPtOEWgf3i.jpg" },
  "superman-1978": { tmdbId: 1924, posterPath: "/6Tarl5jBDSiclMmXtKaArK77Fu3.jpg" },
  "the-shining-1980": { tmdbId: 694, posterPath: "/baKA5UY6bcBDxvDQLp0KSntFEo8.jpg" },
  "beauty-and-the-beast-1991": { tmdbId: 10020, posterPath: "/6FVWpYF2F0EbIkWK4kG0kmmDkTx.jpg" },
  "the-lion-king-1994": { tmdbId: 8587, posterPath: "/2SwFiYKrP8Q9MxRd1w8xqvlhkSB.jpg" },
  "catch-me-if-you-can-2002": { tmdbId: 640, posterPath: "/nyMQDfFH8Ox3cBiCbiefMts676w.jpg" },
  "good-bye-lenin-2003": { tmdbId: 338, posterPath: "/ipo0rCvRtakOhmIVS5M8Pkpxoyn.jpg" },
  "casino-royale-2006": { tmdbId: 36557, posterPath: "/u5Hk3FSdRtbN59YsqBY3XpYmhhJ.jpg" },
  "ratatouille-2007": { tmdbId: 2062, posterPath: "/enibUZpI1t2NA501G0LqtxzjEa3.jpg" },
  "the-bourne-ultimatum-2007": { tmdbId: 2503, posterPath: "/qUoIj70Pa6noRSzFAqYuEFahA6E.jpg" },
  "taken-2008": { tmdbId: 8681, posterPath: "/qEOJkbSFUyJ352PLrId8kHh2xMo.jpg" },
  "inglourious-basterds-2009": { tmdbId: 16869, posterPath: "/b3siLJYqd7B89J7IcYdUauKiDuh.jpg" },
  "the-king-s-speech-2010": { tmdbId: 45269, posterPath: "/nbeN3CFmLguV4nnC1uzHp1i1RrR.jpg" },
  "django-unchained-2012": { tmdbId: 68718, posterPath: "/tqpCY0MMHQ8kS89U6ago3N82cJw.jpg" },
  "everything-everywhere-all-at-once-2022": { tmdbId: 545611, posterPath: "/mb3JAvJiYCUSiAslibfIgtDOKdP.jpg" },
  "dune-part-two-2024": { tmdbId: 693134, posterPath: "/q6OlEefHppCj4qSfPEzGdsdRCG2.jpg" },
  "conclave-2024": { tmdbId: 974576, posterPath: "/fAlMWXHqg6ykes62US7YOBVMc2R.jpg" },
};

describe("poster audit fixes", () => {
  test("replaced posters keep movie identity", () => {
    for (const [id, exp] of Object.entries(REPLACED)) {
      const m = MOVIE_LIST.find((x) => x.id === id)!;
      expect(m.tmdbId).toBe(exp.tmdbId);
      expect(m.posterPath).toBe(exp.posterPath);
      const p = MOVIE_PUZZLES.find((x) => x.id === id)!;
      expect(p.posterUrl.endsWith(exp.posterPath)).toBe(true);
    }
  });
  test("King's Speech top title band is masked", () => {
    expect(MOVIE_LIST.find((m) => m.id === "the-king-s-speech-2010")!.posterMask).toEqual({ enabled: true, position: "top", size: 25 });
  });
  test("all 200 puzzles keep ids and order", () => {
    expect(MOVIE_PUZZLES.map((p) => p.id)).toEqual(MOVIE_LIST.map((m) => m.id));
    expect(new Set(MOVIE_LIST.map((m) => m.posterPath)).size).toBe(200);
  });
  test("reveal sequence unchanged", () => expect([...REVEAL_SCALES]).toEqual([5, 4, 3, 2, 1]));
});
