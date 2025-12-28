import React from "react";
import { View, Text } from "react-native";

const STEPS = [
  "Heat olive oil in a large pot over medium heat. Sauté onion until soft (3-4 min).",
  "Add garlic, cumin, and turmeric. Stir for 30 seconds until fragrant.",
  "Pour in lentils, tomatoes, and broth. Bring to boil, then reduce heat.",
  "Simmer 20 minutes until lentils are tender.",
  "Stir in spinach until wilted. Season with salt, pepper, and lemon.",
  "Serve warm. Store leftovers up to 4 days or freeze for 3 months.",
];

export function NutritionSteps() {
  return (
    <View className="px-8 py-6 bg-white">
      <Text className="text-2xl font-lufga-semibold text-black mb-8">
        Instructions
      </Text>
      <View className="gap-4">
        {STEPS.map((step, index) => (
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
