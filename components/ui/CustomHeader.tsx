import { Settings } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface WellnessHeaderProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  onSettingsPress?: () => void;
}

export function WellnessHeader({ 
  title, 
  subtitle = "Today I'm going to....", 
  accentColor = "#4CC3FF",
  onSettingsPress 
}: WellnessHeaderProps) {
  return (
    <View className="relative py-6 overflow-hidden">
      <View 
        className="absolute w-64 h-64 rounded-full -top-5 left-0 opacity-60" 
        style={{ 
          backgroundColor: `${accentColor}40`,
          filter: "blur(80px)" 
        }} 
      />
      <View className="flex-row justify-between items-center px-6 z-10">
        <Text className="text-xl font-bold">{title}</Text>
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