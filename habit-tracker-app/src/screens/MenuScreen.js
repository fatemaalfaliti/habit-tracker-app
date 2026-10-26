import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, FONTS } from "../constants/theme";
import { getCurrentUser } from "../utils/habitStorage";

// ------------------------------------------------------------
// Temporary Menu screen (opened from the settings icon).
// The full settings menu will be built in Module 4.
// For now it greets the user and lets them log out.
// ------------------------------------------------------------
export default function MenuScreen({ navigation }) {
  const [userName, setUserName] = useState("");

  // Load the logged-in user's name
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) setUserName(user.userName);
    });
  }, []);

  // Logout: remove the session and go back to the Login screen
  const handleLogout = async () => {
    await AsyncStorage.removeItem("currentUser");
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  return (
    <View style={styles.screen}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={22} color={COLORS.text} />
      </TouchableOpacity>

      <Text style={globalStyles.title}>Hello, {userName}!</Text>
      <Text style={globalStyles.subtitle}>Would you like to change any settings?</Text>

      {/* Logout button */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logout: {
    flexDirection: "row",
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.errorBg,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: FONTS.bold,
    marginLeft: 8,
  },
});
