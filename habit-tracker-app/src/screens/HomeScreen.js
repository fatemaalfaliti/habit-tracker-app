import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles, COLORS } from "../constants/theme";

// Temporary Home screen. We will build the full Home screen in the next lab.
export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("currentUser");
      if (stored) {
        setUserName(JSON.parse(stored).userName);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("currentUser");
    navigation.replace("Login");
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Hello, {userName}!</Text>
      <Text style={globalStyles.subtitle}>Let's build great habits today</Text>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logout: {
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.errorBg,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: "700",
  },
});
