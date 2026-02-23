import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useCallback } from 'react';
import { GameArea } from '../components/GameArea';
import { WordList } from '../components/WordList';
import { generatePuzzle, isValidWord, calculateScore } from '../utils/game';

import allWordsList from '../utils/words.json';
import allPangramsList from '../utils/pangrams.json';

const allWordsSet = new Set(allWordsList);

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [puzzle, setPuzzle] = useState<{ centerLetter: string, letters: string[] } | null>(null);
  const [input, setInput] = useState('');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  // Auto-clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    setPuzzle(generatePuzzle(allPangramsList));
  }, []);

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
      const outerLetters = prev.letters.filter(l => l !== prev.centerLetter);
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

  const handleEnter = useCallback(() => {
    if (!puzzle) return;

    // Check if empty
    if (input.length === 0) return;

    // Check if already found
    if (foundWords.includes(input.toLowerCase())) {
      setMessage('Already found');
      setInput('');
      return;
    }

    const result = isValidWord(input, puzzle.centerLetter, puzzle.letters, allWordsSet);
    if (!result.valid) {
      setMessage(result.error || 'Invalid word');
      setTimeout(() => setInput(''), 600);
      return;
    }

    // Valid word!
    const wordScore = calculateScore(input.toLowerCase());
    const isPangram = new Set(input.toLowerCase()).size === 7;

    setScore(prev => prev + wordScore);
    setFoundWords(prev => [...prev, input.toLowerCase()]);
    setInput('');

    setMessage(isPangram ? 'Pangram!' : 'Awesome!');

  }, [input, puzzle, foundWords]);

  // Handle keyboard input
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


  if (!puzzle) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-mauve-200">
      <header className="px-6 py-5 border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-serif italic">
            Spelling Bee
          </h1>
          <button
            onClick={() => {
              setPuzzle(generatePuzzle(allPangramsList));
              setFoundWords([]);
              setScore(0);
              setInput('');
            }}
            className="text-sm font-semibold text-slate-500 hover:text-mauve-600 transition-colors bg-slate-100 hover:bg-mauve-50 px-4 py-2 rounded-full"
          >
            New Puzzle
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 py-4 md:py-8 px-4 md:px-6">
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
