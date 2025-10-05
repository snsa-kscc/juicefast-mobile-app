import React from "react";
import { View, Text } from "react-native";
import { useUser } from "@clerk/clerk-expo";

interface ProtectedContentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredFeature?: string;
}

export function ProtectedContent({
  children,
  fallback,
  requiredFeature = "premium_access",
}: ProtectedContentProps) {
  const { user } = useUser();

  // Check if user has the required feature in publicMetadata
  const hasAccess = user?.publicMetadata?.[requiredFeature] === true;

  if (!hasAccess) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <View style={{ padding: 16 }}>
        <Text style={{ color: "#6B7280" }}>
          Sorry, you don't have access to this content.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}
