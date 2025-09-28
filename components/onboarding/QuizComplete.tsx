import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingCompletion } from '../../utils/onboarding';

interface QuizCompleteProps {
  answers: Record<string, string | string[] | number>;
}

const LINK_RULES = [
  {
    condition: (answers: Record<string, string | string[] | number>) => {
      const movementAnswer = answers.movement;
      return movementAnswer === 'daily' || movementAnswer === 'few_times';
    },
    link: 'https://juicefast.com/functional-juices/'
  },
  {
    condition: (answers: Record<string, string | string[] | number>) => {
      const activitiesAnswer = answers.activities;
      return Array.isArray(activitiesAnswer) &&
        (activitiesAnswer.includes('yoga') || activitiesAnswer.includes('pilates'));
    },
    link: 'https://juicefast.com/proteins-adaptogens/'
  },
  {
    condition: (answers: Record<string, string | string[] | number>) => {
      const eatingHabitsAnswer = answers.eating_habits;
      return Array.isArray(eatingHabitsAnswer) &&
        (eatingHabitsAnswer.includes('chaotic') || eatingHabitsAnswer.includes('emotional_eater'));
    },
    link: 'https://juicefast.com/fasting/'
  }
];

function getSelectedLink(answers: Record<string, string | string[] | number>): string | null {
  const matchingLinks = LINK_RULES.filter(rule => rule.condition(answers))
    .map(rule => rule.link);

  if (matchingLinks.length === 0) {
    return null;
  }

  if (matchingLinks.length === 1) {
    return matchingLinks[0];
  }

  const randomIndex = Math.floor(Math.random() * matchingLinks.length);
  return matchingLinks[randomIndex];
}

export function QuizComplete({ answers }: QuizCompleteProps) {
  const { markOnboardingCompleted } = useOnboardingCompletion();

  const handleContinue = async () => {
    await markOnboardingCompleted();

    const selectedLink = getSelectedLink(answers);
    console.log('Selected Link:', selectedLink);

    if (selectedLink) {
      console.log('Navigating to Store with link:', selectedLink);
      const encodedLink = encodeURIComponent(selectedLink);
      console.log('Encoded link:', encodedLink);
      router.replace({
        pathname: '/(tabs)/store',
        params: { link: encodedLink }
      });
    } else {
      console.log('Navigating to Home tabs');
      router.replace('/(tabs)');
    }
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