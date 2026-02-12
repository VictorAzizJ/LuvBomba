import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const baseClasses = [
  "w-full font-pixel text-xl text-ink",
  "border-[3px] border-ink bg-white",
  "shadow-retro-inset",
  "px-3 py-2",
  "outline-none",
  "focus:border-bubblegum focus:shadow-retro-glow",
  "placeholder:text-ink/30",
  "transition-shadow duration-150",
].join(" ");

export function RetroInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(baseClasses, className)} {...props} />;
}

export function RetroTextarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(baseClasses, "resize-y", className)} {...props} />
  );
}
