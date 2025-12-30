export interface ClubItem {
  title: string;
  url: string;
  category: string;
  subcategory: string;
  duration_minutes: number;
}

export interface WellnessCategory {
  id: string;
  name: string;
  contentType: "video" | "recipe";
}

export interface ProcessedClubItem extends ClubItem {
  id: string;
  duration: string;
  type: "meditation" | "track" | "video" | "audio" | "recipe";
  imageUrl?: string;
}

export interface SubcategoryData {
  title: string;
  subtitle: string;
  description: string;
  items: ProcessedClubItem[];
  featuredImageUrl?: string;
}

export interface SubcategorySummary {
  id: string;
  name: string;
  count: number;
  countLabel: string;
  imageUrl?: string;
  _originalName: string;
}
