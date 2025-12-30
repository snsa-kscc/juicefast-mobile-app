import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { ArticleStats } from "./ArticleStats";
import { ArticleIngredients } from "./ArticleIngredients";
import { ArticleSteps } from "./ArticleSteps";
import { ArticleFooter } from "./ArticleFooter";
import { getImageWithFallback, DEFAULT_IMAGE } from "@/utils/imageUtils";
import { Article, getDifficultyColor, formatTime } from "@/utils/articleData";

interface ArticlePageProps {
  article: Article;
  categoryName?: string;
  categoryItemCount?: number;
  onBackPress: () => void;
  footerItems?: Array<{ name: string; image: string }>;
  onFooterItemPress?: (item: { name: string; image: string }) => void;
  footerTitle?: string;
}

// Article Header
function ArticleHeader({
  categoryName,
  categoryItemCount,
  onBackPress,
  articleType,
}: {
  categoryName?: string;
  categoryItemCount?: number;
  onBackPress: () => void;
  articleType: "recipe" | "beauty";
}) {
  const itemLabel = articleType === "recipe" ? "Recipes" : "Items";

  return (
    <View className="bg-white px-8 py-5">
      <View className="flex-row items-center gap-5">
        <TouchableOpacity
          className="bg-sky-400 p-2 rounded-full"
          onPress={onBackPress}
        >
          <View>
            <ArrowLeft size={24} color="white" />
          </View>
        </TouchableOpacity>

        <View className="flex-1 gap-1">
          <Text className="text-xl font-lufga-medium text-black">
            {categoryName ||
              (articleType === "recipe" ? "Nutrition" : "Beauty")}
          </Text>
          <Text className="text-base font-lufga-medium-italic text-black">
            {categoryItemCount
              ? `${categoryItemCount} ${itemLabel}`
              : itemLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

// Title & Meta Section
function ArticleTitleSection({ article }: { article: Article }) {
  const difficultyColor = getDifficultyColor(article.difficulty);

  return (
    <View className="px-8 pt-6 pb-4 bg-jf-gray">
      <Text className="text-3xl font-lufga-bold text-black mb-4 leading-tight">
        {article.title}
      </Text>

      <View className="flex-row items-center gap-4 flex-wrap">
        <View className={`${difficultyColor} px-3 py-1 rounded-md`}>
          <Text className="text-base font-inter-semibold text-gray-700">
            {article.difficulty}
          </Text>
        </View>

        {/* Recipe-specific meta */}
        {article.articleType === "recipe" &&
          article.prepTime !== undefined &&
          article.cookTime !== undefined && (
            <View className="flex-row items-center gap-2">
              <View className="flex-row items-center gap-1">
                <Text className="text-sm font-inter-bold text-black">
                  Prep:
                </Text>
                <Text className="text-sm font-inter-medium text-black">
                  {formatTime(article.prepTime)}
                </Text>
              </View>
              <View className="w-px h-4 bg-gray-300" />
              <View className="flex-row items-center gap-1">
                <Text className="text-sm font-inter-bold text-black">
                  Cook:
                </Text>
                <Text className="text-sm font-inter-medium text-black">
                  {formatTime(article.cookTime)}
                </Text>
              </View>
              {article.servings && (
                <>
                  <View className="w-px h-4 bg-gray-300" />
                  <View className="flex-row items-center gap-1">
                    <Text className="text-sm font-inter-bold text-black">
                      Servings:
                    </Text>
                    <Text className="text-sm font-inter-medium text-black">
                      {article.servings}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}

        {/* Beauty-specific meta */}
        {article.articleType === "beauty" && article.quickInfo && (
          <View className="flex-row items-center gap-2 flex-wrap">
            {article.quickInfo.time && (
              <View className="flex-row items-center gap-1">
                <Text className="text-sm font-inter-bold text-black">
                  Time:
                </Text>
                <Text className="text-sm font-inter-medium text-black">
                  {article.quickInfo.time}
                </Text>
              </View>
            )}
            {article.quickInfo.frequency && (
              <>
                <View className="w-px h-4 bg-gray-300" />
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-inter-bold text-black">
                    Frequency:
                  </Text>
                  <Text className="text-sm font-inter-medium text-black">
                    {article.quickInfo.frequency}
                  </Text>
                </View>
              </>
            )}
            {article.quickInfo.target && (
              <>
                <View className="w-px h-4 bg-gray-300" />
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-inter-bold text-black">
                    Target:
                  </Text>
                  <Text className="text-sm font-inter-medium text-black">
                    {article.quickInfo.target}
                  </Text>
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

// Image Section with Tags
function ArticleImageSection({ article }: { article: Article }) {
  return (
    <View className="pb-6 bg-jf-gray">
      <View className="relative w-full h-96 overflow-hidden bg-white">
        <Image
          source={getImageWithFallback(article.image, DEFAULT_IMAGE)}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Tags Overlay */}
        <View className="absolute top-4 left-4 flex-row flex-wrap gap-2">
          {article.tags.map((tag, index) => (
            <View key={index} className="bg-white/60 px-3 py-1 rounded-full">
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
function WhyItsGreatSection({ article }: { article: Article }) {
  return (
    <View className="px-8 py-2 bg-jf-gray">
      <Text className="text-2xl font-lufga-semibold text-black mb-3">
        Why It's Great
      </Text>
      <Text className="text-lg font-inter text-black leading-6">
        {article.description}
      </Text>
    </View>
  );
}

export function ArticlePage({
  article,
  categoryName,
  categoryItemCount,
  onBackPress,
  footerItems,
  onFooterItemPress,
  footerTitle,
}: ArticlePageProps) {
  const handleBackPress = onBackPress || (() => router.back());

  // Determine footer title based on article type
  const defaultFooterTitle =
    article.articleType === "recipe" ? "More recipes for you" : "More for you";

  return (
    <View className="flex-1 bg-jf-gray">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ArticleHeader
          categoryName={categoryName}
          categoryItemCount={categoryItemCount}
          onBackPress={handleBackPress}
          articleType={article.articleType}
        />
        <ArticleTitleSection article={article} />
        <ArticleImageSection article={article} />
        <WhyItsGreatSection article={article} />

        {/* Recipe-specific: Nutrition Stats */}
        {article.articleType === "recipe" && article.nutrition && (
          <ArticleStats article={article} />
        )}

        {/* Ingredients (both recipes and DIY beauty items) */}
        {article.ingredients && article.ingredients.length > 0 && (
          <ArticleIngredients article={article} />
        )}

        {/* Instructions */}
        <ArticleSteps article={article} />

        {/* Footer with tips and related items */}
        {footerItems && (
          <ArticleFooter
            article={article}
            items={footerItems}
            onItemPress={onFooterItemPress}
            title={footerTitle || defaultFooterTitle}
          />
        )}
      </ScrollView>
    </View>
  );
}
