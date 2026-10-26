import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from "../components/Logo";
import { globalStyles, COLORS } from "../constants/theme";
import { showAlert } from "../utils/showAlert";
import { useTheme } from "../context/ThemeProvider";

export default function SignupScreen({ navigation }) {
  // Active theme colours and styles (light or dark mode)
  const { colors: COLORS, globalStyles } = useTheme();
  const styles = makeStyles(COLORS);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFilled = userName.trim() && email.trim() && password.trim();

  // Step 2: validate the form fields
  const validateForm = () => {
    if (!userName.trim() || !email.trim() || !password.trim()) {
      showAlert("Validation Error", "Please fill in all fields.");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      showAlert("Validation Error", "Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      showAlert("Validation Error", "Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  // Step 3: save the user in AsyncStorage and go to the login screen
  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const stored = await AsyncStorage.getItem("users");
      const users = stored ? JSON.parse(stored) : [];

      const exists = users.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (exists) {
        showAlert("Error", "An account with this email already exists.");
        return;
      }

      const newUser = {
        userName: userName.trim(),
        email: email.trim().toLowerCase(),
        password,
      };
      users.push(newUser);
      await AsyncStorage.setItem("users", JSON.stringify(users));

      showAlert("Success", "Account created! Please log in.");
      setUserName("");
      setEmail("");
      setPassword("");
      navigation.navigate("Login");
    } catch (error) {
      showAlert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      <Logo showTagline={false} />

      <Text style={globalStyles.title}>Create your account</Text>
      <Text style={globalStyles.subtitle}>Start tracking your habits today</Text>

      <Text style={globalStyles.label}>Username</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Your name"
        placeholderTextColor={COLORS.textMuted}
        value={userName}
        onChangeText={setUserName}
      />

      <Text style={globalStyles.label}>Email</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="you@example.com"
        placeholderTextColor={COLORS.textMuted}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={globalStyles.label}>Password</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="At least 6 characters"
        placeholderTextColor={COLORS.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[globalStyles.button, !isFilled && globalStyles.buttonDisabled]}
        onPress={handleRegister}
      >
        <Text style={globalStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={globalStyles.linkRow}>
        <Text style={globalStyles.linkText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={globalStyles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Styles are built from the active theme colours (light or dark)
const makeStyles = (COLORS) =>
  StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: COLORS.background,
  },
});
