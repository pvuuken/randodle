import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { GameHost } from "@/components/randodle/GameHost";
import { getDailyGame } from "@/engine/dailyGameService";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Today's Randodle — play the daily game" },
      {
        name: "description",
        content: "Play today's Randodle. One puzzle, one day, one streak — the game type changes daily.",
      },
      { property: "og:title", content: "Today's Randodle" },
      { property: "og:description", content: "One puzzle a day, and you never know which game you'll get." },
    ],
  }),
  component: PlayPage,
});

function PlayPage() {
  const daily = useMemo(() => getDailyGame(), []);
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-20 pt-8 sm:pt-12">
      <GameHost
        edition={daily.edition}
        dayKey={daily.dayKey}
        game={daily.game}
        puzzle={daily.puzzle}
      />
    </main>
  );
}
