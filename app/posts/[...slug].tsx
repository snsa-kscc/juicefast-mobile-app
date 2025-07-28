import { Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

// Catch-all route: /posts/2024/january/my-post, /posts/tech/react, etc.
export default function PostPage() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  
  // slug will be an array: ["2024", "january", "my-post"]
  const slugArray = Array.isArray(slug) ? slug : [slug];
  const path = slugArray.join('/');

  return (
    <View className="flex-1 items-center justify-center bg-yellow-50 px-6">
      <Text className="text-3xl font-bold text-yellow-600 mb-4">
        Post Page
      </Text>
      
      <Text className="text-xl text-gray-700 mb-4">
        Path: /{path}
      </Text>
      
      <Text className="text-base text-gray-600 text-center mb-8">
        This is a catch-all route, just like Next.js [...slug].js!
        It matches any number of path segments.
      </Text>
      
      <View className="bg-white p-4 rounded-lg mb-8">
        <Text className="font-semibold mb-2">Slug segments:</Text>
        {slugArray.map((segment, index) => (
          <Text key={index} className="text-gray-600">
            {index}: {segment}
          </Text>
        ))}
      </View>
      
      <TouchableOpacity 
        className="bg-yellow-500 py-4 px-8 rounded-lg"
        onPress={() => router.back()}
      >
        <Text className="text-white font-semibold text-lg">← Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
