import { useState } from "react";
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
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRevenueCat } from "@/providers/RevenueCatProvider";

interface PremiumSubscriptionDrawerProps {
  children: React.ReactNode;
  isPremiumOnAnyPlatform?: boolean;
  isMobileAppSubscribed?: boolean;
}

export function PremiumSubscriptionDrawer({
  children,
  isPremiumOnAnyPlatform = false,
  isMobileAppSubscribed = false,
}: PremiumSubscriptionDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "yearly"
  );
  const { offerings, purchasePackage, restorePurchases } = useRevenueCat();

  const openDrawer = () => {
    // If already subscribed, don't show drawer
    if (isPremiumOnAnyPlatform) {
      return;
    }
    setIsVisible(true);
  };

  const closeDrawer = () => setIsVisible(false);

  const handleSubscribe = async () => {
    // Get the selected package based on user choice
    const currentOffering = offerings?.current;
    let selectedPackage;

    if (selectedPlan === "yearly") {
      selectedPackage = currentOffering?.annual;
    } else {
      selectedPackage = currentOffering?.monthly;
    }

    if (!selectedPackage) {
      Alert.alert(
        "Package Not Available",
        "The selected subscription package is currently unavailable. Please try again later.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsPurchasing(true);

    try {
      const result = await purchasePackage(selectedPackage);
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

  const handleRestorePurchases = async () => {
    try {
      await restorePurchases();
      // Check subscription status after restore
      if (isMobileAppSubscribed) {
        Alert.alert(
          "Purchases Restored",
          "Your purchases have been successfully restored.",
          [{ text: "OK" }]
        );
        closeDrawer();
      } else {
        Alert.alert(
          "No Purchases Found",
          "We couldn't find any previous purchases to restore.",
          [{ text: "OK" }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Restore Failed",
        error.message ||
          "Something went wrong while restoring purchases. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  // Get pricing info from offerings
  const currentOffering = offerings?.current;
  const monthlyPackage = currentOffering?.monthly;
  const yearlyPackage = currentOffering?.annual;

  // Calculate yearly savings
  const yearlySavings =
    monthlyPackage && yearlyPackage
      ? monthlyPackage.product.price * 12 - yearlyPackage.product.price
      : 59.89;

  // Helper function to format price consistently
  const formatPrice = (price: number) => {
    return `€${price.toFixed(2).replace(",", ".")}`;
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
                {/* Yearly Card */}
                <TouchableOpacity
                  onPress={() => setSelectedPlan("yearly")}
                  className={`border-2 rounded-2xl p-4 mb-3 ${
                    selectedPlan === "yearly"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View>
                      <Text className="text-xl font-lufga-bold text-gray-900">
                        {yearlyPackage
                          ? formatPrice(yearlyPackage.product.price)
                          : formatPrice(119.99)}
                      </Text>
                      <Text className="text-xs font-lufga text-gray-500 mt-0.5">
                        {yearlyPackage
                          ? formatPrice(yearlyPackage.product.price / 12)
                          : formatPrice(10.0)}{" "}
                        / month
                      </Text>
                    </View>
                    <View className="bg-green-500 px-3 py-1.5 rounded-full">
                      <Text className="text-xs font-lufga-semibold text-white">
                        Yearly - save {formatPrice(yearlySavings)}/year
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs font-lufga text-gray-500 leading-4">
                    Billed annually. Best value with{" "}
                    {yearlyPackage
                      ? formatPrice(yearlyPackage.product.price / 12)
                      : formatPrice(10.0)}{" "}
                    per month equivalent.
                  </Text>
                </TouchableOpacity>

                {/* Monthly Card */}
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
                        {monthlyPackage
                          ? formatPrice(monthlyPackage.product.price)
                          : formatPrice(14.99)}
                      </Text>
                      <Text className="text-xs font-lufga text-gray-500 mt-0.5">
                        {monthlyPackage
                          ? formatPrice(monthlyPackage.product.price)
                          : formatPrice(14.99)}{" "}
                        / month
                      </Text>
                    </View>
                    <View className="bg-gray-100 px-3 py-1.5 rounded-full">
                      <Text className="text-xs font-lufga-semibold text-gray-600">
                        Monthly
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs font-lufga text-gray-500 leading-4">
                    Billed monthly. Get started right away with flexible monthly
                    payments.
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
                disabled={isPurchasing || (!monthlyPackage && !yearlyPackage)}
              >
                {isPurchasing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-base font-lufga-semibold text-white uppercase tracking-wide">
                    Subscribe to{" "}
                    {selectedPlan === "yearly" ? "Yearly" : "Monthly"} Plan
                  </Text>
                )}
              </TouchableOpacity>

              {/* Required subscription terms and links */}
              <View className="mt-4 px-5">
                <Text className="text-sm font-lufga text-gray-500 text-center leading-4 mb-3">
                  Subscription automatically renews unless auto-renew is turned
                  off at least 24 hours before the end of the current period.
                </Text>

                <View className="flex-row justify-center items-center gap-4">
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        "https://juicefast.com/privacy-and-security/"
                      )
                    }
                  >
                    <Text className="text-sm font-lufga text-blue-500 underline">
                      Privacy Policy
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL("https://juicefast.com/eula/")
                    }
                  >
                    <Text className="text-sm font-lufga text-blue-500 underline">
                      Terms of Use
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleRestorePurchases}>
                    <Text className="text-sm font-lufga text-blue-500 underline">
                      Restore purchases
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}
