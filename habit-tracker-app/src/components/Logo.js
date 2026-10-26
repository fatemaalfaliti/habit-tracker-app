import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../constants/theme";
import { useTheme } from "../context/ThemeProvider";

export default function Logo({ showTagline = true }) {
  // Active theme colours and styles (light or dark mode)
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  return (
    <View style={styles.wrapper}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.image}
        accessibilityLabel="HabitTracker logo"
      />
      <Text style={styles.name}>HabitTracker</Text>
      {showTagline && (
        <Text style={styles.tagline}>Build better habits, one day at a time</Text>
      )}
    </View>
  );
}

// Styles are built from the active theme colours (light or dark)
const makeStyles = (COLORS) =>
  StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginBottom: 28,
  },
  image: {
    width: 72,
    height: 72,
    marginBottom: 12,
  },
  name: {
    fontSize: SIZES.xl,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  tagline: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
