
import { Hexagon } from './hexagon';

interface GameAreaProps {
    input: string;
    centerLetter: string;
    letters: string[];
    onLetterClick: (letter: string) => void;
    onDelete: () => void;
    onShuffle: () => void;
    onEnter: () => void;
    message: string | null;
}

export function GameArea({
    input,
    centerLetter,
    letters,
    onLetterClick,
    onDelete,
    onShuffle,
    onEnter,
    message,
}: GameAreaProps) {
    // Letters excluding the center letter (expected 6 letters)
    const outerLetters = letters.filter(l => l !== centerLetter);

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto relative pt-4 md:pt-8 pb-8 md:pb-12">

            {/* Toast Message */}
            <div className="h-12 flex items-center justify-center mb-4">
                {message && (
                    <div className="bg-black text-white px-4 py-2 rounded shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                        {message}
                    </div>
                )}
            </div>

            {/* Input Display */}
            <div className="text-2xl md:text-3xl flex-wrap font-bold text-center min-h-[40px] md:min-h-[48px] mb-6 md:mb-8 uppercase tracking-widest flex items-center justify-center px-4">
                {input && input.length > 0 ? (
                    input.split('').map((char, i) => {
                        const isCenter = char === centerLetter;
                        const isInvalid = !letters.includes(char);

                        let colorClass = 'text-slate-900';
                        if (isInvalid) colorClass = 'text-slate-300';
                        else if (isCenter) colorClass = 'text-mauve-600';

                        return (
                            <span key={i} className={colorClass}>
                                {char}
                            </span>
                        );
                    })
                ) : (
                    <span className="text-slate-300 relative animate-pulse font-medium">Type or click letters</span>
                )}
                <span className="w-[2px] h-8 bg-mauve-500 animate-pulse ml-1" />
            </div>

            {/* Honeycomb Grid */}
            <div className="relative w-[300px] h-[300px] flex items-center justify-center mb-6 md:mb-8 scale-[0.85] sm:scale-100">
                {/* Center Hexagon */}
                <div className="absolute z-10 transition-transform duration-300">
                    <Hexagon letter={centerLetter} isCenter onClick={onLetterClick} />
                </div>

                {/* Outer Hexagons offset distance */}
                {outerLetters.map((letter, i) => {
                    const angle = (Math.PI / 3) * i - (Math.PI / 2); // Start top (-90deg), rotate 60deg
                    const r = 94; // Height (86) + 8px gap
                    const x = typeof window !== 'undefined' ? r * Math.cos(angle) : 0;
                    const y = typeof window !== 'undefined' ? r * Math.sin(angle) : 0;

                    return (
                        <div
                            key={letter}
                            className="absolute transition-all duration-500 ease-out"
                            style={{ transform: `translate(${x}px, ${y}px)` }}
                        >
                            <Hexagon letter={letter} onClick={onLetterClick} />
                        </div>
                    );
                })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 md:mt-12 w-full max-w-sm px-4">
                <button
                    onClick={onDelete}
                    className="flex-1 py-4 px-6 rounded-full border border-slate-300 text-slate-700 bg-white font-semibold hover:bg-slate-50 hover:text-slate-950 active:scale-95 transition-all shadow-sm"
                >
                    Delete
                </button>
                <button
                    onClick={onShuffle}
                    className="w-14 h-14 rounded-full border border-slate-300 text-slate-700 bg-white flex items-center justify-center hover:bg-slate-50 hover:text-slate-950 active:scale-95 transition-all shadow-sm shrink-0 p-3"
                    aria-label="Shuffle letters"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                        <polyline points="16 3 21 3 21 8"></polyline>
                        <line x1="4" y1="20" x2="21" y2="3"></line>
                        <polyline points="21 16 21 21 16 21"></polyline>
                        <line x1="15" y1="15" x2="21" y2="21"></line>
                        <line x1="4" y1="4" x2="9" y2="9"></line>
                    </svg>
                </button>
                <button
                    onClick={onEnter}
                    className="flex-1 py-4 px-6 rounded-full border border-slate-300 text-slate-700 bg-white font-semibold hover:bg-slate-50 hover:text-slate-950 active:scale-95 transition-all shadow-sm"
                >
                    Enter
                </button>
            </div>

        </div>
    );
}
