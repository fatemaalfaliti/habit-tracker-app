import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

// ------------------------------------------------------------
// Notification helpers used by the Daily Reminders screen.
// - On a phone (iOS / Android): expo-notifications
// - On the web (Cloud IDE browser): the browser Notification API,
//   because expo-notifications cannot schedule notifications on the web.
// ------------------------------------------------------------

const isWeb = Platform.OS === "web";

// Timers for notifications scheduled on the web (id -> timer)
const webTimers = {};

// On a phone: show notifications even while the app is open
if (!isWeb) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// Returns the current permission: "granted", "denied" or "default"
export const getPermissionStatus = async () => {
  if (isWeb) {
    return typeof window !== "undefined" && "Notification" in window
      ? window.Notification.permission
      : "unsupported";
  }
  const { status } = await Notifications.getPermissionsAsync();
  return status === "undetermined" ? "default" : status;
};

// Asks the user for permission to show notifications.
// Returns true if notifications are allowed.
export const requestPermissions = async () => {
  try {
    if (isWeb) {
      if (!("Notification" in window)) return false;
      if (window.Notification.permission === "granted") return true;
      const result = await window.Notification.requestPermission();
      return result === "granted";
    }
    const { status } = await Notifications.getPermissionsAsync();
    if (status === "granted") return true;
    const request = await Notifications.requestPermissionsAsync();
    return request.status === "granted";
  } catch (error) {
    console.log("Error requesting notification permission:", error);
    return false;
  }
};

// Shows a notification on the web right now.
// If the browser blocks notifications, an in-app alert is shown instead.
const showWebNotification = (title, body) => {
  if ("Notification" in window && window.Notification.permission === "granted") {
    new window.Notification(title, { body });
  } else {
    window.alert(`${title}\n${body}`);
  }
};

// Schedules a notification after a number of seconds.
// Returns an id that can be used to cancel it.
export const scheduleNotification = async (title, body, seconds) => {
  const delay = Math.max(1, Math.round(seconds));

  if (isWeb) {
    const id = `web-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    webTimers[id] = setTimeout(() => {
      showWebNotification(title, body);
      delete webTimers[id];
    }, delay * 1000);
    return id;
  }

  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds: delay },
  });
};

// Schedules a notification for a specific date and time
export const scheduleNotificationAt = (title, body, date) =>
  scheduleNotification(title, body, (date.getTime() - Date.now()) / 1000);

// Cancels a scheduled notification
export const cancelNotification = async (id) => {
  if (!id) return;
  if (isWeb) {
    clearTimeout(webTimers[id]);
    delete webTimers[id];
    return;
  }
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (error) {
    console.log("Error cancelling notification:", error);
  }
};
