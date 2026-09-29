import type { GameModule, GameState, Puzzle } from "@/types/game";

export interface ShareInput {
  edition: number;
  game: GameModule<Puzzle>;
  state: GameState;
  streak: number;
  /** Localized closing lines; English by default. */
  labels?: { streak: (n: number) => string; beatMe: string };
}

const DEFAULT_LABELS = { streak: (n: number) => `🔥 ${n} day streak`, beatMe: "Can you beat me?" };

/** Spoiler-free share text. Works for every registered game. */
export function buildShareText({ edition, game, state, streak, labels = DEFAULT_LABELS }: ShareInput): string {
  const share = game.getShareResult(state);
  const lines = [
    `🎲 Randodle #${String(edition).padStart(3, "0")}`,
    "",
    `${game.emoji} ${game.name}`,
    "",
    share.squares,
    "",
    share.progress,
  ];
  if (streak > 0) lines.push("", labels.streak(streak));
  lines.push("", labels.beatMe);
  return lines.join("\n");
}

export type ShareOutcome = "shared" | "copied" | "failed";

export async function shareText(text: string): Promise<ShareOutcome> {
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return "failed";
    }
  }
  return copyText(text);
}

export async function copyText(text: string): Promise<ShareOutcome> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return "copied";
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
    return "copied";
  } catch {
    return "failed";
  }
}
