import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Details() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-blue-50 px-6">
      <Text className="text-3xl font-bold text-blue-600 mb-4">Details Page</Text>
      
      <Text className="text-base text-gray-700 text-center mb-8">
        This page was navigated to with a stacking effect! 
        Notice how it slides in from the right.
      </Text>
      
      <View className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Stack Navigation</Text>
        <Text className="text-gray-600">
          This demonstrates push/pop navigation with smooth transitions between screens.
        </Text>
      </View>
      
      <TouchableOpacity 
        className="bg-blue-500 py-4 px-8 rounded-lg"
        onPress={() => router.back()}
      >
        <Text className="text-white font-semibold text-lg">← Go Back</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="bg-green-500 py-4 px-8 rounded-lg mt-4"
        onPress={() => router.push('/profile')}
      >
        <Text className="text-white font-semibold text-lg">Go to Profile →</Text>
      </TouchableOpacity>
    </View>
  );
}
