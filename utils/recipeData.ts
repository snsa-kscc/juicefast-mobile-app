import recipesData from "@/data/jf-recipes.json";

export interface Recipe {
  id: string;
  title: string;
  category: string;
  tags: string[];
  image: string | null;
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

// Export the full recipe data
export const RECIPES_DATA: RecipeData = recipesData;

// Get all recipes
export const getAllRecipes = (): Recipe[] => {
  return RECIPES_DATA.recipes;
};

// Get recipes by category
export const getRecipesByCategory = (categoryId: string): Recipe[] => {
  return RECIPES_DATA.recipes.filter(
    (recipe) => recipe.category === categoryId
  );
};

// Get recipes by subcategory (maps to category for recipes)
export const getRecipesBySubcategory = (subcategory: string): Recipe[] => {
  // For recipes, subcategory is the same as category
  return RECIPES_DATA.recipes.filter(
    (recipe) => recipe.category === subcategory
  );
};

// Get a single recipe by ID
export const getRecipeById = (recipeId: string): Recipe | undefined => {
  return RECIPES_DATA.recipes.find((recipe) => recipe.id === recipeId);
};

// Get category info by ID
export const getCategoryById = (
  categoryId: string
): RecipeCategory | undefined => {
  return RECIPES_DATA.categories.find((category) => category.id === categoryId);
};

// Get formatted time string
export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

// Get difficulty color
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-500";
    case "medium":
      return "bg-yellow-500";
    case "hard":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

// Get random recipes for footer
export const getRandomRecipes = (
  count: number = 5,
  excludeId?: string
): Recipe[] => {
  const allRecipes = excludeId
    ? RECIPES_DATA.recipes.filter((recipe) => recipe.id !== excludeId)
    : RECIPES_DATA.recipes;

  // Shuffle array using Fisher-Yates algorithm
  const shuffled = [...allRecipes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
};
