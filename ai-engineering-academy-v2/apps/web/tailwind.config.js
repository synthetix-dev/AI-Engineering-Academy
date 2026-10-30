/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/visualizations/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6DA2E4",
          light: "#97BFF0",
          dark: "#4B7EC2",
          surface: "#EDF5FE",
        },
        accent: {
          DEFAULT: "#EC612F",
          light: "#F2865E",
          dark: "#C94516",
          surface: "#FEF2ED",
        },
        navy: {
          DEFAULT: "#0D2238",
          dark: "#081524",
          light: "#1B3356",
        },
        border: {
          DEFAULT: "#D0D7DE",
          dark: "#263B53",
        },
        canvas: {
          DEFAULT: "#EDF5FE",
          card: "#FFFFFF",
        },
      },
      fontFamily: {
        display: ['"Onest"', '"Manrope"', "sans-serif"],
        body: ['"Manrope"', "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
    },
  },
  plugins: [],
};
