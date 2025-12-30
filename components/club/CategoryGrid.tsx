import React from "react";
import { View, TouchableOpacity, ScrollView, Image, Text } from "react-native";
import { getCategoryCount, isArticleCategory } from "@/utils/clubData";

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
        const count = getCategoryCount(category.categoryId);
        const countLabel = isArticleCategory(category.categoryId)
          ? `${count} ${count === 1 ? "article" : "articles"}`
          : `${count} ${count === 1 ? "item" : "items"}`;

        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => onCategoryPress(category.categoryId)}
            className="rounded-2xl overflow-hidden"
            style={{
              width: 120,
              height: 120,
            }}
          >
            <View className="relative">
              <Image
                source={category.image}
                className="max-w-full"
                style={{ width: 120, height: 120, maxWidth: "100%" }}
                resizeMode="cover"
              />
              <View className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <Text className="text-white text-xs font-lufga text-center">
                  {countLabel}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
