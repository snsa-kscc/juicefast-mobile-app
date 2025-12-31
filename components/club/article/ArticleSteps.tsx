import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Article } from "@/utils/articleData";

export function ArticleSteps({ article }: { article: Article }) {
  const gradientColors =
    article.articleType === "recipe"
      ? (["#FCD34D", "#F59E0B"] as const) // amber-300 to amber-500
      : (["#DEFFD1", "#B4EDF0"] as const); // beauty gradient colors

  const textColorClass =
    article.articleType === "recipe" ? "text-white" : "text-black";

  return (
    <View className="px-8 py-6 bg-white">
      <Text className="text-2xl font-lufga-semibold text-black mb-8">
        Instructions
      </Text>
      <View className="gap-4">
        {article.instructions.map((step, index) => (
          <View
            key={index}
            className="flex-row items-center gap-4 border-b border-gray-100 pb-5"
          >
            {/* Step Number */}
            <LinearGradient
              colors={gradientColors}
              className="flex-shrink-0"
              style={{
                width: 32,
                height: 32,
                borderRadius: 300,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                className={`text-sm font-lufga-medium ${textColorClass} text-center leading-none`}
              >
                {index + 1}
              </Text>
            </LinearGradient>
            {/* Step Text */}
            <Text className="text-lg font-lufga text-black leading-6 flex-1">
              {step}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
