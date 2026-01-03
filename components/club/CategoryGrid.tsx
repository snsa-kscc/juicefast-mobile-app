import React from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";

interface CategoryItem {
  id: string;
  name: string;
  image: any;
  categoryId: string;
}

interface CategoryGridProps {
  categories: CategoryItem[];
  onCategoryPress: (categoryId: string) => void;
}

export function CategoryGrid({
  categories,
  onCategoryPress,
}: CategoryGridProps) {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      className="flex-1 mb-6"
      contentContainerStyle={{ paddingLeft: 16, paddingRight: 16, gap: 16 }}
    >
      {categories.map((category) => {
        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => onCategoryPress(category.categoryId)}
            className="rounded-2xl overflow-hidden"
          >
            <Image
              source={category.image}
              className="h-32 w-32"
              contentFit="cover"
            />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
