import React from "react";
import { View, Text, FlatList } from "react-native";
import { ProcessedClubItem } from "@/types/club";
import { ContentCard } from "@/components/club/ContentCard";

interface ContentGridProps {
  items: ProcessedClubItem[];
  title?: string;
  subtitle?: string;
  columns?: number;
  onItemPress?: (item: ProcessedClubItem) => void;
}

export function ContentGrid({
  items,
  title,
  subtitle,
  columns = 2,
  onItemPress,
}: ContentGridProps) {
  const renderItem = ({ item }: { item: ProcessedClubItem }) => (
    <View className="mx-[0.5%]" style={{ width: `${100 / columns - 2}%` }}>
      <ContentCard item={item} onPress={() => onItemPress?.(item)} />
    </View>
  );

  return (
    <View className="mb-8">
      {title && (
        <View className="mb-4">
          <Text className="text-xl font-lufga-bold text-gray-900 mb-1">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm font-lufga text-gray-500">{subtitle}</Text>
          )}
        </View>
      )}

      <FlatList
        data={items}
        renderItem={renderItem}
        numColumns={columns}
        columnWrapperStyle={
          columns > 1 ? { justifyContent: "space-between" } : undefined
        }
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}
