import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        brand: {
          bg: "#FDF6ED",
          surface: "#FFF8F0",
          "surface-elevated": "#FFF3E4",
          "amber-soft": "#FEF3C7",
          border: "#E8D5B7",
          "border-strong": "#D4B896",
          accent: "#F59E0B",
          "accent-dark": "#D97706",
          "accent-light": "#FDE68A",
          "text-primary": "#1C1008",
          "text-secondary": "#6B5B45",
          "text-tertiary": "#9C8A72",
          success: "#15803D",
          error: "#DC2626",
          info: "#1D4ED8",
        },
      },
      boxShadow: {
        card: "0 1px 4px rgba(180,140,80,0.10), 0 0 0 1px rgba(180,140,80,0.12)",
        button: "0 2px 8px rgba(245,158,11,0.25)",
        elevated: "0 8px 24px rgba(180,140,80,0.15)",
      },
      transitionDuration: {
        brand: "180ms",
      },
    },
  },
  plugins: [],
};
export default config;
