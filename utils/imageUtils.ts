import { ImageSourcePropType } from "react-native";

export const DEFAULT_IMAGE = require("@/assets/images/jf-club/placeholder.jpg");

// Beauty images mapping (1.webp to 40.webp)
const beautyImages: Record<string, ImageSourcePropType> = {
  "1.webp": require("@/assets/images/jf-club/beauty/1.webp"),
  "2.webp": require("@/assets/images/jf-club/beauty/2.webp"),
  "3.webp": require("@/assets/images/jf-club/beauty/3.webp"),
  "4.webp": require("@/assets/images/jf-club/beauty/4.webp"),
  "5.webp": require("@/assets/images/jf-club/beauty/5.webp"),
  "6.webp": require("@/assets/images/jf-club/beauty/6.webp"),
  "7.webp": require("@/assets/images/jf-club/beauty/7.webp"),
  "8.webp": require("@/assets/images/jf-club/beauty/8.webp"),
  "9.webp": require("@/assets/images/jf-club/beauty/9.webp"),
  "10.webp": require("@/assets/images/jf-club/beauty/10.webp"),
  "11.webp": require("@/assets/images/jf-club/beauty/11.webp"),
  "12.webp": require("@/assets/images/jf-club/beauty/12.webp"),
  "13.webp": require("@/assets/images/jf-club/beauty/13.webp"),
  "14.webp": require("@/assets/images/jf-club/beauty/14.webp"),
  "15.webp": require("@/assets/images/jf-club/beauty/15.webp"),
  "16.webp": require("@/assets/images/jf-club/beauty/16.webp"),
  "17.webp": require("@/assets/images/jf-club/beauty/17.webp"),
  "18.webp": require("@/assets/images/jf-club/beauty/18.webp"),
  "19.webp": require("@/assets/images/jf-club/beauty/19.webp"),
  "20.webp": require("@/assets/images/jf-club/beauty/20.webp"),
  "21.webp": require("@/assets/images/jf-club/beauty/21.webp"),
  "22.webp": require("@/assets/images/jf-club/beauty/22.webp"),
  "23.webp": require("@/assets/images/jf-club/beauty/23.webp"),
  "24.webp": require("@/assets/images/jf-club/beauty/24.webp"),
  "25.webp": require("@/assets/images/jf-club/beauty/25.webp"),
  "26.webp": require("@/assets/images/jf-club/beauty/26.webp"),
  "27.webp": require("@/assets/images/jf-club/beauty/27.webp"),
  "28.webp": require("@/assets/images/jf-club/beauty/28.webp"),
  "29.webp": require("@/assets/images/jf-club/beauty/29.webp"),
  "30.webp": require("@/assets/images/jf-club/beauty/30.webp"),
  "31.webp": require("@/assets/images/jf-club/beauty/31.webp"),
  "32.webp": require("@/assets/images/jf-club/beauty/32.webp"),
  "33.webp": require("@/assets/images/jf-club/beauty/33.webp"),
  "34.webp": require("@/assets/images/jf-club/beauty/34.webp"),
  "35.webp": require("@/assets/images/jf-club/beauty/35.webp"),
  "36.webp": require("@/assets/images/jf-club/beauty/36.webp"),
  "37.webp": require("@/assets/images/jf-club/beauty/37.webp"),
  "38.webp": require("@/assets/images/jf-club/beauty/38.webp"),
  "39.webp": require("@/assets/images/jf-club/beauty/39.webp"),
  "40.webp": require("@/assets/images/jf-club/beauty/40.webp"),
};

