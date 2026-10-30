import type { Config } from "tailwindcss";
import containerQueries from "@tailwindcss/container-queries";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        // Semantic shadcn CSS variables
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Figma Extracted Color Palette: Brand Gold / Amber Accent
        brand: {
          gold: {
            DEFAULT: "#E8A808",
            hover: "#FFB800",
            dark: "#B58306",
            deep: "#8C6605",
            muted: "#C9A24B",
            light: "#FEF3C7",
            subtle: "#FFFDF5",
          },
        },

        // Figma Extracted Color Palette: Deep Navy & Dark Slate
        navy: {
          midnight: "#06143E", // Deep midnight canvas
          deep: "#0B1736",     // Slate navy sidebar / dark cards
          royal: "#092167",    // Deep royal navy
          hover: "#0A2471",    // Royal navy hover
          surface: "#1D293D",  // Dark card surface
          border: "#26365A",   // Navy border
          muted: "#5B6CA0",    // Muted navy text
          black: "#020618",    // Near black
        },

        // Figma Extracted Slate Scale
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CAD5E2",
          400: "#90A1B9",
          500: "#62748E",
          600: "#45556C",
          700: "#334155",
          800: "#1F2328",
          900: "#0F172A",
          950: "#020618",
        },
      },
      fontFamily: {
        heading: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
        ui: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
        card: "12px",
        panel: "16px",
        container: "20px",
      },
      boxShadow: {
        card: "0 4px 12px -2px rgba(30, 22, 69, 0.08), 0 2px 4px -1px rgba(30, 22, 69, 0.04)",
        "card-hover": "0 12px 28px -4px rgba(30, 22, 69, 0.12), 0 4px 10px -2px rgba(30, 22, 69, 0.06)",
        "glow-gold": "0 0 0 3px rgba(232, 168, 8, 0.25)",
        modal: "0 20px 40px -10px rgba(6, 20, 62, 0.25)",
      },
    },
  },
  plugins: [containerQueries],
};

export default config;
