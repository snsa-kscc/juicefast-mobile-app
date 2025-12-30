import React from "react";
import { View, Text } from "react-native";
import { Recipe } from "@/utils/recipeData";

export function NutritionSteps({ recipe }: { recipe: Recipe }) {
  return (
    <View className="px-8 py-6 bg-white">
      <Text className="text-2xl font-lufga-semibold text-black mb-8">
        Instructions
      </Text>
      <View className="gap-4">
        {recipe.instructions.map((step, index) => (
          <View key={index} className="flex-row items-center gap-4">
            {/* Step Number Circle */}
            <View className="w-8 h-8 rounded-full bg-amber-400 items-center justify-center shadow-sm flex-shrink-0">
              <Text className="text-sm font-inter-medium text-white text-center leading-none">
                {index + 1}
              </Text>
            </View>
            {/* Step Text */}
            <Text className="text-lg font-inter text-black leading-6 flex-1">
              {step}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
