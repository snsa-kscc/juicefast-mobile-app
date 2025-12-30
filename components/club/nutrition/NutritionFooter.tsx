import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ViewToken,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { NutritionTips } from "./NutritionTips";
import { getImageWithFallback, DEFAULT_IMAGES } from "@/utils/imageUtils";
import { Recipe } from "@/utils/recipeData";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = (SCREEN_WIDTH - 48 - 32) / 3; // 48 = px-6 * 2, 32 = gap space

interface NutritionFooterProps {
  recipe?: Recipe;
  recipes: Array<{ name: string; image: string }>;
  onRecipePress?: (recipe: { name: string; image: string }) => void;
  title?: string;
}

export function NutritionFooter({
  recipe,
  recipes,
  onRecipePress,
  title = "More recipes for you",
}: NutritionFooterProps) {
  const flatListRef = useRef<FlatList>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate total pages (3 items per page)
  const itemsPerPage = 3;
  const totalPages = Math.ceil(recipes.length / itemsPerPage);

  // Stabilize viewabilityConfig with useRef to prevent re-renders
  const viewabilityConfigRef = useRef({
    itemVisiblePercentThreshold: 50,
  });

  // Handle scroll to update current page indicator
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const firstVisibleIndex = viewableItems[0].index ?? 0;
        const newPage = Math.floor(firstVisibleIndex / itemsPerPage);
        setCurrentPage(newPage);
      }
    }
  ).current;

  // Scroll to previous page
  const handlePrev = useCallback(() => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      const targetIndex = newPage * itemsPerPage;
      flatListRef.current?.scrollToIndex({
        index: targetIndex,
        animated: true,
      });
    }
  }, [currentPage]);

  // Scroll to next page
  const handleNext = useCallback(() => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      const targetIndex = newPage * itemsPerPage;
      flatListRef.current?.scrollToIndex({
        index: Math.min(targetIndex, recipes.length - 1),
        animated: true,
      });
    }
  }, [currentPage, totalPages, recipes.length]);

  // Render individual recipe item
  const renderRecipeItem = useCallback(
    ({
      item,
      index,
    }: {
      item: { name: string; image: string };
      index: number;
    }) => (
      <TouchableOpacity
        onPress={() => onRecipePress?.(item)}
        className="gap-2"
        style={{
          width: ITEM_WIDTH,
          marginRight: index < recipes.length - 1 ? 16 : 0,
        }}
      >
        <View className="w-full aspect-square rounded-3xl overflow-hidden bg-white shadow-sm">
          <Image
            source={getImageWithFallback(item.image, DEFAULT_IMAGES.recipe)}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text className="text-base font-inter-bold text-center text-black leading-tight">
          {item.name}
        </Text>
      </TouchableOpacity>
    ),
    [recipes.length, onRecipePress]
  );

  return (
    <View className="bg-jf-gray pb-8">
      {/* Tips Section */}
      <View>{recipe && <NutritionTips recipe={recipe} />}</View>

      {/* Navigation Slider Section */}
      <View>
        <View className="py-6 px-6">
          <Text className="text-center font-lufga-bold text-2xl">{title}</Text>
        </View>

        {/* Navigation Controls - Now ABOVE the slider */}
        <View className="relative h-16 px-6 mb-6">
          {/* Progress indicators centered */}
          <View className="flex-row items-center justify-center h-full">
            <View className="flex-row items-center justify-center h-12 px-8 rounded-full bg-white/80 shadow-lg">
              {Array.from({ length: totalPages }, (_, index) => (
                <View
                  key={index}
                  className={`w-3 h-3 rounded-full mx-1.5 ${
                    index === currentPage
                      ? "bg-amber-400"
                      : "border-2 border-amber-400"
                  }`}
                />
              ))}
            </View>
          </View>

          {/* Previous Button (Left) */}
          <View className="absolute top-0 left-6 h-full items-center justify-center">
            <TouchableOpacity
              onPress={handlePrev}
              disabled={currentPage === 0}
              className={`w-16 h-16 rounded-full bg-amber-400 shadow-lg items-center justify-center ${
                currentPage === 0 ? "opacity-40" : ""
              }`}
            >
              <ArrowLeft size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Next Button (Right) */}
          <View className="absolute top-0 right-6 h-full items-center justify-center">
            <TouchableOpacity
              onPress={handleNext}
              disabled={currentPage >= totalPages - 1}
              className={`w-16 h-16 rounded-full bg-amber-400 shadow-lg items-center justify-center ${
                currentPage >= totalPages - 1 ? "opacity-40" : ""
              }`}
            >
              <View className="rotate-180">
                <ArrowLeft size={28} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Related Recipes Slider - Now BELOW the controls */}
        <View>
          <FlatList
            ref={flatListRef}
            data={recipes}
            renderItem={renderRecipeItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfigRef.current}
            snapToInterval={ITEM_WIDTH + 16}
            decelerationRate="fast"
            getItemLayout={(_, index) => ({
              length: ITEM_WIDTH + 16,
              offset: (ITEM_WIDTH + 16) * index,
              index,
            })}
          />
        </View>
      </View>
    </View>
  );
}
