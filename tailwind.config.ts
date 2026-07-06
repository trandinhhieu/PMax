import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        tomato: {
          DEFAULT: "#B83226",
          hover: "#98291F",
        },
        olive: "#4F6F3E",
        fire: "#D86F32",
        cream: "#F7F1E7",
        porcelain: "#FFFDF8",
        stoneWarm: "#E7DAC8",
        charcoal: "#211C18",
        muted: "#6F6258",
        borderWarm: "#D8C8B4",
        success: "#2F7D50",
        warning: "#B7791F",
        error: "#B42318",
        disabled: "#B8AEA4",
        ember: "#B83226",
        basil: "#4F6F3E",
        paper: "#F7F1E7",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Arial", "sans-serif"],
        display: ["Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        small: "0 1px 2px rgba(33, 28, 24, 0.08)",
        medium: "0 8px 24px rgba(33, 28, 24, 0.10)",
        large: "0 18px 48px rgba(33, 28, 24, 0.14)",
        hover: "0 12px 32px rgba(184, 50, 38, 0.16)",
        soft: "0 18px 48px rgba(33, 28, 24, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
