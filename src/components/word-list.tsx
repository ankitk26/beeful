
import { useState } from 'react';

interface WordListProps {
    words: string[];
    totalScore: number;
}

export function WordList({ words, totalScore }: WordListProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full">
            {/* Mobile: collapsible bar */}
            <div className="lg:hidden">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl cursor-pointer group"
                >
                    <span className="text-sm text-slate-500 font-medium truncate max-w-[55%]">
                        {words.length === 0 ? 'Your words ...' : words.slice(-3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(', ')}
                        {words.length > 3 && ` +${words.length - 3}`}
                    </span>
                    <div className="flex items-center gap-2">
                        {words.length > 0 && (
                            <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full tracking-wide">{totalScore}</span>
                        )}
                        <svg
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>

                {isExpanded && (
                    <div className="mt-1.5 p-4 bg-white border border-slate-200 rounded-xl max-h-48 overflow-y-auto">
                        {words.length === 0 ? (
                            <p className="text-slate-300 italic text-center text-sm py-4 font-serif">No words found yet</p>
                        ) : (
                            <ul className="space-y-0">
                                {[...words].reverse().map((word, idx) => (
                                    <li
                                        key={idx}
                                        className="py-1.5 px-2 font-medium text-slate-700 capitalize flex items-center justify-between text-sm border-b border-slate-100 last:border-0"
                                    >
                                        <span>{word}</span>
                                        {new Set(word).size === 7 && (
                                            <span className="text-[9px] uppercase tracking-[0.15em] bg-sky-500 text-white px-2 py-0.5 rounded-full font-bold">Pangram</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Desktop: sidebar */}
            <div className="hidden lg:flex flex-col p-6 rounded-2xl bg-white border border-slate-200 h-full max-h-[520px]">
                <div className="flex items-end justify-between mb-5 pb-5 border-b border-slate-100">
                    <div>
                        <h2 className="text-2xl font-medium text-slate-900 font-serif">Words</h2>
                        <p className="text-slate-400 text-[11px] font-medium mt-1 tracking-[0.15em] uppercase">{words.length} found</p>
                    </div>
                    <span className="text-4xl font-semibold text-sky-500 font-serif leading-none">{totalScore}</span>
                </div>

                <div className="flex-1 overflow-y-auto pr-1">
                    {words.length === 0 ? (
                        <p className="text-slate-300 italic text-center mt-12 font-serif text-lg">No words yet</p>
                    ) : (
                        <ul className="mt-1">
                            {[...words].reverse().map((word, idx) => (
                                <li
                                    key={idx}
                                    className="py-2.5 px-2 hover:bg-slate-50 transition-colors font-medium text-slate-700 capitalize border-b border-slate-100 last:border-0 flex items-center justify-between text-[15px] rounded-lg"
                                >
                                    <span>{word}</span>
                                    {new Set(word).size === 7 && (
                                        <span className="text-[9px] uppercase tracking-[0.15em] bg-sky-500 text-white px-2.5 py-0.5 rounded-full font-bold">Pangram</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
