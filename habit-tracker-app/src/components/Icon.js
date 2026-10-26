import React from "react";
import { Text } from "react-native";

// ------------------------------------------------------------
// Simple icon component built from text symbols and emoji.
// We use it instead of an icon font, because the lab server
// cannot load icon font files (they fail with a 500 error).
// Usage: <Icon name="checkmark" size={18} color="#fff" />
// ------------------------------------------------------------
const SYMBOLS = {
  // Interface icons (they take the colour you pass)
  "settings-outline": "⚙︎", // gear
  checkmark: "✓", // check mark
  add: "+",
  close: "✕",
  "arrow-back": "←",
  "share-social-outline": "↗",
  heart: "♥",
  "heart-outline": "♡",
  "sparkles-outline": "✦",
  "log-out-outline": "↩",
  "chevron-forward": "›",
  // Menu icons (emoji)
  "options-outline": "⚙️",
  "alarm-outline": "⏰",
  "bar-chart-outline": "📊",
  "information-circle-outline": "ℹ️",
  "person-outline": "👤",
  // Habit icons (colourful emoji)
  flame: "🔥",
  "walk-outline": "🚶",
  "book-outline": "📖",
  "water-outline": "💧",
  "leaf-outline": "🌿",
  "moon-outline": "🌙",
  "barbell-outline": "💪",
};

export default function Icon({ name, size = 20, color = "#1F2937" }) {
  return (
    <Text
      style={{
        fontSize: size,
        lineHeight: Math.round(size * 1.2),
        color,
        fontWeight: name === "add" ? "400" : "700",
        textAlign: "center",
      }}
      accessible={false}
    >
      {SYMBOLS[name] || "•"}
    </Text>
  );
}
