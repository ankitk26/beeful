import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import dailyPuzzles from "../utils/daily-puzzles.json";
import { ScoreCounter } from "../components/score-counter";

export const Route = createFileRoute("/history")({ component: HistoryPage });

interface GameEntry {
  date: string;
  centerLetter: string;
  letters: string;
  played: boolean;
  score: number;
  wordsCount: number;
  words?: string[];
}

function HistoryPage() {
  const [history, setHistory] = useState<GameEntry[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameEntry | null>(null);

  useEffect(() => {
    const puzzleMap = dailyPuzzles as any;
    const allDates = Object.keys(puzzleMap).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );

    const entries: GameEntry[] = allDates
      .filter((dateStr) => new Date(dateStr).getTime() <= Date.now())
      .map((dateStr) => {
        const puzzle = puzzleMap[dateStr];
        const saved = localStorage.getItem(`beeful-game-${dateStr}`);
        let played = false;
        let score = 0;
        let wordsCount = 0;
        let words: string[] = [];

        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.foundWords && parsed.foundWords.length > 0) {
              played = true;
              score = parsed.score;
              wordsCount = parsed.foundWords.length;
              words = parsed.foundWords;
            }
          } catch {
            /* empty */
          }
        }

        return {
          date: dateStr,
          centerLetter: puzzle.centerLetter,
          letters: puzzle.letters.join("").toUpperCase(),
          played,
          score,
          wordsCount,
          words,
        };
      });

    const mockEntries: GameEntry[] = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      centerLetter: "E",
      letters: "ABCDEF",
      played: true,
      score: Math.floor(Math.random() * 500) + 100,
      wordsCount: Math.floor(Math.random() * 20) + 5,
      words: Array.from({ length: 25 }, (_, j) => `word${j + 1}`),
    }));

    const allEntries = [...entries, ...mockEntries];
    setHistory(allEntries);
    if (entries.some((e) => e.played)) {
      const firstPlayed = entries.find((e) => e.played);
      if (firstPlayed) {
        const extendedWords = [
          ...(firstPlayed.words || []),
          ...Array.from({ length: 50 }, (_, i) => `testword${i + 1}`),
        ];
        setSelectedGame({
          ...firstPlayed,
          words: extendedWords,
          wordsCount: extendedWords.length,
          score: firstPlayed.score + 100,
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans flex flex-col">
      <header className="px-4 lg:px-0 py-4 border-b border-neutral-300 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            History
          </span>
          <a
            href="/game"
            className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 transition-colors tracking-widest uppercase"
          >
            Back to Game
          </a>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto pt-6 md:pt-10 pb-8 px-4 lg:px-0">
        {history.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border border-neutral-300 text-center max-w-3xl">
            <div className="text-neutral-400 text-2xl mb-2">No Puzzles Yet</div>
            <p className="text-neutral-500 text-sm">
              Check back later for daily puzzles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 w-full max-w-5xl mx-auto">
            {/* Left column: Game list - scrollable on desktop */}
            <div className="space-y-2 lg:overflow-y-auto lg:max-h-[calc(100vh-140px)] lg:pr-2">
              {history.map((game) => (
                <div key={game.date}>
                  <button
                    onClick={() =>
                      game.played &&
                      setSelectedGame(
                        selectedGame?.date === game.date ? null : game,
                      )
                    }
                    disabled={!game.played}
                    className={`w-full px-5 py-4 rounded-xl border text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                      game.played
                        ? selectedGame?.date === game.date
                          ? "bg-sky-50 border-sky-400 rounded-b-none lg:rounded-b-xl"
                          : "bg-white border-neutral-300 hover:border-neutral-400 cursor-pointer"
                        : "bg-neutral-100 border-neutral-200 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div>
                      <h3 className="text-[15px] font-semibold text-neutral-900 mb-0.5">
                        {new Date(game.date).toLocaleDateString(undefined, {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </h3>
                      <div className="flex items-center gap-3 text-[12px]">
                        <span className="text-neutral-600 font-mono tracking-[0.2em]">
                          {game.letters}
                        </span>
                        <span className="text-neutral-500">
                          Center:{" "}
                          <strong className="text-neutral-700">
                            {game.centerLetter.toUpperCase()}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {game.played ? (
                      <div className="flex gap-6 sm:text-right shrink-0">
                        <div>
                          <span className="block text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-semibold mb-0.5">
                            Words
                          </span>
                          <span className="text-lg font-bold text-neutral-900">
                            {game.wordsCount}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-semibold mb-0.5">
                            Score
                          </span>
                          <span className="text-lg text-sky-600 font-bold">
                            <ScoreCounter value={game.score} />
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[12px] font-medium text-neutral-400 shrink-0 tracking-wide">
                        Not played
                      </span>
                    )}
                  </button>

                  {/* Mobile expanded words - inline accordion */}
                  {game.played && selectedGame?.date === game.date && (
                    <div className="bg-white border border-t-0 border-sky-400 rounded-b-xl p-4 lg:hidden">
                      <div className="flex items-end justify-between mb-4 pb-4 border-b border-neutral-200">
                        <div>
                          <p className="text-neutral-500 text-[11px] font-medium tracking-[0.15em] uppercase">
                            {game.wordsCount} words found
                          </p>
                        </div>
                        <span className="text-2xl font-semibold text-sky-600 leading-none">
                          <ScoreCounter value={game.score} />
                        </span>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto pr-1">
                        {game.words!.length === 0 ? (
                          <p className="text-neutral-400 text-center py-4">
                            No words found
                          </p>
                        ) : (
                          <ul className="space-y-1">
                            {[...game.words!]
                              .sort((a, b) => {
                                const aPangram = new Set(a).size === 7;
                                const bPangram = new Set(b).size === 7;
                                if (aPangram && !bPangram) return -1;
                                if (!aPangram && bPangram) return 1;
                                return b.length - a.length;
                              })
                              .map((word, idx) => (
                                <li
                                  key={idx}
                                  className="py-2 px-3 hover:bg-neutral-50 transition-colors font-medium text-neutral-700 border-b border-neutral-100 last:border-0 flex items-center justify-between text-[15px] rounded-lg"
                                >
                                  <span>
                                    {word
                                      .toUpperCase()
                                      .split("")
                                      .map((char, i) => (
                                        <span
                                          key={i}
                                          className={
                                            char ===
                                            game.centerLetter.toUpperCase()
                                              ? "text-sky-600 font-bold"
                                              : ""
                                          }
                                        >
                                          {char}
                                        </span>
                                      ))}
                                  </span>
                                  {new Set(word).size === 7 && (
                                    <span className="text-[9px] uppercase tracking-[0.15em] bg-sky-600 text-white px-2.5 py-0.5 rounded-full font-bold">
                                      Pangram
                                    </span>
                                  )}
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: Right column - shown only on lg screens */}
            <div className="hidden lg:block lg:sticky lg:top-20 h-[calc(100vh-140px)]">
              {selectedGame ? (
                <div className="bg-white rounded-2xl border border-neutral-300 p-6 h-full flex flex-col">
                  <div className="flex items-end justify-between mb-5 pb-5 border-b border-neutral-200 shrink-0">
                    <div>
                      <h2 className="text-xl font-medium text-neutral-900">
                        {new Date(selectedGame.date).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" },
                        )}
                      </h2>
                      <p className="text-neutral-500 text-[11px] font-medium mt-1 tracking-[0.15em] uppercase">
                        {selectedGame.wordsCount} words found
                      </p>
                    </div>
                    <span className="text-4xl font-semibold text-sky-600 leading-none">
                      <ScoreCounter value={selectedGame.score} />
                    </span>
                  </div>

                  <div className="overflow-y-auto flex-1 pr-1">
                    {selectedGame.words!.length === 0 ? (
                      <p className="text-neutral-400 text-center py-8">
                        No words found
                      </p>
                    ) : (
                      <ul className="space-y-1">
                        {[...selectedGame.words!]
                          .sort((a, b) => {
                            const aPangram = new Set(a).size === 7;
                            const bPangram = new Set(b).size === 7;
                            if (aPangram && !bPangram) return -1;
                            if (!aPangram && bPangram) return 1;
                            return b.length - a.length;
                          })
                          .map((word, idx) => (
                            <li
                              key={idx}
                              className="py-2 px-3 hover:bg-neutral-50 transition-colors font-medium text-neutral-700 border-b border-neutral-100 last:border-0 flex items-center justify-between text-[15px] rounded-lg"
                            >
                              <span>
                                {word
                                  .toUpperCase()
                                  .split("")
                                  .map((char, i) => (
                                    <span
                                      key={i}
                                      className={
                                        char ===
                                        selectedGame.centerLetter.toUpperCase()
                                          ? "text-sky-600 font-bold"
                                          : ""
                                      }
                                    >
                                      {char}
                                    </span>
                                  ))}
                              </span>
                              {new Set(word).size === 7 && (
                                <span className="text-[9px] uppercase tracking-[0.15em] bg-sky-600 text-white px-2.5 py-0.5 rounded-full font-bold">
                                  Pangram
                                </span>
                              )}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-neutral-300 p-12 text-center">
                  <p className="text-neutral-400">
                    Select a played game to view words
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
