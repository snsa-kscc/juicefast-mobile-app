import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { useOnboardingCompletion } from "../../utils/onboarding";

interface QuizStartProps {
  onStart: () => void;
}

export function QuizStart({ onStart }: QuizStartProps) {
  const { markOnboardingCompleted } = useOnboardingCompletion();

  const handleSkip = async () => {
    await markOnboardingCompleted();
    router.replace("/(tabs)");
  };

  return (
    <View
      className="flex-1 justify-center items-center px-6"
      style={{ backgroundColor: "#F8F6F2" }}
    >
      <View className="w-full max-w-sm">
        {/* App logo */}
        <View className="items-center mb-6">
          <View
            className="w-20 h-20 rounded-2xl items-center justify-center"
            style={{ backgroundColor: "#1A1A1A" }}
          >
            <Image
              source={require("../../assets/images/jf-picto.png")}
              style={{ width: 65, height: 65 }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Title */}
        <View className="items-center mb-12">
          <Text
            className="text-4xl font-bold text-center mb-2"
            style={{ color: "#1A1A1A", lineHeight: 44 }}
          >
            Daily habits,{"\n"}lasting change
          </Text>
        </View>

        {/* Statistics grid */}
        <View className="mb-12">
          <View className="flex-row mb-6">
            <View className="flex-1 items-center mr-3">
              <Text className="text-3xl mb-1">👤</Text>
              <Text className="font-bold text-xl" style={{ color: "#1A1A1A" }}>
                30.000+
              </Text>
              <Text className="text-sm text-gray-700">Transformations</Text>
            </View>
            <View className="flex-1 items-center ml-3">
              <Text className="text-3xl mb-1">⚖️</Text>
              <Text className="font-bold text-xl" style={{ color: "#1A1A1A" }}>
                4.2kg
              </Text>
              <Text className="text-sm text-gray-700">Avg. weightloss</Text>
            </View>
          </View>
          <View className="flex-row">
            <View className="flex-1 items-center mr-3">
              <Text className="text-3xl mb-1">⭐</Text>
              <Text className="font-bold text-xl" style={{ color: "#1A1A1A" }}>
                4.000.000+
              </Text>
              <Text className="text-sm text-gray-700">Sold products</Text>
            </View>
            <View className="flex-1 items-center ml-3">
              <Text className="text-3xl mb-1">💪</Text>
              <Text className="font-bold text-xl" style={{ color: "#1A1A1A" }}>
                12.000+
              </Text>
              <Text className="text-sm text-gray-700 text-center">
                Following our{"\n"}plans
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="mb-12">
          <Text
            className="text-base text-center leading-relaxed"
            style={{ color: "#1F2937" }}
          >
            We'll ask you a few short questions to personalize your experience,
            you can skip at any time
          </Text>
        </View>

        {/* Start button */}
        <TouchableOpacity
          onPress={onStart}
          className="px-8 py-4 rounded-full w-full mb-4"
          style={{ backgroundColor: "#1A1A1A", height: 56 }}
        >
          <Text className="text-white text-base font-semibold text-center">
            Start your journey
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
