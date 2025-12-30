import { ImageSourcePropType } from "react-native";

export const DEFAULT_IMAGES = {
  icon: require("@/assets/images/icon.png"),
  clubPlaceholder: require("@/assets/images/jf-club/placeholder.jpg"),
  recipe: require("@/assets/images/jf-club/placeholder.jpg"),
} as const;

export const getImageWithFallback = (
  uri: string | undefined,
  fallback: ImageSourcePropType = DEFAULT_IMAGES.icon
): ImageSourcePropType => {
  // If uri exists, is not empty, and is not the placeholder path, use it
  if (uri && uri.trim() !== "" && !uri.includes("/images/placeholder.jpg")) {
    return { uri };
  }
  // Otherwise, use the fallback image
  return fallback;
};
