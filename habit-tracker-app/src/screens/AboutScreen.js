import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "../components/Icon";
import { COLORS, FONTS } from "../constants/theme";
import { useTheme } from "../context/ThemeProvider";

// ------------------------------------------------------------
// About screen: information about the app and its features.
// ------------------------------------------------------------
const FEATURES = [
  "Track your daily habits and mark them as done",
  "See today's progress and your streaks",
  "Get a new motivational quote every day",
  "Save your favourite habits",
  "View your weekly progress report",
];

export default function AboutScreen({ navigation }) {
  // Active theme colours and styles (light or dark mode)
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>About</Text>
        <View style={styles.iconButtonPlaceholder} />
      </View>

      {/* App logo, name and version */}
      <View style={styles.brand}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          accessibilityLabel="HabitTracker logo"
        />
        <Text style={styles.name}>HabitTracker</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <Text style={styles.body}>
        HabitTracker helps you build good habits one day at a time. Track your
        progress, keep your streaks going and stay motivated.
      </Text>

      {/* Feature list */}
      <Text style={styles.sectionTitle}>Features</Text>
      {FEATURES.map((feature) => (
        <Text key={feature} style={styles.feature}>
          ✓  {feature}
        </Text>
      ))}

      {/* Developer */}
      <Text style={styles.sectionTitle}>Developer</Text>
      <Text style={styles.body}>
        Built with React Native and Expo as part of the Mobile App Development
        Capstone Project.
      </Text>
    </ScrollView>
  );
}

// Styles are built from the active theme colours (light or dark)
const makeStyles = (COLORS) =>
  StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  topTitle: {
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
  iconButtonPlaceholder: {
    width: 44,
    height: 44,
  },
  brand: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  version: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginTop: 18,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  feature: {
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 4,
  },
});
