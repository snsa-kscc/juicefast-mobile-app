import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProcessedClubItem } from "@/types/club";
import { getImageWithFallback, DEFAULT_IMAGES } from "@/utils/imageUtils";
import { formatSubcategoryTitle } from "@/utils/clubData";

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
          source={getImageWithFallback(item.imageUrl, DEFAULT_IMAGES.icon)}
          className="max-w-full"
          style={{ width: "100%", height: "100%", maxWidth: "100%" }}
          resizeMode="cover"
        />
        {/* Subcategory overlay in upper left */}
        <View className="absolute top-2 left-2 bg-white/90 px-3 py-1.5 rounded-full">
          <Text className="text-xs font-lufga text-black text-center">
            {formatSubcategoryTitle(item.subcategory)}
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
