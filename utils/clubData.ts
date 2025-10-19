import {
  ClubItem,
  ProcessedClubItem,
  WellnessCategory,
  SubcategoryData,
} from "@/types/club";
import clubDataRaw from "@/data/jf-club.json";

// Wellness categories for the app
export const WELLNESS_CATEGORIES: WellnessCategory[] = [
  { id: "trending", name: "Trending" },
  { id: "mind", name: "Mind" },
  { id: "workouts", name: "Workouts" },
  { id: "nutrition", name: "Nutrition" },
  { id: "beauty", name: "Beauty" },
];

// Subcategory sort order by category
const SUBCATEGORY_SORT_ORDER: Record<string, string[]> = {
  mind: [
    "better sleep",
    "breathing techniques",
    "guided meditations",
    "guided affirmations",
    "binaural beats",
    "relaxation music",
    "sounds of nature",
  ],
  workouts: [
    "pilates",
    "yoga",
    "mobility & stretching",
    "cardio and fat burn",
    "weight loss fitness",
    "fitness",
  ],
  nutrition: [
    "postpartum nutrition",
    "smoothies",
    "snacks",
    "bowls",
    "oven baked",
    "mocktails",
    "recipes",
    "apple cider",
  ],
  beauty: ["face yoga mini class", "diy hair masks", "diy face masks", "diy bath bombs"],
};

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
  item: ClubItem
): "meditation" | "track" | "video" | "audio" => {
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
  // Use a generic placeholder for all individual items
  // Headers will use local images via getSubcategoryImage
  return "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center";
};

// Process and export all club data
export const CLUB_DATA = processClubData(clubDataRaw as ClubItem[]);

// Get items by category
export const getItemsByCategory = (category: string): ProcessedClubItem[] => {
  if (category === "trending") {
    // Return a mix of popular items from different categories
    return CLUB_DATA.slice(0, 20);
  }
  return CLUB_DATA.filter((item) => item.category === category);
};

// Get items by subcategory
export const getItemsBySubcategory = (
  subcategory: string
): ProcessedClubItem[] => {
  return CLUB_DATA.filter((item) => item.subcategory === subcategory);
};

// Get unique subcategories for a category
export const getSubcategoriesForCategory = (category: string): string[] => {
  const items = getItemsByCategory(category);
  const subcategories = [...new Set(items.map((item) => item.subcategory))];
  return subcategories;
};

// Get subcategory data with counts
export const getSubcategoryData = (category: string) => {
  const subcategories = getSubcategoriesForCategory(category);
  const sortOrder = SUBCATEGORY_SORT_ORDER[category] || [];

  const subcategoryData = subcategories.map((subcategory) => {
    const items = getItemsBySubcategory(subcategory);
    return {
      id: subcategory.toLowerCase().replace(/\s+/g, "-"),
      name: subcategory.charAt(0).toUpperCase() + subcategory.slice(1),
      count: items.length,
      countLabel: "tracks",
      imageUrl: items[0]?.imageUrl,
      _originalName: subcategory, // Keep for sorting
    };
  });

  // Sort by defined order, then alphabetically for any not in the list
  return subcategoryData.sort((a, b) => {
    const indexA = sortOrder.indexOf(a._originalName);
    const indexB = sortOrder.indexOf(b._originalName);

    // Both in sort order - use defined order
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // Only A in sort order - A comes first
    if (indexA !== -1) return -1;
    // Only B in sort order - B comes first
    if (indexB !== -1) return 1;
    // Neither in sort order - alphabetical
    return a.name.localeCompare(b.name);
  });
};

