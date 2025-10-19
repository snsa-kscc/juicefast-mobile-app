import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { SubcategoryDetail } from "@/components/club/SubcategoryDetail";
import { WellnessHeader } from "@/components/ui/CustomHeader";
import { getSubcategoryDetail, getSubcategoryInfo } from "@/utils/clubData";
import { ProcessedClubItem } from "@/types/club";

export default function SubcategoryPage() {
  const { subcategory } = useLocalSearchParams<{
    category: string;
    subcategory: string;
  }>();

  const subcategoryData = getSubcategoryDetail(subcategory || "");

  // Get the original subcategory name for image lookup (convert kebab-case back to spaces)
  const originalSubcategory = subcategory?.replace(/-/g, " ") || "";

  // Get subcategory info from unified data structure
  const subcategoryInfo = getSubcategoryInfo(originalSubcategory);

  const handleItemClick = (item: ProcessedClubItem, index: number) => {
    // First 2 items (index 0 and 1) are free, rest require premium
    const isFree = index < 2;
    router.push({
      pathname: "/club/content/[id]",
      params: { id: item.id, isFree: isFree.toString() },
    });
  };

  const handleBack = () => {
    router.back();
  };

  if (!subcategoryData) {
    return (
      <SafeAreaView className="flex-1 bg-jf-gray">
        <SubcategoryDetail
          title="Subcategory Not Found"
          description="The wellness subcategory you're looking for doesn't exist."
          items={[]}
          onItemPress={handleItemClick}
          headerComponent={
            <WellnessHeader
              title="Subcategory Not Found"
              subtitle="The wellness subcategory you're looking for doesn't exist"
              showBackButton={true}
              onBackPress={handleBack}
              showSettings={false}
            />
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-jf-gray">
      <SubcategoryDetail
        title=""
        subtitle=""
        description=""
        items={subcategoryData.items}
        onItemPress={handleItemClick}
        headerComponent={
          <WellnessHeader
            title={subcategoryData.title}
            subtitle={subcategoryData.description || subcategoryData.subtitle}
            backgroundImage={
              subcategoryInfo?.image ||
              require("@/assets/images/jf-club/placeholder.jpg")
            }
            itemCount={subcategoryData.items.length}
            itemCountLabel="meditations"
            showBackButton={true}
            onBackPress={handleBack}
            showSettings={true}
            onSettingsPress={() => router.push("/profile")}
          />
        }
      />
    </SafeAreaView>
  );
}
