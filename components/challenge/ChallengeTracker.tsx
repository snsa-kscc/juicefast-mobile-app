import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";

interface ChallengeTrackerProps {
  isAdmin?: boolean;
}

export function ChallengeTracker({ isAdmin = false }: ChallengeTrackerProps) {
  const router = useRouter();

  const handleParticipatePress = () => {
    if (isAdmin) {
      router.push("/challenge/order-entry");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-jf-gray"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section with Gradient */}
      <LinearGradient
        colors={["#BAF3C1", "#F8F6EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="pb-8"
      >
        <View className="items-center pt-20 px-6">
          {/* Title */}
          <Text className="text-3xl font-lufga text-black mb-1">JOIN THE</Text>
          <Text className="text-5xl font-lufga-black text-black leading-tight">
            Juicefast
          </Text>
          <Text className="text-5xl font-lufga-black text-black leading-tight mb-3">
            Challenge
          </Text>
          <Text className="text-2xl font-lufga-semibold text-black text-center">
            Transform your body
          </Text>
          <Text className="text-2xl font-lufga-semibold text-black text-center">
            and mind in 60 days
          </Text>
        </View>
      </LinearGradient>

      {/* Gift Box */}
      <View className="flex flex-row justify-center items-center mb-6 translate-y-10 z-50">
        <Image
          source={require("@/assets/images/challenge/gift-box.webp")}
          className="w-28 h-28"
          resizeMode="contain"
        />
      </View>

      {/* CTA Button and Prizes Section */}
      <View className="px-6">
        {/* CTA Button */}
        <TouchableOpacity
          className="w-full rounded-3xl shadow-2xl shadow-black/90 py-5 px-8 mb-6 overflow-hidden"
          disabled={!isAdmin}
          onPress={handleParticipatePress}
        >
          <LinearGradient
            colors={["#A5ECC9", "#EFEFEF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
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
            <Text className="text-center text-2xl font-lufga-bold text-gray-700">
              {isAdmin ? "Participate in" : "Coming Soon"}
            </Text>
            <Text className="text-center text-2xl font-lufga-bold text-[#109375]">
              JF Challenge
            </Text>
          </View>
        </TouchableOpacity>

        {/* Prizes Section */}
        <View className="flex flex-row w-full mb-6 gap-2 items-center justify-center">
          {/* Prize 1 */}
          <LinearGradient
            colors={["#750046", "#B8037A"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              flex: 1,
              padding: 16,
              minHeight: 130,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text className="text-white font-lufga-bold text-xs">1. prize</Text>
            <Image
              source={require("@/assets/images/challenge/cash.webp")}
              className="w-14 h-14"
            />
            <Text className="text-white font-lufga-bold text-base">
              2.000 €
            </Text>
          </LinearGradient>

          {/* Prize 2 */}
          <LinearGradient
            colors={["#FF7006", "#ECAA01"]}
            start={{ x: 1, y: 0.5 }}
            end={{ x: 0, y: 0.5 }}
            style={{
              flex: 1,
              padding: 16,
              minHeight: 130,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text className="text-white font-lufga-bold text-xs">2. prize</Text>
            <Image
              source={require("@/assets/images/challenge/iphone.webp")}
              className="w-14 h-14"
            />
            <Text className="text-white font-lufga-bold text-sm text-center">
              iPhone{"\n"}17 pro
            </Text>
          </LinearGradient>

          {/* Prize 3 */}
          <LinearGradient
            colors={["#BA0239", "#FF799B"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              flex: 1,
              padding: 16,
              minHeight: 130,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text className="text-white font-lufga-bold text-xs">3. prize</Text>
            <Image
              source={require("@/assets/images/challenge/gift-card.webp")}
              className="w-14 h-14"
            />
            <Text className="text-white font-lufga-bold text-sm text-center">
              10x 50€{"\n"}gift card
            </Text>
          </LinearGradient>
        </View>
      </View>

      {/* Hero Image Section with Overlaid Features */}
      <View className="overflow-hidden relative h-[700px] flex-1">
        <Image
          source={require("@/assets/images/challenge/fitness-lady.webp")}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />

        <View className="absolute bottom-28 left-0 right-0 px-6 pb-6">
          <BlurView
            intensity={30}
            tint="light"
            experimentalBlurMethod="dimezisBlurView"
            className="rounded-3xl py-3.5 px-6 mb-2.5 overflow-hidden shadow-2xl shadow-black/60 border-2 border-white/60"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.4)",
            }}
          >
            <Text className="text-gray-900 font-lufga-medium text-xl text-center">
              Track progress
            </Text>
          </BlurView>
          <BlurView
            intensity={30}
            tint="light"
            experimentalBlurMethod="dimezisBlurView"
            className="rounded-3xl py-3.5 px-6 mb-2.5 overflow-hidden shadow-2xl shadow-black/60 border-2 border-white/60"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.4)",
            }}
          >
            <Text className="text-gray-900 font-lufga-medium text-xl text-center">
              Win prizes
            </Text>
          </BlurView>
          <BlurView
            intensity={30}
            tint="light"
            experimentalBlurMethod="dimezisBlurView"
            className="rounded-3xl py-3.5 px-6 mb-2.5 overflow-hidden shadow-2xl shadow-black/60 border-2 border-white/60"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.4)",
            }}
          >
            <Text className="text-gray-900 font-lufga-medium text-xl text-center">
              Become your best self
            </Text>
          </BlurView>
        </View>
      </View>
    </ScrollView>
  );
}
