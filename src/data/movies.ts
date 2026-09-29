import type { Clue, Puzzle } from "@/types/game";

export interface MoviePuzzle extends Puzzle {
  /** The title to guess. Demo/placeholder catalogue for v0.1. */
  answer: string;
  /** Optional accepted alternatives, e.g. without a leading "The". */
  aliases?: string[];
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
    aliases: ["Paper Astronaut"],
    clues: [
      { icon: "💬", label: "Quote", value: "\"We built a rocket out of homework.\"", translations: { nl: { label: "Citaat", value: "\"We bouwden een raket van ons huiswerk.\"" } } },
      { icon: "📅", label: "Release year", value: "2019", translations: { nl: { label: "Jaar van uitgave", value: "2019" } } },
      { icon: "🎭", label: "Genre", value: "Adventure / Family / Drama", translations: { nl: { label: "Genre", value: "Avontuur / Familie / Drama" } } },
      { icon: "🎬", label: "Director", value: "Ines Delacroix (demo)", translations: { nl: { label: "Regisseur", value: "Ines Delacroix (demo)" } } },
      { icon: "📍", label: "Setting", value: "A coastal town with one radio mast", translations: { nl: { label: "Decor", value: "Een kustdorp met één zendmast" } } },
      { icon: "👤", label: "Lead actor", value: "Marek Oduya (demo)", translations: { nl: { label: "Hoofdrol", value: "Marek Oduya (demo)" } } },
    ],
  },
  {
    id: "movie-002",
    answer: "Neon Cartography",
    clues: [
      { icon: "💬", label: "Quote", value: "\"Every city is a map of someone leaving.\"", translations: { nl: { label: "Citaat", value: "\"Elke stad is een kaart van iemand die vertrekt.\"" } } },
      { icon: "📅", label: "Release year", value: "2022", translations: { nl: { label: "Jaar van uitgave", value: "2022" } } },
      { icon: "🎭", label: "Genre", value: "Sci-fi / Neo-noir", translations: { nl: { label: "Genre", value: "Sci-fi / Neo-noir" } } },
      { icon: "🎬", label: "Director", value: "Tova Lindqvist (demo)", translations: { nl: { label: "Regisseur", value: "Tova Lindqvist (demo)" } } },
      { icon: "📍", label: "Setting", value: "A rain-lit megacity with no street names", translations: { nl: { label: "Decor", value: "Een regenachtige megastad zonder straatnamen" } } },
      { icon: "👤", label: "Lead actor", value: "Priya Raval (demo)", translations: { nl: { label: "Hoofdrol", value: "Priya Raval (demo)" } } },
    ],
  },
  {
    id: "movie-003",
    answer: "Cold Orchard",
    clues: [
      { icon: "💬", label: "Quote", value: "\"Nothing grows here, and still we prune.\"", translations: { nl: { label: "Citaat", value: "\"Hier groeit niets, en toch snoeien we.\"" } } },
      { icon: "📅", label: "Release year", value: "2015", translations: { nl: { label: "Jaar van uitgave", value: "2015" } } },
      { icon: "🎭", label: "Genre", value: "Thriller / Mystery", translations: { nl: { label: "Genre", value: "Thriller / Mystery" } } },
      { icon: "🎬", label: "Director", value: "Hal Brentwood (demo)", translations: { nl: { label: "Regisseur", value: "Hal Brentwood (demo)" } } },
      { icon: "📍", label: "Setting", value: "A frozen family farm in late winter", translations: { nl: { label: "Decor", value: "Een bevroren familieboerderij aan het eind van de winter" } } },
      { icon: "👤", label: "Lead actor", value: "Noor Haddad (demo)", translations: { nl: { label: "Hoofdrol", value: "Noor Haddad (demo)" } } },
    ],
  },
  {
    id: "movie-004",
    answer: "The Velvet Engine",
    clues: [
      { icon: "💬", label: "Quote", value: "\"Softest machine I ever loved.\"", translations: { nl: { label: "Citaat", value: "\"De zachtste machine waar ik ooit van hield.\"" } } },
      { icon: "📅", label: "Release year", value: "2011", translations: { nl: { label: "Jaar van uitgave", value: "2011" } } },
      { icon: "🎭", label: "Genre", value: "Romance / Period drama", translations: { nl: { label: "Genre", value: "Romantiek / Kostuumdrama" } } },
      { icon: "🎬", label: "Director", value: "Giulia Prosper (demo)", translations: { nl: { label: "Regisseur", value: "Giulia Prosper (demo)" } } },
      { icon: "📍", label: "Setting", value: "A defunct textile mill turned dance hall", translations: { nl: { label: "Decor", value: "Een oude textielfabriek die een danszaal werd" } } },
      { icon: "👤", label: "Lead actor", value: "Eamon Dwyer (demo)", translations: { nl: { label: "Hoofdrol", value: "Eamon Dwyer (demo)" } } },
    ],
  },
  {
    id: "movie-005",
    answer: "Radio Silence County",
    clues: [
      { icon: "💬", label: "Quote", value: "\"Out here the news arrives on foot.\"", translations: { nl: { label: "Citaat", value: "\"Hier komt het nieuws te voet.\"" } } },
      { icon: "📅", label: "Release year", value: "2024", translations: { nl: { label: "Jaar van uitgave", value: "2024" } } },
      { icon: "🎭", label: "Genre", value: "Western / Drama", translations: { nl: { label: "Genre", value: "Western / Drama" } } },
      { icon: "🎬", label: "Director", value: "Ruth Alvear (demo)", translations: { nl: { label: "Regisseur", value: "Ruth Alvear (demo)" } } },
      { icon: "📍", label: "Setting", value: "A valley with one working telephone", translations: { nl: { label: "Decor", value: "Een vallei met één werkende telefoon" } } },
      { icon: "👤", label: "Lead actor", value: "Cassian Mbeki (demo)", translations: { nl: { label: "Hoofdrol", value: "Cassian Mbeki (demo)" } } },
    ],
  },
  {
    id: "movie-006",
    answer: "Midnight Cartwheel",
    clues: [
      { icon: "💬", label: "Quote", value: "\"Gravity clocks off at midnight.\"", translations: { nl: { label: "Citaat", value: "\"Om middernacht heeft de zwaartekracht vrij.\"" } } },
      { icon: "📅", label: "Release year", value: "2018", translations: { nl: { label: "Jaar van uitgave", value: "2018" } } },
      { icon: "🎭", label: "Genre", value: "Comedy / Coming of age", translations: { nl: { label: "Genre", value: "Komedie / Opgroeien" } } },
      { icon: "🎬", label: "Director", value: "Bex Oyelaran (demo)", translations: { nl: { label: "Regisseur", value: "Bex Oyelaran (demo)" } } },
      { icon: "📍", label: "Setting", value: "An empty summer gymnasium", translations: { nl: { label: "Decor", value: "Een lege gymzaal in de zomer" } } },
      { icon: "👤", label: "Lead actor", value: "Lena Farrow (demo)", translations: { nl: { label: "Hoofdrol", value: "Lena Farrow (demo)" } } },
    ],
  },
];
