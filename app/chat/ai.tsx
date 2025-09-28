import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { AnimatedScreen } from '@/components/AnimatedScreen';
import { WellnessHeader } from '@/components/ui/CustomHeader';
import { AIChat } from '@/components/ai/AIChat';
import { useAuth } from '@clerk/clerk-expo';

export default function AIChatPage() {
  const router = useRouter();
  const { isSignedIn, userId } = useAuth();

  const handleBackPress = () => {
    router.back();
  };

  const handleSettingsPress = () => {
    router.push("/profile");
  };

  return (
    <AnimatedScreen>
      <WellnessHeader
        title="AI Health Assistant"
        subtitle="Get instant wellness guidance"
        accentColor="#4CC3FF"
        showBackButton={true}
        onBackPress={handleBackPress}
        onSettingsPress={handleSettingsPress}
      />

      {isSignedIn && userId ? (
        <AIChat userId={userId} />
      ) : (
        <View className="flex-1 bg-[#FCFBF8] items-center justify-center px-6">
          <Text className="text-gray-500 text-center text-lg font-lufga-medium mb-4">
            Sign in to chat with your AI health assistant
          </Text>
          <Text className="text-gray-400 text-center text-sm font-lufga">
            Your health data will be used to provide personalized wellness guidance
          </Text>
        </View>
      )}
    </AnimatedScreen>
  );
}
