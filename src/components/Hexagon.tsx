
interface HexagonProps {
    letter: string;
    isCenter?: boolean;
    onClick: (letter: string) => void;
}

export function Hexagon({ letter, isCenter = false, onClick }: HexagonProps) {
    return (
        <button
            onClick={() => onClick(letter)}
            className="relative flex items-center justify-center w-[100px] h-[86px] group outline-none active:scale-95 transition-transform cursor-pointer"
            style={{
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            }}
        >
            <div
                className={`absolute inset-0 transition-colors duration-200 ${isCenter
                    ? 'bg-mauve-500 group-hover:bg-mauve-600'
                    : 'bg-slate-200 group-hover:bg-slate-300'
                    }`}
            />
            <span
                className={`relative z-10 text-3xl font-bold uppercase transition-colors duration-200 ${isCenter ? 'text-white' : 'text-slate-900'
                    }`}
            >
                {letter}
            </span>
        </button>
    );
}
