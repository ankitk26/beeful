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
    <div className="min-h-screen bg-[#f7fafe] font-sans flex flex-col">
      <header className="px-4 md:px-6 py-3 border-b border-sky-200/30 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="text-[22px] font-semibold text-sky-950 tracking-tight font-serif italic hover:text-sky-600 transition-colors">
            History
          </a>
          <a
            href="/game"
            className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 transition-colors tracking-[0.1em] uppercase"
          >
            Back to Game
          </a>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto py-8 px-4 md:px-6">
        {history.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border border-sky-200/30 text-center">
            <div className="text-sky-300 font-serif italic text-2xl mb-2">No Puzzles Yet</div>
            <p className="text-sky-400 text-sm">Check back later for daily puzzles.</p>
          </div>
        ) : (
          <div className="grid gap-2.5">
            {history.map(game => (
              <div
                key={game.date}
                className={`px-5 py-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${game.played
                  ? 'bg-white border-sky-200/40 hover:border-sky-300/50'
                  : 'bg-sky-50/30 border-sky-100/40 opacity-50'
                  }`}
              >
                <div>
                  <h3 className="text-[15px] font-semibold text-sky-950 mb-0.5">
                    {new Date(game.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <div className="flex items-center gap-3 text-[12px]">
                    <span className="text-sky-600 font-mono tracking-[0.2em]">
                      {game.letters}
                    </span>
                    <span className="text-sky-400">
                      Center: <strong className="text-sky-700">{game.centerLetter.toUpperCase()}</strong>
                    </span>
                  </div>
                </div>

                {game.played ? (
                  <div className="flex gap-6 sm:text-right shrink-0">
                    <div>
                      <span className="block text-[10px] uppercase tracking-[0.15em] text-sky-400 font-semibold mb-0.5">Words</span>
                      <span className="text-lg font-bold text-sky-950">{game.wordsCount}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-[0.15em] text-sky-400 font-semibold mb-0.5">Score</span>
                      <span className="text-lg text-sky-500 font-bold">{game.score}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-[12px] font-medium text-sky-300 italic shrink-0 tracking-wide">
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
