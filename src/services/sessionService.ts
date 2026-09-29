import type { GameState } from "@/types/game";
import { storageService } from "./storageService";

export interface StoredSession {
  gameId: string;
  puzzleId: string;
  state: GameState;
  score: number;
  recorded: boolean;
}

const key = (dayKey: string) => `session:${dayKey}`;

/** Persists today's progress so a refresh never loses a run. */
export const sessionService = {
  load(dayKey: string): StoredSession | null {
    return storageService.read<StoredSession | null>(key(dayKey), null);
  },
  save(dayKey: string, session: StoredSession): void {
    storageService.write(key(dayKey), session);
  },
  clear(dayKey: string): void {
    storageService.remove(key(dayKey));
  },
};
