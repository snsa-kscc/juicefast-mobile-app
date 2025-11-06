import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { AnimatedScreen } from "@/components/AnimatedScreen";
import { WellnessHeader } from "@/components/ui/CustomHeader";
import { AIChat } from "@/components/ai/AIChat";
import { useAuth } from "@clerk/clerk-expo";

export default function AIChatPage() {
  const router = useRouter();
  const { userId } = useAuth();

  const handleBackPress = () => {
    router.back();
  };

  const handleSettingsPress = () => {
    router.push("/profile");
  };

  if (!userId) {
    return null;
  }

  return (
    <AnimatedScreen className="bg-jf-gray">
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
