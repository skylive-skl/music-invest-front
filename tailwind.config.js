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
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
          elevated: "var(--bg-elevated)",
          hover: "var(--bg-hover)",
        },
        accent: {
          purple: "var(--accent-purple)",
          "purple-light": "var(--accent-purple-light)",
          "purple-dim": "var(--accent-purple-dim)",
          cyan: "var(--accent-cyan)",
          "cyan-light": "var(--accent-cyan-light)",
          "cyan-dim": "var(--accent-cyan-dim)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          light: "var(--border-light)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-purple": "linear-gradient(135deg, #7c3aed, #06b6d4)",
        "gradient-card": "var(--gradient-card)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-purple": "var(--shadow-glow-purple)",
        "glow-cyan": "var(--shadow-glow-cyan)",
        "card": "var(--shadow-card)",
        "player": "var(--shadow-player)",
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
