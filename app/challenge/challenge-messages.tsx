import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Bell, ChevronLeft } from "lucide-react-native";

export default function ChallengeMessagesPage() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 pt-12 pb-3">
        <TouchableOpacity
          className="w-16 h-16 bg-[#F8F8F8] rounded-full items-center justify-center"
          onPress={() => router.back()}
        >
          <ChevronLeft size={28} color="#750046" />
        </TouchableOpacity>
        <Text className="text-2xl font-lufga-medium text-[#750046]">Inbox</Text>
        <TouchableOpacity className="w-20 h-16 bg-[#F8F8F8] rounded-full items-center justify-center">
          <Bell size={28} color="#750046" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 bg-jf-gray"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text>Challenge Messages</Text>
      </ScrollView>
    </View>
  );
}
