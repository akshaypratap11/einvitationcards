import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        festive: {
          wine: "#2b0d16",
          maroon: "#5a1731",
          maroonDark: "#3b0d1e",
          maroonLight: "#771d3e",
          rose: "#c2185b",
          gold: "#c9a24b",
          goldLight: "#f3e2a9",
          goldDark: "#946f25",
          goldShimmer: "#ffe699",
          cream: "#fbf3e4",
          creamDark: "#f2e4cc",
          blush: "#f6e3e1",
          sand: "#e7d7be",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        cormorant: ["'Cormorant Garamond'", "Georgia", "serif"],
        script: ["'Great Vibes'", "cursive"],
        cinzel: ["'Cinzel'", "serif"],
        sans: ["'Outfit'", "var(--font-geist-sans)", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 30px rgba(201, 162, 75, 0.3)",
        "gold-glow-lg": "0 0 50px rgba(201, 162, 75, 0.45)",
        "maroon-deep": "0 20px 40px -15px rgba(43, 13, 22, 0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
