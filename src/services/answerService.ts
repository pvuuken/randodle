/**
 * Shared text-answer validation. Separates the canonical answer from optional
 * accepted aliases. Suggestion lists never take part in validation.
 */

/** Deterministic normal form: trimmed, lowercase, no diacritics, single spaces. */
export function normalizeAnswer(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Letters and digits only — matches the previous strict behaviour ("Spider-Man" = "spiderman"). */
function compact(input: string): string {
  return normalizeAnswer(input).replace(/[^a-z0-9]/g, "");
}

export function isAnswerCorrect(input: string, canonicalAnswer: string, aliases: string[] = []): boolean {
  const guess = normalizeAnswer(input);
  if (!guess) return false;
  const guessCompact = compact(input);
  return [canonicalAnswer, ...aliases].some((candidate) => {
    if (!candidate) return false;
    if (normalizeAnswer(candidate) === guess) return true;
    const c = compact(candidate);
    return c.length > 0 && c === guessCompact;
  });
}
