import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";
import { ArticleTips } from "./ArticleTips";
import { getImageWithFallback, DEFAULT_IMAGE } from "@/utils/imageUtils";
import { Article } from "@/utils/articleData";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = (SCREEN_WIDTH - 48 - 16) / 2; // 2 items per page: 48 = px-6 * 2, 16 = gap space

interface ArticleFooterProps {
  article?: Article;
  items: Array<{ name: string; image: string }>;
  onItemPress?: (item: { name: string; image: string }) => void;
  title?: string;
}

export function ArticleFooter({
  article,
  items,
  onItemPress,
  title = "More for you",
}: ArticleFooterProps) {
  const flatListRef = useRef<FlatList>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerWidth = useRef(SCREEN_WIDTH);

  // Determine colors based on article type
  const gradientColors =
    article?.articleType === "recipe"
      ? (["#FCD34D", "#F59E0B"] as const) // amber-300 to amber-500
      : (["#DEFFD1", "#B4EDF0"] as const); // beauty gradient colors

  const solidColor =
    article?.articleType === "recipe" ? "bg-amber-400" : "bg-[#B4EDF0]";
  const borderColor =
    article?.articleType === "recipe" ? "border-amber-400" : "border-[#B4EDF0]";

  // Calculate total pages (2 items per page)
  const itemsPerPage = 2;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Handle scroll to update current page and chevron state
  const handleScroll = useCallback(
    (event: any) => {
      const contentOffset = event.nativeEvent.contentOffset;

      // Calculate which item is at the leading edge of the screen
      // Use Math.ceil to ensure we get the correct item at the end
      const leadingItemIndex = Math.ceil(contentOffset.x / (ITEM_WIDTH + 16));

      // Calculate page based on the leading item index
      let newPage = Math.floor(leadingItemIndex / itemsPerPage);

      // Special case: if we're at the end (can't scroll right), force to last page
      if (!canScrollRight) {
        newPage = totalPages - 1;
      }

      // Ensure we don't go beyond bounds
      newPage = Math.min(newPage, totalPages - 1);
      newPage = Math.max(newPage, 0);

      setCurrentPage(newPage);

      // Check if we can scroll right
      const contentWidth = items.length * (ITEM_WIDTH + 16);
      const remainingScroll =
        contentWidth - (contentOffset.x + containerWidth.current);
      const newCanScrollRight = remainingScroll > 10; // 10px threshold

      // Update state only if it changed to avoid re-renders
      if (newCanScrollRight !== canScrollRight) {
        setCanScrollRight(newCanScrollRight);
      }
    },
    [itemsPerPage, totalPages, items.length, canScrollRight]
  );

  // Scroll to previous page
  const handlePrev = useCallback(() => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      const targetOffset = newPage * itemsPerPage * (ITEM_WIDTH + 16);
      flatListRef.current?.scrollToOffset({
        offset: targetOffset,
        animated: true,
      });
    }
  }, [currentPage]);

  // Scroll to next page
  const handleNext = useCallback(() => {
    if (canScrollRight) {
      const newPage = currentPage + 1;
      const targetOffset = newPage * itemsPerPage * (ITEM_WIDTH + 16);
      // Ensure we don't scroll past the end
      const maxOffset = Math.max(
        0,
        (items.length - itemsPerPage) * (ITEM_WIDTH + 16)
      );
      flatListRef.current?.scrollToOffset({
        offset: Math.min(targetOffset, maxOffset),
        animated: true,
      });
    }
  }, [currentPage, canScrollRight, items.length]);

  // Render individual item
  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: { name: string; image: string };
      index: number;
    }) => (
      <TouchableOpacity
        onPress={() => onItemPress?.(item)}
        className="gap-2"
        style={{
          width: ITEM_WIDTH,
          marginRight: index < items.length - 1 ? 16 : 0,
        }}
      >
        <View className="w-full aspect-square rounded-3xl overflow-hidden bg-white shadow-sm">
          <Image
            source={getImageWithFallback(item.image, DEFAULT_IMAGE)}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text className="text-base font-lufga-bold text-center text-black leading-tight">
          {item.name}
        </Text>
      </TouchableOpacity>
    ),
    [items.length, onItemPress]
  );

  return (
    <View className="bg-jf-gray pb-8">
      {/* Tips Section */}
      <View>{article && <ArticleTips article={article} />}</View>

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
                      ? solidColor
                      : `border-2 ${borderColor}`
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
              className={`w-16 h-16 rounded-full shadow-lg items-center justify-center ${
                currentPage === 0 ? "opacity-40" : ""
              }`}
            >
              {article?.articleType === "recipe" ? (
                <View
                  className={`w-14 h-14 rounded-full ${solidColor} items-center justify-center`}
                >
                  <ArrowLeft size={28} color="#fff" />
                </View>
              ) : (
                <LinearGradient
                  colors={gradientColors}
                  className="rounded-full flex-shrink-0"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 300,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowLeft size={28} color="#000" />
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>

          {/* Next Button (Right) */}
          <View className="absolute top-0 right-6 h-full items-center justify-center">
            <TouchableOpacity
              onPress={handleNext}
              disabled={!canScrollRight}
              className={`w-16 h-16 rounded-full shadow-lg items-center justify-center ${
                !canScrollRight ? "opacity-40" : ""
              }`}
            >
              {article?.articleType === "recipe" ? (
                <View
                  className={`w-14 h-14 rounded-full ${solidColor} items-center justify-center`}
                >
                  <View className="rotate-180">
                    <ArrowLeft size={28} color="#fff" />
                  </View>
                </View>
              ) : (
                <LinearGradient
                  colors={gradientColors}
                  className="rounded-full flex-shrink-0"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 300,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View className="rotate-180">
                    <ArrowLeft size={28} color="#000" />
                  </View>
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Related Recipes Slider - Now BELOW the controls */}
        <View>
          <FlatList
            ref={flatListRef}
            data={items}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={itemsPerPage * (ITEM_WIDTH + 16)}
            decelerationRate="fast"
            getItemLayout={(_, index) => ({
              length: ITEM_WIDTH + 16,
              offset: (ITEM_WIDTH + 16) * index,
              index,
            })}
            onScrollToIndexFailed={(info) => {
              // Fallback if scrollToIndex fails
              const offset = info.index * (ITEM_WIDTH + 16);
              flatListRef.current?.scrollToOffset({ offset, animated: false });
            }}
          />
        </View>
      </View>
    </View>
  );
}