// Recipe images mapping (1.webp to 60.webp)
const recipeImages: Record<string, ImageSourcePropType> = {
  "1.webp": require("@/assets/images/jf-club/recipes/1.webp"),
  "2.webp": require("@/assets/images/jf-club/recipes/2.webp"),
  "3.webp": require("@/assets/images/jf-club/recipes/3.webp"),
  "4.webp": require("@/assets/images/jf-club/recipes/4.webp"),
  "5.webp": require("@/assets/images/jf-club/recipes/5.webp"),
  "6.webp": require("@/assets/images/jf-club/recipes/6.webp"),
  "7.webp": require("@/assets/images/jf-club/recipes/7.webp"),
  "8.webp": require("@/assets/images/jf-club/recipes/8.webp"),
  "9.webp": require("@/assets/images/jf-club/recipes/9.webp"),
  "10.webp": require("@/assets/images/jf-club/recipes/10.webp"),
  "11.webp": require("@/assets/images/jf-club/recipes/11.webp"),
  "12.webp": require("@/assets/images/jf-club/recipes/12.webp"),
  "13.webp": require("@/assets/images/jf-club/recipes/13.webp"),
  "14.webp": require("@/assets/images/jf-club/recipes/14.webp"),
  "15.webp": require("@/assets/images/jf-club/recipes/15.webp"),
  "16.webp": require("@/assets/images/jf-club/recipes/16.webp"),
  "17.webp": require("@/assets/images/jf-club/recipes/17.webp"),
  "18.webp": require("@/assets/images/jf-club/recipes/18.webp"),
  "19.webp": require("@/assets/images/jf-club/recipes/19.webp"),
  "20.webp": require("@/assets/images/jf-club/recipes/20.webp"),
  "21.webp": require("@/assets/images/jf-club/recipes/21.webp"),
  "22.webp": require("@/assets/images/jf-club/recipes/22.webp"),
  "23.webp": require("@/assets/images/jf-club/recipes/23.webp"),
  "24.webp": require("@/assets/images/jf-club/recipes/24.webp"),
  "25.webp": require("@/assets/images/jf-club/recipes/25.webp"),
  "26.webp": require("@/assets/images/jf-club/recipes/26.webp"),
  "27.webp": require("@/assets/images/jf-club/recipes/27.webp"),
  "28.webp": require("@/assets/images/jf-club/recipes/28.webp"),
  "29.webp": require("@/assets/images/jf-club/recipes/29.webp"),
  "30.webp": require("@/assets/images/jf-club/recipes/30.webp"),
  "31.webp": require("@/assets/images/jf-club/recipes/31.webp"),
  "32.webp": require("@/assets/images/jf-club/recipes/32.webp"),
  "33.webp": require("@/assets/images/jf-club/recipes/33.webp"),
  "34.webp": require("@/assets/images/jf-club/recipes/34.webp"),
  "35.webp": require("@/assets/images/jf-club/recipes/35.webp"),
  "36.webp": require("@/assets/images/jf-club/recipes/36.webp"),
  "37.webp": require("@/assets/images/jf-club/recipes/37.webp"),
  "38.webp": require("@/assets/images/jf-club/recipes/38.webp"),
  "39.webp": require("@/assets/images/jf-club/recipes/39.webp"),
  "40.webp": require("@/assets/images/jf-club/recipes/40.webp"),
  "41.webp": require("@/assets/images/jf-club/recipes/41.webp"),
  "42.webp": require("@/assets/images/jf-club/recipes/42.webp"),
  "43.webp": require("@/assets/images/jf-club/recipes/43.webp"),
  "44.webp": require("@/assets/images/jf-club/recipes/44.webp"),
  "45.webp": require("@/assets/images/jf-club/recipes/45.webp"),
  "46.webp": require("@/assets/images/jf-club/recipes/46.webp"),
  "47.webp": require("@/assets/images/jf-club/recipes/47.webp"),
  "48.webp": require("@/assets/images/jf-club/recipes/48.webp"),
  "49.webp": require("@/assets/images/jf-club/recipes/49.webp"),
  "50.webp": require("@/assets/images/jf-club/recipes/50.webp"),
  "51.webp": require("@/assets/images/jf-club/recipes/51.webp"),
  "52.webp": require("@/assets/images/jf-club/recipes/52.webp"),
  "53.webp": require("@/assets/images/jf-club/recipes/53.webp"),
  "54.webp": require("@/assets/images/jf-club/recipes/54.webp"),
  "55.webp": require("@/assets/images/jf-club/recipes/55.webp"),
  "56.webp": require("@/assets/images/jf-club/recipes/56.webp"),
  "57.webp": require("@/assets/images/jf-club/recipes/57.webp"),
  "58.webp": require("@/assets/images/jf-club/recipes/58.webp"),
  "59.webp": require("@/assets/images/jf-club/recipes/59.webp"),
  "60.webp": require("@/assets/images/jf-club/recipes/60.webp"),
};

export const getImageWithFallback = (
  uri: string | undefined,
  fallback: ImageSourcePropType = DEFAULT_IMAGE,
  imageType?: "beauty" | "recipe"
): ImageSourcePropType => {
  if (!uri) {
    return fallback;
  }

  // Check if it's a numbered webp file (e.g., "1.webp", "10.webp")
  if (uri.match(/^\d+\.webp$/)) {
    if (imageType === "beauty" && beautyImages[uri]) {
      return beautyImages[uri];
    }
    if (imageType === "recipe" && recipeImages[uri]) {
      return recipeImages[uri];
    }
    // If no type specified, try both (recipes have more images)
    if (recipeImages[uri]) {
      return recipeImages[uri];
    }
    if (beautyImages[uri]) {
      return beautyImages[uri];
    }
  }

  // If it's a full URI (http/https), use it directly
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return { uri };
  }

  // Otherwise, use the fallback image
  return fallback;
};

// Helper to get beauty image
export const getBeautyImage = (
  imageName: string,
  fallback: ImageSourcePropType = DEFAULT_IMAGE
): ImageSourcePropType => {
  return getImageWithFallback(imageName, fallback, "beauty");
};

// Helper to get recipe image
export const getRecipeImage = (
  imageName: string,
  fallback: ImageSourcePropType = DEFAULT_IMAGE
): ImageSourcePropType => {
  return getImageWithFallback(imageName, fallback, "recipe");
};
