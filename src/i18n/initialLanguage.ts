import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { getLanguage, isLanguage, LANGUAGE_COOKIE, type Language } from "./index";

/** Saved language: request cookie on the server, stored choice in the browser. English if none. */
export const readInitialLanguage = createIsomorphicFn()
  .server((): Language => {
    const v = getCookie(LANGUAGE_COOKIE);
    return isLanguage(v) ? v : "en";
  })
  .client((): Language => getLanguage());
