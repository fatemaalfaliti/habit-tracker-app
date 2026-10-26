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
import Header from "../components/Header";
import Welcome from "../components/Welcome";
import QuoteCard from "../components/QuoteCard";
import ProgressCard from "../components/ProgressCard";
import HabitCard from "../components/HabitCard";
import AddHabitModal from "../components/AddHabitModal";
import { COLORS, FONTS } from "../constants/theme";
import { showConfirm } from "../utils/showAlert";
import {
  getCurrentUser,
  loadHabits,
  saveHabits,
  isDoneToday,
  toggleDoneToday,
} from "../utils/habitStorage";

export default function HomeScreen({ navigation }) {
  // ---------------- State ----------------
  const [user, setUser] = useState(null); // logged-in user
  const [habits, setHabits] = useState([]); // the user's habits
  const [isLoading, setIsLoading] = useState(true); // loading indicator
  const [showAddModal, setShowAddModal] = useState(false); // "New Habit" pop-up

  // ---------------- Load data ----------------
  // Runs every time the Home screen is shown (also when coming back
  // from the Detail screen), so the list is always up to date.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          // Nobody is logged in: go back to the Login screen
          navigation.replace("Login");
          return;
        }
        const savedHabits = await loadHabits(currentUser.email);
        if (isActive) {
          setUser(currentUser);
          setHabits(savedHabits);
          setIsLoading(false);
        }
      };

      loadData();
      return () => {
        isActive = false;
      };
    }, [navigation])
  );

  // ---------------- Actions ----------------
  // Updates the list on screen and saves it in AsyncStorage
  const updateHabits = async (newHabits) => {
    setHabits(newHabits);
    await saveHabits(user.email, newHabits);
  };

  // Marks a habit as done / not done for today
  const handleToggle = (id) => {
    updateHabits(habits.map((h) => (h.id === id ? toggleDoneToday(h) : h)));
  };

  // Adds a new habit from the pop-up form
  const handleAdd = (newHabit) => {
    updateHabits([...habits, newHabit]);
  };

  // Deletes a habit after the user confirms (long-press on a card)
  const handleDelete = (habit) => {
    showConfirm("Delete habit", `Do you want to delete "${habit.title}"?`, () =>
      updateHabits(habits.filter((h) => h.id !== habit.id))
    );
  };

  // Opens the Detail screen for the selected habit
  const openDetails = (habit) => {
    navigation.navigate("Detail", { habitId: habit.id });
  };

  // ---------------- Loading state ----------------
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Split habits into two sections: "To Do" and "Done"
  const todoHabits = habits.filter((h) => !isDoneToday(h));
  const doneHabits = habits.filter((h) => isDoneToday(h));

  // Renders one list of habit cards
  const renderCards = (list) =>
    list.map((habit) => (
      <HabitCard
        key={habit.id}
        habit={habit}
        done={isDoneToday(habit)}
        onPress={() => openDetails(habit)}
        onToggle={() => handleToggle(habit.id)}
        onLongPress={() => handleDelete(habit)}
      />
    ));

  // ---------------- Screen layout ----------------
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Top navigation bar */}
        <Header onSettingsPress={() => navigation.navigate("Menu")} />

        {/* Welcome section */}
        <Welcome name={user.userName} />

        {/* Quote of the day */}
        <QuoteCard />

        {/* Today's progress */}
        <ProgressCard completed={doneHabits.length} total={habits.length} />

        {/* Content sections */}
        {habits.length === 0 ? (
          // Empty state: no habits yet
          <Text style={styles.emptyText}>Use the + button to create some habits!</Text>
        ) : (
          <>
            {/* To Do section */}
            <Text style={styles.sectionTitle}>To Do ({todoHabits.length})</Text>
            {todoHabits.length === 0 ? (
              <Text style={styles.hint}>All habits are done for today. Great job!</Text>
            ) : (
              renderCards(todoHabits)
            )}

            {/* Done section */}
            <Text style={styles.sectionTitle}>Done ({doneHabits.length})</Text>
            {doneHabits.length === 0 ? (
              <Text style={styles.hint}>Tap the circle on a habit to mark it as done.</Text>
            ) : (
              renderCards(doneHabits)
            )}
          </>
        )}
      </ScrollView>

      {/* Floating "+" button to add a new habit */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        accessibilityLabel="Add a new habit"
      >
        <Icon name="add" size={30} color={COLORS.white} />
      </TouchableOpacity>

      {/* "New Habit" pop-up form */}
      <AddHabitModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100, // space so the last card is not hidden by the + button
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginTop: 6,
    marginBottom: 10,
  },
  hint: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 30,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
