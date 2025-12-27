import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Bell, ChevronLeft } from "lucide-react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ChallengeMessagesPage() {
  const router = useRouter();

  // Fetch challenge messages
  const messages = useQuery(api.challengeNotifications.getChallengeMessages);

  const formatDate = (timestamp: number) => {
    return (
      new Date(timestamp).toLocaleDateString() +
      " " +
      new Date(timestamp).toLocaleTimeString()
    );
  };

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
        {messages === undefined ? (
          <View className="flex-1 items-center justify-center mt-8">
            <ActivityIndicator size="large" color="#750046" />
          </View>
        ) : messages && messages.length > 0 ? (
          <View className="px-4 pt-4">
            {messages.map((message) => (
              <View
                key={message._id}
                className="bg-white rounded-lg p-4 mb-3 shadow-sm"
              >
                <View className="mb-2">
                  <Text className="text-lg font-lufga-bold text-gray-900 mb-1">
                    {message.title}
                  </Text>
                  <Text className="text-sm text-gray-500 mb-2">
                    From: {message.senderName}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    {formatDate(message.sentAt)}
                  </Text>
                </View>
                <Text className="text-gray-700 mb-3">{message.message}</Text>
                <View className="flex-row gap-4 text-xs text-gray-500">
                  <Text>Total: {message.totalRecipients}</Text>
                  <Text className="text-green-600">
                    Sent: {message.successCount}
                  </Text>
                  {message.failureCount > 0 && (
                    <Text className="text-red-600">
                      Failed: {message.failureCount}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center mt-8">
            <Bell size={48} color="#9CA3AF" />
            <Text className="text-lg font-lufga text-gray-600 mt-4">
              No challenge messages sent yet
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
