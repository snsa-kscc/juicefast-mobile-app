import { ImageSourcePropType } from "react-native";

export const DEFAULT_IMAGE = require("@/assets/images/jf-club/placeholder.jpg");

export const getImageWithFallback = (
  uri: string | undefined,
  fallback: ImageSourcePropType = DEFAULT_IMAGE
): ImageSourcePropType => {
  // If uri exists, is not empty, and is not the placeholder path, use it
  if (uri && !uri.includes("webp")) {
    return { uri };
  }
  // Otherwise, use the fallback image
  return fallback;
};
