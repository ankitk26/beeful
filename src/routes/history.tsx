import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import dailyPuzzles from '../utils/daily-puzzles.json';

export const Route = createFileRoute('/history')({ component: HistoryPage })

interface GameEntry {
  date: string;
  centerLetter: string;
  letters: string;
  played: boolean;
  score: number;
  wordsCount: number;
}

function HistoryPage() {
  const [history, setHistory] = useState<GameEntry[]>([]);

  useEffect(() => {
    const puzzleMap = dailyPuzzles as any;
    const allDates = Object.keys(puzzleMap).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const entries: GameEntry[] = allDates
      // Only show dates up to today
      .filter(dateStr => new Date(dateStr).getTime() <= Date.now())
      .map(dateStr => {
        const puzzle = puzzleMap[dateStr];
        const saved = localStorage.getItem(`beeful-game-${dateStr}`);
        let played = false;
        let score = 0;
        let wordsCount = 0;

        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.foundWords && parsed.foundWords.length > 0) {
              played = true;
              score = parsed.score;
              wordsCount = parsed.foundWords.length;
            }
          } catch { /* empty */ }
        }

        return {
          date: dateStr,
          centerLetter: puzzle.centerLetter,
          letters: puzzle.letters.join('').toUpperCase(),
          played,
          score,
          wordsCount,
        };
      });

    setHistory(entries);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-mauve-200 flex flex-col">
      <header className="px-6 py-5 border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-serif italic">
              History
            </h1>
          </div>
          <a
            href="/"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full"
          >
            Back to Game
          </a>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto py-8 px-4 md:px-6">
        {history.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="text-slate-400 font-serif italic text-xl mb-2">No Puzzles Available</div>
            <p className="text-slate-500 text-sm">Check back later for daily puzzles.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {history.map(game => (
              <div
                key={game.date}
                className={`p-5 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${game.played
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-50 border-slate-100 opacity-70'
                  }`}
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif mb-0.5">
                    {new Date(game.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="bg-slate-100 text-slate-600 font-mono tracking-widest px-2 py-0.5 rounded text-xs">
                      {game.letters}
                    </span>
                    <span className="text-slate-400 text-xs">
                      Center: <strong className="text-slate-600">{game.centerLetter.toUpperCase()}</strong>
                    </span>
                  </div>
                </div>

                {game.played ? (
                  <div className="flex gap-6 sm:text-right shrink-0">
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Words</span>
                      <span className="text-xl font-bold text-slate-900">{game.wordsCount}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Score</span>
                      <span className="text-xl text-mauve-600 font-black">{game.score}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-slate-400 italic shrink-0">
                    Not played
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
