import React from "react";
import { View, Text } from "react-native";
import { Recipe } from "@/utils/recipeData";

export function NutritionIngredients({ recipe }: { recipe: Recipe }) {
  return (
    <View className="px-8 py-6">
      <Text className="text-2xl font-lufga-semibold text-black mb-4">
        Ingredients
      </Text>
      <View className="gap-3">
        {recipe.ingredients.map((item, index) => (
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
