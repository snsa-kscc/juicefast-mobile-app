import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// Using View with backgroundColor instead of LinearGradient
import { AnimatedScreen } from "@/components/AnimatedScreen";
import { PaywallGuard } from "@/components/paywall/PaywallGuard";
import { CategorySelector } from "@/components/club/CategorySelector";
import { ContentGrid } from "@/components/club/ContentGrid";
import { DailyContent } from "@/components/club/DailyContent";
import { PremiumSubscriptionDrawer } from "@/components/club/PremiumSubscriptionDrawer";
import {
  WELLNESS_CATEGORIES,
  getTrendingContent,
  getDailyContent,
  getItemsByCategory,
  getSubcategoryData,
  getSubcategoryImage,
} from "@/utils/clubData";
import { ProcessedClubItem } from "@/types/club";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JFClub() {
  const [activeTab, setActiveTab] = useState<string>("trending");
  const [selectedCategory, setSelectedCategory] = useState<string>("trending");

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedCategory(tab === "trending" ? "trending" : selectedCategory);
  };

  // Handle item click
  const handleItemClick = (item: ProcessedClubItem) => {
    // Navigate to content detail page
    router.push(`/club/content/${item.id}`);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);

    // If we're in discover tab and selecting trending, switch to trending tab
    if (activeTab === "discover" && category === "trending") {
      setActiveTab("trending");
    }
    // If we're in trending tab and selecting non-trending, switch to discover tab
    else if (activeTab === "trending" && category !== "trending") {
      setActiveTab("discover");
    }
  };

  // Handle category click for navigation
  const handleCategoryClick = (category: string) => {
    if (category === "trending") {
      setActiveTab("trending");
      setSelectedCategory("trending");
    } else {
      // Navigate to category page for Mind, Workouts, Nutrition, Beauty
      if (["mind", "workouts", "nutrition", "beauty"].includes(category)) {
        router.push(`/club/categories/${category.toLowerCase()}`);
      } else {
        setActiveTab("discover");
        setSelectedCategory(category);
      }
    }
  };

  // Determine which content to show based on selected category
  const getContentForCategory = () => {
    switch (selectedCategory) {
      case "trending":
        return getTrendingContent();
      default:
        return getItemsByCategory(selectedCategory);
    }
  };

  // Get subcategories for the selected category
  const getSubcategoriesForCategory = () => {
    if (selectedCategory === "trending") return [];
    return getSubcategoryData(selectedCategory);
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    router.push(`/club/categories/${selectedCategory}/${subcategoryId}`);
  };

  return (
    <PaywallGuard>
      <AnimatedScreen>
        <SafeAreaView className="flex-1 bg-[#FCFBF8]">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="bg-[#E0F7FA] pb-8">
              <View className="px-4 pt-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-xl font-bold text-gray-900">JF Club</Text>
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => router.push("/profile")}
                  >
                    <Ionicons
                      name="settings-outline"
                      size={20}
                      color="#374151"
                    />
                  </TouchableOpacity>
                </View>
                <Text className="text-sm text-gray-500 leading-5">
                  Workouts, recipes and relevant articles come to you every day,
                  and are all based on your current state, logged results and
                  overall wellness goals.
                </Text>
              </View>
            </View>

            {/* Tab Navigation */}
            <View className="border-b border-gray-200">
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => handleTabChange("trending")}
                  className={`px-6 py-3 ${
                    activeTab === "trending" ? "border-b-2 border-gray-900" : ""
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      activeTab === "trending" ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    Trending
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleTabChange("discover")}
                  className={`px-6 py-3 ${
                    activeTab === "discover" ? "border-b-2 border-gray-900" : ""
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      activeTab === "discover" ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    Discover
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Category Selector */}
            <CategorySelector
              categories={WELLNESS_CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />

            {/* Content Section */}
            <View className="px-4">
              <Text className="text-2xl font-bold text-gray-900 mb-4 mt-4">
                {selectedCategory === "trending"
                  ? "Trending"
                  : WELLNESS_CATEGORIES.find((c) => c.id === selectedCategory)
                      ?.name}
              </Text>

              {/* Content Grid or Subcategories */}
              {selectedCategory === "trending" ? (
                <ContentGrid
                  items={getContentForCategory()}
                  columns={2}
                  onItemPress={handleItemClick}
                />
              ) : (
                <View className="flex-row flex-wrap justify-between mb-8">
                  {getSubcategoriesForCategory().map((subcategory) => (
                    <TouchableOpacity
                      key={subcategory.id}
                      className="w-[48%] mb-4"
                      onPress={() => handleSubcategoryClick(subcategory.id)}
                    >
                      <View className="aspect-square rounded-xl overflow-hidden mb-2">
                        <Image
                          source={getSubcategoryImage(subcategory.name.toLowerCase())}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>
                      <View className="mt-2">
                        <Text className="text-base font-semibold text-gray-900">
                          {subcategory.name}
                        </Text>
                        {subcategory.count && (
                          <Text className="text-xs text-gray-500 mt-0.5">
                            {subcategory.count}{" "}
                            {subcategory.countLabel || "items"}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Premium Banner - Only show on trending */}
              {selectedCategory === "trending" && (
                <View className="mb-8">
                  <Text className="text-xs text-gray-500 text-center mb-2">
                    *Premium also includes detail analytics, premium insights,
                    PDF data export and better wellness predictions
                  </Text>
                  <PremiumSubscriptionDrawer>
                    <View className="bg-blue-500 py-3 rounded-[25px] items-center">
                      <Text className="text-base font-bold text-white">GO PREMIUM</Text>
                    </View>
                  </PremiumSubscriptionDrawer>
                </View>
              )}

              {/* Daily Content - Only show on trending */}
              {selectedCategory === "trending" && (
                <DailyContent
                  items={getDailyContent()}
                  onItemPress={handleItemClick}
                />
              )}

              <View className="h-[100px]" />
            </View>
          </ScrollView>
        </SafeAreaView>
      </AnimatedScreen>
    </PaywallGuard>
  );
}
