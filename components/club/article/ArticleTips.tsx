import React from "react";
import { View, Text } from "react-native";
import { Article } from "@/utils/articleData";

export function ArticleTips({ article }: { article: Article }) {
  if (!article.tips || article.tips.length === 0) {
    return null;
  }

  return (
    <View className="px-8 pt-6 pb-12">
      <Text className="text-2xl font-lufga-semibold text-black mb-4">
        Tips & Variations
      </Text>
      <View className="gap-2">
        {article.tips.map((tip, index) => (
          <View key={index} className="flex-row items-start">
            <Text className="text-lg font-inter-medium text-black mr-2 leading-6">
              •
            </Text>
            <Text className="text-base font-inter-medium text-black leading-6 mt-0.5">
              {tip}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
