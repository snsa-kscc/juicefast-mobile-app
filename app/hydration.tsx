import { AnimatedScreen } from "@/components/AnimatedScreen";
import { HydrationTracker } from "@/components/tracker/HydrationTracker";
import { TrackerScreenWrapper } from "@/components/TrackerScreenWrapper";
import { useRouter } from "expo-router";
import React from "react";

export default function HydrationScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSettingsPress = () => {
    router.push("/profile");
  };

  return (
    <TrackerScreenWrapper>
      <AnimatedScreen>
        <HydrationTracker
          onBack={handleBack}
          onSettingsPress={handleSettingsPress}
        />
      </AnimatedScreen>
    </TrackerScreenWrapper>
  );
}
