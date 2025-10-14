import React from "react";
import { View, Text } from "react-native";

interface TrackerStatsProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function TrackerStats({ title, subtitle, children }: TrackerStatsProps) {
  return (
    <View className="flex-1 px-6 py-8 items-center">
      <Text className="text-2xl font-lufga-bold mb-1">{title}</Text>
      <Text className="text-sm font-lufga text-gray-500 mb-6">{subtitle}</Text>
      {children}
    </View>
  );
}
