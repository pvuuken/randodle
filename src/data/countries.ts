import type { Clue, Puzzle } from "@/types/game";

export interface CountryPuzzle extends Puzzle {
  answer: string;
  /** Accepted alternative spellings, lowercase. */
  aliases?: string[];
  clues: Clue[];
}

export const COUNTRY_NAMES: string[] = [
  "Argentina",
  "Australia",
  "Austria",
  "Brazil",
  "Canada",
  "Chile",
  "Egypt",
  "France",
  "Germany",
  "Iceland",
  "India",
  "Ireland",
  "Italy",
  "Japan",
  "Kenya",
  "Mexico",
  "Morocco",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Peru",
  "Poland",
  "Portugal",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Vietnam",
];

export const COUNTRY_PUZZLES: CountryPuzzle[] = [
  {
    id: "country-001",
    answer: "Portugal",
    clues: [
      { icon: "🌍", label: "Continent", value: "Europe" },
      { icon: "🌊", label: "Geography", value: "Atlantic coastline along its entire west" },
      { icon: "💶", label: "Currency", value: "Euro" },
      { icon: "🤝", label: "Neighbours", value: "Shares one land border only" },
      { icon: "🏙️", label: "Capital", value: "A hillside capital on the river Tagus" },
    ],
  },
  {
    id: "country-002",
    answer: "Iceland",
    clues: [
      { icon: "🌍", label: "Continent", value: "Europe" },
      { icon: "🌋", label: "Geography", value: "Volcanic island near the Arctic Circle" },
      { icon: "💰", label: "Currency", value: "Króna" },
      { icon: "👥", label: "Population", value: "Under 500,000" },
      { icon: "🏙️", label: "Capital", value: "Reykjavík" },
    ],
  },
  {
    id: "country-003",
    answer: "Nepal",
    clues: [
      { icon: "🌍", label: "Continent", value: "Asia" },
      { icon: "🏔️", label: "Geography", value: "Landlocked, home to the highest peak on Earth" },
      { icon: "💰", label: "Currency", value: "Rupee" },
      { icon: "🤝", label: "Neighbours", value: "Between India and China" },
      { icon: "🏙️", label: "Capital", value: "Kathmandu" },
    ],
  },
  {
    id: "country-004",
    answer: "Peru",
    clues: [
      { icon: "🌍", label: "Continent", value: "South America" },
      { icon: "🏞️", label: "Geography", value: "Andes, Amazon and Pacific coast in one country" },
      { icon: "💰", label: "Currency", value: "Sol" },
      { icon: "🤝", label: "Neighbours", value: "Borders Ecuador, Colombia, Brazil, Bolivia and Chile" },
      { icon: "🏙️", label: "Capital", value: "Lima" },
    ],
  },
  {
    id: "country-005",
    answer: "Vietnam",
    clues: [
      { icon: "🌍", label: "Continent", value: "Asia" },
      { icon: "🌊", label: "Geography", value: "Long S-shaped coastline on the South China Sea" },
      { icon: "💰", label: "Currency", value: "Đồng" },
      { icon: "🤝", label: "Neighbours", value: "Borders China, Laos and Cambodia" },
      { icon: "🏙️", label: "Capital", value: "Hanoi" },
    ],
  },
  {
    id: "country-006",
    answer: "Morocco",
    clues: [
      { icon: "🌍", label: "Continent", value: "Africa" },
      { icon: "🏜️", label: "Geography", value: "Atlas mountains, desert and two coastlines" },
      { icon: "💰", label: "Currency", value: "Dirham" },
      { icon: "🤝", label: "Neighbours", value: "Closest African country to Spain" },
      { icon: "🏙️", label: "Capital", value: "Rabat" },
    ],
  },
  {
    id: "country-007",
    answer: "New Zealand",
    aliases: ["nz"],
    clues: [
      { icon: "🌍", label: "Continent", value: "Oceania" },
      { icon: "🏝️", label: "Geography", value: "Two main islands, no land borders" },
      { icon: "💰", label: "Currency", value: "Dollar" },
      { icon: "👥", label: "Population", value: "Around 5 million" },
      { icon: "🏙️", label: "Capital", value: "Wellington" },
    ],
  },
];
