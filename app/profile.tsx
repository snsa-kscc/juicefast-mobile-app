import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-purple-50 px-6">
      <Text className="text-3xl font-bold text-purple-600 mb-4">Profile Page</Text>
      
      <Text className="text-base text-gray-700 text-center mb-8">
        Another page with stacking navigation! You can keep pushing more screens.
      </Text>
      
      <View className="bg-white p-6 rounded-xl shadow-lg mb-8 w-full max-w-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-4">User Profile</Text>
        <View className="space-y-2">
          <Text className="text-gray-600">Name: John Doe</Text>
          <Text className="text-gray-600">Email: john@example.com</Text>
          <Text className="text-gray-600">Role: Developer</Text>
        </View>
      </View>
      
      <View className="space-y-4 w-full max-w-xs">
        <TouchableOpacity 
          className="bg-purple-500 py-4 px-8 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold text-lg text-center">← Go Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-gray-500 py-4 px-8 rounded-lg"
          onPress={() => router.push('/(tabs)')}
        >
          <Text className="text-white font-semibold text-lg text-center">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
