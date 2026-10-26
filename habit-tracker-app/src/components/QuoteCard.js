import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Icon from "./Icon";
import { COLORS, FONTS } from "../constants/theme";
import { fetchRandomQuote, getFallbackQuote } from "../api/quotesApi";
import { useTheme } from "../context/ThemeProvider";

// ------------------------------------------------------------
// Quote of the Day card.
// Fetches a motivational quote from an external API when the
// Home screen opens, and again when the user taps "New quote".
// Shows a loading indicator while waiting, and a saved quote
// with a short message if the API cannot be reached.
// ------------------------------------------------------------
export default function QuoteCard() {
  // Active theme colours and styles (light or dark mode)
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  // ---------------- State ----------------
  const [quote, setQuote] = useState(null); // { text, author }
  const [isLoading, setIsLoading] = useState(true); // waiting for the API
  const [isOffline, setIsOffline] = useState(false); // API request failed

  // ---------------- Fetch data from the API ----------------
  const loadQuote = useCallback(async () => {
    setIsLoading(true);
    try {
      const newQuote = await fetchRandomQuote(); // GET request
      setQuote(newQuote);
      setIsOffline(false);
    } catch (error) {
      console.log("Error fetching quote:", error);
      setQuote(getFallbackQuote()); // show a saved quote instead
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load a quote once when the card first appears
  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  // ---------------- Display ----------------
  return (
    <View style={styles.card}>
      {/* Title row with the refresh button */}
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Icon name="sparkles-outline" size={14} color={COLORS.primaryDark} />
          <Text style={styles.label}>QUOTE OF THE DAY</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadQuote}
          disabled={isLoading}
          accessibilityLabel="Get a new quote"
        >
          <Text style={styles.refreshText}>↻ New quote</Text>
        </TouchableOpacity>
      </View>

      {/* Conditional rendering: loading or quote */}
      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading today's quote...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.quote}>"{quote.text}"</Text>
          <Text style={styles.author}>— {quote.author}</Text>
          {isOffline && (
            <Text style={styles.offline}>
              Couldn't reach the quotes service. Showing a saved quote.
            </Text>
          )}
        </>
      )}
    </View>
  );
}

// Styles are built from the active theme colours (light or dark)
const makeStyles = (COLORS) =>
  StyleSheet.create({
  card: {
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1.5,
    borderColor: COLORS.accentBorder,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  titleLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  refreshButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.card,
  },
  refreshText: {
    fontSize: 12,
    fontWeight: FONTS.semibold,
    color: COLORS.primaryDark,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginLeft: 10,
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
  offline: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 8,
  },
});
