import React from "react";
import { useRouter } from "expo-router";
import { AnimatedScreen } from "@/components/AnimatedScreen";
import { WellnessHeader } from "@/components/ui/CustomHeader";
import { NutritionistChat } from "@/components/nutritionist/NutritionistChat";

export default function NutritionistChatPage() {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleSettingsPress = () => {
    router.push("/profile");
  };

  return (
    <AnimatedScreen className="bg-jf-gray">
      <WellnessHeader
        title="Nutritionist Chat"
        subtitle="Connect with certified nutrition experts"
        accentColor="#E1D5B9"
        showBackButton={true}
        onBackPress={handleBackPress}
        onSettingsPress={handleSettingsPress}
      />

      <NutritionistChat />
    </AnimatedScreen>
  );
}
