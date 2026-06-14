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
      },
      colors: {
        brand: {
          bg: "#FDF8F3",
          accent: "#F59E0B",
          text: "#1C1917",
          card: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
export default config;
