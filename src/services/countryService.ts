import { COUNTRIES, countryByCode, type Country } from "@/data/countryList";
import { isAnswerCorrect } from "@/services/answerService";
import type { Language } from "@/i18n";

export { countryByCode };
export type { Country };

/** Resolves a typed answer in any supported language (name or alias) to a country. */
export function resolveCountry(input: string): Country | undefined {
  // Official names first, so an alias can never shadow another country's real name.
  return (
    COUNTRIES.find((x) => isAnswerCorrect(input, x.name.en, [x.name.nl])) ??
    COUNTRIES.find((x) => isAnswerCorrect(input, "", [...x.aliases.en, ...x.aliases.nl]))
  );
}

export const countryName = (country: Country, lang: Language): string => country.name[lang];

/** Localized display name for a stored English name or code; falls back to the input. */
export function localizeCountry(value: string, lang: Language): string {
  const country = countryByCode(value) ?? resolveCountry(value);
  return country ? country.name[lang] : value;
}

export interface Suggestion {
  value: string;
  /** Extra searchable text (aliases) shown alongside the value. */
  label?: string;
}

/** Autocomplete entries in the current language. Suggestions never decide validity. */
export function countrySuggestions(lang: Language): Suggestion[] {
  return COUNTRIES.map((x) => {
    const aliases = x.aliases[lang];
    return { value: x.name[lang], ...(aliases.length ? { label: aliases.join(", ") } : {}) };
  }).sort((a, b) => a.value.localeCompare(b.value, lang));
}
