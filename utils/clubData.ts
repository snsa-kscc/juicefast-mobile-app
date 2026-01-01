import {
  ClubItem,
  ProcessedClubItem,
  WellnessCategory,
  SubcategoryData,
  SubcategorySummary,
} from "@/types/club";
import clubData from "@/data/jf-club.json";
import beautyDataRaw from "@/data/jf-beauty.json";
import recipesDataRaw from "@/data/jf-recipes.json";
import { getRecipesBySubcategory } from "./recipeData";
import { getBeautyItemsBySubcategory } from "./beautyData";
import { formatKebabToTitle } from "./helpers";

// Wellness categories for the app
export const WELLNESS_CATEGORIES: WellnessCategory[] = [
  { id: "trending", name: "Trending", contentType: "video" },
  { id: "mind", name: "Mind", contentType: "video" },
  { id: "workouts", name: "Workouts", contentType: "video" },
  { id: "nutrition", name: "Nutrition", contentType: "article" },
  { id: "beauty", name: "Beauty", contentType: "article" },
];

export const CATEGORY_IMAGES = {
  mind: {
    id: "mind",
    name: "Mind",
    image: require("@/assets/images/jf-club/meditation.jpg"),
    categoryId: "mind",
  },
  workouts: {
    id: "workouts",
    name: "Workouts",
    image: require("@/assets/images/jf-club/workouts.jpg"),
    categoryId: "workouts",
  },
  nutrition: {
    id: "nutrition",
    name: "Nutrition",
    image: require("@/assets/images/jf-club/recipes.jpg"),
    categoryId: "nutrition",
  },
  beauty: {
    id: "beauty",
    name: "Beauty",
    image: require("@/assets/images/jf-club/articles.jpg"),
    categoryId: "beauty",
  },
};

// Image mapping object to avoid dynamic requires
const IMAGE_MAP: Record<string, any> = {
  "jf-club/guided-meditation.jpg": require("@/assets/images/jf-club/guided-meditation.jpg"),
  "jf-club/relaxation.jpg": require("@/assets/images/jf-club/relaxation.jpg"),
  "jf-club/breathing.jpg": require("@/assets/images/jf-club/breathing.jpg"),
  "jf-club/binaural.jpg": require("@/assets/images/jf-club/binaural.jpg"),
  "jf-club/better-sleep.jpg": require("@/assets/images/jf-club/better-sleep.jpg"),
  "jf-club/meditation.jpg": require("@/assets/images/jf-club/meditation.jpg"),
  "jf-club/affirmations.jpg": require("@/assets/images/jf-club/affirmations.jpg"),
  "jf-club/nature-sounds.jpg": require("@/assets/images/jf-club/nature-sounds.jpg"),
  "jf-club/workouts.jpg": require("@/assets/images/jf-club/workouts.jpg"),
  "jf-club/yoga.jpg": require("@/assets/images/jf-club/yoga.jpg"),
  "jf-club/pilates.jpg": require("@/assets/images/jf-club/pilates.jpg"),
  "jf-club/cardio-fat-burn.jpg": require("@/assets/images/jf-club/cardio-fat-burn.jpg"),
  "jf-club/weight-loss-fitness.jpg": require("@/assets/images/jf-club/weight-loss-fitness.jpg"),
  "jf-club/mobility-stretching.jpg": require("@/assets/images/jf-club/mobility-stretching.jpg"),
  "jf-club/easy-flow.jpg": require("@/assets/images/jf-club/easy-flow.jpg"),
  "jf-club/neck-shoulder.jpg": require("@/assets/images/jf-club/neck-shoulder.jpg"),
  "jf-club/face-yoga.jpg": require("@/assets/images/jf-club/face-yoga.jpg"),
  "jf-club/recipes.jpg": require("@/assets/images/jf-club/recipes.jpg"),
  "jf-club/smoothies.jpg": require("@/assets/images/jf-club/smoothies.jpg"),
  "jf-club/snacks.jpg": require("@/assets/images/jf-club/snacks.jpg"),
  "jf-club/oven-baked.jpg": require("@/assets/images/jf-club/oven-baked.jpg"),
  "jf-club/mocktails.jpg": require("@/assets/images/jf-club/mocktails.jpg"),
  "jf-club/apple-cider.jpg": require("@/assets/images/jf-club/apple-cider.jpg"),
  "jf-club/postpartum-nutrition.jpg": require("@/assets/images/jf-club/postpartum-nutrition.jpg"),
  "jf-club/articles.jpg": require("@/assets/images/jf-club/articles.jpg"),
  "jf-club/face-masks.jpg": require("@/assets/images/jf-club/face-masks.jpg"),
  "jf-club/hair-masks.jpg": require("@/assets/images/jf-club/hair-masks.jpg"),
  "jf-club/bath-bombs.jpg": require("@/assets/images/jf-club/bath-bombs.jpg"),
  "jf-club/bowls.jpg": require("@/assets/images/jf-club/bowls.jpg"),
  "jf-club/placeholder.jpg": require("@/assets/images/jf-club/placeholder.jpg"),
};

