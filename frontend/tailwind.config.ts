import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        denim: {
          DEFAULT: "#6DA2E4",
          50: "#F0F6FD",
          100: "#E1EDFB",
          500: "#6DA2E4",
          600: "#4D8ADB",
          700: "#3171C8",
        },
        tangerine: {
          DEFAULT: "#EC612F",
          50: "#FDF4F0",
          100: "#FBE6DE",
          500: "#EC612F",
          600: "#D94A17",
          700: "#B83A0E",
        },
        cloud: "#EDF5FE",
        navy: {
          DEFAULT: "#0D2238",
          800: "#132D48",
          900: "#0D2238",
          950: "#071626",
        },
        graphite: "#0D2238",
        borderline: "#D0D7DE",
        neutralSurface: "#E8E8E8",
        dark: {
          bg: "#0A1624",
          surface: "#102235",
          border: "#1C354E",
          text: "#E6EDF3",
          muted: "#8B949E"
        }
      },
      fontFamily: {
        display: [
          "var(--font-display)",
          "Rubik",
          "Bricolage Grotesque",
          "-apple-system",
          "system-ui",
          "sans-serif"
        ],
        sans: [
          "var(--font-sans)",
          "Manrope",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Noto Sans",
          "sans-serif"
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "SF Mono",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace"
        ]
      }
    },
  },
  plugins: [],
};

export default config;
