import React from "react";
import { View, Text, FlatList } from "react-native";
import { ProcessedClubItem } from "@/types/club";
import { ContentCard } from "./ContentCard";

interface DailyContentProps {
  items: ProcessedClubItem[];
  onItemPress?: (item: ProcessedClubItem) => void;
}

export function DailyContent({ items, onItemPress }: DailyContentProps) {
  const renderItem = ({ item }: { item: ProcessedClubItem }) => (
    <View className="w-40 mr-3">
      <ContentCard
        item={item}
        onPress={() => onItemPress?.(item)}
        variant="small"
      />
    </View>
  );

  return (
    <View className="mb-8">
      <Text className="text-xl font-lufga-bold text-gray-900 mb-1">Daily Recommendations</Text>
      <Text className="text-sm font-lufga-regular text-gray-500 mb-4">
        Curated content for your wellness journey
      </Text>

      <FlatList
        data={items}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="pr-4"
      />
    </View>
  );
}

