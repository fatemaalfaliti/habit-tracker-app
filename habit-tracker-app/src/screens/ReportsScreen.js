import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "../components/Icon";
import { COLORS, FONTS } from "../constants/theme";
import {
  getCurrentUser,
  loadHabits,
  getDateKey,
  isDoneToday,
  getBestStreak,
} from "../utils/habitStorage";
import { useTheme } from "../context/ThemeProvider";

// ------------------------------------------------------------
// Reports screen: weekly progress built from the saved habits.
// - Bar chart: habits completed on each of the last 7 days
// - Summary cards: completed this week, pending today, best streak
// - Lists of today's completed and pending habits
// ------------------------------------------------------------

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CHART_HEIGHT = 140;

export default function ReportsScreen({ navigation }) {
  // Active theme colours and styles (light or dark mode)
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load the habits from local storage each time the screen opens
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const user = await getCurrentUser();
        if (!user) {
          navigation.replace("Login");
          return;
        }
        setHabits(await loadHabits(user.email));
        setIsLoading(false);
      };
      loadData();
    }, [navigation])
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // ---------------- Calculate the report ----------------
  // The last 7 days, from 6 days ago to today
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = getDateKey(date);
    const count = habits.filter((h) => h.completedDates.includes(key)).length;
    week.push({ key, label: DAY_NAMES[date.getDay()], count, isToday: i === 0 });
  }

  const completedThisWeek = week.reduce((sum, day) => sum + day.count, 0);
  const doneToday = habits.filter((h) => isDoneToday(h));
  const pendingToday = habits.filter((h) => !isDoneToday(h));
  const bestStreak = habits.reduce((best, h) => Math.max(best, getBestStreak(h)), 0);
  const maxCount = Math.max(habits.length, 1); // full bar = all habits done

  // ---------------- Screen layout ----------------
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
        <Text style={styles.topTitle}>Reports</Text>
        <View style={styles.iconButtonPlaceholder} />
      </View>

      <Text style={styles.title}>Weekly Progress</Text>
      <Text style={styles.subtitle}>Habits completed in the last 7 days</Text>

      {/* Bar chart */}
      <View style={styles.chartCard}>
        <View style={styles.chart}>
          {week.map((day) => (
            <View key={day.key} style={styles.barColumn}>
              <Text style={styles.barValue}>{day.count}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    { height: (day.count / maxCount) * CHART_HEIGHT },
                    day.isToday && styles.barToday,
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, day.isToday && styles.barLabelToday]}>
                {day.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Summary cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedThisWeek}</Text>
          <Text style={styles.statLabel}>Completed this week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pendingToday.length}</Text>
          <Text style={styles.statLabel}>Pending today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{bestStreak}</Text>
          <Text style={styles.statLabel}>Best streak (days)</Text>
        </View>
      </View>

      {/* Today's completed and pending habits */}
      <View style={styles.listsRow}>
        <View style={styles.listCard}>
          <Text style={[styles.listTitle, { color: COLORS.primary }]}>
            Completed ({doneToday.length})
          </Text>
          {doneToday.length === 0 ? (
            <Text style={styles.listEmpty}>Nothing yet today</Text>
          ) : (
            doneToday.map((h) => (
              <Text key={h.id} style={styles.listItem}>✓ {h.title}</Text>
            ))
          )}
        </View>
        <View style={styles.listCard}>
          <Text style={[styles.listTitle, { color: "#9A3412" }]}>
            Pending ({pendingToday.length})
          </Text>
          {pendingToday.length === 0 ? (
            <Text style={styles.listEmpty}>All done!</Text>
          ) : (
            pendingToday.map((h) => (
              <Text key={h.id} style={styles.listItem}>• {h.title}</Text>
            ))
          )}
        </View>
      </View>
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
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
  title: {
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 14,
  },
  chartCard: {
    borderWidth: 1.5,
    borderColor: COLORS.divider,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
  },
  barValue: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  barTrack: {
    height: CHART_HEIGHT,
    width: 24,
    justifyContent: "flex-end",
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    overflow: "hidden",
  },
  bar: {
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  barToday: {
    backgroundColor: "#EA580C",
  },
  barLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  barLabelToday: {
    color: "#C2410C",
    fontWeight: FONTS.bold,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.divider,
    borderRadius: 14,
    padding: 10,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  listsRow: {
    flexDirection: "row",
  },
  listCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.divider,
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 4,
  },
  listTitle: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    marginBottom: 6,
  },
  listItem: {
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 3,
  },
  listEmpty: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
