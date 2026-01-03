import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { ProcessedClubItem } from "@/types/club";
import { getImageWithFallback, DEFAULT_IMAGE } from "@/utils/imageUtils";
import { formatKebabToTitle } from "@/utils/helpers";

interface SubcategoryDetailProps {
  title: string;
  subtitle?: string;
  description?: string;
  items: ProcessedClubItem[];
  onItemPress?: (item: ProcessedClubItem, index: number) => void;
  featuredImageUrl?: string;
  headerComponent?: React.ReactNode;
  itemWrapper?: (
    item: ProcessedClubItem,
    index: number,
    children: React.ReactNode
  ) => React.ReactNode;
  shouldDisablePress?: (item: ProcessedClubItem, index: number) => boolean;
  isPremiumOnAnyPlatform?: boolean;
}

export function SubcategoryDetail({
  title,
  subtitle,
  description,
  items,
  onItemPress,
  featuredImageUrl,
  headerComponent,
  itemWrapper,
  shouldDisablePress,
  isPremiumOnAnyPlatform = false,
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

  const renderItem = ({
    item,
    index,
  }: {
    item: ProcessedClubItem;
    index: number;
  }) => {
    const isPremium = index >= 2;
    const showLock = isPremium && !isPremiumOnAnyPlatform;

    const isDisabled = shouldDisablePress?.(item, index) ?? false;

    const itemContent = (
      <TouchableOpacity
        className="flex-row items-center bg-jf-gray px-4 py-3 mb-2 rounded-lg border border-gray-200"
        onPress={() => !isDisabled && onItemPress?.(item, index)}
        disabled={isDisabled}
      >
        <View className="w-10 h-10 rounded-md overflow-hidden mr-3">
          <Image
            source={getImageWithFallback(item.imageUrl, DEFAULT_IMAGE)}
            className="w-full h-full"
            contentFit="cover"
          />
        </View>

        <View className="flex-1">
          {item.duration && (
            <View className="flex-row items-center mb-1">
              <Ionicons name="time-outline" size={12} color="#F59E0B" />
              <Text className="text-xs text-amber-500 ml-1 font-lufga-medium">
                {item.duration}
              </Text>
            </View>
          )}
          <Text
            className="text-sm font-lufga-medium text-gray-900 leading-[18px]"
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </View>

        {showLock ? (
          <View className="ml-2">
            <Ionicons name="lock-closed" size={20} color="#F59E0B" />
          </View>
        ) : item.type === "track" ? (
          <View className="ml-2">
            <Ionicons name="play-circle-outline" size={24} color="#D1D5DB" />
          </View>
        ) : null}
      </TouchableOpacity>
    );

    // If itemWrapper is provided, wrap the item
    if (itemWrapper) {
      return itemWrapper(item, index, itemContent);
    }

    return itemContent;
  };

  return (
    <ScrollView
      className="flex-1 bg-jf-gray"
      showsVerticalScrollIndicator={false}
    >
      {/* Custom Header Component */}
      {headerComponent}

      {/* Featured Image Header */}
      {headerImageUrl && title && (
        <View className="px-4 pt-4 mb-6">
          <View className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
            <Image
              source={
                typeof headerImageUrl === "string"
                  ? { uri: headerImageUrl }
                  : headerImageUrl
              }
              className="w-full h-64"
              contentFit="cover"
            />
          </View>
          <View className="px-2">
            <Text className="text-3xl font-lufga-bold text-gray-900 mb-2 leading-tight">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-lg font-lufga-medium text-gray-700 mb-3 leading-relaxed">
                {subtitle}
              </Text>
            )}
            {description && (
              <Text
                className="text-base font-lufga text-gray-600 leading-relaxed max-w-[320px]"
                numberOfLines={3}
              >
                {description}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Content Sections */}
      <View className="px-4 pt-2 pb-24">
        {Object.entries(groupedItems).map(([group, groupItems]) => (
          <View key={group} className="mb-6">
            <Text className="text-lg font-lufga-semibold text-amber-500 mb-2 p-4">
              {formatKebabToTitle(group)}
            </Text>
            <FlatList
              data={groupItems}
              renderItem={({ item, index }) => {
                // Calculate global index across all items
                const globalIndex = items.findIndex((i) => i.id === item.id);
                return renderItem({
                  item,
                  index: globalIndex,
                }) as React.ReactElement;
              }}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
