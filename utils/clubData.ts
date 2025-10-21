import {
  ClubItem,
  ProcessedClubItem,
  WellnessCategory,
  SubcategoryData,
  SubcategorySummary,
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

// Comprehensive subcategory data structure
const SUBCATEGORY_DATA: Record<
  string,
  {
    id: string;
    name: string;
    category: string;
    description: string;
    image: any;
    sortIndex: number;
  }
> = {
  // Mind category
  "better sleep": {
    id: "better-sleep",
    name: "Better Sleep",
    category: "mind",
    description:
      "Catch the z's you need to with the help of these sleep tracks. Play them in the background, focus on the sound, and slip into a slumber.",
    image: require("@/assets/images/jf-club/better-sleep.jpg"),
    sortIndex: 0,
  },
  "breathing techniques": {
    id: "breathing-techniques",
    name: "Breathing Techniques",
    category: "mind",
    description:
      "Learn various breathing techniques to calm your mind, reduce stress, and improve your overall well-being through mindful breathing practices.",
    image: require("@/assets/images/jf-club/breathing.jpg"),
    sortIndex: 1,
  },
  "guided meditations": {
    id: "guided-meditations",
    name: "Guided Meditations",
    category: "mind",
    description:
      "Through these meditations, you can achieve a mental, physical and emotional balance and reset. Find your inner peace with our guided meditation tracks.",
    image: require("@/assets/images/jf-club/guided-meditation.jpg"),
    sortIndex: 2,
  },
  "guided affirmations": {
    id: "guided-affirmations",
    name: "Guided Affirmations",
    category: "mind",
    description:
      "Transform your mindset with positive affirmations that help build confidence, reduce anxiety, and cultivate a more positive outlook on life.",
    image: require("@/assets/images/jf-club/affirmations.jpg"),
    sortIndex: 3,
  },
  "binaural beats": {
    id: "binaural-beats",
    name: "Binaural Beats",
    category: "mind",
    description:
      "These specially designed audio tracks use different frequencies in each ear to help you focus, relax, or sleep. For best results, listen with headphones.",
    image: require("@/assets/images/jf-club/binaural.jpg"),
    sortIndex: 4,
  },
  "relaxation music": {
    id: "relaxation-music",
    name: "Relaxation Music",
    category: "mind",
    description:
      "Here you'll find relaxing music that can help lower your heart rate, reduce stress and induce calmness. Take 20 minutes to relax and focus inwards.",
    image: require("@/assets/images/jf-club/relaxation.jpg"),
    sortIndex: 5,
  },
  "sounds of nature": {
    id: "sounds-of-nature",
    name: "Sounds of Nature",
    category: "mind",
    description:
      "Immerse yourself in the calming sounds of nature. From ocean waves to forest rain, these tracks help you connect with natural environments.",
    image: require("@/assets/images/jf-club/nature-sounds.jpg"),
    sortIndex: 6,
  },

  // Workouts category
  pilates: {
    id: "pilates",
    name: "Pilates",
    category: "workouts",
    description:
      "Strengthen your core, improve flexibility, and build lean muscle with our guided Pilates workouts suitable for all fitness levels.",
    image: require("@/assets/images/jf-club/pilates.jpg"),
    sortIndex: 0,
  },
  yoga: {
    id: "yoga",
    name: "Yoga",
    category: "workouts",
    description:
      "Find balance, flexibility, and inner peace through our yoga practices. From beginner flows to advanced poses, there's something for everyone.",
    image: require("@/assets/images/jf-club/yoga.jpg"),
    sortIndex: 1,
  },
  "mobility & stretching": {
    id: "mobility-stretching",
    name: "Mobility & Stretching",
    category: "workouts",
    description:
      "Improve your range of motion, prevent injury, and feel more flexible with our targeted mobility and stretching routines.",
    image: require("@/assets/images/jf-club/mobility-stretching.jpg"),
    sortIndex: 2,
  },
  "cardio and fat burn": {
    id: "cardio-fat-burn",
    name: "Cardio and Fat Burn",
    category: "workouts",
    description:
      "Get your heart pumping and burn calories with our effective cardio workouts designed to boost your metabolism and improve endurance.",
    image: require("@/assets/images/jf-club/cardio-fat-burn.jpg"),
    sortIndex: 3,
  },
  "weight loss fitness": {
    id: "weight-loss-fitness",
    name: "Weight Loss Fitness",
    category: "workouts",
    description:
      "Achieve your weight loss goals with our targeted fitness programs that combine strength training and cardio for maximum results.",
    image: require("@/assets/images/jf-club/weight-loss-fitness.jpg"),
    sortIndex: 4,
  },
  fitness: {
    id: "fitness",
    name: "Fitness",
    category: "workouts",
    description:
      "General fitness workouts to improve your overall health, strength, and endurance with a variety of exercise styles and intensities.",
    image: require("@/assets/images/jf-club/workouts.jpg"),
    sortIndex: 5,
  },

  // Nutrition category
  "postpartum nutrition": {
    id: "postpartum-nutrition",
    name: "Postpartum Nutrition",
    category: "nutrition",
    description:
      "Nourish your body during the postpartum period with nutrient-dense recipes and nutritional guidance designed to support recovery and lactation.",
    image: require("@/assets/images/jf-club/postpartum-nutrition.jpg"),
    sortIndex: 0,
  },
  smoothies: {
    id: "smoothies",
    name: "Smoothies",
    category: "nutrition",
    description:
      "Delicious and nutritious smoothie recipes packed with vitamins, minerals, and antioxidants to support your health and wellness goals.",
    image: require("@/assets/images/jf-club/smoothies.jpg"),
    sortIndex: 1,
  },
  snacks: {
    id: "snacks",
    name: "Snacks",
    category: "nutrition",
    description:
      "Healthy and satisfying snack options that keep you energized throughout the day without compromising your nutrition goals.",
    image: require("@/assets/images/jf-club/snacks.jpg"),
    sortIndex: 2,
  },
  bowls: {
    id: "bowls",
    name: "Bowls",
    category: "nutrition",
    description:
      "Nutritious and colorful bowl recipes that combine wholesome ingredients for balanced meals that are as beautiful as they are delicious.",
    image: require("@/assets/images/jf-club/bowls.jpg"),
    sortIndex: 3,
  },
  "oven baked": {
    id: "oven-baked",
    name: "Oven Baked",
    category: "nutrition",
    description:
      "Healthy oven-baked recipes that bring out the best flavors in whole foods while maintaining their nutritional value.",
    image: require("@/assets/images/jf-club/oven-baked.jpg"),
    sortIndex: 4,
  },
  mocktails: {
    id: "mocktails",
    name: "Mocktails",
    category: "nutrition",
    description:
      "Refreshing non-alcoholic beverages packed with nutrients and natural flavors to hydrate and delight your senses.",
    image: require("@/assets/images/jf-club/mocktails.jpg"),
    sortIndex: 5,
  },
  recipes: {
    id: "recipes",
    name: "Recipes",
    category: "nutrition",
    description:
      "A collection of healthy, delicious recipes designed to support your wellness journey with balanced nutrition and amazing flavors.",
    image: require("@/assets/images/jf-club/recipes.jpg"),
    sortIndex: 6,
  },
  "apple cider": {
    id: "apple-cider",
    name: "Apple Cider",
    category: "nutrition",
    description:
      "Discover the health benefits and creative uses of apple cider in various wellness recipes and remedies.",
    image: require("@/assets/images/jf-club/apple-cider.jpg"),
    sortIndex: 7,
  },

  // Beauty category
  "face yoga mini class": {
    id: "face-yoga-mini-class",
    name: "Face Yoga Mini Class",
    category: "beauty",
    description:
      "Learn facial exercises and techniques to tone your facial muscles, improve circulation, and achieve a natural, youthful glow.",
    image: require("@/assets/images/jf-club/face-yoga.jpg"),
    sortIndex: 0,
  },
  "diy hair masks": {
    id: "diy-hair-masks",
    name: "DIY Hair Masks",
    category: "beauty",
    description:
      "Natural hair mask recipes using simple ingredients to nourish, strengthen, and revitalize your hair at home.",
    image: require("@/assets/images/jf-club/hair-masks.jpg"),
    sortIndex: 1,
  },
  "diy face masks": {
    id: "diy-face-masks",
    name: "DIY Face Masks",
    category: "beauty",
    description:
      "Create your own natural face masks with ingredients from your kitchen to address various skin concerns and achieve a radiant complexion.",
    image: require("@/assets/images/jf-club/face-masks.jpg"),
    sortIndex: 2,
  },
  "diy bath bombs": {
    id: "diy-bath-bombs",
    name: "DIY Bath Bombs",
    category: "beauty",
    description:
      "Learn to make luxurious bath bombs with natural ingredients that transform your bath time into a spa-like experience.",
    image: require("@/assets/images/jf-club/bath-bombs.jpg"),
    sortIndex: 3,
  },
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

// Get subcategory data with counts (legacy function for backward compatibility)
export const getSubcategoryData = (category: string): SubcategorySummary[] => {
  const items = getItemsByCategory(category);
  const uniqueSubcategories = [
    ...new Set(items.map((item) => item.subcategory)),
  ];

  const subcategoryData = uniqueSubcategories.map((subcategory) => {
    const subcategoryItems = getItemsBySubcategory(subcategory);
    const subcategoryInfo = SUBCATEGORY_DATA[subcategory];

    return {
      id: subcategoryInfo?.id || subcategory.toLowerCase().replace(/\s+/g, "-"),
      name:
        subcategoryInfo?.name ||
        subcategory.charAt(0).toUpperCase() + subcategory.slice(1),
      count: subcategoryItems.length,
      countLabel: subcategoryItems.length === 1 ? "track" : "tracks",
      imageUrl: subcategoryItems[0]?.imageUrl,
      _originalName: subcategory, // Keep for compatibility
    };
  });

  // Sort by defined order in SUBCATEGORY_DATA, then alphabetically for any not in the list
  return subcategoryData.sort((a, b) => {
    const subcategoryInfoA = SUBCATEGORY_DATA[a._originalName];
    const subcategoryInfoB = SUBCATEGORY_DATA[b._originalName];

    // Both have defined sort order - use defined order
    if (subcategoryInfoA && subcategoryInfoB) {
      return subcategoryInfoA.sortIndex - subcategoryInfoB.sortIndex;
    }
    // Only A has defined order - A comes first
    if (subcategoryInfoA) return -1;
    // Only B has defined order - B comes first
    if (subcategoryInfoB) return 1;
    // Neither in defined data - alphabetical
    return a.name.localeCompare(b.name);
  });
};

// Get detailed subcategory information
export const getSubcategoryDetail = (
  subcategory: string
): SubcategoryData | null => {
  // Convert kebab-case back to original format (e.g., "postpartum-nutrition" -> "postpartum nutrition")
  const normalizedSubcategory = subcategory.replace(/-/g, " ");
  const items = getItemsBySubcategory(normalizedSubcategory);
  if (items.length === 0) return null;

  const subcategoryInfo = SUBCATEGORY_DATA[normalizedSubcategory];

  const defaultInfo = {
    title:
      normalizedSubcategory.charAt(0).toUpperCase() +
      normalizedSubcategory.slice(1),
    subtitle: `${items.length} ${items.length === 1 ? "item" : "items"}`,
    description: "Wellness content to support your journey.",
  };

  const finalInfo = subcategoryInfo
    ? {
        title: subcategoryInfo.name,
        subtitle: `${items.length} ${items.length === 1 ? "item" : "items"}`,
        description: subcategoryInfo.description,
      }
    : defaultInfo;

  return {
    ...finalInfo,
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
  // Return a diverse selection of items from ALL subcategories for daily recommendations
  // Get items from each subcategory to ensure maximum diversity
  const guidedMeditations = getItemsBySubcategory("guided meditations").slice(
    0,
    2
  );
  const betterSleep = getItemsBySubcategory("better sleep").slice(0, 2);
  const binauralBeats = getItemsBySubcategory("binaural beats").slice(0, 2);
  const breathingTechniques = getItemsBySubcategory(
    "breathing techniques"
  ).slice(0, 2);
  const cardioFatBurn = getItemsBySubcategory("cardio and fat burn").slice(
    0,
    2
  );
  const diyBathBombs = getItemsBySubcategory("diy bath bombs").slice(0, 2);
  const diyFaceMasks = getItemsBySubcategory("diy face masks").slice(0, 2);
  const diyHairMasks = getItemsBySubcategory("diy hair masks").slice(0, 2);
  const faceYoga = getItemsBySubcategory("face yoga mini class").slice(0, 2);
  const fitness = getItemsBySubcategory("fitness").slice(0, 2);
  const guidedAffirmations = getItemsBySubcategory("guided affirmations").slice(
    0,
    2
  );
  const mobilityStretching = getItemsBySubcategory(
    "mobility & stretching"
  ).slice(0, 2);
  const pilates = getItemsBySubcategory("pilates").slice(0, 2);
  const postpartumNutrition = getItemsBySubcategory(
    "postpartum nutrition"
  ).slice(0, 2);
  const relaxationMusic = getItemsBySubcategory("relaxation music").slice(0, 2);
  const snacks = getItemsBySubcategory("snacks").slice(0, 2);
  const soundsOfNature = getItemsBySubcategory("sounds of nature").slice(0, 2);
  const yoga = getItemsBySubcategory("yoga").slice(0, 2);

  return [
    ...guidedMeditations,
    ...betterSleep,
    ...binauralBeats,
    ...breathingTechniques,
    ...cardioFatBurn,
    ...diyBathBombs,
    ...diyFaceMasks,
    ...diyHairMasks,
    ...faceYoga,
    ...fitness,
    ...guidedAffirmations,
    ...mobilityStretching,
    ...pilates,
    ...postpartumNutrition,
    ...relaxationMusic,
    ...snacks,
    ...soundsOfNature,
    ...yoga,
  ];
};

// Format subcategory title with proper capitalization and symbols
export const formatSubcategoryTitle = (title: string): string => {
  return title
    .split(" ")
    .map((word) => {
      // Make DIY completely uppercase
      if (word.toLowerCase() === "diy") {
        return "DIY";
      }
      // Replace "and" with "&"
      if (word.toLowerCase() === "and") {
        return "&";
      }
      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

// Get subcategory image from unified data structure
export const getSubcategoryImage = (subcategory: string) => {
  const subcategoryInfo = SUBCATEGORY_DATA[subcategory];

  // Return mapped image or fallback to placeholder
  return (
    subcategoryInfo?.image || require("@/assets/images/jf-club/placeholder.jpg")
  );
};

// Get subcategory info from unified data structure
export const getSubcategoryInfo = (subcategory: string) => {
  return SUBCATEGORY_DATA[subcategory];
};

// Get all subcategories for a category, ordered by defined sort order
export const getOrderedSubcategoriesForCategory = (category: string) => {
  const allSubcategories = Object.values(SUBCATEGORY_DATA)
    .filter((subcategory) => subcategory.category === category)
    .sort((a, b) => a.sortIndex - b.sortIndex);

  return allSubcategories;
};

// Category images for the trending section
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

// Get category images for trending section
export const getCategoryImages = () => {
  return Object.values(CATEGORY_IMAGES);
};

// Export the comprehensive subcategory data structure for use throughout the app
export { SUBCATEGORY_DATA };
