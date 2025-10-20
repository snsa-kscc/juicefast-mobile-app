import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePaywall } from "@/hooks/usePaywall";
import { useRevenueCat } from "@/providers/RevenueCatProvider";

interface PremiumSubscriptionDrawerProps {
  children: React.ReactNode;
}

export function PremiumSubscriptionDrawer({
  children,
}: PremiumSubscriptionDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { isSubscribed } = usePaywall();
  const { offerings, purchasePackage } = useRevenueCat();

  const openDrawer = () => {
    // If already subscribed, don't show drawer
    if (isSubscribed) {
      return;
    }
    setIsVisible(true);
  };

  const closeDrawer = () => setIsVisible(false);

  const handleSubscribe = async () => {
    // Get the first available package (typically monthly)
    const currentOffering = offerings?.current;
    const availablePackages = currentOffering?.availablePackages || [];

    if (availablePackages.length === 0) {
      Alert.alert(
        "No Packages Available",
        "No subscription packages are currently available. Please try again later.",
        [{ text: "OK" }]
      );
      return;
    }

    const pkg = availablePackages[0];
    setIsPurchasing(true);

    try {
      const result = await purchasePackage(pkg);
      if (result.success) {
        closeDrawer();
        Alert.alert(
          "Welcome to Premium!",
          "You now have access to all premium content and features.",
          [{ text: "Awesome!" }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Purchase Failed",
        error.message || "Something went wrong. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  // Get pricing info from offerings
  const currentOffering = offerings?.current;
  const availablePackages = currentOffering?.availablePackages || [];
  const primaryPackage = availablePackages[0];

  const getPricingText = () => {
    if (!primaryPackage) {
      return "Subscribe to unlock premium features";
    }

    const hasFreeTrial = !!primaryPackage.product.introPrice;
    const price = primaryPackage.product.priceString;

    if (hasFreeTrial) {
      return `7-day free trial, then ${price}/month. Cancel anytime.`;
    }

    return `${price}/month. Cancel anytime.`;
  };

  return (
    <>
      <TouchableOpacity onPress={openDrawer}>{children}</TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeDrawer}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <TouchableOpacity onPress={closeDrawer} className="p-2">
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">
              Go Premium
            </Text>
            <View className="w-10" />
          </View>

          <View className="flex-1 px-6 pt-8 items-center">
            <View className="w-20 h-20 rounded-full bg-amber-100 items-center justify-center mb-6">
              <Ionicons name="star" size={48} color="#F59E0B" />
            </View>

            <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
              Unlock Premium
            </Text>
            <Text className="text-base text-gray-500 text-center leading-6 mb-8">
              Get unlimited access to all premium features
            </Text>

            <View className="w-full mb-8">
              <View className="flex-row items-center mb-4">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text className="text-base text-gray-700 ml-3">
                  Access to JF Club exclusive content
                </Text>
              </View>
              <View className="flex-row items-center mb-4">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text className="text-base text-gray-700 ml-3">
                  Detailed analytics and insights
                </Text>
              </View>
              <View className="flex-row items-center mb-4">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text className="text-base text-gray-700 ml-3">
                  Premium wellness predictions
                </Text>
              </View>
              <View className="flex-row items-center mb-4">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text className="text-base text-gray-700 ml-3">
                  PDF data export
                </Text>
              </View>
              <View className="flex-row items-center mb-4">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text className="text-base text-gray-700 ml-3">
                  Ad-free experience
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="w-full bg-blue-500 py-4 rounded-xl items-center mb-4"
              onPress={handleSubscribe}
              disabled={isPurchasing || !primaryPackage}
            >
              {isPurchasing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-base font-semibold text-white">
                  {primaryPackage?.product.introPrice
                    ? "Start Free Trial"
                    : "Subscribe Now"}
                </Text>
              )}
            </TouchableOpacity>

            <Text className="text-sm text-gray-500 text-center leading-5">
              {getPricingText()}
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
