import { useState } from "react";
import type { GameState } from "@/types/game";

/** Zoom per number of wrong guesses; the last step shows the full poster. */
export const REVEAL_SCALES = [5, 4, 3, 2, 1] as const;

/** Derived purely from the session's attempts — no separate counter. */
export function revealScale(state: GameState): number {
  if (state.status === "lost") return 1;
  const wrong = state.attempts.filter((a) => a.tone !== "correct").length;
  return REVEAL_SCALES[Math.min(wrong, REVEAL_SCALES.length - 1)] ?? 1;
}

export function PosterReveal({ src, scale, alt, fallback }: { src: string; scale: number; alt: string; fallback: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc === src;
  return (
    <div className="relative mx-auto aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-xl border border-border bg-muted">
      {failed ? (
        <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
          <span>🎬<br />{fallback}</span>
        </div>
      ) : (
        <img
          key={src}
          src={src}
          alt={alt}
          draggable={false}
          onError={() => setFailedSrc(src)}
          className="h-full w-full select-none object-cover"
          style={{ transform: `scale(${scale})`, transformOrigin: "center center", transition: "transform 300ms ease-out" }}
        />
      )}
    </div>
  );
}
