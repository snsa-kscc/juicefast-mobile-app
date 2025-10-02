import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface TrackerButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  backgroundColor?: string;
}

export function TrackerButton({
  title,
  onPress,
  disabled = false,
  variant = "primary",
  backgroundColor,
}: TrackerButtonProps) {
  const getButtonStyle = () => {
    if (backgroundColor) {
      return { backgroundColor };
    }
    return variant === "primary" ? "bg-black" : "bg-gray-200";
  };

  const getTextStyle = () => {
    return variant === "primary" ? "text-white" : "text-black";
  };

  return (
    <TouchableOpacity
      className={`w-full rounded-md py-3 items-center ${getButtonStyle()}`}
      style={backgroundColor ? { backgroundColor } : undefined}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className={`font-medium ${getTextStyle()}`}>{title}</Text>
    </TouchableOpacity>
  );
}
