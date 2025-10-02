import React from "react";
import { View, Text } from "react-native";

interface QuizProgressProps {
  current: number;
  total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const progress = (current / total) * 100;

  return (
    <View className="flex-1 mr-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm text-gray-600">
          Question {current} of {total}
        </Text>
        <Text className="text-sm text-gray-600">{Math.round(progress)}%</Text>
      </View>

      <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-green-600 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
}
