import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "./Icon";
import { COLORS, FONTS } from "../constants/theme";
import { useTheme } from "../context/ThemeProvider";

// ------------------------------------------------------------
// Top navigation bar: app logo and name on the left,
// settings icon on the right (opens the menu).
// ------------------------------------------------------------
export default function Header({ onSettingsPress }) {
  // Active theme colours and styles (light or dark mode)
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  return (
    <View style={styles.header}>
      {/* Logo and app name */}
      <View style={styles.brand}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          accessibilityLabel="HabitTracker logo"
        />
        <Text style={styles.name}>HabitTracker</Text>
      </View>

      {/* Settings button */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onSettingsPress}
        accessibilityLabel="Open settings menu"
      >
        <Icon name="settings-outline" size={22} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}

// Styles are built from the active theme colours (light or dark)
const makeStyles = (COLORS) =>
  StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    marginBottom: 12,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
