import { ImageSourcePropType } from "react-native";

export const DEFAULT_IMAGES = {
  icon: require("@/assets/images/icon.png"),
  clubPlaceholder: require("@/assets/images/jf-club/placeholder.jpg"),
  recipe: require("@/assets/images/jf-club/placeholder.jpg"),
} as const;

export const getImageWithFallback = (
  uri: string | undefined,
  fallback: ImageSourcePropType = DEFAULT_IMAGES.icon
): { uri?: string; defaultSource: ImageSourcePropType } => {
  if (uri) {
    return { uri, defaultSource: fallback };
  }
  return { defaultSource: fallback };
};
