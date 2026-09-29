import type { Clue, Puzzle } from "@/types/game";

export interface CountryPuzzle extends Puzzle {
  /** ISO alpha-2 code into the shared country dataset (countryList.ts). */
  countryCode: string;
  clues: Clue[];
}

type ClueKind = "continent" | "geography" | "currency" | "neighbours" | "population" | "language" | "landmark" | "capital";
type ClueDef = [ClueKind, string, string];

const KIND: Record<ClueKind, { icon: string; en: string; nl: string }> = {
  continent: { icon: "🌍", en: "Continent", nl: "Continent" },
  geography: { icon: "🗺️", en: "Geography", nl: "Ligging" },
  currency: { icon: "💰", en: "Currency", nl: "Munteenheid" },
  neighbours: { icon: "🤝", en: "Neighbours", nl: "Buurlanden" },
  population: { icon: "👥", en: "Population", nl: "Inwoners" },
  language: { icon: "🗣️", en: "Language", nl: "Taal" },
  landmark: { icon: "🏛️", en: "Landmark", nl: "Kenmerk" },
  capital: { icon: "🏙️", en: "Capital", nl: "Hoofdstad" },
};

const clue = ([kind, en, nl]: ClueDef): Clue => ({
  icon: KIND[kind].icon,
  label: KIND[kind].en,
  value: en,
  translations: { nl: { label: KIND[kind].nl, value: nl } },
});

const C: Record<"EU" | "AS" | "AF" | "NA" | "SA" | "OC", ClueDef> = {
  EU: ["continent", "Europe", "Europa"],
  AS: ["continent", "Asia", "Azië"],
  AF: ["continent", "Africa", "Afrika"],
  NA: ["continent", "North America", "Noord-Amerika"],
  SA: ["continent", "South America", "Zuid-Amerika"],
  OC: ["continent", "Oceania", "Oceanië"],
};

