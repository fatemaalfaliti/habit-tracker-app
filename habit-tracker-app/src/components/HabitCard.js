import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "./Icon";
import { COLORS, FONTS } from "../constants/theme";
import { CATEGORIES } from "../constants/habits";
import { useTheme } from "../context/ThemeProvider";

// ------------------------------------------------------------
// One habit card: icon thumbnail, title, category tag, duration,
// and a check button to mark the habit as done / not done.
// Tap the card to open details, long-press it to delete.
// ------------------------------------------------------------
export default function HabitCard({ habit, done, onPress, onToggle, onLongPress }) {
  // Active theme colours and styles (light or dark mode)
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  // Colours and icon for the habit's category
  const category = CATEGORIES[habit.category] || CATEGORIES.Health;

  return (
    <TouchableOpacity
      style={[styles.card, done && styles.cardDone]}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityLabel={`${habit.title}, ${done ? "done" : "not done"}`}
    >
      {/* Thumbnail: coloured square with the habit icon */}
      <View style={[styles.thumb, { backgroundColor: category.bg }]}>
        <Icon name={habit.icon || category.icon} size={26} color={category.fg} />
      </View>

      {/* Title, category tag and duration */}
      <View style={styles.info}>
        <Text style={[styles.title, done && styles.titleDone]}>{habit.title}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.tag, { backgroundColor: category.bg }]}>
            <Text style={[styles.tagText, { color: category.fg }]}>{habit.category}</Text>
          </View>
          <Text style={styles.duration}>{habit.duration}</Text>
        </View>
      </View>

      {/* Done / Not done button */}
      <TouchableOpacity
        style={[styles.check, done && styles.checkDone]}
        onPress={onToggle}
        accessibilityLabel={done ? "Mark as not done" : "Mark as done"}
      >
        {done && <Icon name="checkmark" size={18} color={COLORS.white} />}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// Styles are built from the active theme colours (light or dark)
const makeStyles = (COLORS) =>
  StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1.5,
    borderColor: COLORS.divider,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    marginBottom: 10,
  },
  cardDone: {
    backgroundColor: COLORS.cardMuted,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: FONTS.semibold,
    color: COLORS.text,
    marginBottom: 6,
  },
  titleDone: {
    color: COLORS.textMuted,
    textDecorationLine: "line-through",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginRight: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: FONTS.semibold,
  },
  duration: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  check: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  checkDone: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});
