import { Link, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-blue-500 mb-8">Welcome to NativeWind!</Text>

      <Text className="text-base text-gray-600 text-center mb-8">Navigate to other pages using the links below or the tab bar:</Text>

      <View className="w-full max-w-xs space-y-4">
        {/* Tab Navigation (no stacking effect) */}
        <Text className="text-sm font-semibold text-gray-500 text-center mb-2">Tab Navigation:</Text>
        <Link href="/(tabs)/explore" asChild>
          <TouchableOpacity className="bg-green-500 py-4 px-6 rounded-lg">
            <Text className="text-white text-center font-semibold text-lg">Go to Explore Page</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/about" asChild>
          <TouchableOpacity className="bg-purple-500 py-4 px-6 rounded-lg">
            <Text className="text-white text-center font-semibold text-lg">Go to About Page</Text>
          </TouchableOpacity>
        </Link>

        {/* Stack Navigation (with stacking effect) */}
        <Text className="text-sm font-semibold text-gray-500 text-center mt-6 mb-2">Stack Navigation:</Text>
        <TouchableOpacity className="bg-blue-500 py-4 px-6 rounded-lg" onPress={() => router.push("/details")}>
          <Text className="text-white text-center font-semibold text-lg">Push to Details Page →</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-orange-500 py-4 px-6 rounded-lg" onPress={() => router.push("/profile")}>
          <Text className="text-white text-center font-semibold text-lg">Push to Profile Page →</Text>
        </TouchableOpacity>

        {/* Next.js-like Dynamic Routes */}
        <Text className="text-sm font-semibold text-gray-500 text-center mt-6 mb-2">Dynamic Routes (like Next.js):</Text>
        <TouchableOpacity className="bg-green-500 py-4 px-6 rounded-lg" onPress={() => router.push("/user/123")}>
          <Text className="text-white text-center font-semibold text-lg">User Profile [id] →</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-yellow-500 py-4 px-6 rounded-lg" onPress={() => router.push("/posts/2024/january/my-first-post")}>
          <Text className="text-white text-center font-semibold text-lg">Post [...slug] →</Text>
        </TouchableOpacity>
        
        {/* API Routes Demo (Next.js Server Actions → Expo API) */}
        <Text className="text-sm font-semibold text-gray-500 text-center mt-6 mb-2">API Routes (Server Actions Migration):</Text>
        <TouchableOpacity className="bg-indigo-500 py-4 px-6 rounded-lg" onPress={() => router.push("/users")}>
          <Text className="text-white text-center font-semibold text-lg">Users Management →</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-sm text-gray-400 mt-8 text-center">You can also use the tab bar at the bottom to navigate</Text>
    </View>
  );
}
