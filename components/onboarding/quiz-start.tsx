import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface QuizStartProps {
  onStart: () => void;
}

export function QuizStart({ onStart }: QuizStartProps) {
  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <View className="items-center mb-12">
        <Text className="text-4xl font-bold text-gray-900 text-center mb-4">
          Welcome to JuiceFast
        </Text>
        <Text className="text-lg text-gray-600 text-center leading-relaxed">
          Let's personalize your juice fasting journey with a quick quiz
        </Text>
      </View>
      
      <TouchableOpacity
        onPress={onStart}
        className="bg-green-600 px-8 py-4 rounded-full w-full max-w-xs"
      >
        <Text className="text-white text-lg font-semibold text-center">
          Start Quiz
        </Text>
      </TouchableOpacity>
    </View>
  );
}