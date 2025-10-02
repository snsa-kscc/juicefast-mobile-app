import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { ProcessedClubItem } from "@/types/club";
import { ContentCard } from "./ContentCard";

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
    <View style={[styles.itemContainer, { width: `${100 / columns - 2}%` }]}>
      <ContentCard item={item} onPress={() => onItemPress?.(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}

      <FlatList
        data={items}
        renderItem={renderItem}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? styles.row : undefined}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  headerContainer: {
    marginBottom: 16,
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
  },
  row: {
    justifyContent: "space-between",
  },
  itemContainer: {
    marginHorizontal: "1%",
  },
});
