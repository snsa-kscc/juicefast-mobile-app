import React from "react";
import { View, Text } from "react-native";
import { Article } from "@/utils/articleData";

export function ArticleSteps({ article }: { article: Article }) {
  return (
    <View className="px-8 py-6 bg-white">
      <Text className="text-2xl font-lufga-semibold text-black mb-8">
        Instructions
      </Text>
      <View className="gap-4">
        {article.instructions.map((step, index) => (
          <View
            key={index}
            className="flex-row items-start gap-4 border-b border-gray-100 pb-5"
          >
            {/* Step Number */}
            <View className="w-6 items-center justify-center flex-shrink-0">
              <Text className="text-sm font-inter-medium text-gray-500 text-center leading-none">
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
