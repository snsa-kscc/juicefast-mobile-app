import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SubcategoryDetail } from "@/components/club/SubcategoryDetail";
import { WellnessHeader } from "@/components/ui/CustomHeader";
import { getSubcategoryDetail } from "@/utils/clubData";
import { getSubcategoryImage } from "@/utils/clubData";
import { ProcessedClubItem } from "@/types/club";

export default function SubcategoryPage() {
  const { category, subcategory } = useLocalSearchParams<{
    category: string;
    subcategory: string;
  }>();

  const subcategoryData = getSubcategoryDetail(subcategory || "");

  const handleItemClick = (item: ProcessedClubItem) => {
    router.push({
      pathname: "/club/content/[id]",
      params: { id: item.id },
    });
  };

  const handleBack = () => {
    router.back();
  };

  if (!subcategoryData) {
    return (
      <SafeAreaView className="flex-1 bg-jf-gray">
        <WellnessHeader
          title="Subcategory Not Found"
          subtitle="The wellness subcategory you&apos;re looking for doesn&apos;t exist"
          showBackButton={true}
          onBackPress={handleBack}
          showSettings={false}
        />
        <SubcategoryDetail
          title="Subcategory Not Found"
          description="The wellness subcategory you&apos;re looking for doesn&apos;t exist."
          items={[]}
          onItemPress={handleItemClick}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-jf-gray">
      <WellnessHeader
        title={subcategoryData.title}
        subtitle={subcategoryData.description || subcategoryData.subtitle}
        backgroundImage={subcategoryData.featuredImageUrl || getSubcategoryImage(subcategoryData.title.toLowerCase())}
        itemCount={subcategoryData.items.length}
        itemCountLabel="meditations"
        showBackButton={true}
        onBackPress={handleBack}
        showSettings={true}
        onSettingsPress={() => router.push("/profile")}
      />
      <SubcategoryDetail
        title=""
        subtitle=""
        description=""
        items={subcategoryData.items}
        onItemPress={handleItemClick}
      />
    </SafeAreaView>
  );
}

