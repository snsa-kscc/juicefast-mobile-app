import React from "react";
import { View, Text } from "react-native";
import { Recipe } from "@/utils/recipeData";

interface StatProps {
  label: string;
  value: string;
  unit: string;
}

const StatItem = ({ label, value, unit }: StatProps) => (
  <View className="bg-white flex-1 items-center justify-center py-5 px-2.5 rounded-3xl gap-2.5 shadow-sm">
    <Text className="text-2xl font-lufga-bold text-black leading-tight">
      {value}
      {unit}
    </Text>

    <View className="w-full h-px bg-gray-200" />

    <Text className="text-xs font-lufga text-black uppercase">{label}</Text>
  </View>
);

export function NutritionStats({ recipe }: { recipe: Recipe }) {
  return (
    <View className="w-full px-8 py-6">
      <View className="flex-row justify-between items-end mb-6">
        <Text className="text-sm text-black">
          <Text className="font-inter-extrabold">Nutrition </Text>
          <Text className="font-inter-italic text-gray-500">(per serving)</Text>
        </Text>
        <Text className="text-sm font-inter-extrabold text-black">
          Calories: {recipe.nutrition.calories} kcal
        </Text>
      </View>

      <View className="flex-row justify-between gap-3">
        <StatItem
          label="Protein"
          value={recipe.nutrition.protein.toString()}
          unit="g"
        />
        <StatItem
          label="Carbs"
          value={recipe.nutrition.carbs.toString()}
          unit="g"
        />
        <StatItem
          label="Fat"
          value={recipe.nutrition.fat.toString()}
          unit="g"
        />
        <StatItem
          label="Fiber"
          value={recipe.nutrition.fiber.toString()}
          unit="g"
        />
      </View>

      <Text className="text-center text-sm font-inter-medium text-gray-500 italic mt-6">
        Bonus: {recipe.bonus}
      </Text>
    </View>
  );
}
