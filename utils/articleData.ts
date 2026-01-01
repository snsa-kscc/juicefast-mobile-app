import {
  Recipe,
  getRecipeById,
  getRandomRecipes,
  getCategoryById,
} from "./recipeData";
import {
  BeautyItem,
  getBeautyItemById,
  getRandomBeautyItems,
  getBeautyCategoryById,
} from "./beautyData";
import {
  getDifficultyColor as sharedGetDifficultyColor,
  formatTime as sharedFormatTime,
} from "./helpers";

// Unified Article type that works for both recipes and beauty
export interface Article {
  id: string;
  title: string;
  category: string;
  tags: string[];
  image: string;
  description: string;
  difficulty: string;
  instructions: string[];
  tips: string[];
  // Recipe-specific fields (optional)
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  bonus?: string;
  // Shared ingredients (both recipes and DIY beauty items have this)
  ingredients?: string[];
  // Beauty-specific fields (optional)
  quickInfo?: {
    time: string;
    frequency?: string;
    target?: string;
    bestFor?: string;
    skinType?: string;
    mood?: string;
  };
  // Article type indicator
  articleType: "recipe" | "beauty";
}

export interface ArticleCategory {
  id: string;
  name: string;
  itemCount: number;
}

// Convert Recipe to Article
export const recipeToArticle = (recipe: Recipe): Article => {
  return {
    id: recipe.id,
    title: recipe.title,
    category: recipe.category,
    tags: recipe.tags,
    image: recipe.image,
    description: recipe.description,
    difficulty: recipe.difficulty,
    instructions: recipe.instructions,
    tips: recipe.tips,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    nutrition: recipe.nutrition,
    bonus: recipe.bonus,
    ingredients: recipe.ingredients,
    articleType: "recipe",
  };
};

// Convert BeautyItem to Article
export const beautyItemToArticle = (item: BeautyItem): Article => {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    tags: item.tags,
    image: item.image,
    description: item.description,
    difficulty: item.difficulty,
    instructions: item.instructions,
    tips: item.tips,
    ingredients: item.ingredients,
    quickInfo: item.quickInfo,
    articleType: "beauty",
  };
};

// Get article by ID (checks both recipes and beauty)
export const getArticleById = (articleId: string): Article | undefined => {
  // Try recipes first
  const recipe = getRecipeById(articleId);
  if (recipe) {
    return recipeToArticle(recipe);
  }

  // Try beauty items
  const beautyItem = getBeautyItemById(articleId);
  if (beautyItem) {
    return beautyItemToArticle(beautyItem);
  }

  return undefined;
};

// Get random articles for footer (from same type)
export const getRandomArticles = (
  count: number = 5,
  excludeId?: string,
  articleType?: "recipe" | "beauty"
): Article[] => {
  if (articleType === "recipe") {
    return getRandomRecipes(count, excludeId).map(recipeToArticle);
  } else if (articleType === "beauty") {
    return getRandomBeautyItems(count, excludeId).map(beautyItemToArticle);
  }

  // Mix of both if no type specified
  const recipes = getRandomRecipes(Math.ceil(count / 2), excludeId).map(
    recipeToArticle
  );
  const beauty = getRandomBeautyItems(Math.floor(count / 2), excludeId).map(
    beautyItemToArticle
  );
  return [...recipes, ...beauty].slice(0, count);
};

// Get category info by ID (checks both recipes and beauty)
export const getArticleCategoryById = (
  categoryId: string,
  articleType?: "recipe" | "beauty"
): ArticleCategory | undefined => {
  if (articleType === "recipe") {
    const cat = getCategoryById(categoryId);
    return cat
      ? { id: cat.id, name: cat.name, itemCount: cat.recipeCount }
      : undefined;
  } else if (articleType === "beauty") {
    const cat = getBeautyCategoryById(categoryId);
    return cat
      ? { id: cat.id, name: cat.name, itemCount: cat.itemCount }
      : undefined;
  }

  // Try both
  const recipeCat = getCategoryById(categoryId);
  if (recipeCat) {
    return {
      id: recipeCat.id,
      name: recipeCat.name,
      itemCount: recipeCat.recipeCount,
    };
  }

  const beautyCat = getBeautyCategoryById(categoryId);
  if (beautyCat) {
    return {
      id: beautyCat.id,
      name: beautyCat.name,
      itemCount: beautyCat.itemCount,
    };
  }

  return undefined;
};

// Re-export shared utilities for backwards compatibility
export const getDifficultyColor = sharedGetDifficultyColor;
export const formatTime = sharedFormatTime;

// Get duration string for an article
export const getArticleDuration = (article: Article): string => {
  if (
    article.articleType === "recipe" &&
    article.prepTime !== undefined &&
    article.cookTime !== undefined
  ) {
    return formatTime(article.prepTime + article.cookTime);
  } else if (article.articleType === "beauty" && article.quickInfo?.time) {
    return article.quickInfo.time;
  }
  return "";
};
