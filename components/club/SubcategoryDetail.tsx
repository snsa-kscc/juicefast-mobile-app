import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProcessedClubItem } from "@/types/club";

interface SubcategoryDetailProps {
  title: string;
  subtitle?: string;
  description?: string;
  items: ProcessedClubItem[];
  onBack?: () => void;
  onItemPress?: (item: ProcessedClubItem) => void;
  featuredImageUrl?: string;
}

export function SubcategoryDetail({
  title,
  subtitle,
  description,
  items,
  onBack,
  onItemPress,
  featuredImageUrl,
}: SubcategoryDetailProps) {
  // Group items by their subcategory for sections
  const groupedItems = items.reduce<Record<string, ProcessedClubItem[]>>(
    (acc, item) => {
      const group = item.subcategory || "Other";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    },
    {}
  );

  const headerImageUrl =
    featuredImageUrl || (items.length > 0 ? items[0].imageUrl : undefined);

  const renderItem = ({ item }: { item: ProcessedClubItem }) => (
    <TouchableOpacity
      className="flex-row items-center bg-white px-4 py-3 mb-2 rounded-lg border border-gray-200"
      onPress={() => onItemPress?.(item)}
    >
      <View className="w-10 h-10 rounded-md overflow-hidden mr-3">
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-full"
          defaultSource={require("@/assets/images/icon.png")}
          resizeMode="cover"
        />
      </View>

      <View className="flex-1">
        {item.duration && (
          <View className="flex-row items-center mb-1">
            <Ionicons name="time-outline" size={12} color="#F59E0B" />
            <Text className="text-xs text-amber-500 ml-1 font-lufga-medium">{item.duration}</Text>
          </View>
        )}
        <Text className="text-sm font-lufga-medium text-gray-900 leading-[18px]" numberOfLines={2}>
          {item.title}
        </Text>
      </View>

      {item.type === "track" && (
        <View className="ml-2">
          <Ionicons name="play-circle-outline" size={24} color="#D1D5DB" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Featured Image Header */}
      {headerImageUrl && (
        <View className="relative h-56 mb-4">
          <Image source={{ uri: headerImageUrl }} className="w-full h-full" />
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 justify-between p-6">
            <TouchableOpacity onPress={onBack} className="flex-row items-center self-start mt-4">
              <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <View className="self-start">
              <Text className="text-2xl font-lufga-bold text-white mb-1">{title}</Text>
              {subtitle && (
                <Text className="text-base font-lufga-medium text-white mb-2">{subtitle}</Text>
              )}
              {description && (
                <Text className="text-sm font-lufga-regular text-white leading-5 max-w-[280px]" numberOfLines={3}>
                  {description}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Content Sections */}
      <View className="px-4 pt-2 pb-24">
        {Object.entries(groupedItems).map(([group, groupItems]) => (
          <View key={group} className="mb-6">
            <Text className="text-base font-lufga-semibold text-amber-500 mb-2 px-4">{group}</Text>
            <FlatList
              data={groupItems}
              renderItem={renderItem}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

