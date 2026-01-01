import recipesData from "@/data/jf-recipes.json";
import { getRandomItems, formatTime, getDifficultyColor } from "./helpers";

export interface Recipe {
  id: string;
  title: string;
  category: string;
  tags: string[];
  image: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  bonus: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
}

export interface RecipeCategory {
  id: string;
  name: string;
  recipeCount: number;
}

export interface RecipeData {
  version: string;
  totalRecipes: number;
  categories: RecipeCategory[];
  recipes: Recipe[];
}

export const RECIPES_DATA: RecipeData = recipesData;

export const getAllRecipes = (): Recipe[] => RECIPES_DATA.recipes;

export const getRecipesByCategory = (categoryId: string): Recipe[] =>
  RECIPES_DATA.recipes.filter((recipe) => recipe.category === categoryId);

// Alias for consistency with clubData
export const getRecipesBySubcategory = getRecipesByCategory;

export const getRecipeById = (recipeId: string): Recipe | undefined =>
  RECIPES_DATA.recipes.find((recipe) => recipe.id === recipeId);

export const getCategoryById = (
  categoryId: string
): RecipeCategory | undefined =>
  RECIPES_DATA.categories.find((category) => category.id === categoryId);

export const getRandomRecipes = (
  count: number = 5,
  excludeId?: string
): Recipe[] => getRandomItems(RECIPES_DATA.recipes, count, excludeId);

// Re-export shared utilities for backwards compatibility
export { formatTime, getDifficultyColor };
