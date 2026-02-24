import { Hexagon } from "./hexagon";

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
  const outerLetters = letters.filter((l) => l !== centerLetter);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto relative pb-4 md:pb-8">
      {/* Toast - fixed at top of viewport */}
      {message && (
        <div
          className="fixed top-16 left-1/2 z-50"
          style={{ transform: "translateX(-50%)" }}
        >
          <div className="toast-pop bg-neutral-900 text-white text-sm font-semibold px-6 py-2.5 rounded-full tracking-wide whitespace-nowrap">
            {message}
          </div>
        </div>
      )}

      {/* Input Display */}
      <div className="h-[52px] mb-8 md:mb-10 flex items-center justify-center px-4 w-full border-b border-neutral-300 relative">
        {!input && (
          <span className="absolute flex items-center">
            <span className="text-neutral-400 text-lg font-sans font-normal tracking-[0.2em] uppercase">
              Type or click
            </span>
            <span className="w-[2px] h-6 bg-sky-600 cursor-blink ml-1 rounded-full" />
          </span>
        )}
        <div className="text-[30px] md:text-[36px] font-medium text-center uppercase tracking-[0.15em] flex items-center justify-center flex-wrap">
          {input &&
            input.split("").map((char, i) => {
              const isCenter = char === centerLetter;
              const isInvalid = !letters.includes(char);

              let colorClass = "text-neutral-800";
              if (isInvalid) colorClass = "text-neutral-400";
              else if (isCenter) colorClass = "text-sky-600";

              return (
                <span
                  key={i}
                  className={`${colorClass} transition-colors duration-100`}
                >
                  {char}
                </span>
              );
            })}
          {input && (
            <span className="w-[2px] h-9 bg-sky-600 cursor-blink ml-0.5 rounded-full" />
          )}
        </div>
      </div>

      {/* Honeycomb Grid */}
      <div className="relative w-[300px] h-[300px] flex items-center justify-center mb-6 md:mb-8 scale-[0.82] sm:scale-100">
        <div className="absolute z-10">
          <Hexagon letter={centerLetter} isCenter onClick={onLetterClick} />
        </div>
        {outerLetters.map((letter, i) => {
          const angle = (Math.PI / 3) * i - Math.PI / 2;
          const r = 94;
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);
          return (
            <div
              key={letter}
              className="absolute"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Hexagon letter={letter} onClick={onLetterClick} />
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-4 md:mt-6 w-full max-w-[280px] px-2">
        <button
          onClick={onDelete}
          className="flex-1 py-3 rounded-full border border-sky-600 text-sky-700 bg-white font-semibold text-[13px] tracking-wide hover:border-sky-700 hover:bg-sky-50 active:scale-[0.96] transition-all"
        >
          Delete
        </button>
        <button
          onClick={onShuffle}
          className="w-11 h-11 rounded-full border border-neutral-300 text-neutral-500 bg-white flex items-center justify-center hover:border-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 active:rotate-180 active:scale-[0.96] transition-all duration-300 shrink-0"
          aria-label="Shuffle letters"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[18px] h-[18px]"
          >
            <polyline points="16 3 21 3 21 8"></polyline>
            <line x1="4" y1="20" x2="21" y2="3"></line>
            <polyline points="21 16 21 21 16 21"></polyline>
            <line x1="15" y1="15" x2="21" y2="21"></line>
            <line x1="4" y1="4" x2="9" y2="9"></line>
          </svg>
        </button>
        <button
          onClick={onEnter}
          className="flex-1 py-3 rounded-full bg-sky-600 text-white font-semibold text-[13px] tracking-wide hover:bg-sky-700 active:scale-[0.96] transition-all"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
