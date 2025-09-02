import { AnimatedScreen } from "@/components/AnimatedScreen";
import React from "react";
import { Text, View } from "react-native";

export default function JFClub() {
  return (
    <AnimatedScreen>
      <View className="flex-1 bg-[#FCFBF8] justify-center items-center p-6">
        <Text className="text-2xl font-bold text-center mb-4">
          🍃 JuiceFast Club
        </Text>
        <Text className="text-lg text-gray-600 text-center mb-8">
          Connect with the JuiceFast community
        </Text>
        <Text className="text-base text-gray-500 text-center">
          Community features coming soon...
        </Text>
      </View>
    </AnimatedScreen>
  );
}