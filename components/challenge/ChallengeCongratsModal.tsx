import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { showCrossPlatformAlert } from "@/utils/alert";

interface ChallengeCongratsModalProps {
  visible: boolean;
  onClose: () => void;
  onUploadPhoto: (image: any) => Promise<void>;
}

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

export function ChallengeCongratsModal({
  visible,
  onClose,
  onUploadPhoto,
}: ChallengeCongratsModalProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadPhoto = async () => {
    try {
      setIsUploading(true);
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

      if (!result.canceled && result.assets[0]) {
        try {
          await onUploadPhoto(result.assets[0]);
          // Show success alert
          await showCrossPlatformAlert(
            "Success!",
            "Your photo has been uploaded successfully."
          );
        } catch (error) {
          // Show error alert if upload failed
          await showCrossPlatformAlert(
            "Error",
            "Failed to upload photo. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      await showCrossPlatformAlert(
        "Error",
        "Failed to pick image. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Blur Background */}
      <BlurView
        intensity={5}
        className="flex-1"
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
      >
        <View className="flex-1 justify-center items-center px-6">
          {/* Modal Content */}
          <View
            className="bg-white rounded-2xl p-8 w-full max-w-sm"
            style={{ maxHeight: windowHeight * 0.8 }}
          >
            {/* Title */}
            <Text className="text-2xl font-lufga-bold text-black text-center mb-8 leading-7">
              Congrats on starting the challenge!
            </Text>

            {/* Illustration Container */}
            <View className="relative h-56 w-full mb-8 rounded-2xl overflow-hidden">
              {/* Gradient Background */}
              <LinearGradient
                colors={["#A5EC9C", "#EFEFEF"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                className="absolute inset-0"
                style={{ transform: [{ rotate: "255.857deg" }] }}
              />

              {/* Calendar Illustration - Placeholder for the complex Figma illustration */}
              <View className="absolute inset-0 justify-center items-center">
                <View className="bg-white/90 rounded-2xl p-6 shadow-lg">
                  <View className="w-20 h-20 bg-[#0DC99B] rounded-2xl justify-center items-center mb-3">
                    <Text className="text-white text-3xl font-lufga-bold">
                      📅
                    </Text>
                  </View>
                  <Text className="text-gray-700 text-sm font-lufga-medium text-center">
                    Day 1
                  </Text>
                </View>
              </View>
            </View>

            {/* Subtitle */}
            <Text className="text-base font-lufga-medium text-black text-center mb-8 leading-5">
              Add your before photos to track your progress
            </Text>

            {/* Buttons */}
            <View className="gap-3">
              {/* Upload Photo Button */}
              <TouchableOpacity
                onPress={handleUploadPhoto}
                disabled={isUploading}
                className={`rounded-xl py-3 px-12 justify-center items-center ${
                  isUploading ? "bg-gray-400" : "bg-[#0DC99B]"
                }`}
                activeOpacity={0.8}
              >
                {isUploading ? (
                  <Text className="text-white text-2xl font-lufga-bold">
                    Uploading...
                  </Text>
                ) : (
                  <Text className="text-white text-2xl font-lufga-bold">
                    Upload photo
                  </Text>
                )}
              </TouchableOpacity>

              {/* Skip Button */}
              <TouchableOpacity
                onPress={onClose}
                className="bg-white border border-[#00A45F] rounded-xl py-3 px-12 justify-center items-center"
                activeOpacity={0.8}
              >
                <Text className="text-[#00A45F] font-lufga tracking-tight">
                  Skip and go to Dashboard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
