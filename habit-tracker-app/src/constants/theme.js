import { StyleSheet } from "react-native";

// Central styling file: colors, sizes and reusable styles for the whole app

export const COLORS = {
  primary: "#0F766E",
  primaryDark: "#115E59",
  primaryLight: "#CCFBF1",
  primarySoft: "#F0FDFA",
  background: "#FFFFFF",
  surface: "#F3F4F6",
  text: "#1F2937",
  textMuted: "#6B7280",
  border: "#D1D5DB",
  error: "#B91C1C",
  errorBg: "#FEE2E2",
  disabled: "#9CC7C2",
  white: "#FFFFFF",
};

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

export const globalStyles = StyleSheet.create({
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
    backgroundColor: COLORS.white,
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
