import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Semantic roles are additive. Keep the raw brand names below until each
        // consumer has migrated in a later Refactor C phase.
        canvas: "#F7F1E7",
        surface: "#FFFDF8",
        elevated: "#FFFFFF",
        inverse: "#211C18",
        text: {
          primary: "#1F1A17",
          secondary: "#6F6258",
          inverse: "#FFFDF8",
        },
        action: {
          primary: "#B83226",
          "primary-hover": "#98291F",
          "primary-foreground": "#FFFDF8",
          secondary: "#4F6F3E",
          "secondary-foreground": "#FFFDF8",
          tertiary: "#211C18",
          "tertiary-foreground": "#FFFDF8",
        },
        border: "#D8C8B4",
        focus: "#4F6F3E",
        status: {
          success: "#2F7D50",
          warning: "#B7791F",
          error: "#B42318",
          disabled: "#B8AEA4",
        },
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
      fontSize: {
        display: ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "page-title": ["clamp(2rem, 4vw, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "section-title": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "card-title": ["1.25rem", { lineHeight: "1.3" }],
        body: ["1rem", { lineHeight: "1.625rem" }],
        label: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "600" }],
        caption: ["0.75rem", { lineHeight: "1rem" }],
        overline: ["0.75rem", { lineHeight: "1rem", fontWeight: "700", letterSpacing: "0.08em" }],
      },
      spacing: {
        gutter: "clamp(1rem, 3vw, 2rem)",
        "section-y": "clamp(3.5rem, 8vw, 6rem)",
        "section-gap": "clamp(2rem, 5vw, 4rem)",
        "grid-gap": "clamp(1rem, 2vw, 1.5rem)",
        "control-sm": "2.5rem",
        control: "3rem",
        "control-lg": "3.5rem",
        "icon-xs": "0.875rem",
        "icon-sm": "1rem",
        icon: "1.25rem",
        "icon-lg": "1.5rem",
        "icon-xl": "2rem",
      },
      maxWidth: {
        content: "72rem",
        reading: "42rem",
        narrow: "32rem",
      },
      borderRadius: {
        control: "0.5rem",
        card: "0.75rem",
        panel: "1rem",
      },
      borderWidth: {
        DEFAULT: "1px",
        strong: "2px",
      },
      boxShadow: {
        small: "0 1px 2px rgba(33, 28, 24, 0.08)",
        medium: "0 8px 24px rgba(33, 28, 24, 0.10)",
        large: "0 18px 48px rgba(33, 28, 24, 0.14)",
        hover: "0 12px 32px rgba(184, 50, 38, 0.16)",
        soft: "0 18px 48px rgba(33, 28, 24, 0.14)",
      },
      transitionDuration: {
        instant: "100ms",
        fast: "150ms",
        normal: "200ms",
        slow: "300ms",
      },
      transitionTimingFunction: {
        "standard": "cubic-bezier(0.2, 0, 0, 1)",
        "emphasized": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
