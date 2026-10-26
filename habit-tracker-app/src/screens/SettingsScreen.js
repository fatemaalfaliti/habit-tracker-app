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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "../components/Icon";
import { FONTS } from "../constants/theme";
import { useTheme } from "../context/ThemeProvider";
import { showAlert } from "../utils/showAlert";
import {
  getCurrentUser,
  updateUserProfile,
  getNotificationsEnabled,
  saveNotificationsEnabled,
} from "../utils/habitStorage";

// ------------------------------------------------------------
// Settings screen (opened from the Settings option in the Menu).
// Sections:
//   Account       -> view and edit name and email (saved locally)
//   Appearance    -> Dark Mode switch (whole app, saved locally)
//   Notifications -> turn reminders on or off (saved locally)
//   Logout        -> clear the session and return to Login
// ------------------------------------------------------------
export default function SettingsScreen({ navigation }) {
  // Theme from the ThemeProvider (React Context)
  const { colors: COLORS, globalStyles, isDarkMode, toggleTheme } = useTheme();
  const styles = makeStyles(COLORS);

  // ---------------- State ----------------
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [notificationsOn, setNotificationsOn] = useState(true);

  // ---------------- Load saved data ----------------
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          navigation.replace("Login");
          return;
        }
        setUser(currentUser);
        setUserName(currentUser.userName);
        setEmail(currentUser.email);
        setNotificationsOn(await getNotificationsEnabled(currentUser.email));
      };
      loadData();
    }, [navigation])
  );

  // ---------------- Account: save profile changes ----------------
  const handleSave = async () => {
    if (!userName.trim() || !email.trim()) {
      showAlert("Validation Error", "Please fill in all fields.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      showAlert("Validation Error", "Please enter a valid email address.");
      return;
    }
    const result = await updateUserProfile(user.email, userName, email);
    if (!result.ok) {
      showAlert("Error", result.message);
      return;
    }
    setUser(result.user);
    setIsEditing(false);
    showAlert("Saved", "Your profile has been updated.");
  };

  // Cancel editing and restore the saved values
  const handleCancel = () => {
    setUserName(user.userName);
    setEmail(user.email);
    setIsEditing(false);
  };

  // ---------------- Notifications switch ----------------
  const handleToggleNotifications = async (value) => {
    setNotificationsOn(value);
    await saveNotificationsEnabled(user.email, value);
  };

  // ---------------- Logout ----------------
  const handleLogout = async () => {
    await AsyncStorage.removeItem("currentUser");
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
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
        <Text style={styles.topTitle}>Settings</Text>
        <View style={styles.iconButtonPlaceholder} />
      </View>

      {/* ---------- Account ---------- */}
      <Text style={styles.sectionLabel}>ACCOUNT</Text>
      <View style={styles.box}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.userName}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>
          {!isEditing && (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Edit form (shown after tapping Edit) */}
        {isEditing && (
          <View style={styles.form}>
            <Text style={globalStyles.label}>Username</Text>
            <TextInput
              style={globalStyles.input}
              value={userName}
              onChangeText={setUserName}
              placeholderTextColor={COLORS.textMuted}
            />
            <Text style={globalStyles.label}>Email</Text>
            <TextInput
              style={globalStyles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={COLORS.textMuted}
            />
            <View style={styles.formButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* ---------- Appearance ---------- */}
      <Text style={styles.sectionLabel}>APPEARANCE</Text>
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Dark Mode</Text>
            <Text style={styles.rowSubtitle}>
              {isDarkMode ? "Dark theme is on" : "Easier on the eyes at night"}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.white}
            accessibilityLabel="Dark Mode"
          />
        </View>
      </View>

      {/* ---------- Notifications ---------- */}
      <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Enable Notifications</Text>
            <Text style={styles.rowSubtitle}>
              {notificationsOn ? "Daily habit reminders are on" : "Reminders are off"}
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

      {/* ---------- Logout ---------- */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    sectionLabel: {
      fontSize: 12,
      fontWeight: FONTS.bold,
      color: COLORS.textMuted,
      letterSpacing: 0.6,
      marginTop: 12,
      marginBottom: 8,
    },
    box: {
      borderWidth: 1.5,
      borderColor: COLORS.divider,
      borderRadius: 16,
      padding: 14,
      backgroundColor: COLORS.card,
    },
    profileRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    avatarText: {
      color: COLORS.white,
      fontSize: 20,
      fontWeight: FONTS.bold,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 16,
      fontWeight: FONTS.semibold,
      color: COLORS.text,
    },
    profileEmail: {
      fontSize: 13,
      color: COLORS.textMuted,
      marginTop: 2,
    },
    editButton: {
      paddingHorizontal: 14,
      height: 36,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: COLORS.accentBorder,
      backgroundColor: COLORS.primarySoft,
      justifyContent: "center",
    },
    editText: {
      color: COLORS.primaryDark,
      fontWeight: FONTS.semibold,
      fontSize: 13,
    },
    form: {
      marginTop: 16,
    },
    formButtons: {
      flexDirection: "row",
    },
    cancelButton: {
      flex: 1,
      height: 46,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
    },
    cancelText: {
      color: COLORS.text,
      fontWeight: FONTS.semibold,
    },
    saveButton: {
      flex: 2,
      height: 46,
      borderRadius: 12,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    saveText: {
      color: COLORS.white,
      fontWeight: FONTS.semibold,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 44,
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
    logout: {
      flexDirection: "row",
      height: 54,
      borderRadius: 14,
      backgroundColor: COLORS.errorBg,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 24,
    },
    logoutText: {
      color: COLORS.error,
      fontSize: 15,
      fontWeight: FONTS.bold,
      marginLeft: 8,
    },
  });
