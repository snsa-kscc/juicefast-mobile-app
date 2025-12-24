import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Bell, Camera, Scale, ChevronLeft } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { showCrossPlatformAlert } from "@/utils/alert";
import { EditDetailsModal } from "@/components/EditDetailsModal";

export default function ProgressDashboardPage() {
  const router = useRouter();
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);

  // Get user profile for BMI calculation
  const userProfile = useQuery(api.userProfile.getByUserId);
  const updateUserProfile = useMutation(api.userProfile.createOrUpdate);

  // BMI ranges and calculations
  const calculateBMIPosition = (bmi: number) => {
    // BMI ranges: Underweight < 18.5, Normal 18.5-24.9, Overweight 25-29.9, Obesity >= 30
    const minBMI = 8;
    const maxBMI = 40;
    const totalRange = maxBMI - minBMI;

    // Adjust ranges to be continuous and fill the entire space
    const ranges = [
      { min: 8, max: 18.5, color: "#2196F3" }, // Underweight: 10.5 range
      { min: 18.5, max: 25, color: "#4CAF50" }, // Normal: 6.5 range
      { min: 25, max: 30, color: "#FF9800" }, // Overweight: 5 range
      { min: 30, max: 40, color: "#F44336" }, // Obesity: 10 range
    ];

    // Calculate position as percentage (0-100)
    const position = Math.min(
      Math.max(((bmi - minBMI) / totalRange) * 100, 0),
      100
    );

    // Determine category
    let category = "Underweight";
    let categoryColor = "#2196F3";
    if (bmi >= 30) {
      category = "Obesity";
      categoryColor = "#F44336";
    } else if (bmi >= 25) {
      category = "Overweight";
      categoryColor = "#FF9800";
    } else if (bmi >= 18.5) {
      category = "Normal";
      categoryColor = "#4CAF50";
    }

    return { position, category, categoryColor, ranges, totalRange };
  };

  // Calculate BMI from profile data
  const calculateBMI = () => {
    if (userProfile?.weight && userProfile?.height) {
      return Number(
        (userProfile.weight / Math.pow(userProfile.height / 100, 2)).toFixed(1)
      );
    }
    return null; // Return null when no data available
  };

  const actualBMI = calculateBMI();
  const bmiData = actualBMI ? calculateBMIPosition(actualBMI) : null;

  // Handle saving profile details
  const handleSaveDetails = async (
    height: string,
    weight: string,
    age: string,
    gender: string | undefined,
    activityLevel: string | undefined
  ) => {
    try {
      await updateUserProfile({
        height: height ? parseInt(height) : undefined,
        weight: weight ? parseInt(weight) : undefined,
        age: age ? parseInt(age) : undefined,
        gender,
        activityLevel,
        referralCode: userProfile?.referralCode || "DEFAULT",
        referredBy: userProfile?.referredBy,
        referralCount: userProfile?.referralCount || 0,
      });
      setShowEditDetailsModal(false);
      showCrossPlatformAlert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      await showCrossPlatformAlert("Error", "Failed to update profile details");
    }
  };

  // Gender and activity options for the modal
  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const activityOptions = [
    { label: "Sedentary (little to no exercise)", value: "sedentary" },
    { label: "Light (exercise 1-3 days/week)", value: "light" },
    { label: "Moderate (exercise 3-5 days/week)", value: "moderate" },
    { label: "Active (exercise 6-7 days/week)", value: "active" },
    { label: "Very Active (professional athlete level)", value: "very_active" },
  ];

  // Get user's challenge progress
  const challengeProgress = useQuery(
    api.challengeProgress.getUserChallengeProgress
  );
  const generateUploadUrl = useMutation(
    api.challengeProgress.generateUploadUrl
  );
  const updateProgress = useMutation(api.challengeProgress.updateProgress);
  const deletePhoto = useMutation(api.challengeProgress.deletePhoto);

  // Get image URLs if they exist
  const beforeImageUrl = useQuery(
    api.challengeProgress.getUrl,
    challengeProgress?.beforePhotoUrl
      ? { storageId: challengeProgress.beforePhotoUrl as any }
      : "skip"
  );
  const afterImageUrl = useQuery(
    api.challengeProgress.getUrl,
    challengeProgress?.afterPhotoUrl
      ? { storageId: challengeProgress.afterPhotoUrl as any }
      : "skip"
  );

  const handleImageUpload = async (type: "before" | "after") => {
    const setUploading =
      type === "before" ? setIsUploadingBefore : setIsUploadingAfter;
    try {
      setUploading(true);

      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        await showCrossPlatformAlert(
          "Permission Required",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const image = result.assets[0];

      // Delete existing photo if it exists
      const existingPhotoUrl =
        type === "before"
          ? challengeProgress?.beforePhotoUrl
          : challengeProgress?.afterPhotoUrl;

      if (existingPhotoUrl) {
        await deletePhoto({ storageId: existingPhotoUrl as any });
      }

      // Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload image
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": image.mimeType! },
        body: image.uri.includes("file://")
          ? await fetch(image.uri).then((r) => r.blob())
          : await fetch(image.uri).then((r) => r.blob()),
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await response.json();

      // Update progress with new image
      if (type === "before") {
        await updateProgress({ beforePhotoUrl: storageId });
      } else {
        await updateProgress({ afterPhotoUrl: storageId });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      await showCrossPlatformAlert(
        "Upload Failed",
        "Failed to upload photo. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 pt-12 pb-3">
        <TouchableOpacity
          className="w-16 h-16 bg-[#F8F8F8] rounded-full items-center justify-center"
          onPress={() => router.back()}
        >
          <ChevronLeft size={28} color="#750046" />
        </TouchableOpacity>
        <Text className="text-2xl font-lufga-medium text-[#750046]">
          Progress Dashboard
        </Text>
        <TouchableOpacity
          className="w-20 h-16 bg-[#F8F8F8] rounded-full items-center justify-center"
          onPress={() => router.push("/challenge/challenge-messages")}
        >
          <Bell size={28} color="#750046" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 bg-jf-gray"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="rounded-3xl mx-0 mt-2 px-4 pt-4 pb-6">
          {!bmiData ? (
            <View className="bg-white rounded-2xl p-5 mb-4">
              <View className="flex-row items-center mb-3">
                <Scale size={18} color="#750046" />
                <Text className="text-xl font-lufga-medium text-[#750046] ml-1.5">
                  BMI
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setShowEditDetailsModal(true)}
                className="flex-col items-center justify-center py-2"
              >
                <Text className="text-4xl font-lufga-semibold text-gray-400 mb-2">
                  --
                </Text>
                <Text className="font-lufga-medium text-gray-600 text-center mb-3">
                  No height or weight data
                </Text>
                <View className="bg-[#750046] rounded-2xl px-6 py-3">
                  <Text className="font-lufga-semibold text-white">
                    Add Your Details
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-5 mb-4">
              <View className="flex-row items-center mb-3">
                <Scale size={18} color="#750046" />
                <Text className="text-xl font-lufga-medium text-[#750046] ml-1.5">
                  BMI
                </Text>
              </View>

              <View className="flex-row items-center mb-4">
                <Text className="text-5xl font-lufga-semibold text-[#750046]">
                  {actualBMI}
                </Text>
                <View
                  className="rounded-2xl px-3 py-1 ml-3"
                  style={{ backgroundColor: bmiData.categoryColor }}
                >
                  <Text className="text-sm font-lufga-semibold text-white">
                    {bmiData.category}
                  </Text>
                </View>
              </View>

              <View className="mb-4 relative">
                <View className="h-3.5 flex-row rounded-full overflow-hidden">
                  {bmiData.ranges.map((range, index) => {
                    const width =
                      ((range.max - range.min) / bmiData.totalRange) * 100;
                    return (
                      <View
                        key={index}
                        className="h-full"
                        style={{
                          backgroundColor: range.color,
                          width: `${width}%`,
                        }}
                      />
                    );
                  })}
                </View>
                {/* BMI Position Indicator */}
                <View
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${bmiData.position}%` }}
                >
                  <View className="w-6 h-6 rounded-full bg-gray-300" />
                </View>
              </View>

              <View className="flex-row justify-between px-1">
                <View className="flex-row items-center">
                  <View className="w-2.5 h-2.5 rounded-full bg-[#2196F3]" />
                  <Text className="ml-1.5 text-xs text-[#9FA2BA] font-lufga text-center">
                    Underweight
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" />
                  <Text className="ml-1.5 text-xs text-[#9FA2BA] font-lufga text-center">
                    Normal
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-2.5 h-2.5 rounded-full bg-[#FF9800]" />
                  <Text className="ml-1.5 text-xs text-[#9FA2BA] font-lufga text-center">
                    Overweight
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-2.5 h-2.5 rounded-full bg-[#F44336]" />
                  <Text className="ml-1.5 text-xs text-[#9FA2BA] font-lufga text-center">
                    Obesity
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View className="mb-4">
            <View className="flex-row gap-4 items-center">
              <View className="bg-white flex-1 p-4   rounded-2xl">
                <Text className="text-base font-lufga-medium text-[#750046] mb-3">
                  Before
                </Text>
                <View className="bg-[#EEF0EB] border border-[#EEF0EB] rounded-md h-56 overflow-hidden mb-3">
                  {beforeImageUrl ? (
                    <Image
                      source={{ uri: beforeImageUrl }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="flex-1 items-center justify-center">
                      <Camera size={22} color="#750046" strokeWidth={1.5} />
                      <Text className="text-sm font-lufga-medium text-[#750046] mt-1">
                        No before photo
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  className={`bg-white border border-[#AA036F] rounded-xl py-2 items-center ${isUploadingBefore ? "opacity-50" : ""}`}
                  onPress={() => handleImageUpload("before")}
                  disabled={isUploadingBefore}
                >
                  <Text className="font-lufga text-gray-600 leading-tight">
                    {isUploadingBefore
                      ? "Uploading..."
                      : challengeProgress?.beforePhotoUrl
                        ? "Update before"
                        : "Add new before"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="bg-white flex-1 p-4 rounded-2xl">
                <Text className="text-base font-lufga-medium text-[#750046] mb-3">
                  After
                </Text>
                <View className="bg-[#EEF0EB] border border-[#EEF0EB] rounded-md h-56 overflow-hidden mb-3">
                  {afterImageUrl ? (
                    <Image
                      source={{ uri: afterImageUrl }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="flex-1 items-center justify-center">
                      <Camera size={22} color="#750046" strokeWidth={1.5} />
                      <Text className="text-sm font-lufga-medium text-[#750046] mt-1">
                        No after photo
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  className={`bg-white border border-[#C20F44] rounded-xl py-2 items-center ${isUploadingAfter ? "opacity-50" : ""}`}
                  onPress={() => handleImageUpload("after")}
                  disabled={isUploadingAfter}
                >
                  <Text className="font-lufga text-gray-600 leading-tight">
                    {isUploadingAfter
                      ? "Uploading..."
                      : challengeProgress?.afterPhotoUrl
                        ? "Update after"
                        : "Add after photo"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-5">
            <View className="flex-row items-center mb-2">
              <Scale size={18} color="#750046" />
              <Text className="text-xl font-lufga-medium text-[#750046] ml-1.5">
                Weight
              </Text>
            </View>

            <View className="flex-row items-baseline mb-4">
              <Text className="text-3xl font-lufga-medium text-[#750046]">
                85.0{" "}
              </Text>
              <Text className="text-base font-lufga text-[#750046]">kg</Text>
            </View>

            <TouchableOpacity className="bg-[#BAF2C4] rounded-xl py-2.5 items-center">
              <Text
                className="text-lg font-lufga-medium text-[#003D29]"
                style={{ letterSpacing: -0.28 }}
              >
                Log Weight
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Edit Details Modal */}
      <EditDetailsModal
        visible={showEditDetailsModal}
        onClose={() => setShowEditDetailsModal(false)}
        initialHeight={userProfile?.height?.toString() || ""}
        initialWeight={userProfile?.weight?.toString() || ""}
        initialAge={userProfile?.age?.toString() || ""}
        initialGender={userProfile?.gender}
        initialActivityLevel={userProfile?.activityLevel}
        genderOptions={genderOptions}
        activityOptions={activityOptions}
        onSave={handleSaveDetails}
      />
    </View>
  );
}
