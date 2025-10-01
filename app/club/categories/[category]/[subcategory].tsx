import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SubcategoryDetail } from '@/components/club/SubcategoryDetail';
import { getSubcategoryDetail } from '@/utils/clubData';
import { ProcessedClubItem } from '@/types/club';

export default function SubcategoryPage() {
  const { category, subcategory } = useLocalSearchParams<{ 
    category: string; 
    subcategory: string; 
  }>();

  const subcategoryData = getSubcategoryDetail(subcategory || '');

  const handleItemClick = (item: ProcessedClubItem) => {
    router.push({
      pathname: '/club/content/[id]',
      params: { id: item.id }
    });
  };

  const handleBack = () => {
    router.back();
  };

  if (!subcategoryData) {
    return (
      <SafeAreaView style={styles.container}>
        <SubcategoryDetail
          title="Subcategory Not Found"
          description="The wellness subcategory you're looking for doesn't exist."
          items={[]}
          onBack={handleBack}
          onItemPress={handleItemClick}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SubcategoryDetail
        title={subcategoryData.title}
        subtitle={subcategoryData.subtitle}
        description={subcategoryData.description}
        items={subcategoryData.items}
        featuredImageUrl={subcategoryData.featuredImageUrl}
        onBack={handleBack}
        onItemPress={handleItemClick}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
