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
          bg: "#0A0A0F",
          surface: "#111118",
          "surface-elevated": "#1A1A24",
          border: "#2A2A3A",
          accent: "#F59E0B",
          "accent-glow": "rgba(245, 158, 11, 0.15)",
          "text-primary": "#F5F5F0",
          "text-secondary": "#8888A0",
          "text-tertiary": "#55556A",
          success: "#1D9E75",
          error: "#E24B4A",
          info: "#378ADD",
        },
      },
    },
  },
  plugins: [],
};
export default config;
