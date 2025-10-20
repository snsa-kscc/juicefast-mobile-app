import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { WELLNESS_CATEGORIES, getDailyContent } from "@/utils/clubData";
import { AnimatedScreen } from "@/components/AnimatedScreen";
import { PaywallGuard } from "@/components/paywall/PaywallGuard";
import { CategorySelector } from "@/components/club/CategorySelector";
import { ContentGrid } from "@/components/club/ContentGrid";
import { DailyContent } from "@/components/club/DailyContent";
import { PremiumSubscriptionDrawer } from "@/components/club/PremiumSubscriptionDrawer";
import { SubcategoryGrid } from "@/components/club/SubcategoryGrid";
import { WellnessHeader } from "@/components/ui/CustomHeader";
import { useClubLogic } from "@/hooks/useClubLogic";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JFClub() {
  const {
    activeTab,
    selectedCategory,
    handleTabChange,
    handleItemClick,
    handleCategorySelect,
    getContentForCategory,
    getSubcategoriesForCategory,
    handleSubcategoryClick,
  } = useClubLogic();

  return (
    <PaywallGuard>
      <AnimatedScreen>
        <SafeAreaView className="flex-1 bg-jf-gray">
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <WellnessHeader
              title="JF Club"
              subtitle="Workouts, recipes and relevant articles come to you every day, and are all based on your current state, logged results and overall wellness goals."
              accentColor="#1A1A1A"
              backgroundColor="#E0F7FA"
              showSettings={true}
              onSettingsPress={() => {
                router.push("/profile");
              }}
            />
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
                    className={`text-sm font-lufga-medium ${
                      activeTab === "trending"
                        ? "text-gray-900"
                        : "text-gray-400"
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
                    className={`text-sm font-lufga-medium ${
                      activeTab === "discover"
                        ? "text-gray-900"
                        : "text-gray-400"
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
              <Text className="text-2xl font-lufga-bold text-gray-900 mb-4 mt-4">
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
                <SubcategoryGrid
                  category={selectedCategory}
                  onSubcategoryClick={handleSubcategoryClick}
                />
              )}

              {/* Premium Banner - Only show on trending */}
              {selectedCategory === "trending" && (
                <View className="mb-8">
                  <Text className="text-xs font-lufga-regular text-gray-500 text-center mb-2">
                    *Premium also includes detail analytics, premium insights,
                    PDF data export and better wellness predictions
                  </Text>
                  <PremiumSubscriptionDrawer>
                    <View className="bg-blue-500 py-3 rounded-[25px] items-center">
                      <Text className="text-base font-lufga-bold text-white">
                        GO PREMIUM
                      </Text>
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
