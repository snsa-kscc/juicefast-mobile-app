import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Bell, ChevronLeft } from "lucide-react-native";

export default function ChallengeMessagesPage() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="relative px-4 pt-12 pb-3">
        <TouchableOpacity
          className="absolute left-4 top-6 w-16 h-16 bg-[#F8F8F8] rounded-full items-center justify-center"
          onPress={() => router.back()}
        >
          <ChevronLeft size={28} color="#750046" />
        </TouchableOpacity>
        <View className="items-center justify-center">
          <Text className="text-2xl font-lufga-medium text-[#750046]">
            Inbox
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-jf-gray"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-1 items-center justify-center mt-8">
          <Text className="text-lg font-lufga text-gray-600">
            No messages yet
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
