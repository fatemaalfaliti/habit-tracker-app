import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider, useTheme } from "./src/context/ThemeProvider";
import { getCurrentUser } from "./src/utils/habitStorage";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import DetailScreen from "./src/screens/DetailScreen";
import MenuScreen from "./src/screens/MenuScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import RemindersScreen from "./src/screens/RemindersScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import ReportsScreen from "./src/screens/ReportsScreen";
import AboutScreen from "./src/screens/AboutScreen";

// ------------------------------------------------------------
// Navigation: all the app screens are registered here.
// The whole app is wrapped in ThemeProvider (light / dark mode).
// If a user is already logged in, the app opens on the Home screen.
// ------------------------------------------------------------
const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check the saved login session when the app starts
  useEffect(() => {
    const checkLoginState = async () => {
      const user = await getCurrentUser();
      setIsLoggedIn(!!user);
      setIsLoading(false);
    };
    checkLoginState();
  }, []);

  // Loading screen while the session is being checked
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? "Home" : "Login"}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Reminders" component={RemindersScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
