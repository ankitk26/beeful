import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans flex flex-col hex-bg">
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-xl">
          {/* Decorative hex mark */}
          <div className="stagger-1 flex items-center justify-center mb-8">
            <div
              className="relative w-20 h-[70px]"
              style={{
                clipPath:
                  "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
              }}
            >
              <div className="absolute inset-0 bg-sky-600" />
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-white">
                B
              </span>
            </div>
          </div>

          <h1 className="stagger-2 text-6xl md:text-7xl font-semibold text-neutral-900 tracking-tight leading-none mb-6">
            Beeful
          </h1>

          <p className="stagger-3 text-neutral-600 text-lg md:text-xl leading-relaxed mb-14 max-w-md mx-auto font-light">
            Play Spelling Bee unlimited.
            <br />
            Track every game you've ever played.
          </p>

          <div className="stagger-4">
            <a
              href="/game"
              className="inline-block bg-sky-600 text-white font-semibold text-[13px] tracking-[0.2em] uppercase px-14 py-4.5 rounded-full hover:bg-sky-700 active:scale-[0.97] transition-all"
            >
              Play Today's Puzzle
            </a>
          </div>

          <div className="stagger-5 mt-6">
            <a
              href="/history"
              className="text-sm text-sky-700 hover:text-sky-900 transition-colors font-medium tracking-wide"
            >
              View History →
            </a>
          </div>
        </div>
      </main>

      {/* Bottom credit line */}
      <footer className="pb-6 text-center">
        <span className="text-[11px] text-neutral-500 tracking-[0.3em] uppercase font-medium">
          A daily word game
        </span>
      </footer>
    </div>
  );
}
