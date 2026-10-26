import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_HABITS } from "../constants/habits";

// ------------------------------------------------------------
// Local storage (persistence) for the whole app, using AsyncStorage.
// On the web, AsyncStorage saves into the browser's Local Storage.
//
// Keys saved in local storage:
//   "users"            -> all registered accounts (Signup screen)
//   "currentUser"      -> the logged-in user / session (Login screen)
//   "habits_<email>"   -> each user's habits, completed days and favourites
// ------------------------------------------------------------

const keyFor = (email) => `habits_${email}`;

// Returns a date as "YYYY-MM-DD" (used to record completed days)
export const getDateKey = (date = new Date()) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// ---------------- User profile / session ----------------

// Reads the logged-in user saved by the Login screen
export const getCurrentUser = async () => {
  try {
    const stored = await AsyncStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.log("Error reading current user:", error);
    return null;
  }
};

// Saves the logged-in user (keeps the user logged in between sessions)
export const saveCurrentUser = async (user) => {
  try {
    await AsyncStorage.setItem("currentUser", JSON.stringify(user));
  } catch (error) {
    console.log("Error saving current user:", error);
  }
};

// ---------------- Habits (user actions) ----------------

// Loads the user's habits. The first time, it saves the default habits.
export const loadHabits = async (email) => {
  try {
    const stored = await AsyncStorage.getItem(keyFor(email));
    if (stored) {
      return JSON.parse(stored);
    }
    await AsyncStorage.setItem(keyFor(email), JSON.stringify(DEFAULT_HABITS));
    return DEFAULT_HABITS;
  } catch (error) {
    console.log("Error loading habits:", error);
    return [];
  }
};

// Saves the full list of habits for the user
export const saveHabits = async (email, habits) => {
  try {
    await AsyncStorage.setItem(keyFor(email), JSON.stringify(habits));
  } catch (error) {
    console.log("Error saving habits:", error);
  }
};

// ---------------- Favourites ----------------

// Returns only the habits the user added to favourites
export const getFavoriteHabits = async (email) => {
  const habits = await loadHabits(email);
  return habits.filter((h) => h.favorite);
};

// Removes a habit from favourites and saves the change.
// Returns the updated list of favourite habits.
export const removeFavorite = async (email, habitId) => {
  const habits = await loadHabits(email);
  const updated = habits.map((h) =>
    h.id === habitId ? { ...h, favorite: false } : h
  );
  await saveHabits(email, updated);
  return updated.filter((h) => h.favorite);
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

// Longest run of consecutive completed days for one habit (used in Reports)
export const getBestStreak = (habit) => {
  const days = [...habit.completedDates].sort();
  let best = 0;
  let current = 0;
  let previous = null;
  days.forEach((key) => {
    const date = new Date(`${key}T00:00:00`);
    if (previous && (date - previous) / 86400000 === 1) {
      current += 1;
    } else {
      current = 1;
    }
    best = Math.max(best, current);
    previous = date;
  });
  return best;
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
