import { View, Text, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

interface HelloResponse {
  message: string;
  timestamp: string;
}

export default function HelloPage() {
  const { data, isLoading, error, refetch } = useQuery<HelloResponse>({
    queryKey: ['hello'],
    queryFn: async () => {
      const response = await fetch('/api/hello');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  return (
    <View className="flex-1 bg-white p-6 justify-center items-center">
      <Text className="text-2xl font-bold mb-8 text-center">
        TanStack Query Demo
      </Text>

      {isLoading && (
        <View className="mb-6">
          <Text className="text-lg text-blue-600 text-center">
            Loading... 🔄
          </Text>
          <Text className="text-sm text-gray-500 text-center mt-2">
            Fetching data from API (2s delay)
          </Text>
        </View>
      )}

      {error && (
        <View className="mb-6 p-4 bg-red-100 rounded-lg">
          <Text className="text-red-600 text-center">
            Error: {(error as Error).message}
          </Text>
        </View>
      )}

      {data && !isLoading && (
        <View className="mb-6 p-4 bg-green-100 rounded-lg w-full">
          <Text className="text-green-800 font-semibold mb-2">
            ✅ Success!
          </Text>
          <Text className="text-gray-700 mb-1">
            Message: {data.message}
          </Text>
          <Text className="text-gray-500 text-sm">
            Timestamp: {new Date(data.timestamp).toLocaleString()}
          </Text>
        </View>
      )}

      <View className="space-y-4 w-full">
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-blue-500 p-4 rounded-lg"
          disabled={isLoading}
        >
          <Text className="text-white text-center font-semibold">
            {isLoading ? 'Fetching...' : 'Refetch Data'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-500 p-4 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">
            Go Back
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-8 p-4 bg-gray-100 rounded-lg">
        <Text className="text-sm text-gray-600 text-center">
          This demo shows TanStack Query's isLoading state with a 2-second API delay
        </Text>
      </View>
    </View>
  );
}
