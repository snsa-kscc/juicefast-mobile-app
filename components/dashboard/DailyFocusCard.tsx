import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { FocusIcon } from "@/components/dashboard/icons/TrackerIcons";

interface DailyFocusCardProps {
  note: { content: string; timestamp: number } | null | undefined;
  isToday: boolean;
}

export function DailyFocusCard({ note, isToday }: DailyFocusCardProps) {
  // note is undefined while loading, null when no note exists
  const isLoading = note === undefined;
  const hasFocus = note && note.content.trim() !== "";

  const handlePress = () => {
    if (isToday) {
      router.push("/notes" as any);
    }
  };

  // Don't render anything while loading to prevent flash
  if (isLoading) {
    return null;
  }

  return (
    <View className="px-6 py-4">
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={isToday ? 0.7 : 1}
        disabled={!isToday}
        className="bg-white rounded-2xl p-5 flex-row items-center"
      >
        <View className="mr-4">
          <FocusIcon size={36} />
        </View>
        <View className="flex-1">
          {hasFocus ? (
            <View>
              <Text className="font-lufga-semibold text-xl mb-3">
                {isToday ? "Today's Focus" : "Daily Focus"}
              </Text>
              <Text
                className="font-lufga text-base text-gray-700 mb-4"
                numberOfLines={3}
              >
                {note?.content}
              </Text>
              {isToday && (
                <View className="bg-orange-50 px-4 py-2 rounded-full self-start">
                  <Text className="font-lufga-medium text-orange-600 text-sm">
                    Update Your Focus
                  </Text>
                </View>
              )}
            </View>
          ) : isToday ? (
            <View>
              <Text className="font-lufga-semibold text-xl mb-2">
                Start your day with purpose
              </Text>
              <Text className="font-lufga text-sm text-gray-600 mb-4">
                Write a message to inspire your best self today
              </Text>
              <View className="bg-orange-500 px-4 py-3 rounded-full self-start">
                <Text className="font-lufga-semibold text-white text-sm">
                  Set Focus
                </Text>
              </View>
            </View>
          ) : (
            <View>
              <Text className="font-lufga-semibold text-xl mb-2">
                No Focus Set
              </Text>
              <Text className="font-lufga text-sm text-gray-600">
                No daily focus was set for this day
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
