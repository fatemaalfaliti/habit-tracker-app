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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFilled = email.trim() && password.trim();

  // Step 2: form validation
  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      showAlert("Validation Error", "Please fill in all fields.");
      return false;
    }
    return true;
  };

  // Step 3: check the credentials against the users saved in AsyncStorage
  const handleLogin = async () => {
    try {
      const stored = await AsyncStorage.getItem("users");
      const users = stored ? JSON.parse(stored) : [];

      const user = users.find(
        (u) =>
          u.email === email.trim().toLowerCase() && u.password === password
      );

      if (!user) {
        showAlert("Error", "Incorrect email or password.");
        return;
      }

      // Save the logged-in user (session)
      await AsyncStorage.setItem("currentUser", JSON.stringify(user));
      setEmail("");
      setPassword("");
      navigation.replace("Home");
    } catch (error) {
      showAlert("Error", "Something went wrong. Please try again.");
    }
  };

  // Step 4: combine validation and login
  const handleLoginPress = () => {
    if (validateForm()) {
      handleLogin();
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      <Logo />

      <Text style={globalStyles.title}>Welcome back</Text>
      <Text style={globalStyles.subtitle}>Log in to continue your progress</Text>

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
        placeholder="••••••••"
        placeholderTextColor={COLORS.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[globalStyles.button, !isFilled && globalStyles.buttonDisabled]}
        onPress={handleLoginPress}
      >
        <Text style={globalStyles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={globalStyles.linkRow}>
        <Text style={globalStyles.linkText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={globalStyles.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: COLORS.background,
  },
});
