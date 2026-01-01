import beautyDataJson from "@/data/jf-beauty.json";
import { getRandomItems } from "./helpers";

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

const BEAUTY_DATA: BeautyData = beautyDataJson;

export const getBeautyItemsBySubcategory = (categoryId: string): BeautyItem[] =>
  BEAUTY_DATA.items.filter((item) => item.category === categoryId);

export const getBeautyItemById = (itemId: string): BeautyItem | undefined =>
  BEAUTY_DATA.items.find((item) => item.id === itemId);

export const getBeautyCategoryById = (
  categoryId: string
): BeautyCategory | undefined =>
  BEAUTY_DATA.categories.find((category) => category.id === categoryId);

export const getRandomBeautyItems = (
  count: number = 5,
  excludeId?: string
): BeautyItem[] => getRandomItems(BEAUTY_DATA.items, count, excludeId);
