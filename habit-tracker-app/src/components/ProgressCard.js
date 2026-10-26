import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants/theme";

// ------------------------------------------------------------
// Today's Progress card: shows how many habits are done today
// with a progress bar. It updates when a habit is marked as done.
// ------------------------------------------------------------
export default function ProgressCard({ completed, total }) {
  // Percentage of completed habits (0 when there are no habits)
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>Today's Progress</Text>
        <Text style={styles.count}>
          {completed} of {total} completed
        </Text>
      </View>

      {/* Progress bar: grey track with a coloured fill */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
      <Text style={styles.percent}>{percent}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: FONTS.semibold,
    color: COLORS.text,
  },
  count: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  percent: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: "right",
  },
});
