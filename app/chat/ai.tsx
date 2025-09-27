import React from 'react';
import { useRouter } from 'expo-router';
import { AnimatedScreen } from '@/components/AnimatedScreen';
import { WellnessHeader } from '@/components/ui/CustomHeader';
import { AIChat } from '@/components/ai/AIChat';

const userId = "user-123";

export default function AIChatPage() {
  const router = useRouter();

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
      
      <AIChat userId={userId} />
    </AnimatedScreen>
  );
}
