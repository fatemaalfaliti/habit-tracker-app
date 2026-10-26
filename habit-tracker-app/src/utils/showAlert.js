import { Alert, Platform } from "react-native";

// Alert.alert does not show anything on the web,
// so on the web we use the browser alert instead.
export const showAlert = (title, message) => {
  if (Platform.OS === "web") {
    window.alert(`${title}. ${message}`);
  } else {
    Alert.alert(title, message);
  }
};

// Asks the user to confirm an action (OK / Cancel)
// and runs onConfirm only if they press OK.
export const showConfirm = (title, message, onConfirm) => {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}. ${message}`)) {
      onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: "OK", style: "destructive", onPress: onConfirm },
    ]);
  }
};
