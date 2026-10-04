import { useEffect, useState } from "react";
import { getDailyGame, type DailyGame } from "@/engine/dailyGameService";
import { dayKey } from "@/services/dateService";

/** Keeps the current daily game, or swaps to the new one once the UTC day has changed. */
export function nextDaily(current: DailyGame, now: Date): DailyGame {
  return current.dayKey === dayKey(now) ? current : getDailyGame(now);
}

/**
 * Today's Randodle, kept current: when the UTC day rolls over while the page
 * is open, the new daily game is loaded. Nothing is submitted automatically.
 */
export function useDailyGame(): DailyGame {
  const [daily, setDaily] = useState<DailyGame>(() => getDailyGame());

  useEffect(() => {
    const check = () => {
      const now = new Date();
      setDaily((current) => nextDaily(current, now));
    };
    check();
    const id = window.setInterval(check, 1000);
    document.addEventListener("visibilitychange", check);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  return daily;
}
