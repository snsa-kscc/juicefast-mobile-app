import { Text, View } from "react-native";

export default function About() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="text-2xl font-bold text-gray-800 mb-4">About Page</Text>
      <Text className="text-base text-gray-600 text-center px-6">
        This is a new page created with NativeWind styling!
      </Text>
      <View className="mt-6 bg-blue-500 px-6 py-3 rounded-lg">
        <Text className="text-white font-semibold">Welcome to About</Text>
      </View>
    </View>
  );
}
