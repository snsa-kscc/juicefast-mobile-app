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
  showSettings?: boolean;
}

export function WellnessHeader({
  title,
  subtitle = "Today I'm going to....",
  accentColor = "rgb(76, 195, 255)",
  onSettingsPress,
  onBackPress,
  showBackButton = false,
  showSettings = true,
}: WellnessHeaderProps) {
  return (
    <View className="relative py-6 bg-jf-gray">
      <View className="flex-row justify-between items-center px-6">
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
        {showSettings && (
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-transparent justify-center items-center"
            onPress={onSettingsPress}
          >
            <Settings size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
      <View className="px-6 pb-4">
        <Text className="font-lufga text-sm text-gray-500">{subtitle}</Text>
      </View>
    </View>
  );
}
