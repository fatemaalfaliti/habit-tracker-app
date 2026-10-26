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
