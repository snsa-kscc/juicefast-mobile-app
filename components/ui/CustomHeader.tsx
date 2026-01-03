import { Settings, ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ImageSourcePropType,
} from "react-native";
import { Image } from "expo-image";

interface WellnessHeaderProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  backgroundColor?: string;
  backgroundImage?: string | ImageSourcePropType;
  itemCount?: number;
  itemCountLabel?: string;
  onSettingsPress?: () => void;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
  showSettings?: boolean;
}

export function WellnessHeader({
  title,
  subtitle = "Today I'm going to....",
  accentColor = "rgb(76, 195, 255)",
  backgroundColor,
  backgroundImage,
  itemCount,
  itemCountLabel,
  onSettingsPress,
  onBackPress,
  showBackButton = false,
  showSettings = true,
  rightContent,
}: WellnessHeaderProps) {
  return (
    <View
      className="relative overflow-hidden"
      style={{ backgroundColor: backgroundColor || "transparent" }}
    >
      {/* Background Image */}
      {backgroundImage && (
        <Image
          source={
            typeof backgroundImage === "string"
              ? { uri: backgroundImage }
              : backgroundImage
          }
          className="absolute inset-0 w-full h-full"
          contentFit="cover"
        />
      )}

      {/* Overlay for better text visibility */}
      {backgroundImage && <View className="absolute inset-0 bg-black/30" />}

      <View className="px-6 z-10" style={{ paddingTop: 32, paddingBottom: 24 }}>
        <View className="flex-row justify-between items-center mb-4">
          {showBackButton && (
            <TouchableOpacity
              className="w-14 h-14 rounded-full justify-center items-center mr-6"
              style={{ backgroundColor: accentColor }}
              onPress={onBackPress}
            >
              <ArrowLeft size={20} color="white" />
            </TouchableOpacity>
          )}
          <View className="flex-1 mr-4">
            {title && (
              <Text
                className="text-xl font-lufga-bold mb-2"
                style={{ color: backgroundImage ? "white" : "#111827" }}
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                className="text-sm font-lufga leading-5 mb-2"
                style={{
                  color: backgroundImage ? "rgba(255,255,255,0.9)" : "#374151",
                }}
              >
                {subtitle}
              </Text>
            )}
            {itemCount !== undefined && itemCount !== null && (
              <Text
                className="text-xs font-lufga-medium"
                style={{
                  color: backgroundImage ? "rgba(255,255,255,0.8)" : "#6B7280",
                }}
              >
                {itemCount}{" "}
                {itemCount === 1
                  ? itemCountLabel || "item"
                  : itemCountLabel || "items"}
              </Text>
            )}
          </View>
          {rightContent
            ? rightContent
            : showSettings && (
                <TouchableOpacity
                  className="w-14 h-14 rounded-full bg-transparent justify-center items-center"
                  onPress={onSettingsPress}
                >
                  <Settings
                    size={28}
                    color={backgroundImage ? "white" : "#1A1A1A"}
                  />
                </TouchableOpacity>
              )}
        </View>
      </View>
    </View>
  );
}
