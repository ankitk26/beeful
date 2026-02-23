
interface HexagonProps {
    letter: string;
    isCenter?: boolean;
    onClick: (letter: string) => void;
}

export function Hexagon({ letter, isCenter = false, onClick }: HexagonProps) {
    const clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';

    return (
        <button
            onClick={() => onClick(letter)}
            className="relative flex items-center justify-center w-[100px] h-[86px] group outline-none cursor-pointer select-none active:scale-[0.88] transition-transform duration-150"
        >
            <div
                className={`absolute inset-0 transition-colors duration-150 ${isCenter
                    ? 'bg-sky-500 group-hover:bg-sky-400'
                    : 'bg-sky-100 group-hover:bg-sky-200'
                    }`}
                style={{ clipPath }}
            />
            <span
                className={`relative z-10 text-[28px] font-bold uppercase select-none tracking-wide font-serif ${isCenter ? 'text-white' : 'text-sky-950'
                    }`}
            >
                {letter}
            </span>
        </button>
    );
}
