import { StyleSheet } from "react-native";

// ------------------------------------------------------------
// Central styling file: colours, sizes and reusable styles.
// The app has two colour palettes: light and dark.
// The active palette comes from ThemeProvider (src/context).
// ------------------------------------------------------------

// Light mode colours
export const LIGHT_COLORS = {
  primary: "#0F766E",
  primaryDark: "#115E59",
  primaryLight: "#CCFBF1",
  primarySoft: "#F0FDFA",
  accentBorder: "#99F6E4",
  background: "#FFFFFF",
  surface: "#F3F4F6",
  card: "#FFFFFF",
  cardMuted: "#F9FAFB",
  divider: "#E5E7EB",
  text: "#1F2937",
  textSecondary: "#4B5563",
  textMuted: "#6B7280",
  border: "#D1D5DB",
  error: "#B91C1C",
  errorBg: "#FEE2E2",
  disabled: "#9CC7C2",
  white: "#FFFFFF",
};

// Dark mode colours (same names, darker backgrounds and lighter text)
export const DARK_COLORS = {
  primary: "#0D9488",
  primaryDark: "#5EEAD4",
  primaryLight: "#134E4A",
  primarySoft: "#0F2A28",
  accentBorder: "#115E59",
  background: "#0B1120",
  surface: "#1F2937",
  card: "#111827",
  cardMuted: "#1A2332",
  divider: "#374151",
  text: "#F3F4F6",
  textSecondary: "#D1D5DB",
  textMuted: "#9CA3AF",
  border: "#4B5563",
  error: "#F87171",
  errorBg: "#3B1D1D",
  disabled: "#2F5F5A",
  white: "#FFFFFF",
};

// Default palette (light) for files that do not use the theme
export const COLORS = LIGHT_COLORS;

export const SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  padding: 24,
  radius: 12,
};

export const FONTS = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

// Shared styles built from a colour palette (light or dark)
export const makeGlobalStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
      paddingHorizontal: SIZES.padding,
      justifyContent: "center",
    },
    title: {
      fontSize: SIZES.xl,
      fontWeight: FONTS.bold,
      color: COLORS.text,
    },
    subtitle: {
      fontSize: SIZES.sm,
      color: COLORS.textMuted,
      marginTop: 4,
      marginBottom: 24,
    },
    label: {
      fontSize: 13,
      fontWeight: FONTS.medium,
      color: COLORS.text,
      marginBottom: 6,
    },
    input: {
      height: 48,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      fontSize: SIZES.sm,
      color: COLORS.text,
      backgroundColor: COLORS.card,
      marginBottom: 16,
    },
    button: {
      height: 50,
      borderRadius: SIZES.radius,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },
    buttonDisabled: {
      backgroundColor: COLORS.disabled,
    },
    buttonText: {
      color: COLORS.white,
      fontSize: 15,
      fontWeight: FONTS.semibold,
    },
    linkRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
    },
    linkText: {
      fontSize: SIZES.sm,
      color: COLORS.textMuted,
    },
    link: {
      fontSize: SIZES.sm,
      color: COLORS.primary,
      fontWeight: FONTS.semibold,
      marginLeft: 4,
    },
  });

export const globalStyles = makeGlobalStyles(LIGHT_COLORS);
