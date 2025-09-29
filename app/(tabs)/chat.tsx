import React from "react";
import { useRouter } from "expo-router";
import { AnimatedScreen } from "@/components/AnimatedScreen";
import { ChatOptions } from "@/components/chat/ChatOptions";

export default function ChatPage() {
  const router = useRouter();

  const handleChatOptionPress = (route: string) => {
    router.push(route as any);
  };

  const handleSettingsPress = () => {
    router.push("/profile");
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