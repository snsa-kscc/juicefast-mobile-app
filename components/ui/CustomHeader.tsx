import { Settings, ArrowLeft } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface WellnessHeaderProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  onSettingsPress?: () => void;
  onBackPress?: () => void;
  showBackButton?: boolean;
}

export function WellnessHeader({
  title,
  subtitle = "Today I'm going to....",
  accentColor = "rgb(76, 195, 255)",
  onSettingsPress,
  onBackPress,
  showBackButton = false,
}: WellnessHeaderProps) {
  return (
    <View className="relative py-12 overflow-hidden">
      <View className="flex-row justify-between items-center px-6 z-10">
        <View className="flex-row items-center">
          {showBackButton && (
            <TouchableOpacity
              className="w-10 h-10 rounded-full justify-center items-center mr-2"
              style={{ backgroundColor: accentColor }}
              onPress={onBackPress}
            >
              <ArrowLeft size={20} color="white" />
            </TouchableOpacity>
          )}
          <Text className="text-xl font-bold">{title}</Text>
        </View>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-transparent justify-center items-center"
          onPress={onSettingsPress}
        >
          <Settings size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      <View className="px-6 pb-4 z-10">
        <Text className="font-lufga text-sm text-gray-500">{subtitle}</Text>
      </View>
    </View>
  );
}
