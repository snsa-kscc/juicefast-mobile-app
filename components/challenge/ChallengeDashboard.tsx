import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Doc } from "@/convex/_generated/dataModel";
import { ChallengeTracker } from "@/components/challenge/ChallengeTracker";
import { ChallengeCongratsModal } from "@/components/challenge/ChallengeCongratsModal";

interface ChallengeDashboardProps {
  progress?: Doc<"challengeProgress"> | null;
  showModal?: boolean;
}

export function ChallengeDashboard({
  progress,
  showModal = false,
}: ChallengeDashboardProps) {
  const [showCongratsModal, setShowCongratsModal] = useState(false);

  useEffect(() => {
    // Show modal when component first loads if there's no progress
    if (showModal) {
      setShowCongratsModal(true);
    }
  }, [showModal]);

  const handleCloseModal = () => {
    setShowCongratsModal(false);
  };

  const handleUploadPhoto = (image: any) => {
    // TODO: Implement photo upload functionality
    console.log("Upload photo pressed:", image);
    setShowCongratsModal(false);
  };

  return (
    <>
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
          <View className=" pt-20 px-6 mb-12">
            {/* Title */}
            <Text className="text-3xl font-lufga-semibold text-black">
              Welcome to the Juicefast
            </Text>
            <Text className="text-3xl font-lufga-semibold text-black">
              2026 challenge!
            </Text>
          </View>

          {/* Prizes Section */}
          <View className="flex flex-row w-full gap-2 items-center justify-center px-6 mb-6">
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
              <Text className="text-white font-lufga-bold text-xs">
                1. prize
              </Text>
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
              <Text className="text-white font-lufga-bold text-xs">
                2. prize
              </Text>
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
              <Text className="text-white font-lufga-bold text-xs">
                3. prize
              </Text>
              <Image
                source={require("@/assets/images/challenge/gift-card.webp")}
                className="w-14 h-14"
              />
              <Text className="text-white font-lufga-bold text-sm text-center">
                10x 50€{"\n"}gift card
              </Text>
            </LinearGradient>
          </View>
        </LinearGradient>

        {/* Register another order and Prizes Section */}
        <View className="px-6 mb-6">
          {/* Register another order */}
          <TouchableOpacity className="w-full rounded-3xl shadow-2xl shadow-black/90 py-5 px-8 mb-6 overflow-hidden">
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
            <View className="relative flex-row items-center">
              <Image
                source={require("@/assets/images/challenge/gift-box.webp")}
                className="w-12 h-12 mr-3"
                resizeMode="contain"
              />

              <Text className="ml-3 flex-1 text-2xl font-lufga-bold text-gray-700">
                Register another order
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Challenge Tracker Section */}
        <ChallengeTracker />
      </ScrollView>

      {/* Congrats Modal */}
      <ChallengeCongratsModal
        visible={showCongratsModal}
        onClose={handleCloseModal}
        onUploadPhoto={handleUploadPhoto}
      />
    </>
  );
}
