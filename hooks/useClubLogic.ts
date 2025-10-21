import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { ProcessedClubItem } from "@/types/club";
import {
  getTrendingContent,
  getDailyContent,
  getItemsByCategory,
  getSubcategoryData,
} from "@/utils/clubData";

export function useClubLogic() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("trending");
  const [selectedCategory, setSelectedCategory] = useState<string>("trending");

  // Handle tab change
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setSelectedCategory(tab === "trending" ? "trending" : selectedCategory);
  }, [selectedCategory]);

  // Handle item click
  const handleItemClick = useCallback((item: ProcessedClubItem) => {
    router.push(`/club/content/${item.id}`);
  }, [router]);

  // Handle category selection
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);

    // If we're in discover tab and selecting trending, switch to trending tab
    if (activeTab === "discover" && category === "trending") {
      setActiveTab("trending");
    }
    // If we're in trending tab and selecting non-trending, switch to discover tab
    else if (activeTab === "trending" && category !== "trending") {
      setActiveTab("discover");
    }
  }, [activeTab]);

  // Determine which content to show based on selected category
  const getContentForCategory = useCallback(() => {
    switch (selectedCategory) {
      case "trending":
        return getTrendingContent();
      default:
        return getItemsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  // Get subcategories for the selected category
  const getSubcategoriesForCategory = useCallback(() => {
    if (selectedCategory === "trending") return [];
    return getSubcategoryData(selectedCategory);
  }, [selectedCategory]);

  const handleSubcategoryClick = useCallback((subcategoryId: string) => {
    router.push(`/club/categories/${selectedCategory}/${subcategoryId}`);
  }, [router, selectedCategory]);

  // Handle category grid click in trending section
  const handleCategoryGridClick = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab("discover");
  }, []);

  return {
    activeTab,
    selectedCategory,
    handleTabChange,
    handleItemClick,
    handleCategorySelect,
    getContentForCategory,
    getSubcategoriesForCategory,
    handleSubcategoryClick,
    handleCategoryGridClick,
  };
}