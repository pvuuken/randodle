import { useSyncExternalStore } from "react";
import { storageService } from "@/services/storageService";
import { en, type Dictionary } from "./en";
import { nl } from "./nl";

/**
 * Central i18n. Add a language by adding a dictionary + an entry below.
 * Language only changes presentation — never which daily game or puzzle is served.
 */
export const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "nl", label: "NL", name: "Nederlands" },
] as const;

export type Language = (typeof LANGUAGES)[number]["code"];
export type Localized<T> = Partial<Record<Language, T>>;

const DICTIONARIES: Record<Language, Dictionary> = { en, nl };
const DEFAULT: Language = "en";
const STORAGE_KEY = "language";

const isLanguage = (v: unknown): v is Language => LANGUAGES.some((l) => l.code === v);

let current: Language = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

/** Current language outside React (e.g. inside game logic). English until the stored choice loads. */
export function getLanguage(): Language {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    const stored = storageService.read<unknown>(STORAGE_KEY, DEFAULT);
    current = isLanguage(stored) ? stored : DEFAULT;
  }
  return current;
}

export function setLanguage(lang: Language): void {
  current = lang;
  loaded = true;
  storageService.write(STORAGE_KEY, lang);
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useLanguage(): Language {
  return useSyncExternalStore(subscribe, getLanguage, () => DEFAULT);
}

export function useTranslation() {
  const lang = useLanguage();
  return { lang, t: DICTIONARIES[lang], setLanguage };
}

/** Translation of a content object, falling back to the base (English) version. */
export function pickLocale<T extends object>(base: T, translations: Localized<Partial<T>> | undefined, lang: Language): T {
  const tr = translations?.[lang];
  return tr ? { ...base, ...tr } : base;
}

interface LocalizableGame {
  name: string;
  category: string;
  prompt: string;
  howToPlay: string;
  locales?: Localized<Partial<Pick<LocalizableGame, "name" | "category" | "prompt" | "howToPlay">>>;
}

/** Same game module with its display texts in the given language. */
export function localizeGame<G extends LocalizableGame>(game: G, lang: Language): G {
  return pickLocale(game, game.locales as Localized<Partial<G>> | undefined, lang);
}
