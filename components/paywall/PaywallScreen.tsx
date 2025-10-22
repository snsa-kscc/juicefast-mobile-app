import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useRevenueCat } from "@/providers/RevenueCatProvider";
import { Ionicons } from "@expo/vector-icons";
import { PurchasesPackage } from "react-native-purchases";

export function PaywallScreen() {
  const {
    offerings,
    purchasePackage,
    restorePurchases,
    simulateNoSubscription,
  } = useRevenueCat();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);

  const currentOffering = offerings?.current;
  const availablePackages = currentOffering?.availablePackages || [];

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setIsPurchasing(true);
    setSelectedPackage(pkg);
    try {
      const result = await purchasePackage(pkg);
      if (result.success) {
        Alert.alert(
          "Success!",
          "Welcome to Premium! You now have access to all premium features.",
          [{ text: "OK" }]
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
      setSelectedPackage(null);
    }
  };

  const handleRestore = async () => {
    setIsPurchasing(true);
    try {
      await restorePurchases();
      Alert.alert(
        "Restore Complete",
        "Your purchases have been restored successfully.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert(
        "Restore Failed",
        "Could not restore purchases. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  // Debug function to test restore flow
  const handleDebugRestore = () => {
    Alert.alert(
      "Test Restore Flow",
      "This will simulate losing your subscription so you can test the restore functionality.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Simulate",
          style: "destructive",
          onPress: () => {
            simulateNoSubscription();
            Alert.alert(
              "Debug Mode",
              "Subscription state cleared. The paywall should now appear. Tap 'Restore Purchases' to test the restore flow.",
              [{ text: "OK" }]
            );
          },
        },
      ]
    );
  };

  const getPackageTitle = (pkg: PurchasesPackage) => {
    const identifier = pkg.identifier;
    if (identifier.includes("annual") || identifier.includes("yearly")) {
      return "Annual";
    }
    if (identifier.includes("monthly")) {
      return "Monthly";
    }
    if (identifier.includes("weekly")) {
      return "Weekly";
    }
    return pkg.product.title;
  };

  const getPackageDuration = (pkg: PurchasesPackage) => {
    const identifier = pkg.identifier;
    if (identifier.includes("annual") || identifier.includes("yearly")) {
      return "per year";
    }
    if (identifier.includes("monthly")) {
      return "per month";
    }
    if (identifier.includes("weekly")) {
      return "per week";
    }
    return "";
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FCFBF8]">
      {/* Back Button */}
      <View className="px-6 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
          <Text className="text-base font-lufga-medium text-gray-700 ml-2">
            Back
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerClassName="px-6 pb-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <View className="mb-4">
            <Ionicons name="star" size={48} color="#F59E0B" />
          </View>
          <Text className="text-[32px] font-lufga-bold text-gray-900 mb-2 text-center">
            Unlock Premium
          </Text>
          <Text className="text-base text-gray-500 text-center">
            Get unlimited access to all premium features
          </Text>
        </View>

        {/* Features */}
        <View className="mb-8">
          <FeatureItem
            icon="checkmark-circle"
            text="Access to JF Club exclusive content"
          />
          <FeatureItem
            icon="checkmark-circle"
            text="Detailed analytics and insights"
          />
          <FeatureItem
            icon="checkmark-circle"
            text="Premium wellness predictions"
          />
          <FeatureItem icon="checkmark-circle" text="PDF data export" />
          <FeatureItem icon="checkmark-circle" text="Ad-free experience" />
        </View>

        {/* Packages */}
        {availablePackages.length > 0 ? (
          <View className="mb-6">
            {availablePackages.map((pkg) => (
              <TouchableOpacity
                key={pkg.identifier}
                className="bg-white rounded-2xl p-5 mb-3 border-2 border-gray-200 shadow-sm"
                onPress={() => handlePurchase(pkg)}
                disabled={isPurchasing}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-xl font-lufga-bold text-gray-900">
                    {getPackageTitle(pkg)}
                  </Text>
                  {pkg.product.introPrice && (
                    <View className="bg-emerald-500 px-2 py-1 rounded">
                      <Text className="text-[10px] font-lufga-bold text-white">
                        FREE TRIAL
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-[28px] font-lufga-bold text-blue-500 mb-1">
                  {pkg.product.priceString}
                </Text>
                <Text className="text-sm text-gray-500">
                  {getPackageDuration(pkg)}
                </Text>
                {pkg.product.introPrice && (
                  <Text className="text-xs text-gray-400 mt-2">
                    Then {pkg.product.priceString}/{getPackageDuration(pkg)}
                  </Text>
                )}
                {isPurchasing &&
                  selectedPackage?.identifier === pkg.identifier && (
                    <ActivityIndicator className="mt-3" color="#3B82F6" />
                  )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="p-8 items-center">
            <Text className="text-base text-gray-500 text-center">
              No subscription options available at the moment.
            </Text>
          </View>
        )}

        {/* Restore Button */}
        <TouchableOpacity
          className="py-4 items-center mb-4"
          onPress={handleRestore}
          disabled={isPurchasing}
        >
          <Text className="text-base text-blue-500 font-lufga-semibold">
            Restore Purchases
          </Text>
        </TouchableOpacity>

        {/* Debug Button - Only in development */}
        {__DEV__ && (
          <TouchableOpacity
            className="py-3 items-center mb-4 bg-orange-100 rounded-lg"
            onPress={handleDebugRestore}
          >
            <Text className="text-sm text-orange-600 font-lufga-semibold">
              🧪 Test Restore Flow (Debug)
            </Text>
          </TouchableOpacity>
        )}

        {/* Footer */}
        <Text className="text-xs text-gray-400 text-center leading-[18px]">
          Subscriptions automatically renew unless cancelled at least 24 hours
          before the end of the current period.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View className="flex-row items-center mb-4">
      <Ionicons name={icon} size={24} color="#10B981" />
      <Text className="text-base text-gray-700 ml-3 flex-1">{text}</Text>
    </View>
  );
}
