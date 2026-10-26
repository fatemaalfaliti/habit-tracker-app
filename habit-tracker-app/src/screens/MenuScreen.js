import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "../components/Icon";
import { globalStyles, COLORS, FONTS } from "../constants/theme";
import { getCurrentUser } from "../utils/habitStorage";

// ------------------------------------------------------------
// Settings menu (opened from the settings icon on the Home screen).
// Greets the user, links to other screens, and lets them log out.
// More options (Settings, Daily Reminders, Reports) come in Module 4.
// ------------------------------------------------------------
export default function MenuScreen({ navigation }) {
  const [userName, setUserName] = useState("");

  // Load the logged-in user's name from local storage
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
        <Icon name="arrow-back" size={22} color={COLORS.text} />
      </TouchableOpacity>

      <Text style={globalStyles.title}>Hello, {userName}!</Text>
      <Text style={globalStyles.subtitle}>Would you like to change any settings?</Text>

      {/* Menu options */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Favorites")}
      >
        <View style={styles.menuIcon}>
          <Icon name="heart-outline" size={20} color={COLORS.primaryDark} />
        </View>
        <Text style={styles.menuText}>My Favorites</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />

      {/* Logout button */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color={COLORS.error} />
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
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 68,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    marginBottom: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: FONTS.semibold,
    color: COLORS.text,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.textMuted,
  },
  spacer: {
    flex: 1,
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
