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
//   "theme"            -> light or dark mode (ThemeProvider)
//   "notifications_<email>" -> notifications on / off (Settings screen)
//   "reminders_<email>"     -> scheduled reminders (Daily Reminders screen)
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

// ---------------- Profile (Settings screen) ----------------

// Updates the user's name and email everywhere they are saved:
// the users list, the current session and the habits key.
// Returns { ok: true, user } or { ok: false, message }.
export const updateUserProfile = async (oldEmail, newUserName, newEmail) => {
  try {
    const email = newEmail.trim().toLowerCase();
    const stored = await AsyncStorage.getItem("users");
    const users = stored ? JSON.parse(stored) : [];

    // The new email must not belong to another account
    if (email !== oldEmail && users.some((u) => u.email === email)) {
      return { ok: false, message: "This email is already used by another account." };
    }

    const current = users.find((u) => u.email === oldEmail);
    if (!current) {
      return { ok: false, message: "Account not found." };
    }
    const updatedUser = { ...current, userName: newUserName.trim(), email };

    // 1. Save the updated users list
    await AsyncStorage.setItem(
      "users",
      JSON.stringify(users.map((u) => (u.email === oldEmail ? updatedUser : u)))
    );
    // 2. Update the logged-in session
    await saveCurrentUser(updatedUser);
    // 3. If the email changed, move the habits and settings to the new key
    if (email !== oldEmail) {
      const habits = await AsyncStorage.getItem(keyFor(oldEmail));
      if (habits) {
        await AsyncStorage.setItem(keyFor(email), habits);
        await AsyncStorage.removeItem(keyFor(oldEmail));
      }
      for (const prefix of ["notifications_", "reminders_"]) {
        const value = await AsyncStorage.getItem(`${prefix}${oldEmail}`);
        if (value !== null) {
          await AsyncStorage.setItem(`${prefix}${email}`, value);
          await AsyncStorage.removeItem(`${prefix}${oldEmail}`);
        }
      }
    }
    return { ok: true, user: updatedUser };
  } catch (error) {
    console.log("Error updating profile:", error);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
};

// ---------------- Notification preference ----------------

// Reads whether notifications are on for this user (on by default)
export const getNotificationsEnabled = async (email) => {
  try {
    const value = await AsyncStorage.getItem(`notifications_${email}`);
    return value === null ? true : value === "true";
  } catch (error) {
    console.log("Error reading notification setting:", error);
    return true;
  }
};

// Saves the notification on/off choice for this user
export const saveNotificationsEnabled = async (email, enabled) => {
  try {
    await AsyncStorage.setItem(`notifications_${email}`, String(enabled));
  } catch (error) {
    console.log("Error saving notification setting:", error);
  }
};

// ---------------- Reminders (Daily Reminders screen) ----------------

// Reads the user's saved reminders
export const getReminders = async (email) => {
  try {
    const stored = await AsyncStorage.getItem(`reminders_${email}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.log("Error reading reminders:", error);
    return [];
  }
};

// Saves the user's reminders
export const saveReminders = async (email, reminders) => {
  try {
    await AsyncStorage.setItem(`reminders_${email}`, JSON.stringify(reminders));
  } catch (error) {
    console.log("Error saving reminders:", error);
  }
};
