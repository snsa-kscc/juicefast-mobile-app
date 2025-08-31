import React from "react";
import { useRouter } from "expo-router";
import { AnimatedScreen } from "@/components/AnimatedScreen";
import { ChatOptions } from "@/components/chat/ChatOptions";

export default function ChatPage() {
  const router = useRouter();

  const handleChatOptionPress = (route: string) => {
    // For now, we'll just log since the actual chat screens don't exist yet
    // Replace with router.push(route) when chat screens are implemented
    console.log(`Navigate to: ${route}`);
  };

  const handleSettingsPress = () => {
    // Handle settings navigation
    console.log("Settings pressed");
  };

  return (
    <AnimatedScreen>
      <ChatOptions
        onOptionPress={handleChatOptionPress}
        onSettingsPress={handleSettingsPress}
      />
    </AnimatedScreen>
  );
}