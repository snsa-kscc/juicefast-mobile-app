import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { OnboardingQuiz } from '../components/onboarding/OnboardingQuiz';

export default function OnboardingScreen() {
  const { user, isLoaded } = useUser();
  const { retake } = useLocalSearchParams<{ retake?: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isLoaded) return;

      try {
        // Check if onboarding is already completed and user is not explicitly retaking
        if (user?.unsafeMetadata?.onboardingCompleted === true && !retake) {
          setShouldRedirect(true);
          return;
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [isLoaded, user, retake]);

  useEffect(() => {
    if (shouldRedirect) {
      router.replace('/(tabs)');
    }
  }, [shouldRedirect]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (shouldRedirect) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <OnboardingQuiz />
    </View>
  );
}