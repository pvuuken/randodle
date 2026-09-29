import { useId, useState, type ReactNode } from "react";
import { useTranslation } from "@/i18n";

interface GuessFormProps {
  label: string;
  placeholder: string;
  /** Optional autocomplete suggestions. */
  suggestions?: string[];
  inputMode?: "text" | "numeric";
  disabled?: boolean;
  helpText?: ReactNode;
  onSubmit: (value: string) => void;
}

export function GuessForm({
  label,
  placeholder,
  suggestions,
  inputMode = "text",
  disabled = false,
  helpText,
  onSubmit,
}: GuessFormProps) {
  const { t } = useTranslation();
  const inputId = useId();
  const listId = useId();
  const errorId = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) {
          setError(t.game.emptyGuess);
          return;
        }
        setError(null);
        setValue("");
        onSubmit(trimmed);
      }}
    >
      <label htmlFor={inputId} className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          disabled={disabled}
          autoComplete="off"
          list={suggestions ? listId : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className="min-h-13 flex-1 rounded-xl border border-input bg-input-background px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled}
          className="min-h-13 rounded-xl bg-accent px-6 text-base font-bold uppercase tracking-wide text-accent-foreground transition-transform hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:opacity-50"
        >
          {t.game.guess}
        </button>
      </div>
      {suggestions ? (
        <datalist id={listId}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      ) : null}
      {helpText ? <p className="text-xs text-muted-foreground">{helpText}</p> : null}
      <p id={errorId} role="alert" className="min-h-5 text-sm font-medium text-destructive">
        {error}
      </p>
    </form>
  );
}
