import React from "react";
import { useRouter } from "expo-router";
import { AnimatedScreen } from "@/components/AnimatedScreen";
import { WellnessHeader } from "@/components/ui/CustomHeader";
import { NutritionistChat } from "@/components/nutritionist/NutritionistChat";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data - replace with actual API calls
const mockNutritionists = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Clinical Nutritionist",
    isOnline: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    specialization: "Sports Nutritionist",
    isOnline: true,
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialization: "Pediatric Nutritionist",
    isOnline: false,
  },
  {
    id: "4",
    name: "James Wilson",
    specialization: "Weight Management Specialist",
    isOnline: true,
  },
  {
    id: "5",
    name: "Dr. Lisa Park",
    specialization: "Wellness Nutritionist",
    isOnline: false,
  },
  {
    id: "6",
    name: "Robert Taylor",
    specialization: "Fitness Nutritionist",
    isOnline: false,
  },
];

const userId = "user-123";

export default function NutritionistChatPage() {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  const handleSettingsPress = () => {
    router.push("/profile");
  };

  // Mock active session and messages - replace with actual API calls
  const activeSession = null; // No active session initially
  const initialMessages: any[] = [];

  return (
    <SafeAreaView className="flex-1">
      <AnimatedScreen>
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
    </SafeAreaView>
  );
}
