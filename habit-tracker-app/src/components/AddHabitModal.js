import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "./Icon";
import { globalStyles, COLORS, FONTS } from "../constants/theme";
import { CATEGORIES } from "../constants/habits";
import { showAlert } from "../utils/showAlert";

// ------------------------------------------------------------
// Pop-up form for adding a new habit:
// habit name, category and duration.
// ------------------------------------------------------------
export default function AddHabitModal({ visible, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("Health");

  // Clears the form and closes the pop-up
  const resetAndClose = () => {
    setTitle("");
    setDuration("");
    setCategory("Health");
    onClose();
  };

  // Validates the form and sends the new habit to the Home screen
  const handleAdd = () => {
    if (!title.trim()) {
      showAlert("Validation Error", "Please enter a habit name.");
      return;
    }
    const newHabit = {
      id: Date.now().toString(),
      title: title.trim(),
      category,
      duration: duration.trim() || "Daily",
      icon: CATEGORIES[category].icon,
      description: `A new ${category.toLowerCase()} habit you created. Small steps every day lead to big changes.`,
      tips: [
        "Start small and be consistent.",
        "Do it at the same time every day.",
        "Mark it as done to keep your streak going.",
      ],
      completedDates: [],
      favorite: false,
    };
    onAdd(newHabit);
    resetAndClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={resetAndClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Title row with close button */}
          <View style={styles.headerRow}>
            <Text style={styles.heading}>New Habit</Text>
            <TouchableOpacity onPress={resetAndClose} accessibilityLabel="Close">
              <Icon name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Habit name */}
          <Text style={globalStyles.label}>Habit name</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="e.g. Morning Stretch"
            placeholderTextColor={COLORS.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          {/* Category chips */}
          <Text style={globalStyles.label}>Category</Text>
          <View style={styles.chips}>
            {Object.keys(CATEGORIES).map((name) => {
              const selected = name === category;
              return (
                <TouchableOpacity
                  key={name}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => setCategory(name)}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Duration */}
          <Text style={globalStyles.label}>Duration</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="e.g. 10 min"
            placeholderTextColor={COLORS.textMuted}
            value={duration}
            onChangeText={setDuration}
          />

          <TouchableOpacity style={globalStyles.button} onPress={handleAdd}>
            <Text style={globalStyles.buttonText}>Add Habit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.text,
  },
  chipTextSelected: {
    color: COLORS.white,
    fontWeight: FONTS.semibold,
  },
});
