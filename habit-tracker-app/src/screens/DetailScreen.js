import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "../components/Icon";
import { COLORS, FONTS } from "../constants/theme";
import { CATEGORIES } from "../constants/habits";
import { showAlert } from "../utils/showAlert";
import {
  getCurrentUser,
  loadHabits,
  saveHabits,
  isDoneToday,
  toggleDoneToday,
  getStreak,
} from "../utils/habitStorage";

export default function DetailScreen({ route, navigation }) {
  // The id of the habit selected on the Home screen
  const { habitId } = route.params;

  // ---------------- State ----------------
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [activeTab, setActiveTab] = useState("About"); // "About" or "Tips"
  const [isLoading, setIsLoading] = useState(true);

  // ---------------- Load data ----------------
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          navigation.replace("Login");
          return;
        }
        setUser(currentUser);
        setHabits(await loadHabits(currentUser.email));
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

  // Find the selected habit in the list
  const habit = habits.find((h) => h.id === habitId);
  if (!habit) {
    return (
      <View style={styles.center}>
        <Text>Habit not found.</Text>
      </View>
    );
  }

  const category = CATEGORIES[habit.category] || CATEGORIES.Health;
  const done = isDoneToday(habit);
  const streak = getStreak(habit);

  // ---------------- Actions ----------------
  // Replaces this habit in the list and saves the list
  const updateHabit = async (updated) => {
    const newHabits = habits.map((h) => (h.id === updated.id ? updated : h));
    setHabits(newHabits);
    await saveHabits(user.email, newHabits);
  };

  // Mark as done / not done for today
  const handleToggleDone = () => updateHabit(toggleDoneToday(habit));

  // Add to / remove from favourites
  const handleToggleFavorite = () =>
    updateHabit({ ...habit, favorite: !habit.favorite });

  // Share the habit with friends (social media, email, messages)
  const handleShare = async () => {
    try {
      await Share.share({
        message: `I'm building a new habit: ${habit.title} (${habit.duration}) with HabitTracker!`,
      });
    } catch (error) {
      showAlert("Share", "Sharing is not available on this device.");
    }
  };

  // ---------------- Screen layout ----------------
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Top bar: back button, title, share button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Habit Details</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleShare}
          accessibilityLabel="Share habit"
        >
          <Icon name="share-social-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Banner with the habit icon */}
      <View style={[styles.banner, { backgroundColor: category.bg }]}>
        <Icon name={habit.icon || category.icon} size={72} color={category.fg} />
      </View>

      {/* Title, category, duration and streak */}
      <Text style={styles.title}>{habit.title}</Text>
      <View style={styles.metaRow}>
        <View style={[styles.tag, { backgroundColor: category.bg }]}>
          <Text style={[styles.tagText, { color: category.fg }]}>{habit.category}</Text>
        </View>
        <Text style={styles.duration}>{habit.duration} · Daily</Text>
      </View>
      <View style={styles.streakRow}>
        <Icon name="flame" size={18} color="#C2410C" />
        <Text style={styles.streakText}>
          Streak: {streak} {streak === 1 ? "day" : "days"}
        </Text>
      </View>

      {/* About / Tips tabs */}
      <View style={styles.tabs}>
        {["About", "Tips"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab content */}
      {activeTab === "About" ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {habit.title}</Text>
          <Text style={styles.body}>{habit.description}</Text>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips</Text>
          {habit.tips.map((tip, index) => (
            <Text key={index} style={styles.body}>
              {index + 1}. {tip}
            </Text>
          ))}
        </View>
      )}

      {/* Action buttons */}
      <TouchableOpacity
        style={[styles.primaryButton, done && styles.primaryButtonDone]}
        onPress={handleToggleDone}
      >
        <Icon name="checkmark" size={20} color={COLORS.white} />
        <Text style={styles.primaryButtonText}>{done ? "Completed" : "Mark as Done"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
        <Icon
          name={habit.favorite ? "heart" : "heart-outline"}
          size={20}
          color="#9A3412"
        />
        <Text style={styles.favoriteText}>
          {habit.favorite ? "Remove from Favorites" : "Add to Favorites"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  banner: {
    height: 190,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 10,
  },
  tagText: {
    fontSize: 12,
    fontWeight: FONTS.semibold,
  },
  duration: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: FONTS.semibold,
    color: "#9A3412",
    marginLeft: 6,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: COLORS.white,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: FONTS.semibold,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563",
    marginBottom: 4,
  },
  primaryButton: {
    flexDirection: "row",
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  primaryButtonDone: {
    backgroundColor: COLORS.primaryDark,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: FONTS.semibold,
    marginLeft: 8,
  },
  favoriteButton: {
    flexDirection: "row",
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FDBA74",
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteText: {
    color: "#9A3412",
    fontSize: 15,
    fontWeight: FONTS.semibold,
    marginLeft: 8,
  },
});
