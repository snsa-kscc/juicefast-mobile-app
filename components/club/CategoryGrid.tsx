import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";

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
      {categories.map((category) => (
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
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
