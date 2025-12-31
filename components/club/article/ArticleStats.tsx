import React from "react";
import { View, Text } from "react-native";
import { Article } from "@/utils/articleData";

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

export function ArticleStats({ article }: { article: Article }) {
  // Only render for recipes with nutrition data
  if (article.articleType !== "recipe" || !article.nutrition) {
    return null;
  }

  return (
    <View className="w-full px-8 py-6">
      <View className="flex-row justify-between items-end mb-6">
        <Text className="text-sm text-black">
          <Text className="font-lufga-bold text-black">Nutrition </Text>
          <Text className="font-lufga-bold-italic text-gray-500">
            (per serving)
          </Text>
        </Text>
        <Text className="text-sm font-lufga-bold text-black">
          Calories: {article.nutrition.calories} kcal
        </Text>
      </View>

      <View className="flex-row justify-between gap-3">
        <StatItem
          label="Protein"
          value={article.nutrition.protein.toString()}
          unit="g"
        />
        <StatItem
          label="Carbs"
          value={article.nutrition.carbs.toString()}
          unit="g"
        />
        <StatItem
          label="Fat"
          value={article.nutrition.fat.toString()}
          unit="g"
        />
        <StatItem
          label="Fiber"
          value={article.nutrition.fiber.toString()}
          unit="g"
        />
      </View>

      {article.bonus && (
        <Text className="text-center text-sm font-lufga-medium text-gray-500 italic mt-6">
          Bonus: {article.bonus}
        </Text>
      )}
    </View>
  );
}
