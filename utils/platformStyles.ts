import { Platform } from "react-native";

/**
 * Returns platform-specific vertical padding for input fields
 * Android: py-1 (smaller padding)
 * iOS: py-3 (default padding)
 */
export const getInputFieldPadding = (): string => {
  return Platform.OS === "android" ? "py-1" : "py-3";
};
