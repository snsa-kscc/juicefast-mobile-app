import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { ProcessedClubItem } from "@/types/club";
import { ContentCard } from "./ContentCard";

interface DailyContentProps {
  items: ProcessedClubItem[];
  onItemPress?: (item: ProcessedClubItem) => void;
}

export function DailyContent({ items, onItemPress }: DailyContentProps) {
  const renderItem = ({ item }: { item: ProcessedClubItem }) => (
    <View style={styles.itemContainer}>
      <ContentCard
        item={item}
        onPress={() => onItemPress?.(item)}
        variant="small"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Recommendations</Text>
      <Text style={styles.subtitle}>
        Curated content for your wellness journey
      </Text>

      <FlatList
        data={items}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  listContainer: {
    paddingRight: 16,
  },
  itemContainer: {
    width: 160,
    marginRight: 12,
  },
});
