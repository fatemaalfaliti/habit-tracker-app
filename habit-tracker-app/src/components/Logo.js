import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../constants/theme";

export default function Logo({ showTagline = true }) {
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

const styles = StyleSheet.create({
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
