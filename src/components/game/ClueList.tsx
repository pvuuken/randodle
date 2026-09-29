import type { Clue } from "@/types/game";
import { pickLocale, useTranslation } from "@/i18n";

export function ClueList({ clues, revealed }: { clues: Clue[]; revealed: number }) {
  const { lang, t } = useTranslation();
  const shown = clues.slice(0, Math.max(1, revealed));
  return (
    <ol className="space-y-3" aria-label={t.game.cluesSoFar}>
      {shown.map((base, i) => {
        const clue = pickLocale(base, base.translations, lang);
        return (
        <li
          key={base.label}
          className="animate-rise rounded-2xl border border-border bg-card px-4 py-3 shadow-card"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <span aria-hidden="true">{clue.icon} </span>
            {t.game.clue(i + 1, clue.label)}
          </p>
          <p className="mt-1 text-lg font-medium text-foreground">{clue.value}</p>
        </li>
        );
      })}
    </ol>
  );
}
