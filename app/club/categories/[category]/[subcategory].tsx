import { useCallback } from "react";
import { View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SubcategoryDetail } from "@/components/club/SubcategoryDetail";
import { WellnessHeader } from "@/components/ui/CustomHeader";
import { getSubcategoryDetail, getSubcategoryInfo } from "@/utils/clubData";
import { ProcessedClubItem } from "@/types/club";
import { PremiumSubscriptionDrawer } from "@/components/club/PremiumSubscriptionDrawer";
import { usePaywall } from "@/hooks/usePaywall";

export default function SubcategoryPage() {
  const { category, subcategory } = useLocalSearchParams<{
    category: string;
    subcategory: string;
  }>();
  const { isPremiumOnAnyPlatform, isMobileAppSubscribed } = usePaywall();

  // Get the original subcategory name (convert kebab-case back to spaces)
  const originalSubcategory = subcategory?.replace(/-/g, " ") || "";

  const subcategoryData = getSubcategoryDetail(subcategory || "");

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

  const itemWrapper = useCallback(
    (item: ProcessedClubItem, index: number, children: React.ReactNode) => {
      const isPremium = index >= 2;

      // If item is premium and user is not subscribed, wrap with drawer
      if (isPremium && !isPremiumOnAnyPlatform) {
        return (
          <PremiumSubscriptionDrawer
            isPremiumOnAnyPlatform={isPremiumOnAnyPlatform}
            isMobileAppSubscribed={isMobileAppSubscribed}
          >
            {children}
          </PremiumSubscriptionDrawer>
        );
      }

      return <>{children}</>;
    },
    [isPremiumOnAnyPlatform, isMobileAppSubscribed]
  );

  const shouldDisablePress = (item: ProcessedClubItem, index: number) => {
    const isPremium = index >= 2;
    // Disable press for premium items when user is not subscribed
    return isPremium && !isPremiumOnAnyPlatform;
  };

  const handleBack = () => {
    router.back();
  };

  if (!subcategoryData) {
    return (
      <View className="flex-1 bg-jf-gray">
        <SubcategoryDetail
          title="Coming Soon"
          subtitle="This wellness subcategory is on its way!"
          description="We're working hard to bring you amazing content."
          items={[]}
          onItemPress={handleItemClick}
          itemWrapper={itemWrapper}
          shouldDisablePress={shouldDisablePress}
          isPremiumOnAnyPlatform={isPremiumOnAnyPlatform}
          featuredImageUrl={require("@/assets/images/jf-club/affirmations.jpg")}
          headerComponent={
            <WellnessHeader
              title="Almost there!"
              subtitle=""
              showBackButton={true}
              onBackPress={handleBack}
              showSettings={false}
            />
          }
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-jf-gray">
      <SubcategoryDetail
        title=""
        subtitle=""
        description=""
        items={subcategoryData.items}
        onItemPress={handleItemClick}
        itemWrapper={itemWrapper}
        shouldDisablePress={shouldDisablePress}
        isPremiumOnAnyPlatform={isPremiumOnAnyPlatform}
        headerComponent={
          <WellnessHeader
            title={subcategoryData.title}
            subtitle={subcategoryData.description || subcategoryData.subtitle}
            backgroundImage={
              subcategoryInfo?.image ||
              require("@/assets/images/jf-club/placeholder.jpg")
            }
            itemCount={subcategoryData.items.length}
            itemCountLabel="items"
            showBackButton={true}
            onBackPress={handleBack}
            showSettings={true}
            onSettingsPress={() => router.push("/profile")}
          />
        }
      />
    </View>
  );
}