// Helper function to get images by path
const getImageByPath = (imagePath: string) => {
  if (!imagePath) return IMAGE_MAP["jf-club/placeholder.jpg"];
  return IMAGE_MAP[imagePath] || IMAGE_MAP["jf-club/placeholder.jpg"];
};

// Build subcategory data from JSON files
const buildSubcategoryData = (): Record<
  string,
  {
    id: string;
    name: string;
    category: string;
    description: string;
    image: any;
    sortIndex: number;
  }
> => {
  const data: Record<string, any> = {};

  // Process jf-club-new.json subcategories
  clubData.categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      data[subcategory.id] = {
        id: subcategory.id,
        name: subcategory.name,
        category: category.id,
        description: subcategory.description,
        image: getImageByPath(subcategory.image),
        sortIndex: subcategory.sortIndex,
      };
    });
  });

  // Process beauty.json categories (which are actually subcategories)
  beautyDataRaw.categories.forEach((subcategory) => {
    data[subcategory.id] = {
      id: subcategory.id,
      name: subcategory.name,
      category: subcategory.category || "beauty",
      description: subcategory.description,
      image: getImageByPath(subcategory.image),
      sortIndex: subcategory.sortIndex,
    };
  });

  // Process recipes.json categories (which are actually subcategories)
  recipesDataRaw.categories.forEach((subcategory) => {
    data[subcategory.id] = {
      id: subcategory.id,
      name: subcategory.name,
      category: subcategory.category || "nutrition",
      description: subcategory.description,
      image: getImageByPath(subcategory.image),
      sortIndex: subcategory.sortIndex,
    };
  });

  return data;
};

// Subcategory data - built dynamically from JSON files
const SUBCATEGORY_DATA = buildSubcategoryData();

// Process raw club data
const processClubData = (rawData: ClubItem[]): ProcessedClubItem[] => {
  return rawData.map((item, index) => ({
    ...item,
    id: `club-item-${index}`,
    duration: `${item.duration_minutes} min`,
    type: determineItemType(item),
    imageUrl: generateImageUrl(item),
  }));
};

// Determine item type based on URL and category
const determineItemType = (
  item: ClubItem & { type?: string }
): "meditation" | "track" | "video" | "audio" | "recipe" => {
  if (item.type === "recipe") return "recipe";
  if (item.url.includes(".m3u8")) return "video";
  if (item.subcategory.includes("meditation")) return "meditation";
  if (
    item.subcategory.includes("sleep") ||
    item.subcategory.includes("binaural")
  )
    return "track";
  return "audio";
};

// Generate placeholder image URL for individual items
const generateImageUrl = (_item: ClubItem): string => {
  return "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center";
};

// Process and export all club data
export const CLUB_DATA = processClubData(clubData.items as ClubItem[]);

// Get items by category
export const getItemsByCategory = (category: string): ProcessedClubItem[] => {
  if (category === "trending") {
    return CLUB_DATA.slice(0, 20);
  }
  return CLUB_DATA.filter((item) => item.category === category);
};

// Get items by subcategory (expects kebab-case)
export const getItemsBySubcategory = (
  subcategory: string
): ProcessedClubItem[] => {
  return CLUB_DATA.filter((item) => item.subcategory === subcategory);
};

// Get subcategory data with counts
export const getSubcategoryData = (category: string): SubcategorySummary[] => {
  const items = getItemsByCategory(category);
  const uniqueSubcategories = [
    ...new Set(items.map((item) => item.subcategory)),
  ];

  const subcategoryData = uniqueSubcategories.map((subcategory) => {
    const subcategoryItems = getItemsBySubcategory(subcategory);
    const subcategoryInfo = SUBCATEGORY_DATA[subcategory];

    return {
      id: subcategoryInfo?.id || subcategory,
      name: subcategoryInfo?.name || formatSubcategoryTitle(subcategory),
      count: subcategoryItems.length,
      countLabel: subcategoryItems.length === 1 ? "track" : "tracks",
      imageUrl: subcategoryItems[0]?.imageUrl,
      _originalName: subcategory,
    };
  });

  return subcategoryData.sort((a, b) => {
    const infoA = SUBCATEGORY_DATA[a._originalName];
    const infoB = SUBCATEGORY_DATA[b._originalName];

    if (infoA && infoB) return infoA.sortIndex - infoB.sortIndex;
    if (infoA) return -1;
    if (infoB) return 1;
    return a.name.localeCompare(b.name);
  });
};

