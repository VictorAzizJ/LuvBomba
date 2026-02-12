import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function RetroCard({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <section
      className={cn(
        "border-[3px] border-ink bg-lemonade/80",
        "shadow-retro",
        "animate-fade-in overflow-hidden",
        className,
      )}
    >
      {/* Optional Windows-95 style title bar */}
      {title && (
        <div className="flex items-center justify-between border-b-[3px] border-ink bg-gradient-to-r from-lavender to-bubblegum px-3 py-1.5">
          <span className="font-retro text-[8px] uppercase tracking-widest text-ink md:text-[10px]">
            {title}
          </span>
          {/* Decorative window controls */}
          <div className="flex gap-1" aria-hidden="true">
            <span className="inline-block h-3 w-3 border-[2px] border-ink bg-mint" />
            <span className="inline-block h-3 w-3 border-[2px] border-ink bg-lemonade" />
            <span className="inline-block h-3 w-3 border-[2px] border-ink bg-coral" />
          </div>
        </div>
      )}

      <div className="p-4 md:p-6">{children}</div>
    </section>
  );
}
