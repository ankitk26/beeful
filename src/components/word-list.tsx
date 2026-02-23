
interface WordListProps {
    words: string[];
    totalScore: number;
}

export function WordList({ words, totalScore }: WordListProps) {
    return (
        <div className="w-full mx-auto lg:w-80 p-4 md:p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-48 lg:h-full max-h-[500px] flex flex-col shrink-0">
            <div className="flex items-center justify-between mb-3 md:mb-4 pb-3 md:pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 font-serif">Found Words</h2>
                    <p className="text-slate-500 text-xs md:text-sm font-medium">{words.length} words</p>
                </div>
                <div className="text-right">
                    <span className="block text-2xl md:text-3xl font-bold text-slate-900">{totalScore}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
                {words.length === 0 ? (
                    <p className="text-slate-400 italic text-center mt-8">No words found yet</p>
                ) : (
                    <ul className="space-y-1 mt-2">
                        {[...words].reverse().map((word, idx) => (
                            <li
                                key={idx}
                                className="py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-slate-700 capitalize border-b border-slate-100 last:border-0 flex items-center justify-between"
                            >
                                <span>{word}</span>
                                {new Set(word).size === 7 && (
                                    <span className="ml-2 text-[10px] uppercase tracking-wider bg-mauve-500 text-white px-2 py-1 rounded-full font-bold shadow-sm">Pangram</span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
