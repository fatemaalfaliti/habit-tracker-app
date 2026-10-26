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
import { CATEGORIES } from "../constants/habits";
import {
  getCurrentUser,
  getFavoriteHabits,
  removeFavorite,
} from "../utils/habitStorage";

// ------------------------------------------------------------
// My Favorites screen.
// Loads the user's favourite habits from local storage (AsyncStorage)
// every time the screen is opened, and lets the user remove them.
// ------------------------------------------------------------
export default function FavoritesScreen({ navigation }) {
  // ---------------- State ----------------
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ---------------- Load saved favourites ----------------
  // useFocusEffect runs each time the screen is focused,
  // so the list is always up to date (for example after
  // adding a favourite on the Detail screen).
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadFavorites = async () => {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          navigation.replace("Login");
          return;
        }
        const saved = await getFavoriteHabits(currentUser.email);
        if (isActive) {
          setUser(currentUser);
          setFavorites(saved);
          setIsLoading(false);
        }
      };

      loadFavorites();
      return () => {
        isActive = false;
      };
    }, [navigation])
  );

  // Removes a habit from favourites (saved in local storage)
  const handleRemove = async (habitId) => {
    const updated = await removeFavorite(user.email, habitId);
    setFavorites(updated);
  };

  // ---------------- Screen layout ----------------
  return (
    <View style={styles.screen}>
      {/* Top bar: back button and title */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>My Favorite Habits</Text>
        <View style={styles.iconButtonPlaceholder} />
      </View>

      {/* Conditional rendering: loading / empty list / favourites */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.center}>
          <Icon name="heart-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>
            Open a habit and tap "Add to Favorites" to save it here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          <Text style={styles.sectionTitle}>Saved Habits ({favorites.length})</Text>

          {favorites.map((habit) => {
            const category = CATEGORIES[habit.category] || CATEGORIES.Health;
            return (
              <View key={habit.id} style={styles.card}>
                {/* Tap the habit to open its details */}
                <TouchableOpacity
                  style={styles.cardRow}
                  onPress={() => navigation.navigate("Detail", { habitId: habit.id })}
                >
                  <View style={[styles.thumb, { backgroundColor: category.bg }]}>
                    <Icon name={habit.icon || category.icon} size={28} />
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.habitTitle}>{habit.title}</Text>
                    <View style={styles.metaRow}>
                      <View style={[styles.tag, { backgroundColor: category.bg }]}>
                        <Text style={[styles.tagText, { color: category.fg }]}>
                          {habit.category}
                        </Text>
                      </View>
                      <Text style={styles.duration}>{habit.duration}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Remove from favourites */}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(habit.id)}
                >
                  <Icon name="heart" size={16} color={COLORS.error} />
                  <Text style={styles.removeText}>Remove from Favorites</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 6,
  },
  list: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 12,
  },
  card: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 15,
    fontWeight: FONTS.semibold,
    color: COLORS.text,
    marginBottom: 6,
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
  removeButton: {
    flexDirection: "row",
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#FCA5A5",
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: FONTS.semibold,
    marginLeft: 6,
  },
});
