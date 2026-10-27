import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "../components/Icon";
import { COLORS, FONTS } from "../constants/theme";
import { getCurrentUser } from "../utils/habitStorage";
import { showAlert } from "../utils/showAlert";
import { useTheme } from "../context/ThemeProvider";

// ------------------------------------------------------------
// Settings Menu screen (opened from the settings icon on the Home screen).
// - Personalised greeting with the user's name and email
// - A list of menu options, each with an icon and a short description
// - A Logout button that clears the session and returns to Login
// ------------------------------------------------------------

// Menu options. "screen" is the name of the screen to open.
// Options with screen: null are planned for the next labs.
const MENU_OPTIONS = [
  {
    id: "settings",
    title: "Settings",
    subtitle: "Profile, theme and preferences",
    icon: "options-outline",
    screen: "Settings",
  },
  {
    id: "favorites",
    title: "My Favorites",
    subtitle: "Habits you saved",
    icon: "heart-outline",
    screen: "Favorites",
  },
  {
    id: "reminders",
    title: "Daily Reminders",
    subtitle: "Set reminder times",
    icon: "alarm-outline",
    screen: "Reminders",
  },
  {
    id: "reports",
    title: "Reports",
    subtitle: "Your weekly progress",
    icon: "bar-chart-outline",
    screen: "Reports",
  },
  {
    id: "about",
    title: "About",
    subtitle: "About HabitTracker",
    icon: "information-circle-outline",
    screen: "About",
  },
];

export default function MenuScreen({ navigation }) {
  // Active theme colours and styles (light or dark mode)
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  // ---------------- State: logged-in user details ----------------
  const [user, setUser] = useState(null);

  // Load the user from local storage each time the menu opens
  useFocusEffect(
    useCallback(() => {
      getCurrentUser().then((currentUser) => {
        if (!currentUser) {
          navigation.replace("Login");
          return;
        }
        setUser(currentUser);
      });
    }, [navigation])
  );

  // ---------------- Open a menu option ----------------
  const handleOptionPress = (option) => {
    if (option.screen) {
      navigation.navigate(option.screen);
    } else {
      showAlert(option.title, "This screen is coming soon.");
    }
  };

  // ---------------- Logout ----------------
  // Removes the session from AsyncStorage and returns to the Login screen.
  // reset() clears the navigation history, so "back" cannot reopen the app.
  const handleLogout = async () => {
    await AsyncStorage.removeItem("currentUser");
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  // ---------------- Screen layout ----------------
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Top bar: back button and title */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <Icon name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Menu</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        {/* User information card */}
        {user && (
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Hello, {user.userName}!</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>
        )}
        <Text style={styles.question}>Would you like to change any settings?</Text>

        {/* Menu options */}
        {MENU_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.menuItem}
            onPress={() => handleOptionPress(option)}
            accessibilityLabel={option.title}
          >
            <View style={styles.menuIcon}>
              <Icon name={option.icon} size={20} color={COLORS.primaryDark} />
            </View>
            <View style={styles.menuTextBox}>
              <Text style={styles.menuTitle}>{option.title}</Text>
              <Text style={styles.menuSubtitle}>{option.subtitle}</Text>
            </View>
            <Icon name="chevron-forward" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}

        {/* Logout button */}
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    marginBottom: 20,
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
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1.5,
    borderColor: COLORS.accentBorder,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: FONTS.bold,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  email: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  question: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 14,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 68,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: COLORS.divider,
    borderRadius: 16,
    backgroundColor: COLORS.cardMuted,
    marginBottom: 12,
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuTextBox: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: FONTS.semibold,
    color: COLORS.text,
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  logout: {
    flexDirection: "row",
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.errorBg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: FONTS.bold,
    marginLeft: 8,
  },
});
