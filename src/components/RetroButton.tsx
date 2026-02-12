import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function RetroButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        /* base */
        "inline-flex items-center justify-center font-pixel text-xl leading-tight",
        /* sizing */
        "px-5 py-2.5",
        /* color */
        "bg-bubblegum text-ink",
        /* Windows-95 beveled border */
        "border-[3px] border-ink",
        "shadow-retro",
        /* hover */
        "hover:brightness-110",
        /* active – pressed inset look */
        "active:translate-x-[3px] active:translate-y-[3px] active:shadow-retro-inset",
        /* disabled */
        "disabled:pointer-events-none disabled:opacity-50",
        /* transition */
        "transition-all duration-75",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
