import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { WellnessCategory } from '@/types/club';

interface CategorySelectorProps {
  categories: WellnessCategory[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategorySelector({ categories, selectedCategory, onSelectCategory }: CategorySelectorProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onSelectCategory(category.id)}
          style={[
            styles.categoryButton,
            selectedCategory === category.id ? styles.selectedButton : styles.unselectedButton
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category.id ? styles.selectedText : styles.unselectedText
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  selectedButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  unselectedButton: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedText: {
    color: '#000000',
  },
  unselectedText: {
    color: '#6B7280',
  },
});
