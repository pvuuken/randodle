import type { Clue, Puzzle } from "@/types/game";

export interface MoviePuzzle extends Puzzle {
  /** The title to guess. Demo/placeholder catalogue for v0.1. */
  answer: string;
  clues: Clue[];
}

/** Demo catalogue used for autocomplete — fictional placeholder titles. */
export const MOVIE_TITLES: string[] = [
  "A Quiet Harbour",
  "Neon Cartography",
  "The Paper Astronaut",
  "Salt and Static",
  "Midnight Cartwheel",
  "The Lantern Thief",
  "Glasshouse Rules",
  "Eleven Northbound",
  "The Velvet Engine",
  "Cold Orchard",
  "Hollow Tide",
  "The Ninth Balcony",
  "Radio Silence County",
  "Paper Moon Riot",
  "The Long Rehearsal",
];

export const MOVIE_PUZZLES: MoviePuzzle[] = [
  {
    id: "movie-001",
    answer: "The Paper Astronaut",
    clues: [
      { icon: "💬", label: "Quote", value: "\"We built a rocket out of homework.\"" },
      { icon: "📅", label: "Release year", value: "2019" },
      { icon: "🎭", label: "Genre", value: "Adventure / Family / Drama" },
      { icon: "🎬", label: "Director", value: "Ines Delacroix (demo)" },
      { icon: "📍", label: "Setting", value: "A coastal town with one radio mast" },
      { icon: "👤", label: "Lead actor", value: "Marek Oduya (demo)" },
    ],
  },
  {
    id: "movie-002",
    answer: "Neon Cartography",
    clues: [
      { icon: "💬", label: "Quote", value: "\"Every city is a map of someone leaving.\"" },
      { icon: "📅", label: "Release year", value: "2022" },
      { icon: "🎭", label: "Genre", value: "Sci-fi / Neo-noir" },
      { icon: "🎬", label: "Director", value: "Tova Lindqvist (demo)" },
      { icon: "📍", label: "Setting", value: "A rain-lit megacity with no street names" },
      { icon: "👤", label: "Lead actor", value: "Priya Raval (demo)" },
    ],
  },
  {
    id: "movie-003",
    answer: "Cold Orchard",
    clues: [
      { icon: "💬", label: "Quote", value: "\"Nothing grows here, and still we prune.\"" },
      { icon: "📅", label: "Release year", value: "2015" },
      { icon: "🎭", label: "Genre", value: "Thriller / Mystery" },
      { icon: "🎬", label: "Director", value: "Hal Brentwood (demo)" },
      { icon: "📍", label: "Setting", value: "A frozen family farm in late winter" },
      { icon: "👤", label: "Lead actor", value: "Noor Haddad (demo)" },
    ],
  },
  {
    id: "movie-004",
    answer: "The Velvet Engine",
    clues: [
      { icon: "💬", label: "Quote", value: "\"Softest machine I ever loved.\"" },
      { icon: "📅", label: "Release year", value: "2011" },
      { icon: "🎭", label: "Genre", value: "Romance / Period drama" },
      { icon: "🎬", label: "Director", value: "Giulia Prosper (demo)" },
      { icon: "📍", label: "Setting", value: "A defunct textile mill turned dance hall" },
      { icon: "👤", label: "Lead actor", value: "Eamon Dwyer (demo)" },
    ],
  },
  {
    id: "movie-005",
    answer: "Radio Silence County",
    clues: [
      { icon: "💬", label: "Quote", value: "\"Out here the news arrives on foot.\"" },
      { icon: "📅", label: "Release year", value: "2024" },
      { icon: "🎭", label: "Genre", value: "Western / Drama" },
      { icon: "🎬", label: "Director", value: "Ruth Alvear (demo)" },
      { icon: "📍", label: "Setting", value: "A valley with one working telephone" },
      { icon: "👤", label: "Lead actor", value: "Cassian Mbeki (demo)" },
    ],
  },
  {
    id: "movie-006",
    answer: "Midnight Cartwheel",
    clues: [
      { icon: "💬", label: "Quote", value: "\"Gravity clocks off at midnight.\"" },
      { icon: "📅", label: "Release year", value: "2018" },
      { icon: "🎭", label: "Genre", value: "Comedy / Coming of age" },
      { icon: "🎬", label: "Director", value: "Bex Oyelaran (demo)" },
      { icon: "📍", label: "Setting", value: "An empty summer gymnasium" },
      { icon: "👤", label: "Lead actor", value: "Lena Farrow (demo)" },
    ],
  },
];
