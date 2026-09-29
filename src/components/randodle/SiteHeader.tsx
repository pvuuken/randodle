import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { LANGUAGES, useTranslation } from "@/i18n";

const navLink =
  "rounded-lg px-2 py-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3";

export function SiteHeader() {
  const { lang, t, setLanguage } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span aria-hidden="true" className="text-xl">
            🎲
          </span>
          <span className="font-display text-lg font-extrabold uppercase tracking-[0.2em] text-foreground">
            Randodle
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <nav aria-label={t.header.mainNav} className="flex items-center text-sm font-semibold">
            <Link to="/play" className={navLink} activeProps={{ className: "text-accent" }}>
              {t.header.today}
            </Link>
            <Link to="/stats" className={navLink} activeProps={{ className: "text-accent" }}>
              {t.header.stats}
            </Link>
            <Link to="/how-to-play" className={navLink} activeProps={{ className: "text-accent" }}>
              {t.header.howToPlay}
            </Link>
          </nav>
          <div
            role="group"
            aria-label={t.header.language}
            className="flex items-center rounded-lg border border-border p-0.5 text-xs font-bold"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                lang={l.code}
                aria-pressed={lang === l.code}
                aria-label={l.name}
                onClick={() => setLanguage(l.code)}
                className={`rounded-md px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  lang === l.code ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
