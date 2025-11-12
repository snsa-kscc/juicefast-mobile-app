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

  const benefits = [
    "Special discount on all Juicefast products",
    "VIP offerings on new products",
    "All - Inclusive personalized and curated programs",
    "1:1 talks with our nutritionist and health experts",
    "Free gifts on every delivery",
  ];

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
        <SafeAreaView className="flex-1 bg-jf-gray">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Hero Section with Image */}
            <View className="relative h-80">
              <ImageBackground
                source={require("@/assets/images/jf-club/cardio-fat-burn.jpg")}
                className="w-full h-full"
                resizeMode="cover"
                imageStyle={{ resizeMode: "cover" }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.4)"]}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    paddingBottom: 16,
                  }}
                >
                  {/* Close Button */}
                  <TouchableOpacity
                    onPress={closeDrawer}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/30 items-center justify-center"
                  >
                    <Ionicons name="close" size={24} color="#FFFFFF" />
                  </TouchableOpacity>

                  {/* Title */}
                  <Text className="text-3xl font-lufga-bold text-white text-center mb-2">
                    Juicefast Club
                  </Text>
                  <Text className="text-sm font-lufga text-white/90 text-center px-8 leading-5">
                    Start your journey today and enjoy premium &{"\n"}
                    personalized access to a vibrant wellness{"\n"}community
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </View>

            {/* Content Section */}
            <View className="px-5 pt-6 pb-8">
              {/* Section Title */}
              <Text className="text-base font-lufga-semibold text-gray-900 text-center mb-4">
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
                      <Text className="text-xl font-lufga-bold text-gray-900">
                        {primaryPackage?.product.priceString || "11.28 €"}
                      </Text>
                      <Text className="text-xs font-lufga text-gray-500 mt-0.5">
                        {primaryPackage?.product.priceString
                          ? `${primaryPackage.product.priceString} / month`
                          : "9.40 € / month"}
                      </Text>
                    </View>
                    <View className="bg-blue-500 px-3 py-1.5 rounded-full">
                      <Text className="text-xs font-lufga-semibold text-white">
                        7 days for free
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs font-lufga text-gray-500 leading-4">
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
                      <Text className="text-xl font-lufga-bold text-gray-900">
                        {primaryPackage?.product.priceString || "11.28 €"}
                      </Text>
                      <Text className="text-xs font-lufga text-gray-500 mt-0.5">
                        {primaryPackage?.product.priceString
                          ? `${primaryPackage.product.priceString} / month`
                          : "9.40 € / month"}
                      </Text>
                    </View>
                    <View className="bg-gray-100 px-3 py-1.5 rounded-full">
                      <Text className="text-xs font-lufga-semibold text-gray-600">
                        1 month
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs font-lufga text-gray-500 leading-4">
                    Billed monthly. Get started right away without trial period.
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Benefits List */}
              <View className="mb-6">
                {benefits.map((benefit, index) => (
                  <View key={index} className="flex-row items-center mb-3">
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#10B981"
                      style={{ marginTop: 3 }}
                    />
                    <Text className="text-sm font-lufga text-gray-700 ml-3 flex-1 leading-5">
                      {benefit}
                    </Text>
                  </View>
                ))}
              </View>

              {/* CTA Button */}
              <TouchableOpacity
                className="w-full bg-black py-4 rounded-full items-center"
                onPress={handleSubscribe}
                disabled={isPurchasing || !primaryPackage}
              >
                {isPurchasing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-base font-lufga-semibold text-white uppercase tracking-wide">
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
