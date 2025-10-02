import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Category Not Found</Text>
          <Text style={styles.errorText}>
            The wellness category you're looking for doesn't exist.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={16} color="#374151" />
            <Text style={styles.backButtonText}>Back to Club</Text>
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBackButton}
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryData.name}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Subcategories Grid */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Explore {categoryData.name}</Text>

        <View style={styles.subcategoriesGrid}>
          {subcategories.map((subcategory) => (
            <TouchableOpacity
              key={subcategory.id}
              style={styles.subcategoryCard}
              onPress={() => handleSubcategoryClick(subcategory.id)}
            >
              <View style={styles.subcategoryImageContainer}>
                <Ionicons name="musical-notes" size={40} color="#6B7280" />
              </View>
              <View style={styles.subcategoryContent}>
                <Text style={styles.subcategoryName}>{subcategory.name}</Text>
                {subcategory.count && (
                  <Text style={styles.subcategoryCount}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#374151",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerBackButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
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
});
