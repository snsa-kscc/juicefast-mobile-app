import React from "react";
import { View, ActivityIndicator } from "react-native";

export function LoadingOverlay() {
  return (
    <View className="absolute inset-0 bg-black/50 flex-1 justify-center items-center z-50">
      <ActivityIndicator size="large" color="#2d2d2d" />
    </View>
  );
}