// Get detailed subcategory information (expects kebab-case)
export const getSubcategoryDetail = (
  subcategory: string
): SubcategoryData | null => {
  const subcategoryInfo = SUBCATEGORY_DATA[subcategory];
  const isNutritionSubcategory = subcategoryInfo?.category === "nutrition";
  const isBeautySubcategory = subcategoryInfo?.category === "beauty";
  const isArticleSubcategory = isNutritionSubcategory || isBeautySubcategory;

  let items: ProcessedClubItem[] = [];

  if (isArticleSubcategory) {
    if (isNutritionSubcategory) {
      const recipes = getRecipesBySubcategory(subcategory);
      items = recipes.map((recipe) => ({
        id: `article-${recipe.id}`,
        title: recipe.title,
        subcategory,
        category: "nutrition",
        url: "",
        duration_minutes: recipe.prepTime + recipe.cookTime,
        duration: `${recipe.prepTime + recipe.cookTime} min`,
        type: "recipe" as const,
        imageUrl:
          recipe.image ||
          "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop&crop=center",
      }));
    } else if (isBeautySubcategory) {
      const beautyItems = getBeautyItemsBySubcategory(subcategory);
      items = beautyItems.map((item) => ({
        id: `article-${item.id}`,
        title: item.title,
        subcategory,
        category: "beauty",
        url: "",
        duration_minutes: 0,
        duration: item.quickInfo.time,
        type: "article" as const,
        imageUrl:
          item.image ||
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop&crop=center",
      }));
    }
  } else {
    items = getItemsBySubcategory(subcategory);
  }

  if (items.length === 0) return null;

  const info = subcategoryInfo
    ? {
        title: subcategoryInfo.name,
        subtitle: `${items.length} ${items.length === 1 ? "item" : "items"}`,
        description: subcategoryInfo.description,
      }
    : {
        title: formatSubcategoryTitle(subcategory),
        subtitle: `${items.length} ${items.length === 1 ? "item" : "items"}`,
        description: "Wellness content to support your journey.",
      };

  return { ...info, items };
};

// Get trending content
export const getTrendingContent = (): ProcessedClubItem[] => {
  return [
    ...getItemsBySubcategory("guided-meditations").slice(0, 8),
    ...getItemsBySubcategory("better-sleep").slice(0, 4),
    ...getItemsBySubcategory("binaural-beats").slice(0, 4),
    ...getItemsBySubcategory("relaxation-music").slice(0, 4),
  ];
};

// Daily content (featured items for today)
export const getDailyContent = (): ProcessedClubItem[] => {
  return [
    ...getItemsBySubcategory("guided-meditations").slice(0, 2),
    ...getItemsBySubcategory("better-sleep").slice(0, 2),
    ...getItemsBySubcategory("binaural-beats").slice(0, 2),
    ...getItemsBySubcategory("breathing-techniques").slice(0, 2),
    ...getItemsBySubcategory("cardio-and-fat-burn").slice(0, 2),
    ...getItemsBySubcategory("diy-bath-bombs").slice(0, 2),
    ...getItemsBySubcategory("diy-face-masks").slice(0, 2),
    ...getItemsBySubcategory("diy-hair-masks").slice(0, 2),
    ...getItemsBySubcategory("face-yoga-mini-class").slice(0, 2),
    ...getItemsBySubcategory("fitness").slice(0, 2),
    ...getItemsBySubcategory("guided-affirmations").slice(0, 2),
    ...getItemsBySubcategory("mobility-and-stretching").slice(0, 2),
    ...getItemsBySubcategory("pilates").slice(0, 2),
    ...getItemsBySubcategory("postpartum-nutrition").slice(0, 2),
    ...getItemsBySubcategory("relaxation-music").slice(0, 2),
    ...getItemsBySubcategory("snacks").slice(0, 2),
    ...getItemsBySubcategory("sounds-of-nature").slice(0, 2),
    ...getItemsBySubcategory("yoga").slice(0, 2),
  ];
};

// Re-export for backwards compatibility
export const formatSubcategoryTitle = formatKebabToTitle;

// Get subcategory image (expects kebab-case)
export const getSubcategoryImage = (subcategory: string) => {
  return (
    SUBCATEGORY_DATA[subcategory]?.image || IMAGE_MAP["jf-club/placeholder.jpg"]
  );
};

// Get subcategory info (expects kebab-case)
export const getSubcategoryInfo = (subcategory: string) => {
  return SUBCATEGORY_DATA[subcategory] || null;
};

// Get all subcategories for a category, ordered by sort index
export const getOrderedSubcategoriesForCategory = (category: string) => {
  return Object.values(SUBCATEGORY_DATA)
    .filter((sub) => sub.category === category)
    .sort((a, b) => a.sortIndex - b.sortIndex);
};

// Get category images for trending section
export const getCategoryImages = () => {
  return Object.values(CATEGORY_IMAGES);
};

// Get total count for a category
export const getCategoryCount = (categoryId: string): number => {
  const subcategories = Object.values(SUBCATEGORY_DATA).filter(
    (sub) => sub.category === categoryId
  );

  if (isArticleCategory(categoryId)) {
    return subcategories.reduce((total, sub) => {
      const recipes = getRecipesBySubcategory(sub.id);
      if (recipes.length > 0) return total + recipes.length;

      const beautyItems = getBeautyItemsBySubcategory(sub.id);
      return total + beautyItems.length;
    }, 0);
  } else {
    return subcategories.reduce((total, sub) => {
      return total + getItemsBySubcategory(sub.id).length;
    }, 0);
  }
};

// Check if a category is article content
export const isArticleCategory = (categoryId: string): boolean => {
  const category = WELLNESS_CATEGORIES.find((cat) => cat.id === categoryId);
  return category?.contentType === "article";
};
