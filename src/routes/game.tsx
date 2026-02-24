import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { GameArea } from "../components/game-area";
import { WordList } from "../components/word-list";
import {
  getDailyPuzzle,
  isValidWord,
  calculateScore,
  hashString,
} from "../utils/game";
import { useDailyGameState } from "../hooks/use-game-state";

export const Route = createFileRoute("/game")({ component: App });

function App() {
  const [puzzle] = useState(() => getDailyPuzzle());
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  // Auto-clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Use our persistence hook linked to today's date
  const { gameState, setGameState } = useDailyGameState(puzzle.date);

  const { foundWords, score } = gameState;

  const handleLetterClick = useCallback((letter: string) => {
    setInput((prev) => prev + letter);
  }, []);

  const handleDelete = useCallback(() => {
    setInput((prev) => prev.slice(0, -1));
  }, []);

  // Separate display order from puzzle data
  const [shuffledOuter, setShuffledOuter] = useState(() =>
    puzzle.letters.filter((l: string) => l !== puzzle.centerLetter),
  );

  const handleShuffle = useCallback(() => {
    setShuffledOuter((prev: string[]) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
  }, []);

  const handleEnter = useCallback(async () => {
    if (!puzzle) return;

    if (input.length === 0) return;

    if (foundWords.includes(input.toLowerCase())) {
      setMessage("Already found");
      setInput("");
      return;
    }

    const structCheck = isValidWord(input, puzzle.centerLetter, puzzle.letters);
    if (!structCheck.valid) {
      setMessage(structCheck.error || "Invalid word");
      setTimeout(() => setInput(""), 600);
      return;
    }

    // Hash check security with salt!
    const saltedInput = `${input.toLowerCase()}-${puzzle.date}-BEEFUL`;
    const hashedInput = await hashString(saltedInput);
    if (!puzzle.validHashes.includes(hashedInput)) {
      setMessage("Not in word list");
      setTimeout(() => setInput(""), 600);
      return;
    }

    // Valid word!
    const wordScore = calculateScore(input.toLowerCase());

    setGameState((prev) => ({
      foundWords: [...prev.foundWords, input.toLowerCase()],
      score: prev.score + wordScore,
    }));

    setInput("");
  }, [input, puzzle, foundWords, setGameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!puzzle) return;
      if (e.key === "Backspace") {
        handleDelete();
      } else if (e.key === "Enter") {
        handleEnter();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        const letter = e.key.toLowerCase();
        handleLetterClick(letter);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [puzzle, handleDelete, handleEnter, handleLetterClick]);

  if (!puzzle)
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-neutral-500 animate-pulse text-xl">
          Loading Puzzle...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans flex flex-col">
      <header className="px-4 py-4 border-b border-neutral-300 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-baseline gap-4">
            <a
              href="/"
              className="text-[22px] font-semibold text-neutral-900 tracking-tight hover:text-sky-600 transition-colors"
            >
              Beeful
            </a>
            <span className="text-[10px] text-neutral-500 font-medium tracking-[0.2em] uppercase hidden sm:inline">
              {new Date(puzzle.date).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <a
            href="/history"
            className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 transition-colors tracking-[0.1em] uppercase"
          >
            History
          </a>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8 pt-6 md:pt-10 pb-8 px-4">
        {/* Mobile: word list on top */}
        <div className="w-full lg:hidden">
          <WordList
            words={foundWords}
            totalScore={score}
            centerLetter={puzzle.centerLetter}
          />
        </div>

        <div className="flex-1 w-full flex justify-center">
          <GameArea
            input={input}
            centerLetter={puzzle.centerLetter}
            letters={[puzzle.centerLetter, ...shuffledOuter]}
            onLetterClick={handleLetterClick}
            onDelete={handleDelete}
            onShuffle={handleShuffle}
            onEnter={handleEnter}
            message={message}
          />
        </div>

        {/* Desktop: word list sidebar */}
        <div className="hidden lg:block w-80 shrink-0">
          <WordList
            words={foundWords}
            totalScore={score}
            centerLetter={puzzle.centerLetter}
          />
        </div>
      </main>
    </div>
  );
}
