import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function RetroLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Marquee ticker bar ── */}
      <div className="overflow-hidden border-b-[3px] border-ink bg-ink py-1">
        <p className="animate-marquee whitespace-nowrap font-pixel text-lg text-bubblegum">
          {"✦ Welcome to LuvBomba ✦ Send love softly, later ✦ Privacy-first anonymous messages ✦ No account needed ✦ One-click opt-out ✦ "}
        </p>
      </div>

      {/* ── Header ── */}
      <header className="border-b-[3px] border-ink bg-lavender shadow-retro-sm">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Link href="/" className="no-underline">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">
                💌
              </span>
              <div>
                <h1 className="font-retro text-[10px] uppercase leading-tight tracking-wider text-ink md:text-xs">
                  LuvBomba
                </h1>
                <p className="font-pixel text-base leading-none text-ink/70 md:text-lg">
                  send love softly, later
                </p>
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-3 font-pixel text-lg md:text-xl">
            <Link href="/" className="transition-colors hover:text-bubblegum-dark">
              Home
            </Link>
            <span className="text-ink/30" aria-hidden="true">
              |
            </span>
            <Link href="/compose" className="transition-colors hover:text-bubblegum-dark">
              Compose
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className={cn("mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-8", className)}>
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t-[3px] border-ink bg-ink/90 py-4">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-2 px-4 text-center font-pixel md:px-8">
          <p className="text-lg text-lavender-light">
            Made with 💖 &bull; Privacy-first &bull; No accounts &bull; One-click opt-out
          </p>
          <div className="flex items-center gap-2 text-base text-bubblegum/60">
            <span className="animate-blink" aria-hidden="true">
              ⚡
            </span>
            <span>Best viewed with love &amp; good intentions</span>
            <span className="animate-blink" aria-hidden="true">
              ⚡
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
