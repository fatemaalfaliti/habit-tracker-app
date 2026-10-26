import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LIGHT_COLORS, DARK_COLORS, makeGlobalStyles } from "../constants/theme";

// ------------------------------------------------------------
// ThemeProvider: manages light / dark mode for the whole app
// using React's Context API.
// - theme:        "light" or "dark"
// - toggleTheme:  switches between the two themes
// - colors:       the active colour palette
// - globalStyles: shared styles built with the active colours
// The chosen theme is saved in AsyncStorage under "theme",
// so the app remembers it after a restart.
// ------------------------------------------------------------

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // Load the saved theme when the app starts
  useEffect(() => {
    AsyncStorage.getItem("theme")
      .then((saved) => {
        if (saved === "dark" || saved === "light") {
          setTheme(saved);
        }
      })
      .catch((error) => console.log("Error loading theme:", error));
  }, []);

  // Switch theme and save the choice
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const next = prevTheme === "light" ? "dark" : "light";
      AsyncStorage.setItem("theme", next).catch((error) =>
        console.log("Error saving theme:", error)
      );
      return next;
    });
  };

  // Recalculate colours and shared styles only when the theme changes
  const value = useMemo(() => {
    const colors = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;
    return {
      theme,
      isDarkMode: theme === "dark",
      toggleTheme,
      colors,
      globalStyles: makeGlobalStyles(colors),
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook so any component can read the theme easily
export const useTheme = () => useContext(ThemeContext);
