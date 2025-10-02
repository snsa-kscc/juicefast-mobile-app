import React from "react";
import { useRouter } from "expo-router";
import { AnimatedScreen } from "@/components/AnimatedScreen";
import { ChatOptions } from "@/components/chat/ChatOptions";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <SafeAreaView className="flex-1">
        <ChatOptions
          onOptionPress={handleChatOptionPress}
          onSettingsPress={handleSettingsPress}
        />
      </SafeAreaView>
    </AnimatedScreen>
  );
}
