import { describe, expect, test } from "bun:test";
import { isAnswerCorrect, normalizeAnswer } from "../src/services/answerService";

const CANON = "The Dark Knight";
const ALIASES = ["Dark Knight"];

describe("normalizeAnswer", () => {
  test("case and whitespace", () => {
    expect(normalizeAnswer("The Dark Knight")).toBe("the dark knight");
    expect(normalizeAnswer("  the   dark knight  ")).toBe("the dark knight");
    expect(normalizeAnswer("DARK KNIGHT")).toBe("dark knight");
  });
  test("diacritics", () => {
    expect(normalizeAnswer("België")).toBe(normalizeAnswer("Belgie"));
  });
});

describe("isAnswerCorrect", () => {
  test("canonical", () => expect(isAnswerCorrect("The Dark Knight", CANON, ALIASES)).toBe(true));
  test("alias", () => expect(isAnswerCorrect("Dark Knight", CANON, ALIASES)).toBe(true));
  test("case", () => expect(isAnswerCorrect("THE DARK KNIGHT", CANON, ALIASES)).toBe(true));
  test("whitespace", () => expect(isAnswerCorrect("  The Dark Knight  ", CANON, ALIASES)).toBe(true));
  test("invalid", () => expect(isAnswerCorrect("Batman Begins", CANON, ALIASES)).toBe(false));
  test("dutch diacritics", () => expect(isAnswerCorrect("Belgie", "België")).toBe(true));
  test("empty input", () => {
    expect(isAnswerCorrect("", CANON, ALIASES)).toBe(false);
    expect(isAnswerCorrect("   ", CANON, ALIASES)).toBe(false);
  });
  test("aliases optional", () => {
    expect(isAnswerCorrect("the dark knight", CANON)).toBe(true);
    expect(isAnswerCorrect("Dark Knight", CANON)).toBe(false);
  });
  test("validation takes no suggestion list", () => {
    // Signature has no suggestions parameter: an alias absent from any autocomplete list is still accepted.
    expect(isAnswerCorrect("Dark Knight", CANON, ALIASES)).toBe(true);
  });
});
