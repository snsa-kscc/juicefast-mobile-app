import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  getOrderedSubcategoriesForCategory,
  getItemsBySubcategory,
  formatSubcategoryTitle,
} from "@/utils/clubData";

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

        // Get item count for this subcategory
        const items = getItemsBySubcategory(subcategory.name.toLowerCase());
        const count = items.length;

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
                resizeMode="cover"
              />
              {/* Overlay text for large images */}
              {isFullWidth && (
                <View className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/80 to-transparent">
                  <Text className="text-black text-lg font-lufga-bold mb-1">
                    {subcategory.name}
                  </Text>
                  {count > 0 && (
                    <Text className="text-black/80 text-sm font-lufga">
                      {count} {count === 1 ? "item" : "items"}
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
                    {count} {count === 1 ? "item" : "items"}
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
