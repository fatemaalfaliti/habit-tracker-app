import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_HABITS } from "../constants/habits";

// ------------------------------------------------------------
// Helper functions for reading and saving habits in AsyncStorage.
// Every user has their own list, saved under "habits_<email>".
// ------------------------------------------------------------

const keyFor = (email) => `habits_${email}`;

// Returns a date as "YYYY-MM-DD" (used to record completed days)
export const getDateKey = (date = new Date()) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// Reads the logged-in user saved by the Login screen
export const getCurrentUser = async () => {
  const stored = await AsyncStorage.getItem("currentUser");
  return stored ? JSON.parse(stored) : null;
};

// Loads the user's habits. The first time, it saves the default habits.
export const loadHabits = async (email) => {
  const stored = await AsyncStorage.getItem(keyFor(email));
  if (stored) {
    return JSON.parse(stored);
  }
  await AsyncStorage.setItem(keyFor(email), JSON.stringify(DEFAULT_HABITS));
  return DEFAULT_HABITS;
};

// Saves the full list of habits for the user
export const saveHabits = async (email, habits) => {
  await AsyncStorage.setItem(keyFor(email), JSON.stringify(habits));
};

// True if the habit was marked as done today
export const isDoneToday = (habit) =>
  habit.completedDates.includes(getDateKey());

// Marks the habit as done today, or removes today's mark if already done
export const toggleDoneToday = (habit) => {
  const today = getDateKey();
  const done = habit.completedDates.includes(today);
  return {
    ...habit,
    completedDates: done
      ? habit.completedDates.filter((d) => d !== today)
      : [...habit.completedDates, today],
  };
};

// Counts how many days in a row the habit was completed
export const getStreak = (habit) => {
  let streak = 0;
  const day = new Date();
  // If today is not done yet, start counting from yesterday
  if (!habit.completedDates.includes(getDateKey(day))) {
    day.setDate(day.getDate() - 1);
  }
  while (habit.completedDates.includes(getDateKey(day))) {
    streak += 1;
    day.setDate(day.getDate() - 1);
  }
  return streak;
};
