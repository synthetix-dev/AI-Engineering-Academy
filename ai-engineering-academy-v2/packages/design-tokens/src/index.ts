export const colors = {
  // Brand Palette (Master Specification Section 6)
  primary: {
    DEFAULT: "#6DA2E4",
    light: "#97BFF0",
    dark: "#4B7EC2",
    surface: "#EDF5FE",
    50: "#F4F8FD",
    100: "#EDF5FE",
    200: "#CFE3FA",
    300: "#A9CDF6",
    400: "#6DA2E4",
    500: "#4B7EC2",
    600: "#3661A0",
    700: "#27487B",
    800: "#1B3356",
    900: "#0D2238",
  },
  accent: {
    DEFAULT: "#EC612F",
    light: "#F2865E",
    dark: "#C94516",
    surface: "#FEF2ED",
    50: "#FEF7F4",
    100: "#FEF2ED",
    200: "#FCD8CB",
    300: "#F8B69F",
    400: "#F2865E",
    500: "#EC612F",
    600: "#C94516",
    700: "#9E340E",
    800: "#70250A",
    900: "#451605",
  },
  neutral: {
    bgLight: "#EDF5FE",
    bgCard: "#FFFFFF",
    bgDark: "#0B1929",
    bgCardDark: "#112236",
    textLight: "#0D2238",
    textMuted: "#4B5563",
    textDark: "#EDF5FE",
    textDarkMuted: "#9CA3AF",
    borderLight: "#D0D7DE",
    borderDark: "#263B53",
  },
  semantic: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
} as const;

export const typography = {
  fonts: {
    display: '"Onest", "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  sizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  weights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgba(13, 34, 56, 0.05)",
  md: "0 4px 6px -1px rgba(13, 34, 56, 0.08), 0 2px 4px -1px rgba(13, 34, 56, 0.04)",
  lg: "0 10px 15px -3px rgba(13, 34, 56, 0.1), 0 4px 6px -2px rgba(13, 34, 56, 0.05)",
  card: "0 2px 8px rgba(13, 34, 56, 0.06)",
  cardHover: "0 8px 24px rgba(13, 34, 56, 0.12)",
} as const;

export const tokens = {
  colors,
  typography,
  shadows,
} as const;

export default tokens;
