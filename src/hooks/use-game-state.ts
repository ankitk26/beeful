import { useState, useEffect } from "react";

// A simple hook to persist daily game state
export function useDailyGameState(dateStr: string) {
  const key = `beeful-game-${dateStr}`;

  const [gameState, setGameState] = useState<{
    foundWords: string[];
    score: number;
  }>(() => {
    if (typeof window === "undefined") return { foundWords: [], score: 0 };
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : { foundWords: [], score: 0 };
    } catch (error) {
      console.error(error);
      return { foundWords: [], score: 0 };
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(gameState));
    } catch (error) {
      console.error(error);
    }
  }, [key, gameState]);

  return { gameState, setGameState };
}
