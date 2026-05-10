import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#070a13",
          soft: "#0c1120",
          card: "rgba(255,255,255,0.04)",
        },
        accent: {
          DEFAULT: "#7c5cff",
          400: "#9d83ff",
          500: "#7c5cff",
          600: "#5b3eff",
        },
        cyber: {
          green: "#39ffa5",
          cyan: "#5ce1ff",
          pink: "#ff6ad5",
          amber: "#ffb547",
        },
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at center, rgba(124,92,255,0.18), transparent 60%)",
        glow:
          "radial-gradient(120% 80% at 0% 0%, rgba(124,92,255,0.25), transparent 50%), radial-gradient(120% 80% at 100% 100%, rgba(57,255,165,0.18), transparent 55%)",
      },
      boxShadow: {
        glass:
          "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 30px rgba(0,0,0,0.45)",
        glow: "0 0 30px rgba(124,92,255,0.45)",
      },
      animation: {
        "pulse-slow": "pulse 6s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
