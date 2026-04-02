/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0f",
          secondary: "#111118",
          card: "#16161f",
          elevated: "#1e1e2a",
          hover: "#252535",
        },
        accent: {
          purple: "#7c3aed",
          "purple-light": "#9d5cf6",
          "purple-dim": "#7c3aed33",
          cyan: "#06b6d4",
          "cyan-light": "#22d3ee",
          "cyan-dim": "#06b6d433",
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        text: {
          primary: "#f4f4f8",
          secondary: "#a0a0b8",
          muted: "#5a5a78",
        },
        border: {
          DEFAULT: "#252535",
          light: "#303048",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-purple": "linear-gradient(135deg, #7c3aed, #06b6d4)",
        "gradient-card": "linear-gradient(180deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.05) 100%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-purple": "0 0 40px rgba(124, 58, 237, 0.35)",
        "glow-cyan": "0 0 40px rgba(6, 182, 212, 0.25)",
        "card": "0 8px 32px rgba(0,0,0,0.5)",
        "player": "0 -8px 40px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
        "equalizer": "equalizer 1.2s ease-in-out infinite",
      },
      keyframes: {
        equalizer: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
    },
  },
  plugins: [],
};
