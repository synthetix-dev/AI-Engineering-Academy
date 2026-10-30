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
        graphite: "#24292F",
        borderline: "#D0D7DE",
        neutralSurface: "#E8E8E8",
        oxide: "#5D0D02",
        dark: {
          bg: "#0D1117",
          surface: "#161B22",
          border: "#30363D",
          text: "#E6EDF3",
          muted: "#8B949E"
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Noto Sans",
          "Helvetica",
          "Arial",
          "sans-serif"
        ],
        mono: [
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
