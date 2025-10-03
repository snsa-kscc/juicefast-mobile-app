import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// Using View with backgroundColor instead of LinearGradient
import { AnimatedScreen } from "@/components/AnimatedScreen";
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
} from "@/utils/clubData";
import { ProcessedClubItem } from "@/types/club";

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
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerGradient}>
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Text style={styles.headerTitle}>JF Club</Text>
                <TouchableOpacity 
                  style={styles.settingsButton}
                  onPress={() => router.push("/profile")}
                >
                  <Ionicons name="settings-outline" size={20} color="#374151" />
                </TouchableOpacity>
              </View>
              <Text style={styles.headerDescription}>
                Workouts, recipes and relevant articles come to you every day,
                and are all based on your current state, logged results and
                overall wellness goals.
              </Text>
            </View>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <View style={styles.tabNavigation}>
              <TouchableOpacity
                onPress={() => handleTabChange("trending")}
                style={[
                  styles.tabButton,
                  activeTab === "trending" && styles.activeTabButton,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "trending" && styles.activeTabText,
                  ]}
                >
                  Trending
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleTabChange("discover")}
                style={[
                  styles.tabButton,
                  activeTab === "discover" && styles.activeTabButton,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "discover" && styles.activeTabText,
                  ]}
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
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>
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
              <View style={styles.subcategoriesGrid}>
                {getSubcategoriesForCategory().map((subcategory) => (
                  <TouchableOpacity
                    key={subcategory.id}
                    style={styles.subcategoryCard}
                    onPress={() => handleSubcategoryClick(subcategory.id)}
                  >
                    <View style={styles.subcategoryImageContainer}>
                      <Ionicons
                        name="musical-notes"
                        size={40}
                        color="#6B7280"
                      />
                    </View>
                    <View style={styles.subcategoryContent}>
                      <Text style={styles.subcategoryName}>
                        {subcategory.name}
                      </Text>
                      {subcategory.count && (
                        <Text style={styles.subcategoryCount}>
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
              <View style={styles.premiumSection}>
                <Text style={styles.premiumDisclaimer}>
                  *Premium also includes detail analytics, premium insights, PDF
                  data export and better wellness predictions
                </Text>
                <PremiumSubscriptionDrawer>
                  <View style={styles.premiumButton}>
                    <Text style={styles.premiumButtonText}>GO PREMIUM</Text>
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

            <View style={styles.bottomSpacer} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFBF8",
  },
  headerGradient: {
    backgroundColor: "#E0F7FA",
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  settingsButton: {
    padding: 8,
  },
  headerDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabNavigation: {
    flexDirection: "row",
  },
  tabButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#111827",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  activeTabText: {
    color: "#111827",
  },
  contentSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    marginTop: 16,
  },
  subcategoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  subcategoryCard: {
    width: "48%",
    marginBottom: 16,
  },
  subcategoryImageContainer: {
    aspectRatio: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  subcategoryContent: {
    marginTop: 8,
  },
  subcategoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  subcategoryCount: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  premiumSection: {
    marginBottom: 32,
  },
  premiumDisclaimer: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 8,
  },
  premiumButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bottomSpacer: {
    height: 100,
  },
});
