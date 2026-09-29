import type { Clue } from "@/types/game";

export function ClueList({ clues, revealed }: { clues: Clue[]; revealed: number }) {
  const shown = clues.slice(0, Math.max(1, revealed));
  return (
    <ol className="space-y-3" aria-label="Clues revealed so far">
      {shown.map((clue, i) => (
        <li
          key={clue.label}
          className="animate-rise rounded-2xl border border-border bg-card px-4 py-3 shadow-card"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <span aria-hidden="true">{clue.icon} </span>
            Clue {i + 1} — {clue.label}
          </p>
          <p className="mt-1 text-lg font-medium text-foreground">{clue.value}</p>
        </li>
      ))}
    </ol>
  );
}
