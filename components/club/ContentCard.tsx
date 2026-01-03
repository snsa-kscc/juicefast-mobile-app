import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { ProcessedClubItem } from "@/types/club";
import { getImageWithFallback, DEFAULT_IMAGE } from "@/utils/imageUtils";
import { formatKebabToTitle } from "@/utils/helpers";

interface ContentCardProps {
  item: ProcessedClubItem;
  onPress?: () => void;
  variant?: "large" | "medium" | "small";
}

export function ContentCard({
  item,
  onPress,
  variant = "medium",
}: ContentCardProps) {
  const getAspectRatio = () => {
    switch (variant) {
      case "large":
        return 1.5;
      case "small":
        return 1.5;
      default:
        return 1;
    }
  };

  return (
    <TouchableOpacity className="flex-1 mb-4" onPress={onPress}>
      <View
        className="rounded-xl overflow-hidden bg-gray-100 relative"
        style={{ aspectRatio: getAspectRatio() }}
      >
        <Image
          source={getImageWithFallback(item.imageUrl, DEFAULT_IMAGE)}
          className="w-full h-full"
          contentFit="cover"
        />
        {/* Subcategory overlay in upper left */}
        <View className="absolute top-2 left-2 bg-white/90 px-3 py-1.5 rounded-full">
          <Text className="text-xs font-lufga text-black text-center">
            {formatKebabToTitle(item.subcategory)}
          </Text>
        </View>
      </View>

      <View className="mt-2">
        <Text
          className="text-sm font-lufga-semibold text-gray-900 leading-[18px]"
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {item.duration && (
          <View className="flex-row items-center mt-1">
            <Ionicons name="time-outline" size={12} color="#F59E0B" />
            <Text className="text-xs font-lufga text-amber-500 ml-1">
              {item.duration}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
