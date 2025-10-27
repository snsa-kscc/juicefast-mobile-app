import { AnimatedScreen } from "@/components/AnimatedScreen";
import { NotesTracker } from "@/components/tracker/NotesTracker";
import { useRouter } from "expo-router";
import React from "react";

export default function NotesScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSettingsPress = () => {
    router.push("/profile");
  };

  return (
    <AnimatedScreen>
      <NotesTracker onBack={handleBack} onSettingsPress={handleSettingsPress} />
    </AnimatedScreen>
  );
}
