import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS } from "../constants/theme";

// ------------------------------------------------------------
// Welcome section: personalised greeting with the user's name
// and a short message about what to do.
// ------------------------------------------------------------
export default function Welcome({ name }) {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, {name}!</Text>
      <Text style={styles.message}>Let's build great habits today</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  greeting: {
    fontSize: SIZES.xl,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  message: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
