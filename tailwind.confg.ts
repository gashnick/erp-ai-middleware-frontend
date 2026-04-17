import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system semantic tokens
        primary: {
          DEFAULT: "#2563EB", // blue-600 — actions
          hover: "#1D4ED8", // blue-700
          light: "#EFF6FF", // blue-50
        },
        ai: {
          DEFAULT: "#7C3AED", // purple-600 — AI
          hover: "#6D28D9", // purple-700
          light: "#F5F3FF", // purple-50
        },
        success: {
          DEFAULT: "#16A34A", // green-600
          light: "#F0FDF4", // green-50
        },
        danger: {
          DEFAULT: "#DC2626", // red-600
          light: "#FEF2F2", // red-50
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.375rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
