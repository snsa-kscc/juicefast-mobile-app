import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { NutritionStats } from "./NutritionStats";
import { NutritionIngredients } from "./NutritionIngredients";
import { NutritionSteps } from "./NutritionSteps";
import { NutritionFooter } from "./NutritionFooter";
import { getImageWithFallback, DEFAULT_IMAGES } from "@/utils/imageUtils";
import {
  Recipe,
  getCategoryById,
  formatTime,
  getDifficultyColor,
} from "@/utils/recipeData";

interface NutritionRecipePageProps {
  recipe: Recipe;
  categoryName?: string;
  categoryRecipeCount?: number;
  onBackPress: () => void;
  footerRecipes?: Array<{ name: string; image: string }>;
  onFooterRecipePress?: (recipe: { name: string; image: string }) => void;
  footerTitle?: string;
}

// Recipe Header
function RecipeHeader({
  categoryName,
  categoryRecipeCount,
  onBackPress,
}: {
  categoryName?: string;
  categoryRecipeCount?: number;
  onBackPress: () => void;
}) {
  return (
    <View className="bg-white px-8 py-5">
      <View className="flex-row items-center gap-5">
        <TouchableOpacity
          className="bg-amber-500 p-2 rounded-full"
          onPress={onBackPress}
        >
          <View>
            <ArrowLeft size={24} color="white" />
          </View>
        </TouchableOpacity>

        <View className="flex-1 gap-1">
          <Text className="text-xl font-lufga-medium text-black">
            {categoryName || "Nutrition"}
          </Text>
          <Text className="text-base font-lufga-medium-italic text-black">
            {categoryRecipeCount ? `${categoryRecipeCount} Recipes` : "Recipes"}
          </Text>
        </View>
      </View>
    </View>
  );
}

// Title & Meta Section
function RecipeTitleSection({ recipe }: { recipe: Recipe }) {
  const difficultyColor = getDifficultyColor(recipe.difficulty);

  return (
    <View className="px-8 pt-6 pb-4 bg-jf-gray">
      <Text className="text-3xl font-lufga-bold text-black mb-4 leading-tight">
        {recipe.title}
      </Text>

      <View className="flex-row items-center gap-4 flex-wrap">
        <View className={`${difficultyColor} px-3 py-1 rounded-md`}>
          <Text className="text-base font-inter-bold text-white">
            {recipe.difficulty}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-1">
            <Text className="text-sm font-inter-bold text-black">Prep:</Text>
            <Text className="text-sm font-inter-medium text-black">
              {formatTime(recipe.prepTime)}
            </Text>
          </View>
          <View className="w-px h-4 bg-gray-300" />
          <View className="flex-row items-center gap-1">
            <Text className="text-sm font-inter-bold text-black">Cook:</Text>
            <Text className="text-sm font-inter-medium text-black">
              {formatTime(recipe.cookTime)}
            </Text>
          </View>
          <View className="w-px h-4 bg-gray-300" />
          <View className="flex-row items-center gap-1">
            <Text className="text-sm font-inter-bold text-black">
              Servings:
            </Text>
            <Text className="text-sm font-inter-medium text-black">
              {recipe.servings}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Image Section with Tags
function RecipeImageSection({ recipe }: { recipe: Recipe }) {
  return (
    <View className="pb-6 bg-jf-gray">
      <View className="relative w-full h-72 overflow-hidden bg-white">
        <Image
          source={getImageWithFallback(
            recipe.image ||
              "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
            DEFAULT_IMAGES.recipe
          )}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Tags Overlay */}
        <View className="absolute top-4 left-4 flex-row flex-wrap gap-2">
          {recipe.tags.map((tag, index) => (
            <View key={index} className="bg-white/80 px-3 py-1 rounded-full">
              <Text className="text-xs font-lufga-medium-italic text-black">
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// Why It's Great Section
function WhyItsGreatSection({
  recipe,
  categoryName,
}: {
  recipe: Recipe;
  categoryName?: string;
}) {
  const sectionTitle = categoryName
    ? `Why It's Great for ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}`
    : "Why It's Great";

  return (
    <View className="px-8 py-2 bg-jf-gray">
      <Text className="text-2xl font-lufga-semibold text-black mb-3">
        {sectionTitle}
      </Text>
      <Text className="text-lg font-inter text-black leading-6">
        {recipe.description}
      </Text>
    </View>
  );
}

export function NutritionRecipePage({
  recipe,
  categoryName,
  categoryRecipeCount,
  onBackPress,
  footerRecipes,
  onFooterRecipePress,
  footerTitle,
}: NutritionRecipePageProps) {
  const handleBackPress = onBackPress || (() => router.back());

  return (
    <View className="flex-1 bg-jf-gray">
      <ScrollView showsVerticalScrollIndicator={false}>
        <RecipeHeader
          categoryName={categoryName}
          categoryRecipeCount={categoryRecipeCount}
          onBackPress={handleBackPress}
        />
        <RecipeTitleSection recipe={recipe} />
        <RecipeImageSection recipe={recipe} />
        <WhyItsGreatSection recipe={recipe} categoryName={categoryName} />
        <NutritionStats recipe={recipe} />
        <NutritionIngredients recipe={recipe} />
        <NutritionSteps recipe={recipe} />
        {footerRecipes && (
          <NutritionFooter
            recipe={recipe}
            recipes={footerRecipes}
            onRecipePress={onFooterRecipePress}
            title={footerTitle}
          />
        )}
      </ScrollView>
    </View>
  );
}
