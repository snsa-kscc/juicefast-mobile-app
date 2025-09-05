import React from 'react';
import { View } from 'react-native';
import { OnboardingQuiz } from '../components/onboarding/OnboardingQuiz';

export default function OnboardingScreen() {
  return (
    <View className="flex-1 bg-white">
      <OnboardingQuiz />
    </View>
  );
}