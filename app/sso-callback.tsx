import { View, Text, ActivityIndicator } from "react-native";

export default function SSOCallbackScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-jf-gray">
      <ActivityIndicator size="large" color="#2d2d2d" />
      <Text className="mt-4 text-gray-600 font-lufga-medium">
        Completing sign in...
      </Text>
    </View>
  );
}
