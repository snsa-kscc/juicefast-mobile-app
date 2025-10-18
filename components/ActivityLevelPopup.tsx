import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { X } from "lucide-react-native";

interface ActivityLevelPopupProps {
  visible: boolean;
  onClose: () => void;
  selectedValue: string | undefined;
  onSelect: (value: string) => void;
}

const activityOptions = [
  { label: "Sedentary\n(little to no exercise)", value: "sedentary" },
  { label: "Light\n(exercise 1-3 days/week)", value: "light" },
  { label: "Moderate\n(exercise 3-5 days/week)", value: "moderate" },
  { label: "Active\n(exercise 6-7 days/week)", value: "active" },
  { label: "Very Active\n(professional athlete level)", value: "very_active" },
];

const { height } = Dimensions.get("window");

export function ActivityLevelPopup({
  visible,
  onClose,
  selectedValue,
  onSelect,
}: ActivityLevelPopupProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Activity Level</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            {activityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  selectedValue === option.value && styles.selectedOptionButton,
                ]}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedValue === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  popupContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    minHeight: 80,
    justifyContent: "center",
  },
  selectedOptionButton: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    lineHeight: 22,
  },
  selectedOptionText: {
    color: "#1E40AF",
    fontWeight: "600",
  },
});
