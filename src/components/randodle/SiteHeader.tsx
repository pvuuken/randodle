import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-4">
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
        <nav aria-label="Main" className="flex items-center gap-1 text-sm font-semibold">
          <Link
            to="/play"
            className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            activeProps={{ className: "text-accent" }}
          >
            Today
          </Link>
          <Link
            to="/how-to-play"
            className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            activeProps={{ className: "text-accent" }}
          >
            How to Play
          </Link>
        </nav>
      </div>
    </header>
  );
}
