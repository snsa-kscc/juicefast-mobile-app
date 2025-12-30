import beautyDataJson from "@/data/jf-beauty.json";

export interface BeautyQuickInfo {
  time: string;
  frequency?: string;
  target?: string;
  bestFor?: string;
  skinType?: string;
  mood?: string;
}

export interface BeautyItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  image: string;
  description: string;
  difficulty: string;
  quickInfo: BeautyQuickInfo;
  ingredients?: string[];
  instructions: string[];
  tips: string[];
}

export interface BeautyCategory {
  id: string;
  name: string;
  itemCount: number;
}

export interface BeautyData {
  version: string;
  totalItems: number;
  categories: BeautyCategory[];
  items: BeautyItem[];
}

// Export the full beauty data
export const BEAUTY_DATA: BeautyData = beautyDataJson;

// Get all beauty items
export const getAllBeautyItems = (): BeautyItem[] => {
  return BEAUTY_DATA.items;
};

// Get beauty items by category
export const getBeautyItemsByCategory = (categoryId: string): BeautyItem[] => {
  return BEAUTY_DATA.items.filter((item) => item.category === categoryId);
};

// Get beauty items by subcategory (alias for category since beauty uses flat structure)
export const getBeautyItemsBySubcategory = (
  subcategory: string
): BeautyItem[] => {
  return BEAUTY_DATA.items.filter((item) => item.category === subcategory);
};

// Get a single beauty item by ID
export const getBeautyItemById = (itemId: string): BeautyItem | undefined => {
  return BEAUTY_DATA.items.find((item) => item.id === itemId);
};

// Get category info by ID
export const getBeautyCategoryById = (
  categoryId: string
): BeautyCategory | undefined => {
  return BEAUTY_DATA.categories.find((category) => category.id === categoryId);
};

// Get random beauty items for footer
export const getRandomBeautyItems = (
  count: number = 5,
  excludeId?: string
): BeautyItem[] => {
  const allItems = excludeId
    ? BEAUTY_DATA.items.filter((item) => item.id !== excludeId)
    : BEAUTY_DATA.items;

  // Shuffle array using Fisher-Yates algorithm
  const shuffled = [...allItems];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Get difficulty color (same as recipes for consistency)
export const getBeautyDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case "easy":
    case "beginner":
      return "bg-green-500";
    case "medium":
    case "intermediate":
      return "bg-yellow-500";
    case "hard":
    case "advanced":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