// Get detailed subcategory information, po meni nebitno
export const getSubcategoryDetail = (
  subcategory: string
): SubcategoryData | null => {
  // Convert kebab-case back to original format (e.g., "postpartum-nutrition" -> "postpartum nutrition")
  const normalizedSubcategory = subcategory.replace(/-/g, " ");
  const items = getItemsBySubcategory(normalizedSubcategory);
  if (items.length === 0) return null;

  const subcategoryMap: Record<string, Omit<SubcategoryData, "items">> = {
    "guided meditations": {
      title: "Guided Meditations",
      subtitle: `${items.length} meditations`,
      description:
        "Through these meditations, you can achieve a mental, physical and emotional balance and reset. Find your inner peace with our guided meditation tracks.",
    },
    "better sleep": {
      title: "Better Sleep",
      subtitle: `${items.length} sleep tracks`,
      description:
        "Catch the z's you need to with the help of these sleep tracks. Play them in the background, focus on the sound, and slip into a slumber.",
    },
    "binaural beats": {
      title: "Binaural Beats",
      subtitle: `${items.length} tracks`,
      description:
        "These specially designed audio tracks use different frequencies in each ear to help you focus, relax, or sleep. For best results, listen with headphones.",
    },
    "relaxation music": {
      title: "Relaxation Music",
      subtitle: `${items.length} tracks`,
      description:
        "Here you'll find relaxing music that can help lower your heart rate, reduce stress and induce calmness. Take 20 minutes to relax and focus inwards.",
    },
  };

  const subcategoryInfo = subcategoryMap[normalizedSubcategory] || {
    title:
      normalizedSubcategory.charAt(0).toUpperCase() +
      normalizedSubcategory.slice(1),
    subtitle: `${items.length} items`,
    description: "Wellness content to support your journey.",
  };

  return {
    ...subcategoryInfo,
    items,
  };
};

// Get trending content (mix of popular items)
export const getTrendingContent = (): ProcessedClubItem[] => {
  // Get a diverse mix from different subcategories
  const guidedMeditations = getItemsBySubcategory("guided meditations").slice(
    0,
    8
  );
  const sleepTracks = getItemsBySubcategory("better sleep").slice(0, 4);
  const binauralBeats = getItemsBySubcategory("binaural beats").slice(0, 4);
  const relaxationMusic = getItemsBySubcategory("relaxation music").slice(0, 4);

  return [
    ...guidedMeditations,
    ...sleepTracks,
    ...binauralBeats,
    ...relaxationMusic,
  ];
};

// Daily content (featured items for today)
export const getDailyContent = (): ProcessedClubItem[] => {
  // Return a selection of items for daily recommendations
  return CLUB_DATA.slice(0, 6);
};

// Get subcategory image mapping
export const getSubcategoryImage = (subcategory: string) => {
  const imageMap: Record<string, any> = {
    // Mind category - matching SUBCATEGORY_SORT_ORDER
    "better sleep": require("@/assets/images/jf-club/better-sleep.jpg"),
    "breathing techniques": require("@/assets/images/jf-club/breathing.jpg"),
    "guided meditations": require("@/assets/images/jf-club/guided-meditation.jpg"),
    "guided affirmations": require("@/assets/images/jf-club/affirmations.jpg"),
    "binaural beats": require("@/assets/images/jf-club/binaural.jpg"),
    "relaxation music": require("@/assets/images/jf-club/relaxation.jpg"),
    "sounds of nature": require("@/assets/images/jf-club/nature-sounds.jpg"),

    // Workouts category - matching SUBCATEGORY_SORT_ORDER
    pilates: require("@/assets/images/jf-club/pilates.jpg"),
    yoga: require("@/assets/images/jf-club/yoga.jpg"),
    "mobility & stretching": require("@/assets/images/jf-club/mobility-stretching.jpg"),
    "cardio and fat burn": require("@/assets/images/jf-club/cardio-fat-burn.jpg"),
    "weight loss fitness": require("@/assets/images/jf-club/weight-loss-fitness.jpg"),
    fitness: require("@/assets/images/jf-club/workouts.jpg"),

    // Nutrition category - matching SUBCATEGORY_SORT_ORDER
    "postpartum nutrition": require("@/assets/images/jf-club/postpartum-nutrition.jpg"),
    smoothies: require("@/assets/images/jf-club/smoothies.jpg"),
    snacks: require("@/assets/images/jf-club/snacks.jpg"),
    bowls: require("@/assets/images/jf-club/bowls.jpg"),
    "oven baked": require("@/assets/images/jf-club/oven-baked.jpg"),
    mocktails: require("@/assets/images/jf-club/mocktails.jpg"),
    recipes: require("@/assets/images/jf-club/recipes.jpg"),
    "apple cider": require("@/assets/images/jf-club/apple-cider.jpg"),

    // Beauty category - matching SUBCATEGORY_SORT_ORDER
    "face yoga mini class": require("@/assets/images/jf-club/face-yoga.jpg"),
    "diy hair masks": require("@/assets/images/jf-club/hair-masks.jpg"),
    "diy face masks": require("@/assets/images/jf-club/face-masks.jpg"),
    "diy bath bombs": require("@/assets/images/jf-club/bath-bombs.jpg"),
  };

  // Return mapped image or fallback to placeholder
  return (
    imageMap[subcategory] || require("@/assets/images/jf-club/placeholder.jpg")
  );
};
