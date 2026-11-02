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
        background: "#0c0e12",
        surface: "#12151b",
        "surface-raised": "#181d25",
        "surface-card": "#151921",
        "surface-border": "#242a36",
        brand: {
          purple: "#9d4edd",
          "purple-hover": "#8338ec",
          "purple-dim": "rgba(157, 78, 221, 0.15)",
          green: "#10b981",
          "green-hover": "#059669",
          "green-dim": "rgba(16, 185, 129, 0.15)",
        },
        text: {
          primary: "#f3f4f6",
          secondary: "#9ca3af",
          muted: "#6b7280",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

