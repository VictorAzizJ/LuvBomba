import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["var(--font-vt323)", "monospace"],
        retro: ["var(--font-press-start)", "cursive"],
      },
      colors: {
        bubblegum: {
          DEFAULT: "#ff82d1",
          light: "#ffc2e9",
          dark: "#d94fa8",
        },
        lavender: {
          DEFAULT: "#bca9ff",
          light: "#ddd2ff",
          dark: "#8a6eef",
        },
        mint: {
          DEFAULT: "#97f7d2",
          light: "#c5fce6",
          dark: "#50d9a3",
        },
        lemonade: {
          DEFAULT: "#fff5a6",
          light: "#fffbd4",
          dark: "#f5e044",
        },
        coral: {
          DEFAULT: "#ff9a8b",
          light: "#ffc4bb",
          dark: "#e86b58",
        },
        ink: {
          DEFAULT: "#272447",
          light: "#3d3869",
        },
      },
      boxShadow: {
        /* Windows 95 outset (default button/card look) */
        retro:
          "inset -2px -2px 0 rgba(0,0,0,0.18), inset 2px 2px 0 rgba(255,255,255,0.55), 4px 4px 0 #272447",
        /* Pressed / active / inset look */
        "retro-inset":
          "inset 2px 2px 0 rgba(0,0,0,0.2), inset -1px -1px 0 rgba(255,255,255,0.3)",
        /* Soft drop shadow for cards */
        "retro-sm": "2px 2px 0 #272447",
        /* Pink glow for focus / accents */
        "retro-glow":
          "0 0 10px rgba(255,130,209,0.45), 0 0 24px rgba(188,169,255,0.25)",
      },
      backgroundImage: {
        "retro-gradient":
          "linear-gradient(135deg, rgba(255,130,209,0.25) 0%, rgba(188,169,255,0.2) 50%, rgba(151,247,210,0.25) 100%)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.65" },
          "50%": { transform: "translateY(-10px)", opacity: "1" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        sparkle: {
          "0%, 100%": {
            transform: "scale(0) rotate(0deg)",
            opacity: "0",
          },
          "50%": { transform: "scale(1) rotate(180deg)", opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 4px rgba(255,130,209,0.3)",
          },
          "50%": {
            boxShadow:
              "0 0 16px rgba(255,130,209,0.7), 0 0 32px rgba(188,169,255,0.35)",
          },
        },
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float-up": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.8" },
          "100%": { transform: "translateY(-40px) scale(0.7)", opacity: "0" },
        },
      },
      animation: {
        floaty: "floaty 3s ease-in-out infinite",
        blink: "blink 1s steps(1) infinite",
        sparkle: "sparkle 2.4s ease-in-out infinite",
        wiggle: "wiggle 0.3s ease-in-out",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        marquee: "marquee 18s linear infinite",
        "fade-in": "fade-in 0.3s ease-out both",
        "float-up": "float-up 3.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
