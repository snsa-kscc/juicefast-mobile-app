import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { PremiumSubscriptionDrawer } from "@/components/club/PremiumSubscriptionDrawer";

export default function PremiumActivationPage() {
  const router = useRouter();

  // Progress tracking - current step is 2 (premium activation)
  const currentStep = 2;
  const totalSteps = 2;

  const handlePurchaseSuccess = () => {
    router.replace("/(tabs)/challenge");
  };

  return (
    <ScrollView
      className="flex-1 bg-jf-gray"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section with Gradient - matching ChallengeTracker and order-entry */}
      <LinearGradient
        colors={["#BAF3C1", "#F8F6EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="pb-8"
      >
        <View className="px-6 pt-12">
          {/* Back button and progress indicators */}
          <View className="relative mb-12 h-16">
            {/* Progress indicators centered */}
            <View className="flex-row items-center justify-center h-full">
              <View className="flex-row items-center justify-center h-12 px-14 rounded-full bg-white/80 shadow-lg">
                {Array.from({ length: totalSteps }, (_, index) => (
                  <View
                    key={index}
                    className={`w-5 h-5 rounded-full mx-2 ${
                      index < currentStep
                        ? "bg-[#A5ECC9]"
                        : "border-2 border-[#A5ECC9]"
                    }`}
                  />
                ))}
              </View>
            </View>
            {/* Back button positioned absolutely */}
            <View className="absolute top-0 left-0 h-full items-center justify-center">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-16 h-16 rounded-full bg-[#0DC99B] shadow-lg items-center justify-center"
              >
                <ArrowLeft size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Title */}
          <View className="items-center">
            <Text className="text-5xl font-lufga-black text-black mb-2">
              Unlock
            </Text>
            <Text className="text-5xl font-lufga-black text-black">
              everything
            </Text>
            <Text className="text-3xl font-lufga-bold text-black mt-2">
              for 2 months - free
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content Section */}
      <View className="px-6 pt-8">
        <View className="items-center mb-8">
          <Text className="text-base font-lufga text-gray-600 text-center mb-12 leading-6 px-12">
            Get full access to all workouts, meditations, trackers, and premium
            content. No charge for 60 days.
          </Text>
        </View>

        <PremiumSubscriptionDrawer onPurchaseSuccess={handlePurchaseSuccess}>
          <View className="w-full rounded-3xl py-6 mb-4 overflow-hidden">
            <LinearGradient
              colors={["#0DC99B", "#0DC99B"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                borderRadius: 24,
              }}
            />
            <View className="relative">
              <Text className="text-white text-xl font-lufga-bold text-center">
                Start my free 2 months
              </Text>
            </View>
          </View>
        </PremiumSubscriptionDrawer>

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/challenge")}
          className="w-full rounded-3xl py-4 items-center bg-white mt-20"
        >
          <Text className="text-black text-lg font-lufga-medium">
            Continue with free version
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
