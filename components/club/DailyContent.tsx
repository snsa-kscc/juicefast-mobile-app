import { useMemo } from 'react';
import { View, Text, FlatList } from "react-native";
import { ProcessedClubItem } from "@/types/club";
import { ContentCard } from "@/components/club/ContentCard";

interface DailyContentProps {
  items: ProcessedClubItem[];
  onItemPress?: (item: ProcessedClubItem) => void;
}

export function DailyContent({ items, onItemPress }: DailyContentProps) {
  const randomItems = useMemo(() => {
    // Group items by subcategory
    const itemsBySubcategory = items.reduce(
      (acc, item) => {
        if (!acc[item.subcategory]) {
          acc[item.subcategory] = [];
        }
        acc[item.subcategory].push(item);
        return acc;
      },
      {} as Record<string, ProcessedClubItem[]>
    );

    // Get all subcategories
    const subcategories = Object.keys(itemsBySubcategory);

    // Randomly shuffle subcategories
    const shuffledSubcategories = [...subcategories].sort(
      () => Math.random() - 0.5
    );

    // Select up to 7 different subcategories
    const selectedSubcategories = shuffledSubcategories.slice(0, 7);

    // Randomly select one item from each selected subcategory
    const selectedItems = selectedSubcategories.map((subcategory) => {
      const subcategoryItems = itemsBySubcategory[subcategory];
      const randomIndex = Math.floor(Math.random() * subcategoryItems.length);
      return subcategoryItems[randomIndex];
    });

    return selectedItems;
  }, [items]);

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
      <Text className="text-xl font-lufga-bold text-gray-900 mb-1 text-center">
        HAVE A TASTE
      </Text>
      <Text className="text-sm font-lufga text-gray-500 mb-4 text-center">
        of free daily content
      </Text>

      <FlatList
        data={randomItems}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="pr-4"
      />
    </View>
  );
}
