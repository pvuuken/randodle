import type { GameState } from "@/types/game";
import { useTranslation } from "@/i18n";

const TONE_STYLES = {
  correct: "border-accent bg-accent/15 text-accent",
  close: "border-warning bg-warning/15 text-warning",
  wrong: "border-border bg-muted text-muted-foreground",
} as const;

const TONE_ICON = { correct: "✓", close: "~", wrong: "✕" } as const;

export function AttemptTrail({ state }: { state: GameState }) {
  const { t } = useTranslation();
  if (state.attempts.length === 0) return null;
  return (
    <ul className="space-y-2" aria-label={t.game.yourGuesses}>
      {state.attempts.map((attempt, i) => (
        <li
          key={`${attempt.value}-${i}`}
          className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-sm ${TONE_STYLES[attempt.tone]}`}
        >
          <span className="flex items-center gap-2 font-medium">
            <span aria-hidden="true" className="font-bold">
              {TONE_ICON[attempt.tone]}
            </span>
            {attempt.value}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide">{t.feedback[attempt.feedback] ?? attempt.feedback}</span>
        </li>
      ))}
    </ul>
  );
}

export function AttemptCounter({ state }: { state: GameState }) {
  const { t } = useTranslation();
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {t.game.attempts} {Math.min(state.attempts.length + (state.status === "playing" ? 1 : 0), state.maxAttempts)} /{" "}
      {state.maxAttempts}
    </p>
  );
}
