import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import {
  getOrderedSubcategoriesForCategory,
  getItemsBySubcategory,
  isArticleCategory,
} from "@/utils/clubData";
import { getRecipesBySubcategory } from "@/utils/recipeData";
import { getBeautyItemsBySubcategory } from "@/utils/beautyData";

interface SubcategoryGridProps {
  category: string;
  onSubcategoryClick: (subcategoryId: string) => void;
}

export function SubcategoryGrid({
  category,
  onSubcategoryClick,
}: SubcategoryGridProps) {
  const subcategories = getOrderedSubcategoriesForCategory(category);
  return (
    <View className="flex-row flex-wrap justify-between mb-8">
      {subcategories.map((subcategory, index) => {
        // Calculate the position within the current group (ignoring previous full-width items)
        let groupPosition = index + 1;
        for (let i = 0; i < index; i++) {
          if ((i + 1) % 5 === 0) {
            groupPosition--;
          }
        }

        // Full width if it's the 5th item in original position
        const isFullWidth =
          (index + 1) % 5 === 0 ||
          // Or if it's the last item and the current group has odd number of items
          (index === subcategories.length - 1 && groupPosition % 2 === 1);

        // Get item count for this subcategory (using id which is always kebab-case)
        const count = isArticleCategory(category)
          ? (() => {
              // Try recipes first (for nutrition)
              const recipes = getRecipesBySubcategory(subcategory.id);
              if (recipes.length > 0) return recipes.length;
              // Fall back to beauty items
              return getBeautyItemsBySubcategory(subcategory.id).length;
            })()
          : getItemsBySubcategory(subcategory.id).length;

        // Determine label text based on category type
        const countLabel = isArticleCategory(category)
          ? `${count} ${count === 1 ? "article" : "articles"}`
          : `${count} ${count === 1 ? "item" : "items"}`;

        return (
          <TouchableOpacity
            key={subcategory.id}
            className={`${isFullWidth ? "w-full" : "w-[48%]"} mb-4`}
            onPress={() => onSubcategoryClick(subcategory.id)}
          >
            <View
              className={`${isFullWidth ? "w-full" : ""} ${isFullWidth ? "h-48" : "aspect-square"} rounded-xl overflow-hidden mb-2 relative`}
            >
              <Image
                source={subcategory.image}
                className="w-full h-full"
                contentFit="cover"
              />
              {/* Overlay text for large images */}
              {isFullWidth && (
                <View className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/80 to-transparent">
                  <Text className="text-black text-lg font-lufga-bold mb-1">
                    {subcategory.name}
                  </Text>
                  {count > 0 && (
                    <Text className="text-black/80 text-sm font-lufga">
                      {countLabel}
                    </Text>
                  )}
                </View>
              )}
            </View>
            {/* Text below small images */}
            {!isFullWidth && (
              <View className="mt-2">
                <Text className="text-base font-lufga-semibold text-gray-900">
                  {subcategory.name}
                </Text>
                {count > 0 && (
                  <Text className="text-xs font-lufga text-gray-500 mt-0.5">
                    {countLabel}
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