export const COUNTRY_PUZZLES: CountryPuzzle[] = [
  {
    id: "country-001",
    countryCode: "PT",
    clues: [
      { icon: "🌍", label: "Continent", value: "Europe", translations: { nl: { label: "Continent", value: "Europa" } } },
      { icon: "🌊", label: "Geography", value: "Atlantic coastline along its entire west", translations: { nl: { label: "Ligging", value: "Atlantische kust langs de hele westkant" } } },
      { icon: "💶", label: "Currency", value: "Euro", translations: { nl: { label: "Munteenheid", value: "Euro" } } },
      { icon: "🤝", label: "Neighbours", value: "Shares one land border only", translations: { nl: { label: "Buurlanden", value: "Heeft maar één landgrens" } } },
      { icon: "🏙️", label: "Capital", value: "A hillside capital on the river Tagus", translations: { nl: { label: "Hoofdstad", value: "Een heuvelachtige hoofdstad aan de Taag" } } },
    ],
  },
  {
    id: "country-002",
    countryCode: "IS",
    clues: [
      { icon: "🌍", label: "Continent", value: "Europe", translations: { nl: { label: "Continent", value: "Europa" } } },
      { icon: "🌋", label: "Geography", value: "Volcanic island near the Arctic Circle", translations: { nl: { label: "Ligging", value: "Vulkanisch eiland bij de poolcirkel" } } },
      { icon: "💰", label: "Currency", value: "Króna", translations: { nl: { label: "Munteenheid", value: "Kroon" } } },
      { icon: "👥", label: "Population", value: "Under 500,000", translations: { nl: { label: "Inwoners", value: "Minder dan 500.000" } } },
      { icon: "🏙️", label: "Capital", value: "Reykjavík", translations: { nl: { label: "Hoofdstad", value: "Reykjavík" } } },
    ],
  },
  {
    id: "country-003",
    countryCode: "NP",
    clues: [
      { icon: "🌍", label: "Continent", value: "Asia", translations: { nl: { label: "Continent", value: "Azië" } } },
      { icon: "🏔️", label: "Geography", value: "Landlocked, home to the highest peak on Earth", translations: { nl: { label: "Ligging", value: "Geen kust, met de hoogste berg ter wereld" } } },
      { icon: "💰", label: "Currency", value: "Rupee", translations: { nl: { label: "Munteenheid", value: "Roepie" } } },
      { icon: "🤝", label: "Neighbours", value: "Between India and China", translations: { nl: { label: "Buurlanden", value: "Tussen India en China" } } },
      { icon: "🏙️", label: "Capital", value: "Kathmandu", translations: { nl: { label: "Hoofdstad", value: "Kathmandu" } } },
    ],
  },
  {
    id: "country-004",
    countryCode: "PE",
    clues: [
      { icon: "🌍", label: "Continent", value: "South America", translations: { nl: { label: "Continent", value: "Zuid-Amerika" } } },
      { icon: "🏞️", label: "Geography", value: "Andes, Amazon and Pacific coast in one country", translations: { nl: { label: "Ligging", value: "Andes, Amazone en Stille Oceaan in één land" } } },
      { icon: "💰", label: "Currency", value: "Sol", translations: { nl: { label: "Munteenheid", value: "Sol" } } },
      { icon: "🤝", label: "Neighbours", value: "Borders Ecuador, Colombia, Brazil, Bolivia and Chile", translations: { nl: { label: "Buurlanden", value: "Grenst aan Ecuador, Colombia, Brazilië, Bolivia en Chili" } } },
      { icon: "🏙️", label: "Capital", value: "Lima", translations: { nl: { label: "Hoofdstad", value: "Lima" } } },
    ],
  },
  {
    id: "country-005",
    countryCode: "VN",
    clues: [
      { icon: "🌍", label: "Continent", value: "Asia", translations: { nl: { label: "Continent", value: "Azië" } } },
      { icon: "🌊", label: "Geography", value: "Long S-shaped coastline on the South China Sea", translations: { nl: { label: "Ligging", value: "Lange S-vormige kust aan de Zuid-Chinese Zee" } } },
      { icon: "💰", label: "Currency", value: "Đồng", translations: { nl: { label: "Munteenheid", value: "Đồng" } } },
      { icon: "🤝", label: "Neighbours", value: "Borders China, Laos and Cambodia", translations: { nl: { label: "Buurlanden", value: "Grenst aan China, Laos en Cambodja" } } },
      { icon: "🏙️", label: "Capital", value: "Hanoi", translations: { nl: { label: "Hoofdstad", value: "Hanoi" } } },
    ],
  },
  {
    id: "country-006",
    countryCode: "MA",
    clues: [
      { icon: "🌍", label: "Continent", value: "Africa", translations: { nl: { label: "Continent", value: "Afrika" } } },
      { icon: "🏜️", label: "Geography", value: "Atlas mountains, desert and two coastlines", translations: { nl: { label: "Ligging", value: "Atlasgebergte, woestijn en twee kusten" } } },
      { icon: "💰", label: "Currency", value: "Dirham", translations: { nl: { label: "Munteenheid", value: "Dirham" } } },
      { icon: "🤝", label: "Neighbours", value: "Closest African country to Spain", translations: { nl: { label: "Buurlanden", value: "Het Afrikaanse land het dichtst bij Spanje" } } },
      { icon: "🏙️", label: "Capital", value: "Rabat", translations: { nl: { label: "Hoofdstad", value: "Rabat" } } },
    ],
  },
  {
    id: "country-007",
    countryCode: "NZ",
    clues: [
      { icon: "🌍", label: "Continent", value: "Oceania", translations: { nl: { label: "Continent", value: "Oceanië" } } },
      { icon: "🏝️", label: "Geography", value: "Two main islands, no land borders", translations: { nl: { label: "Ligging", value: "Twee hoofdeilanden, geen landgrenzen" } } },
      { icon: "💰", label: "Currency", value: "Dollar", translations: { nl: { label: "Munteenheid", value: "Dollar" } } },
      { icon: "👥", label: "Population", value: "Around 5 million", translations: { nl: { label: "Inwoners", value: "Ongeveer 5 miljoen" } } },
      { icon: "🏙️", label: "Capital", value: "Wellington", translations: { nl: { label: "Hoofdstad", value: "Wellington" } } },
    ],
  },
  ...[
    // Compact definitions: [code, clue, clue, clue, clue, clue]; clue = [kind, en, nl]. First clue is always the continent.
    ["NO", C.EU, ["geography", "Fjord-cut coastline along the North Sea and the Arctic", "Kust vol fjorden aan de Noordzee en de Noordelijke IJszee"], ["currency", "Krone", "Kroon"], ["neighbours", "Borders Sweden, Finland and Russia", "Grenst aan Zweden, Finland en Rusland"], ["capital", "Oslo", "Oslo"]],
    ["GR", C.EU, ["geography", "Mountainous mainland plus thousands of islands in the Aegean", "Bergachtig vasteland plus duizenden eilanden in de Egeïsche Zee"], ["currency", "Euro", "Euro"], ["landmark", "An ancient marble temple on a rocky hill above the capital", "Een antieke marmeren tempel op een rots boven de hoofdstad"], ["capital", "Athens", "Athene"]],
    ["HU", C.EU, ["geography", "Landlocked, split in two by the Danube, with Lake Balaton", "Geen kust, in tweeën gedeeld door de Donau, met het Balatonmeer"], ["currency", "Forint", "Forint"], ["neighbours", "Borders Austria, Slovakia, Ukraine, Romania, Serbia, Croatia and Slovenia", "Grenst aan Oostenrijk, Slowakije, Oekraïne, Roemenië, Servië, Kroatië en Slovenië"], ["capital", "Budapest", "Boedapest"]],
    ["CH", C.EU, ["geography", "Landlocked and mostly covered by the Alps", "Geen kust en grotendeels bedekt door de Alpen"], ["language", "Four national languages: German, French, Italian and Romansh", "Vier landstalen: Duits, Frans, Italiaans en Reto-Romaans"], ["currency", "Franc", "Frank"], ["capital", "Bern", "Bern"]],
    ["IE", C.EU, ["geography", "An island in the Atlantic, sharing it with one neighbour", "Een eiland in de Atlantische Oceaan, gedeeld met één buurland"], ["language", "Irish and English", "Iers en Engels"], ["currency", "Euro", "Euro"], ["capital", "Dublin", "Dublin"]],
    ["HR", C.EU, ["geography", "Long Adriatic coastline with more than a thousand islands", "Lange Adriatische kust met meer dan duizend eilanden"], ["currency", "Euro (since 2023)", "Euro (sinds 2023)"], ["neighbours", "Borders Slovenia, Hungary, Serbia, Bosnia and Herzegovina and Montenegro", "Grenst aan Slovenië, Hongarije, Servië, Bosnië en Herzegovina en Montenegro"], ["capital", "Zagreb", "Zagreb"]],
    ["PL", C.EU, ["geography", "Baltic coast in the north, Tatra mountains in the south", "Oostzeekust in het noorden, het Tatragebergte in het zuiden"], ["currency", "Złoty", "Zloty"], ["neighbours", "Borders Germany, Czechia, Slovakia, Ukraine, Belarus, Lithuania and Russia", "Grenst aan Duitsland, Tsjechië, Slowakije, Oekraïne, Belarus, Litouwen en Rusland"], ["capital", "Warsaw", "Warschau"]],
    ["FI", C.EU, ["geography", "Tens of thousands of lakes and vast forests", "Tienduizenden meren en uitgestrekte bossen"], ["language", "Finnish and Swedish", "Fins en Zweeds"], ["neighbours", "Borders Sweden, Norway and Russia", "Grenst aan Zweden, Noorwegen en Rusland"], ["capital", "Helsinki", "Helsinki"]],
    ["EE", C.EU, ["geography", "The northernmost of the three Baltic states", "De noordelijkste van de drie Baltische staten"], ["currency", "Euro", "Euro"], ["neighbours", "Borders Latvia and Russia", "Grenst aan Letland en Rusland"], ["capital", "Tallinn", "Tallinn"]],
    ["MT", C.EU, ["geography", "A small archipelago in the Mediterranean, south of Sicily", "Een kleine eilandengroep in de Middellandse Zee, ten zuiden van Sicilië"], ["language", "Maltese and English", "Maltees en Engels"], ["population", "Around half a million", "Ongeveer een half miljoen"], ["capital", "Valletta", "Valletta"]],
    ["AT", C.EU, ["geography", "Landlocked and dominated by the Alps", "Geen kust en gedomineerd door de Alpen"], ["currency", "Euro", "Euro"], ["neighbours", "Borders Germany, Czechia, Slovakia, Hungary, Slovenia, Italy, Switzerland and Liechtenstein", "Grenst aan Duitsland, Tsjechië, Slowakije, Hongarije, Slovenië, Italië, Zwitserland en Liechtenstein"], ["capital", "Vienna", "Wenen"]],
    ["JP", C.AS, ["geography", "Island chain in the Pacific with a famous snow-capped volcano", "Eilandenrij in de Stille Oceaan met een beroemde besneeuwde vulkaan"], ["currency", "Yen", "Yen"], ["population", "Over 120 million", "Meer dan 120 miljoen"], ["capital", "Tokyo", "Tokio"]],
    ["MN", C.AS, ["geography", "Landlocked steppe and part of the Gobi Desert", "Steppe zonder kust en een deel van de Gobiwoestijn"], ["neighbours", "Only borders Russia and China", "Grenst alleen aan Rusland en China"], ["currency", "Tögrög", "Tugrik"], ["capital", "Ulaanbaatar", "Ulaanbaatar"]],
    ["KZ", C.AS, ["geography", "The largest landlocked country in the world", "Het grootste land zonder zeekust ter wereld"], ["neighbours", "Borders Russia, China, Kyrgyzstan, Uzbekistan and Turkmenistan", "Grenst aan Rusland, China, Kirgizië, Oezbekistan en Turkmenistan"], ["currency", "Tenge", "Tenge"], ["capital", "Astana", "Astana"]],
    ["JO", C.AS, ["geography", "Nearly landlocked, with one short coast on the Gulf of Aqaba", "Bijna geen kust, op een kort stuk aan de Golf van Akaba na"], ["landmark", "An ancient city carved into rose-red rock", "Een oude stad uitgehouwen in rozerode rots"], ["currency", "Dinar", "Dinar"], ["capital", "Amman", "Amman"]],
    ["LK", C.AS, ["geography", "A teardrop-shaped island south of India", "Een druppelvormig eiland ten zuiden van India"], ["language", "Sinhala and Tamil", "Singalees en Tamil"], ["currency", "Rupee", "Roepie"], ["capital", "Sri Jayawardenepura Kotte, next to Colombo", "Sri Jayawardenepura Kotte, naast Colombo"]],
    ["KH", C.AS, ["geography", "Crossed by the Mekong, with the great lake Tonlé Sap", "Doorkruist door de Mekong, met het grote Tonlé Sapmeer"], ["landmark", "A vast temple complex that also appears on its flag", "Een enorm tempelcomplex dat ook op de vlag staat"], ["currency", "Riel", "Riel"], ["capital", "Phnom Penh", "Phnom Penh"]],
    ["PH", C.AS, ["geography", "An archipelago of more than 7,000 islands", "Een archipel van meer dan 7.000 eilanden"], ["language", "Filipino and English", "Filipijns en Engels"], ["currency", "Peso", "Peso"], ["capital", "Manila", "Manilla"]],
    ["OM", C.AS, ["geography", "The south-eastern corner of the Arabian Peninsula", "De zuidoostelijke hoek van het Arabisch Schiereiland"], ["neighbours", "Borders the United Arab Emirates, Saudi Arabia and Yemen", "Grenst aan de Verenigde Arabische Emiraten, Saoedi-Arabië en Jemen"], ["currency", "Rial", "Rial"], ["capital", "Muscat", "Masqat"]],
    ["UZ", C.AS, ["geography", "Doubly landlocked in Central Asia", "Dubbel ingesloten door land in Centraal-Azië"], ["landmark", "Silk Road cities Samarkand and Bukhara", "Zijderoutesteden Samarkand en Buchara"], ["currency", "Som", "Sum"], ["capital", "Tashkent", "Tasjkent"]],
    ["BT", C.AS, ["geography", "A landlocked kingdom in the eastern Himalayas", "Een koninkrijk zonder kust in de oostelijke Himalaya"], ["landmark", "Measures progress with Gross National Happiness", "Meet vooruitgang met Bruto Nationaal Geluk"], ["currency", "Ngultrum", "Ngultrum"], ["capital", "Thimphu", "Thimphu"]],
    ["KE", C.AF, ["geography", "Straddles the equator, with a coast on the Indian Ocean", "Ligt op de evenaar, met een kust aan de Indische Oceaan"], ["landmark", "The Maasai Mara savannah and its great migration", "De savanne van de Maasai Mara en de grote trek"], ["currency", "Shilling", "Shilling"], ["capital", "Nairobi", "Nairobi"]],
    ["EG", C.AF, ["geography", "Desert land along the Nile, reaching into Asia via Sinai", "Woestijnland langs de Nijl dat via de Sinaï tot in Azië reikt"], ["landmark", "The pyramids of Giza", "De piramides van Gizeh"], ["currency", "Pound", "Pond"], ["capital", "Cairo", "Caïro"]],
    ["GH", C.AF, ["geography", "Gulf of Guinea coast and the huge man-made Lake Volta", "Kust aan de Golf van Guinee en het enorme Voltameer"], ["currency", "Cedi", "Cedi"], ["neighbours", "Borders Ivory Coast, Burkina Faso and Togo", "Grenst aan Ivoorkust, Burkina Faso en Togo"], ["capital", "Accra", "Accra"]],
    ["MG", C.AF, ["geography", "A very large island off Africa's south-east coast", "Een zeer groot eiland voor de zuidoostkust van Afrika"], ["landmark", "Home of lemurs and avenues of baobabs", "Thuis van lemuren en lanen met baobabs"], ["currency", "Ariary", "Ariary"], ["capital", "Antananarivo", "Antananarivo"]],
    ["NA", C.AF, ["geography", "Atlantic coast with one of the oldest deserts on Earth", "Atlantische kust met een van de oudste woestijnen ter wereld"], ["neighbours", "Borders Angola, Zambia, Botswana and South Africa", "Grenst aan Angola, Zambia, Botswana en Zuid-Afrika"], ["currency", "Dollar", "Dollar"], ["capital", "Windhoek", "Windhoek"]],
    ["ET", C.AF, ["geography", "Landlocked highlands in the Horn of Africa", "Hooglanden zonder kust in de Hoorn van Afrika"], ["language", "Amharic is the main working language", "Amhaars is de belangrijkste werktaal"], ["population", "Over 100 million", "Meer dan 100 miljoen"], ["capital", "Addis Ababa", "Addis Abeba"]],
    ["SN", C.AF, ["geography", "Includes the westernmost point of mainland Africa", "Omvat het westelijkste punt van het Afrikaanse vasteland"], ["neighbours", "Almost completely surrounds The Gambia", "Omringt Gambia bijna volledig"], ["currency", "West African CFA franc", "West-Afrikaanse CFA-frank"], ["capital", "Dakar", "Dakar"]],
    ["TZ", C.AF, ["geography", "Home to Africa's highest mountain", "Heeft de hoogste berg van Afrika"], ["landmark", "The Serengeti and the island of Zanzibar", "De Serengeti en het eiland Zanzibar"], ["currency", "Shilling", "Shilling"], ["capital", "Dodoma", "Dodoma"]],
    ["NG", C.AF, ["geography", "A great river delta on the Gulf of Guinea", "Een grote rivierdelta aan de Golf van Guinee"], ["population", "The most populous country in Africa", "Het land met de meeste inwoners van Afrika"], ["currency", "Naira", "Naira"], ["capital", "Abuja", "Abuja"]],
    ["BW", C.AF, ["geography", "Landlocked, with the huge inland Okavango Delta", "Geen kust, met de enorme Okavangodelta in het binnenland"], ["neighbours", "Borders South Africa, Namibia, Zimbabwe and Zambia", "Grenst aan Zuid-Afrika, Namibië, Zimbabwe en Zambia"], ["currency", "Pula", "Pula"], ["capital", "Gaborone", "Gaborone"]],
    ["CA", C.NA, ["geography", "The second-largest country in the world by area", "Het op één na grootste land ter wereld qua oppervlakte"], ["language", "English and French", "Engels en Frans"], ["neighbours", "Its only land border is with the United States", "Heeft alleen een landgrens met de Verenigde Staten"], ["capital", "Ottawa", "Ottawa"]],
    ["MX", C.NA, ["geography", "Coasts on both the Pacific and the Gulf", "Kusten aan de Stille Oceaan en aan de Golf"], ["landmark", "The Maya pyramid of Chichén Itzá", "De Mayapiramide van Chichén Itzá"], ["currency", "Peso", "Peso"], ["capital", "The capital shares its name with the country", "De hoofdstad draagt dezelfde naam als het land"]],
    ["CU", C.NA, ["geography", "The largest island in the Caribbean", "Het grootste eiland in het Caribisch gebied"], ["landmark", "Classic 1950s cars in the capital's streets", "Klassieke auto's uit de jaren 50 in de straten van de hoofdstad"], ["currency", "Peso", "Peso"], ["capital", "Havana", "Havana"]],
    ["CR", C.NA, ["geography", "Rainforests and volcanoes, with coasts on two oceans", "Regenwouden en vulkanen, met kusten aan twee oceanen"], ["landmark", "Abolished its army in 1948", "Schafte zijn leger af in 1948"], ["neighbours", "Borders Nicaragua and Panama", "Grenst aan Nicaragua en Panama"], ["capital", "San José", "San José"]],
    ["JM", C.NA, ["geography", "A Caribbean island south of Cuba", "Een Caribisch eiland ten zuiden van Cuba"], ["landmark", "The birthplace of reggae", "De geboorteplaats van reggae"], ["currency", "Dollar", "Dollar"], ["capital", "Kingston", "Kingston"]],
    ["PA", C.NA, ["geography", "A narrow isthmus linking two continents", "Een smalle landengte die twee continenten verbindt"], ["landmark", "A canal between the Atlantic and the Pacific", "Een kanaal tussen de Atlantische en de Stille Oceaan"], ["currency", "Balboa and US dollar", "Balboa en Amerikaanse dollar"], ["capital", "The capital shares its name with the country", "De hoofdstad draagt dezelfde naam als het land"]],
    ["AR", C.SA, ["geography", "Stretches from the tropics down to Tierra del Fuego", "Loopt van de tropen tot Vuurland"], ["currency", "Peso", "Peso"], ["neighbours", "Borders Chile, Bolivia, Paraguay, Brazil and Uruguay", "Grenst aan Chili, Bolivia, Paraguay, Brazilië en Uruguay"], ["capital", "Buenos Aires", "Buenos Aires"]],
    ["CL", C.SA, ["geography", "Extremely long and narrow, along the Pacific", "Extreem lang en smal, langs de Stille Oceaan"], ["landmark", "The Atacama, one of the driest deserts on Earth", "De Atacama, een van de droogste woestijnen ter wereld"], ["currency", "Peso", "Peso"], ["capital", "Santiago", "Santiago"]],
    ["BO", C.SA, ["geography", "Landlocked, with the world's largest salt flat", "Geen kust, met de grootste zoutvlakte ter wereld"], ["language", "Spanish plus indigenous languages such as Quechua and Aymara", "Spaans plus inheemse talen zoals Quechua en Aymara"], ["neighbours", "Borders Peru, Brazil, Paraguay, Argentina and Chile", "Grenst aan Peru, Brazilië, Paraguay, Argentinië en Chili"], ["capital", "Sucre, with the government seated in La Paz", "Sucre, met de regering in La Paz"]],
    ["CO", C.SA, ["geography", "Coasts on both the Pacific and the Caribbean", "Kusten aan de Stille Oceaan en de Caribische Zee"], ["landmark", "Famous for coffee and emeralds", "Beroemd om koffie en smaragden"], ["neighbours", "Borders Panama, Venezuela, Brazil, Peru and Ecuador", "Grenst aan Panama, Venezuela, Brazilië, Peru en Ecuador"], ["capital", "Bogotá", "Bogota"]],
    ["UY", C.SA, ["geography", "A small country on the Río de la Plata estuary", "Een klein land aan de monding van de Río de la Plata"], ["neighbours", "Lies between Argentina and Brazil", "Ligt tussen Argentinië en Brazilië"], ["currency", "Peso", "Peso"], ["capital", "Montevideo", "Montevideo"]],
    ["AU", C.OC, ["geography", "A country that covers an entire continent", "Een land dat een heel continent beslaat"], ["landmark", "The giant red rock Uluru", "De reusachtige rode rots Uluru"], ["currency", "Dollar", "Dollar"], ["capital", "Canberra", "Canberra"]],
    ["FJ", C.OC, ["geography", "More than 300 islands in the South Pacific", "Meer dan 300 eilanden in de Stille Zuidzee"], ["landmark", "A rugby sevens powerhouse", "Een grootmacht in rugby sevens"], ["currency", "Dollar", "Dollar"], ["capital", "Suva", "Suva"]],
    ["PG", C.OC, ["geography", "The eastern half of the island of New Guinea", "De oostelijke helft van het eiland Nieuw-Guinea"], ["language", "More than 800 languages are spoken", "Er worden meer dan 800 talen gesproken"], ["neighbours", "Its only land border is with Indonesia", "Heeft alleen een landgrens met Indonesië"], ["capital", "Port Moresby", "Port Moresby"]],
  ].map(([countryCode, ...clues], i) => ({
    id: `country-${String(i + 8).padStart(3, "0")}`,
    countryCode: countryCode as string,
    clues: (clues as ClueDef[]).map(clue),
  })),
];
