import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ContentGrid } from "@/components/club/ContentGrid";
import {
  getItemsByCategory,
  getSubcategoryData,
  WELLNESS_CATEGORIES,
} from "@/utils/clubData";
import { ProcessedClubItem } from "@/types/club";

export default function CategoryPage() {
  const { category } = useLocalSearchParams<{ category: string }>();

  const categoryData = WELLNESS_CATEGORIES.find((c) => c.id === category);
  const subcategories = getSubcategoryData(category || "");
  const items = getItemsByCategory(category || "");

  if (!categoryData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-2xl font-lufga-bold text-gray-900 mb-4">Category Not Found</Text>
          <Text className="text-base font-lufga-regular text-gray-500 text-center mb-6">
            The wellness category you're looking for doesn't exist.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center bg-gray-100 px-4 py-2 rounded-lg"
          >
            <Ionicons name="arrow-back" size={16} color="#374151" />
            <Text className="ml-2 text-base font-lufga-medium text-gray-700">Back to Club</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleItemClick = (item: ProcessedClubItem) => {
    router.push({
      pathname: "/club/content/[id]",
      params: { id: item.id },
    });
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    router.push({
      pathname: "/club/categories/[category]/[subcategory]",
      params: {
        category: category || "",
        subcategory: subcategoryId,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2"
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-lufga-semibold text-gray-900">{categoryData.name}</Text>
        <View className="w-10" />
      </View>

      {/* Subcategories Grid */}
      <View className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-lufga-bold text-gray-900 mb-4">Explore {categoryData.name}</Text>

        <View className="flex-row flex-wrap justify-between mb-8">
          {subcategories.map((subcategory) => (
            <TouchableOpacity
              key={subcategory.id}
              className="w-[48%] mb-4"
              onPress={() => handleSubcategoryClick(subcategory.id)}
            >
              <View className="aspect-square bg-gray-100 rounded-xl items-center justify-center mb-2">
                <Ionicons name="musical-notes" size={40} color="#6B7280" />
              </View>
              <View className="mt-2">
                <Text className="text-base font-lufga-semibold text-gray-900">{subcategory.name}</Text>
                {subcategory.count && (
                  <Text className="text-xs font-lufga-regular text-gray-500 mt-1">
                    {subcategory.count} {subcategory.countLabel || "items"}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* All Items in Category */}
        {items.length > 0 && (
          <ContentGrid
            title="All Content"
            items={items}
            columns={2}
            onItemPress={handleItemClick}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

