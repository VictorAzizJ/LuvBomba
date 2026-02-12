/**
 * Decorative layer of floating hearts and sparkles.
 * Place inside a `position: relative; overflow: hidden` container.
 */

const PARTICLES = [
  { emoji: "💖", size: "text-lg", delay: "0s", duration: "3.8s", left: "6%", top: "12%" },
  { emoji: "✨", size: "text-base", delay: "0.6s", duration: "3s", left: "24%", top: "4%" },
  { emoji: "💕", size: "text-xl", delay: "1.2s", duration: "4.6s", left: "44%", top: "22%" },
  { emoji: "⭐", size: "text-sm", delay: "1.9s", duration: "3.4s", left: "62%", top: "10%" },
  { emoji: "💗", size: "text-base", delay: "0.3s", duration: "4.2s", left: "78%", top: "18%" },
  { emoji: "✦", size: "text-sm", delay: "2.4s", duration: "3.1s", left: "90%", top: "6%" },
  { emoji: "🌟", size: "text-xs", delay: "1.5s", duration: "3.6s", left: "36%", top: "2%" },
  { emoji: "💌", size: "text-sm", delay: "0.9s", duration: "4s", left: "54%", top: "16%" },
] as const;

export function HeartAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={`absolute opacity-50 ${p.size}`}
          style={{
            left: p.left,
            top: p.top,
            animation: `floaty ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
