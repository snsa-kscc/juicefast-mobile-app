import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
  const [selectedPlan, setSelectedPlan] = useState<"trial" | "monthly">(
    "trial"
  );
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
        transparent={Platform.OS === "android"}
        animationType="slide"
        presentationStyle={Platform.OS === "ios" ? "pageSheet" : undefined}
        onRequestClose={closeDrawer}
      >
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Hero Section with Image */}
            <View className="relative h-64">
              <ImageBackground
                source={require("@/assets/images/jf-club/cardio-fat-burn.jpg")}
                className="w-full h-full"
                resizeMode="cover"
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.1)"]}
                  className="w-full h-full justify-center items-center"
                >
                  {/* Close Button */}
                  <TouchableOpacity
                    onPress={closeDrawer}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/30 items-center justify-center"
                  >
                    <Ionicons name="close" size={24} color="#FFFFFF" />
                  </TouchableOpacity>

                  {/* Title */}
                  <Text className="text-3xl font-bold text-white text-center mb-2">
                    Juicefast Club
                  </Text>
                  <Text className="text-sm text-white/90 text-center px-8 leading-5">
                    Start your journey today and enjoy premium &{"\n"}
                    personalized access to a vibrant wellness{"\n"}community
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </View>

            {/* Content Section */}
            <View className="px-5 pt-6 pb-8">
              {/* Section Title */}
              <Text className="text-base font-semibold text-gray-900 text-center mb-4">
                Choose your plan & start your journey
              </Text>

              {/* Plan Cards */}
              <View className="mb-6">
                {/* 7-Day Free Trial Card */}
                <TouchableOpacity
                  onPress={() => setSelectedPlan("trial")}
                  className={`border-2 rounded-2xl p-4 mb-3 ${
                    selectedPlan === "trial"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View>
                      <Text className="text-xl font-bold text-gray-900">
                        {primaryPackage?.product.priceString || "11.28 €"}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-0.5">
                        {primaryPackage?.product.priceString
                          ? `${primaryPackage.product.priceString} / month`
                          : "9.40 € / month"}
                      </Text>
                    </View>
                    <View className="bg-blue-500 px-3 py-1.5 rounded-full">
                      <Text className="text-xs font-semibold text-white">
                        7 days for free
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-gray-500 leading-4">
                    Then {primaryPackage?.product.priceString || "11.28€"} every
                    month until you cancel. Cancel anytime.
                  </Text>
                </TouchableOpacity>

                {/* 1 Month Card */}
                <TouchableOpacity
                  onPress={() => setSelectedPlan("monthly")}
                  className={`border-2 rounded-2xl p-4 ${
                    selectedPlan === "monthly"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View>
                      <Text className="text-xl font-bold text-gray-900">
                        {primaryPackage?.product.priceString || "11.28 €"}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-0.5">
                        {primaryPackage?.product.priceString
                          ? `${primaryPackage.product.priceString} / month`
                          : "9.40 € / month"}
                      </Text>
                    </View>
                    <View className="bg-gray-100 px-3 py-1.5 rounded-full">
                      <Text className="text-xs font-semibold text-gray-600">
                        1 month
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-gray-500 leading-4">
                    Billed monthly. Get started right away without trial period.
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Benefits List */}
              <View className="mb-6">
                <View className="flex-row items-start mb-3">
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#10B981"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-sm text-gray-700 ml-3 flex-1 leading-5">
                    Special discount on all Juicefast products
                  </Text>
                </View>
                <View className="flex-row items-start mb-3">
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#10B981"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-sm text-gray-700 ml-3 flex-1 leading-5">
                    VIP offerings on new products
                  </Text>
                </View>
                <View className="flex-row items-start mb-3">
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#10B981"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-sm text-gray-700 ml-3 flex-1 leading-5">
                    All - Inclusive personalized and curated programs
                  </Text>
                </View>
                <View className="flex-row items-start mb-3">
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#10B981"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-sm text-gray-700 ml-3 flex-1 leading-5">
                    1:1 talks with our nutritionist and health experts
                  </Text>
                </View>
                <View className="flex-row items-start mb-3">
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#10B981"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-sm text-gray-700 ml-3 flex-1 leading-5">
                    Free gifts on every delivery
                  </Text>
                </View>
              </View>

              {/* See Prices Link */}
              <TouchableOpacity className="items-center mb-6">
                <Text className="text-sm text-blue-500 font-medium">
                  See prices
                </Text>
              </TouchableOpacity>

              {/* CTA Button */}
              <TouchableOpacity
                className="w-full bg-black py-4 rounded-full items-center"
                onPress={handleSubscribe}
                disabled={isPurchasing || !primaryPackage}
              >
                {isPurchasing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-base font-semibold text-white uppercase tracking-wide">
                    Start Free Trial & Subscribe
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}
