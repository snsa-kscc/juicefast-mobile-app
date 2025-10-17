import React from "react";
import { View, Text, Platform } from "react-native";
import { usePaywall } from "@/hooks/usePaywall";
import { PaywallScreen } from "./PaywallScreen";

interface PaywallGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PaywallGuard({ children, fallback }: PaywallGuardProps) {
  const { isSubscribed, isLoading } = usePaywall();

  // On Android, always show the content (no paywall)
  if (Platform.OS === "android") {
    return <>{children}</>;
  }

  // Show loading state (iOS only)
  if (isLoading) {
    return (
      <View className="flex-1 bg-[#FCFBF8] justify-center items-center p-6">
        <Text className="text-base text-gray-500">Loading...</Text>
      </View>
    );
  }

  // If subscribed, show the protected content
  if (isSubscribed) {
    return <>{children}</>;
  }

  // Show custom fallback or default paywall screen
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default paywall screen
  return <PaywallScreen />;
}
