import React from "react";
import { View, Text } from "react-native";

const INGREDIENTS = [
  "1 cup red lentils, rinsed",
  "200g fresh spinach",
  "1 can (400g) diced tomatoes",
  "1 medium onion, diced",
  "3 garlic cloves, minced",
  "2 tbsp olive oil",
  "1 tsp cumin",
  "½ tsp turmeric",
  "4 cups vegetable broth",
  "Salt & pepper to taste",
  "Squeeze of lemon juice",
];

export function NutritionIngredients() {
  return (
    <View className="px-8 py-6">
      <Text className="text-2xl font-lufga-semibold text-black mb-4">
        Ingredients
      </Text>
      <View className="gap-3">
        {INGREDIENTS.map((item, index) => (
          <View key={index} className="flex-row items-start gap-3">
            <View className="w-1.5 h-1.5 rounded-full bg-black mt-2.5" />
            <Text className="text-base font-inter text-black leading-6 flex-1">
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
