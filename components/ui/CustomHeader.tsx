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
    <View className="relative py-8 overflow-hidden">
      <View className="flex-row justify-between items-center px-6 z-10">
        <View className="flex-row items-start flex-1 gap-2">
          {showBackButton && (
            <TouchableOpacity
              className="w-14 h-14 rounded-full justify-center items-center mr-4"
              style={{ backgroundColor: accentColor }}
              onPress={onBackPress}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
          )}
          <View className="flex-1">
            <Text className="text-xl font-lufga-medium text-black mb-2">
              {title}
            </Text>
            <Text className="text-sm font-lufga text-gray-500 leading-5 w-3/4">
              {subtitle}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-transparent justify-start items-center ml-2"
          onPress={onSettingsPress}
        >
          <Settings size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
