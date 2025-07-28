import { Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

// Dynamic route: /user/123, /user/456, etc.
export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-green-50 px-6">
      <Text className="text-3xl font-bold text-green-600 mb-4">
        User Profile
      </Text>
      
      <Text className="text-xl text-gray-700 mb-8">
        User ID: {id}
      </Text>
      
      <Text className="text-base text-gray-600 text-center mb-8">
        This is a dynamic route, just like Next.js [id].js!
        The URL parameter is automatically available.
      </Text>
      
      <TouchableOpacity 
        className="bg-green-500 py-4 px-8 rounded-lg"
        onPress={() => router.back()}
      >
        <Text className="text-white font-semibold text-lg">← Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
