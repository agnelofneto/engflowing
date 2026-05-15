import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        ink: {
          50:  "#F7F5F0",
          100: "#EFEBE0",
          200: "#D9D3C2",
          400: "#8A8270",
          600: "#4A4538",
          800: "#2A271F",
          900: "#1A1812",
        },
        amber: {
          accent: "#C8801A",
          deep:   "#8F5612",
        },
        sage: "#5C7A5B",
        rust: "#A8472A",
      },
    },
  },
  plugins: [],
};
export default config;
