import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, usePathname } from "expo-router";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChallengeTracker } from "@/components/challenge/ChallengeTracker";
import { ChallengeCongratsModal } from "@/components/challenge/ChallengeCongratsModal";

interface ChallengeDashboardProps {
  showModal?: boolean;
}

export function ChallengeDashboard({
  showModal = false,
}: ChallengeDashboardProps) {
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const updateProgress = useMutation(api.challengeProgress.updateProgress);
  const generateUploadUrl = useMutation(
    api.challengeProgress.generateUploadUrl
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Show modal only when on challenge tab and there's no progress
    // This prevents the modal from showing on Android when navigating to premium-activation
    if (showModal && pathname === "/challenge") {
      // Add delay for Android to ensure navigation is complete
      const timer = setTimeout(
        () => {
          setShowCongratsModal(true);
        },
        Platform.OS === "android" ? 500 : 0
      );

      return () => clearTimeout(timer);
    }
  }, [showModal, pathname]);

  const handleCloseModal = async () => {
    setShowCongratsModal(false);

    // Update the progress in the background
    try {
      await updateProgress({ hasClearedEntryModal: true });
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const handleUploadPhoto = async (image: any) => {
    try {
      // Get upload URL from Convex
      const postUrl = await generateUploadUrl();

      // Convert image URI to blob for upload
      const response = await fetch(image.uri);
      const blob = await response.blob();

      // Upload the image to Convex storage
      const uploadResponse = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": image.mimeType || "image/jpeg" },
        body: blob,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      // Get the storage ID from the response
      const { storageId } = await uploadResponse.json();

      // Update the challenge progress with the storage ID
      await updateProgress({
        hasClearedEntryModal: true,
        beforePhotoUrl: storageId,
      });

      setShowCongratsModal(false);
    } catch (error) {
      console.error("Failed to upload photo:", error);
      // Re-throw error to let ChallengeCongratsModal handle it
      throw error;
    }
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
          <TouchableOpacity
            className={`w-full rounded-3xl shadow-2xl py-5 px-8 mb-6 bg-transparent ${
              Platform.OS === "ios" ? "shadow-black/30" : "shadow-black/90"
            }`}
            onPress={() => router.push("/challenge/another-entry")}
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
