import { ImageSourcePropType } from "react-native";

export const DEFAULT_IMAGES = {
  icon: require("@/assets/images/jf-club/placeholder.jpg"),
  clubPlaceholder: require("@/assets/images/jf-club/placeholder.jpg"),
  article: require("@/assets/images/jf-club/placeholder.jpg"),
} as const;

export const getImageWithFallback = (
  uri: string | undefined,
  fallback: ImageSourcePropType = DEFAULT_IMAGES.icon
): ImageSourcePropType => {
  // If uri exists, is not empty, and is not the placeholder path, use it
  if (uri && !uri.includes("webp")) {
    return { uri };
  }
  // Otherwise, use the fallback image
  return fallback;
};
