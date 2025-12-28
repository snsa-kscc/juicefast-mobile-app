import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  StarIcon,
  GlassWaterIcon,
  SuccessIcon,
} from "@/components/icons/ChallengeIcons";

export default function ChallengeMessagesPage() {
  const router = useRouter();

  // Fetch challenge messages
  const messages = useQuery(api.challengeNotifications.getChallengeMessages);

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return `${weeks}w`;
  };

  const getIcon = (index: number) => {
    const i = index % 3;
    if (i === 0) return <StarIcon width={42} height={42} />;
    if (i === 1) return <GlassWaterIcon width={42} height={42} />;
    return <SuccessIcon width={42} height={42} />;
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
            {messages.map((message, index) => (
              <View
                key={message._id}
                className="bg-white rounded-2xl p-5 mb-3 shadow-sm flex-row items-start gap-4"
              >
                <View className="mt-1">{getIcon(index)}</View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className="text-lg font-lufga text-[#750046] flex-1 mr-2 leading-5">
                      {message.title}
                    </Text>
                    <Text className="text-xs text-slate-400 font-lufga mt-1">
                      {formatRelativeTime(message.sentAt)}
                    </Text>
                  </View>
                  <Text className="text-sm text-slate-600 font-lufga leading-5">
                    {message.message}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center mt-8">
            <Text className="text-lg font-lufga text-gray-600 mt-4">
              No challenge messages sent yet
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
