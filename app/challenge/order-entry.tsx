import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePaywall } from "@/hooks/usePaywall";
import { showCrossPlatformAlert } from "@/utils/alert";

export default function OrderEntryPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check subscription status
  const { isPremiumOnAnyPlatform, isLoading: subscriptionLoading } =
    usePaywall();

  // Convex mutations
  const enrollInChallenge = useMutation(api.challengeOrders.enrollInChallenge);

  // Progress tracking - current step is 1 (order entry)
  const currentStep = 1;
  const totalSteps = isPremiumOnAnyPlatform ? 1 : 2;

  // Minimum order number thresholds
  const minOrderNumberHR = 91610;
  const minOrderNumberSI = 55555;

  const validateOrderNumber = (
    orderNumber: string
  ): { isValid: boolean; message?: string } => {
    const regex = /^(HR|SI)\d{5}$/;
    if (!regex.test(orderNumber)) {
      return {
        isValid: false,
        message: "Order number must start with HR or SI followed by 5 digits",
      };
    }

    // Extract the prefix and numeric part
    const prefix = orderNumber.substring(0, 2);
    const numericPart = parseInt(orderNumber.substring(2));

    // Check minimum based on prefix
    if (prefix === "HR") {
      if (numericPart < minOrderNumberHR) {
        return {
          isValid: false,
          message: "Order number is invalid",
        };
      }
    } else if (prefix === "SI") {
      if (numericPart < minOrderNumberSI) {
        return {
          isValid: false,
          message: "Order number is invalid",
        };
      }
    }

    return { isValid: true };
  };

  const handleSubmit = async () => {
    if (!orderNumber) {
      await showCrossPlatformAlert("Error", "Please enter your order number");
      return;
    }

    const validation = validateOrderNumber(orderNumber);
    if (!validation.isValid) {
      await showCrossPlatformAlert(
        "Invalid Order Number",
        validation.message || "Invalid order number"
      );
      return;
    }

    setIsLoading(true);
    try {
      // Create order and enroll user in challenge in one atomic operation
      await enrollInChallenge({ orderNumber });

      // Navigate based on subscription status
      if (isPremiumOnAnyPlatform) {
        // User has premium, go directly to challenge page
        router.replace("/(tabs)/challenge");
      } else {
        // User needs premium, go to premium activation
        router.push("/challenge/premium-activation");
      }
    } catch (error) {
      console.error("Error activating order:", error);
      await showCrossPlatformAlert("Error", "Failed to activate order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-jf-gray"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section with Gradient - matching ChallengeTracker */}
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
              Enter your
            </Text>
            <Text className="text-5xl font-lufga-black text-black">
              order number
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content Section */}
      <View className="px-6 pt-8">
        {/* Input Field */}
        <View className="bg-white rounded-2xl shadow-lg p-2 mb-6">
          <TextInput
            value={orderNumber}
            onChangeText={(text) => {
              // Convert to uppercase
              const formattedText = text.toUpperCase();
              setOrderNumber(formattedText);
            }}
            placeholder="Enter order number"
            placeholderTextColor="#9CA3AF"
            className="text-lg font-lufga-medium text-center py-4"
            autoCapitalize="characters"
            autoFocus
            textAlign="center"
            autoCorrect={false}
            spellCheck={false}
            maxLength={7}
            caretHidden={true}
          />
        </View>

        {/* Description Text */}
        <Text className="text-base font-lufga text-gray-600 text-center mb-12 leading-6">
          You'll find your order number in the confirmation{"\n"}
          email after purchasing on juicefast.com. This{"\n"}
          is your ticket to participate.
        </Text>

        {/* Activate Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`w-2/3 rounded-3xl py-5 mb-6 bg-transparent mx-auto ${
            Platform.OS === "ios"
              ? "shadow-2xl shadow-black/30"
              : "shadow-2xl shadow-black/90"
          }`}
        >
          <LinearGradient
            colors={isLoading ? ["#D1D5DB", "#E5E7EB"] : ["#A5ECC9", "#EFEFEF"]}
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
          <View className="relative flex-row items-center justify-center">
            {isLoading ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#374151"
                  className="mr-2"
                />
                <Text className="text-gray-700 text-xl font-lufga-bold text-center">
                  Activating...
                </Text>
              </>
            ) : (
              <Text className="text-black text-xl font-lufga-bold text-center">
                Activate
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
