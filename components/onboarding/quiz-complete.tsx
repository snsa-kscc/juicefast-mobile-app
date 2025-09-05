import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

interface QuizCompleteProps {
  answers: Record<number, string>;
}

export function QuizComplete({ answers }: QuizCompleteProps) {
  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <View className="items-center mb-12">
        <Text className="text-4xl font-bold text-gray-900 text-center mb-4">
          Quiz Complete!
        </Text>
        <Text className="text-lg text-gray-600 text-center leading-relaxed">
          Thank you for completing the onboarding quiz. Your personalized juice fasting plan is ready.
        </Text>
      </View>
      
      <TouchableOpacity
        onPress={handleContinue}
        className="bg-green-600 px-8 py-4 rounded-full w-full max-w-xs"
      >
        <Text className="text-white text-lg font-semibold text-center">
          Continue to App
        </Text>
      </TouchableOpacity>
    </View>
  );
}