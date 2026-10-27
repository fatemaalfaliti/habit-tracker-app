import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "../components/Icon";
import { FONTS } from "../constants/theme";
import { useTheme } from "../context/ThemeProvider";
import { showAlert } from "../utils/showAlert";
import {
  getCurrentUser,
  loadHabits,
  getDateKey,
  getNotificationsEnabled,
  saveNotificationsEnabled,
  getReminders,
  saveReminders,
} from "../utils/habitStorage";
import {
  requestPermissions,
  getPermissionStatus,
  scheduleNotification,
  scheduleNotificationAt,
  cancelNotification,
} from "../utils/notifications";

// ------------------------------------------------------------
// Daily Reminders screen (Notifications settings).
// - Enable / disable notifications (saved in AsyncStorage)
// - Choose a habit, pick a date on the calendar and a time
// - Add Reminder: schedules a notification and saves the reminder
// - All Reminders list with a Delete button
// - Test Notification: sends a notification after 5 seconds
// ------------------------------------------------------------

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIME_PRESETS = [
  { label: "Morning", time: "08:00" },
  { label: "Afternoon", time: "14:00" },
  { label: "Evening", time: "20:00" },
];
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM, 24-hour
const TEST_DELAY_SECONDS = 5;

export default function RemindersScreen({ navigation }) {
  const { colors: COLORS, globalStyles } = useTheme();
  const styles = makeStyles(COLORS);

  // ---------------- State ----------------
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [permission, setPermission] = useState("default");
  const today = new Date();
  const [month, setMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState(null); // "YYYY-MM-DD"
  const [time, setTime] = useState(""); // "HH:MM"
  const [selectedHabit, setSelectedHabit] = useState("All habits");

  // ---------------- Load data and request permission ----------------
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

        const enabled = await getNotificationsEnabled(currentUser.email);
        setNotificationsOn(enabled);
        if (enabled) {
          await requestPermissions(); // ask for permission when the screen loads
        }
        setPermission(await getPermissionStatus());

        // Keep only future reminders, and schedule them again
        // (scheduled web timers are lost when the page reloads)
        const saved = await getReminders(currentUser.email);
        const future = saved.filter((r) => new Date(r.triggerDate) > new Date());
        const rescheduled = [];
        for (const reminder of future) {
          await cancelNotification(reminder.notificationId);
          const notificationId = enabled
            ? await scheduleNotificationAt(
                "HabitTracker Reminder",
                reminderMessage(reminder.habit),
                new Date(reminder.triggerDate)
              )
            : null;
          rescheduled.push({ ...reminder, notificationId });
        }
        setReminders(rescheduled);
        await saveReminders(currentUser.email, rescheduled);
      };
      loadData();
    }, [navigation])
  );

  // Text shown in the notification
  const reminderMessage = (habit) =>
    habit === "All habits"
      ? "Don't forget to complete your habits today!"
      : `Time for your habit: ${habit}`;

  // ---------------- Enable / disable notifications ----------------
  const handleToggleNotifications = async (value) => {
    setNotificationsOn(value);
    await saveNotificationsEnabled(user.email, value);
    if (value) {
      const granted = await requestPermissions();
      setPermission(await getPermissionStatus());
      if (!granted) {
        showAlert(
          "Permission not granted",
          "Please allow notifications in your browser to receive reminders."
        );
      }
      // Turning notifications back on schedules the future reminders again
      const rescheduled = [];
      for (const reminder of reminders) {
        if (new Date(reminder.triggerDate) <= new Date()) continue; // skip past ones
        const notificationId = await scheduleNotificationAt(
          "HabitTracker Reminder",
          reminderMessage(reminder.habit),
          new Date(reminder.triggerDate)
        );
        rescheduled.push({ ...reminder, notificationId });
      }
      setReminders(rescheduled);
      await saveReminders(user.email, rescheduled);
    } else {
      // Turning notifications off cancels all scheduled reminders
      for (const reminder of reminders) {
        await cancelNotification(reminder.notificationId);
      }
    }
  };

  // ---------------- Calendar ----------------
  const changeMonth = (step) => {
    const date = new Date(month.year, month.month + step, 1);
    setMonth({ year: date.getFullYear(), month: date.getMonth() });
  };

  // Builds the calendar grid: empty cells, then the days of the month
  const firstDay = new Date(month.year, month.month, 1).getDay();
  const daysInMonth = new Date(month.year, month.month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const todayKey = getDateKey(today);

  // ---------------- Add a reminder ----------------
  const handleAddReminder = async () => {
    if (!notificationsOn) {
      showAlert("Notifications are off", "Turn on notifications to add reminders.");
      return;
    }
    if (!selectedDate) {
      showAlert("Missing date", "Please select a date on the calendar.");
      return;
    }
    if (!TIME_PATTERN.test(time.trim())) {
      showAlert("Invalid time", "Please enter the time as HH:MM, for example 20:30.");
      return;
    }
    const triggerDate = new Date(`${selectedDate}T${time.trim()}:00`);
    if (triggerDate <= new Date()) {
      showAlert("Invalid time", "Please select a future time.");
      return;
    }

    await requestPermissions();
    setPermission(await getPermissionStatus());

    // Schedule the notification, then save the reminder
    const notificationId = await scheduleNotificationAt(
      "HabitTracker Reminder",
      reminderMessage(selectedHabit),
      triggerDate
    );
    const newReminder = {
      id: Date.now().toString(),
      habit: selectedHabit,
      date: selectedDate,
      time: time.trim(),
      triggerDate: triggerDate.toISOString(),
      notificationId,
    };
    const updated = [...reminders, newReminder].sort(
      (a, b) => new Date(a.triggerDate) - new Date(b.triggerDate)
    );
    setReminders(updated);
    await saveReminders(user.email, updated);
    showAlert("Reminder added", `${selectedHabit} on ${selectedDate} at ${time.trim()}.`);
  };

  // ---------------- Delete a reminder ----------------
  const deleteReminder = async (id) => {
    const reminder = reminders.find((r) => r.id === id);
    if (reminder) await cancelNotification(reminder.notificationId);
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    await saveReminders(user.email, updated);
  };

  // ---------------- Test notification ----------------
  const handleTestNotification = async () => {
    if (!notificationsOn) {
      showAlert("Notifications are off", "Turn on notifications to send a test.");
      return;
    }
    const granted = await requestPermissions();
    setPermission(await getPermissionStatus());
    await scheduleNotification(
      "HabitTracker Reminder",
      "This is a test notification. Keep building great habits!",
      TEST_DELAY_SECONDS
    );
    showAlert(
      "Test scheduled",
      granted
        ? `The test notification will appear in ${TEST_DELAY_SECONDS} seconds.`
        : `Notifications are blocked, so the test will show as an alert in ${TEST_DELAY_SECONDS} seconds.`
    );
  };

  if (!user) {
    return <View style={styles.screen} />;
  }

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
        <Text style={styles.topTitle}>Daily Reminders</Text>
        <View style={styles.iconButtonPlaceholder} />
      </View>

      {/* Enable notifications */}
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Enable Notifications</Text>
            <Text style={styles.rowSubtitle}>
              Permission: {permission === "granted" ? "allowed ✓" : permission}
            </Text>
          </View>
          <Switch
            value={notificationsOn}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.white}
            accessibilityLabel="Enable Notifications"
          />
        </View>
      </View>

      {/* Select habit */}
      <Text style={styles.sectionTitle}>Select Habit for Notification</Text>
      <View style={styles.chips}>
        {["All habits", ...habits.map((h) => h.title)].map((name) => {
          const selected = name === selectedHabit;
          return (
            <TouchableOpacity
              key={name}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => setSelectedHabit(name)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {selected ? "✓ " : ""}
                {name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Calendar */}
      <Text style={styles.sectionTitle}>Select Date</Text>
      <View style={styles.box}>
        <View style={styles.monthRow}>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => changeMonth(-1)}
            accessibilityLabel="Previous month"
          >
            <Text style={styles.monthArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {MONTHS[month.month]} {month.year}
          </Text>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => changeMonth(1)}
            accessibilityLabel="Next month"
          >
            <Text style={styles.monthArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {WEEK_DAYS.map((d) => (
            <Text key={d} style={styles.weekDay}>
              {d}
            </Text>
          ))}
          {cells.map((day, index) => {
            if (!day) return <View key={`empty-${index}`} style={styles.dayCell} />;
            const key = getDateKey(new Date(month.year, month.month, day));
            const isPast = key < todayKey;
            const isSelected = key === selectedDate;
            const isToday = key === todayKey;
            return (
              <TouchableOpacity
                key={key}
                style={styles.dayCell}
                disabled={isPast}
                onPress={() => setSelectedDate(key)}
                accessibilityLabel={key}
              >
                <View
                  style={[
                    styles.dayCircle,
                    isToday && styles.dayToday,
                    isSelected && styles.daySelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isPast && styles.dayPast,
                      isSelected && styles.dayTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Time */}
      <Text style={styles.sectionTitle}>Select Time</Text>
      <View style={styles.chips}>
        {TIME_PRESETS.map((preset) => {
          const selected = preset.time === time;
          return (
            <TouchableOpacity
              key={preset.label}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => setTime(preset.time)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {preset.label} ({preset.time})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TextInput
        style={globalStyles.input}
        placeholder="Enter Time (HH:MM)"
        placeholderTextColor={COLORS.textMuted}
        value={time}
        onChangeText={setTime}
        maxLength={5}
      />

      <Text style={styles.selection}>
        Selected Date: {selectedDate || "None"}    Selected Time: {time || "None"}
      </Text>

      {/* Buttons */}
      <TouchableOpacity
        style={[globalStyles.button, !notificationsOn && globalStyles.buttonDisabled]}
        onPress={handleAddReminder}
      >
        <Text style={globalStyles.buttonText}>Add Reminder</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.testButton} onPress={handleTestNotification}>
        <Icon name="alarm-outline" size={18} />
        <Text style={styles.testText}>Test Notification</Text>
      </TouchableOpacity>

      {/* Reminders list */}
      <Text style={styles.sectionTitle}>All Reminders</Text>
      {reminders.length === 0 ? (
        <Text style={styles.empty}>No reminders yet.</Text>
      ) : (
        reminders.map((reminder) => (
          <View key={reminder.id} style={styles.reminderRow}>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTitle}>{reminder.habit}</Text>
              <Text style={styles.reminderTime}>
                {reminder.date} at {reminder.time}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteReminder(reminder.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
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
    box: {
      borderWidth: 1.5,
      borderColor: COLORS.divider,
      borderRadius: 16,
      padding: 14,
      backgroundColor: COLORS.card,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    rowText: {
      flex: 1,
      marginRight: 12,
    },
    rowTitle: {
      fontSize: 15,
      fontWeight: FONTS.semibold,
      color: COLORS.text,
    },
    rowSubtitle: {
      fontSize: 12,
      color: COLORS.textMuted,
      marginTop: 2,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: FONTS.bold,
      color: COLORS.text,
      marginTop: 18,
      marginBottom: 10,
    },
    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 6,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      marginRight: 8,
      marginBottom: 8,
    },
    chipSelected: {
      backgroundColor: COLORS.primaryLight,
      borderColor: COLORS.primary,
    },
    chipText: {
      fontSize: 13,
      color: COLORS.text,
    },
    chipTextSelected: {
      color: COLORS.primaryDark,
      fontWeight: FONTS.semibold,
    },
    monthRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    monthButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: COLORS.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    monthArrow: {
      fontSize: 22,
      color: COLORS.text,
      lineHeight: 24,
    },
    monthTitle: {
      fontSize: 15,
      fontWeight: FONTS.semibold,
      color: COLORS.text,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    weekDay: {
      width: "14.28%",
      textAlign: "center",
      fontSize: 11,
      fontWeight: FONTS.semibold,
      color: COLORS.textMuted,
      marginBottom: 6,
    },
    dayCell: {
      width: "14.28%",
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    dayCircle: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
    },
    dayToday: {
      borderWidth: 1.5,
      borderColor: COLORS.primary,
    },
    daySelected: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    dayText: {
      fontSize: 13,
      color: COLORS.text,
    },
    dayPast: {
      color: COLORS.border,
    },
    dayTextSelected: {
      color: COLORS.white,
      fontWeight: FONTS.bold,
    },
    selection: {
      fontSize: 13,
      color: COLORS.textSecondary,
      marginBottom: 4,
    },
    testButton: {
      flexDirection: "row",
      height: 48,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
    },
    testText: {
      color: COLORS.primaryDark,
      fontSize: 15,
      fontWeight: FONTS.semibold,
      marginLeft: 8,
    },
    empty: {
      fontSize: 13,
      color: COLORS.textMuted,
    },
    reminderRow: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: COLORS.divider,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      backgroundColor: COLORS.card,
    },
    reminderInfo: {
      flex: 1,
    },
    reminderTitle: {
      fontSize: 14,
      fontWeight: FONTS.semibold,
      color: COLORS.text,
    },
    reminderTime: {
      fontSize: 12,
      color: COLORS.textMuted,
      marginTop: 2,
    },
    deleteButton: {
      backgroundColor: "#DC2626",
      paddingHorizontal: 14,
      height: 36,
      borderRadius: 8,
      justifyContent: "center",
    },
    deleteText: {
      color: COLORS.white,
      fontWeight: FONTS.semibold,
      fontSize: 13,
    },
  });
