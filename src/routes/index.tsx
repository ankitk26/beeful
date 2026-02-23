import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useCallback } from 'react';
import { GameArea } from '../components/game-area';
import { WordList } from '../components/word-list';
import { getDailyPuzzle, isValidWord, calculateScore, hashString } from '../utils/game';
import { useDailyGameState } from '../hooks/use-game-state';

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [puzzle, setPuzzle] = useState(() => getDailyPuzzle());
  const [input, setInput] = useState('');
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
    setInput(prev => prev + letter);
  }, []);

  const handleDelete = useCallback(() => {
    setInput(prev => prev.slice(0, -1));
  }, []);

  const handleShuffle = useCallback(() => {
    if (!puzzle) return;
    setPuzzle(prev => {
      if (!prev) return prev;
      const outerLetters = prev.letters.filter((l: string) => l !== prev.centerLetter);
      for (let i = outerLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [outerLetters[i], outerLetters[j]] = [outerLetters[j], outerLetters[i]];
      }
      return {
        ...prev,
        letters: [prev.centerLetter, ...outerLetters]
      };
    });
  }, [puzzle]);

  const handleEnter = useCallback(async () => {
    if (!puzzle) return;

    if (input.length === 0) return;

    if (foundWords.includes(input.toLowerCase())) {
      setMessage('Already found');
      setInput('');
      return;
    }

    const structCheck = isValidWord(input, puzzle.centerLetter, puzzle.letters);
    if (!structCheck.valid) {
      setMessage(structCheck.error || 'Invalid word');
      setTimeout(() => setInput(''), 600);
      return;
    }

    // Hash check security with salt!
    const saltedInput = `${input.toLowerCase()}-${puzzle.date}-BEEFUL`;
    const hashedInput = await hashString(saltedInput);
    if (!puzzle.validHashes.includes(hashedInput)) {
      setMessage('Not in word list');
      setTimeout(() => setInput(''), 600);
      return;
    }

    // Valid word!
    const wordScore = calculateScore(input.toLowerCase());
    const isPangram = new Set(input.toLowerCase()).size === 7;

    setGameState(prev => ({
      foundWords: [...prev.foundWords, input.toLowerCase()],
      score: prev.score + wordScore
    }));

    setInput('');
    setMessage(isPangram ? 'Pangram!' : 'Awesome!');

  }, [input, puzzle, foundWords, setGameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!puzzle) return;
      if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleEnter();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        const letter = e.key.toLowerCase();
        handleLetterClick(letter);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [puzzle, handleDelete, handleEnter, handleLetterClick]);


  if (!puzzle) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-slate-500 animate-pulse font-serif italic text-xl">Loading Puzzle...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-mauve-200 flex flex-col">
      <header className="px-6 py-5 border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-serif italic">
              Beeful
            </h1>
            <span className="text-xs text-slate-500 font-medium tracking-widest uppercase mt-1">
              {new Date(puzzle.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <a
            href="/history"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full"
          >
            History
          </a>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 py-4 md:py-8 px-4 md:px-6 mb-12">
        <div className="flex-1 w-full flex justify-center">
          <GameArea
            input={input}
            centerLetter={puzzle.centerLetter}
            letters={puzzle.letters}
            onLetterClick={handleLetterClick}
            onDelete={handleDelete}
            onShuffle={handleShuffle}
            onEnter={handleEnter}
            message={message}
          />
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <WordList
            words={foundWords}
            totalScore={score}
          />
        </div>
      </main>
    </div>
  );
}
