import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "./Icon";
import { COLORS, FONTS } from "../constants/theme";

// ------------------------------------------------------------
// Quote of the Day card.
// For now the quote is fixed. In Module 3 (Integrate External API)
// it will be fetched from a quotes API with a refresh button.
// ------------------------------------------------------------
const QUOTE = {
  text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  author: "Will Durant",
};

export default function QuoteCard() {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Icon name="sparkles-outline" size={14} color={COLORS.primaryDark} />
        <Text style={styles.label}>QUOTE OF THE DAY</Text>
      </View>
      <Text style={styles.quote}>"{QUOTE.text}"</Text>
      <Text style={styles.author}>— {QUOTE.author}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1.5,
    borderColor: "#99F6E4",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  quote: {
    fontSize: 15,
    fontWeight: FONTS.medium,
    color: COLORS.text,
    lineHeight: 22,
  },
  author: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 8,
  },
});
