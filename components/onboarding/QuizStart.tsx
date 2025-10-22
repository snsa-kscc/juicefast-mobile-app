import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { useOnboardingCompletion } from "@/utils/onboarding";
import Star from "@/components/ui/star";
import BodyFigure from "@/components/ui/body-figure";
import Scale from "@/components/ui/scale";
import Dumbbell from "@/components/ui/dumbbell";

interface QuizStartProps {
  onStart: () => void;
}

export function QuizStart({ onStart }: QuizStartProps) {
  const [isSkipping, setIsSkipping] = React.useState(false);
  const { markOnboardingCompleted } = useOnboardingCompletion();

  const handleSkip = async () => {
    setIsSkipping(true);
    try {
      await markOnboardingCompleted();
      router.replace("/(tabs)");
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-jf-gray">
      <View className="w-full max-w-sm">
        {/* App logo */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-2xl items-center justify-center bg-black">
            <Image
              source={require("@/assets/images/jf-picto.png")}
              className="w-16 h-16"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Title */}
        <View className="items-center mb-12">
          <Text className="text-4xl font-lufga-bold text-center mb-2 text-black leading-[44px]">
            Daily habits,{"\n"}lasting change
          </Text>
        </View>

        {/* Statistics grid */}
        <View className="mb-12">
          <View className="flex-row mb-6">
            <View className="flex-1 items-center mr-3">
              <BodyFigure />
              <Text className="font-lufga-bold text-xl text-black">
                30.000+
              </Text>
              <Text className="text-sm text-gray-700 font-lufga">
                Transformations
              </Text>
            </View>
            <View className="flex-1 items-center ml-3">
              <Scale />
              <Text className="font-lufga-bold text-xl text-black">4.2kg</Text>
              <Text className="text-sm text-gray-700 font-lufga">
                Avg. weightloss
              </Text>
            </View>
          </View>
          <View className="flex-row">
            <View className="flex-1 items-center mr-3">
              <Star />
              <Text className="font-lufga-bold text-xl text-black">
                4.000.000+
              </Text>
              <Text className="text-sm text-gray-700 font-lufga">
                Sold products
              </Text>
            </View>
            <View className="flex-1 items-center ml-3">
              <Dumbbell />
              <Text className="font-lufga-bold text-xl text-black">
                12.000+
              </Text>
              <Text className="text-sm text-gray-700 text-center font-lufga">
                Following our{"\n"}plans
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="mb-12">
          <Text className="text-base text-center leading-relaxed text-gray-800 font-lufga">
            We'll ask you a few short questions to personalize your experience,
            you can skip at any time
          </Text>
        </View>

        {/* Start button */}
        <TouchableOpacity
          onPress={onStart}
          className="px-8 py-4 rounded-full w-full mb-4 bg-gray-900 h-14"
        >
          <Text className="text-white text-base font-lufga-semibold text-center">
            Start your journey
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
