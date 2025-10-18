import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
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

const { height: windowHeight } = Dimensions.get("window");

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
      <View className="flex-1 bg-transparent justify-end">
        <View
          className="bg-white rounded-t-[20px] p-5"
          style={{ maxHeight: windowHeight * 0.7 }}
        >
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-xl font-bold text-gray-800 font-lufga-bold">
              Select Activity Level
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {activityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`border rounded-xl p-4 min-h-[80px] justify-center ${
                  selectedValue === option.value
                    ? "bg-blue-50 border-blue-500"
                    : "bg-gray-50 border-gray-200"
                }`}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text
                  className={`text-base text-center leading-[22px] ${
                    selectedValue === option.value
                      ? "text-blue-800 font-semibold font-lufga-semibold"
                      : "text-gray-700 font-lufga"
                  }`}
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
