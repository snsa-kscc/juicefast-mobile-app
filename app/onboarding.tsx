import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { OnboardingQuiz } from '../components/onboarding/OnboardingQuiz';

export default function OnboardingScreen() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isLoaded) return;

      try {
        // Check if onboarding is already completed
        if (user?.unsafeMetadata?.onboardingCompleted === true) {
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
  }, [isLoaded, user]);

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