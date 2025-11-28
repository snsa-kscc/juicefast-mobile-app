import { TouchableOpacity, Text } from "react-native";

interface TrackerButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  backgroundColor?: string;
  isLoading?: boolean;
  loadingText?: string;
}

export function TrackerButton({
  title,
  onPress,
  disabled = false,
  variant = "primary",
  backgroundColor,
  isLoading = false,
  loadingText,
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
      className={`w-full my-4 rounded-full py-3 items-center ${getButtonStyle()}`}
      style={backgroundColor ? { backgroundColor } : undefined}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      <Text className={`font-lufga-semibold text-xl ${getTextStyle()}`}>
        {isLoading ? loadingText || `${title}...` : title}
      </Text>
    </TouchableOpacity>
  );
}
