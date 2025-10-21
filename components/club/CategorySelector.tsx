import React from "react";
import { Text, TouchableOpacity, ScrollView } from "react-native";
import { WellnessCategory } from "@/types/club";

interface CategorySelectorProps {
  categories: WellnessCategory[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategorySelector({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4 py-2"
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onSelectCategory(category.id)}
          className={`px-4 py-2 rounded-full mr-2 border ${
            selectedCategory === category.id
              ? "bg-white border-gray-200"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <Text
            className={`text-sm font-lufga-medium ${
              selectedCategory === category.id ? "text-black" : "text-gray-500"
            }`}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
