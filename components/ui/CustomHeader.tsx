import { Settings, ArrowLeft } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";

interface WellnessHeaderProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  itemCount?: number;
  itemCountLabel?: string;
  onSettingsPress?: () => void;
  onBackPress?: () => void;
  showBackButton?: boolean;
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
}: WellnessHeaderProps) {
  return (
    <View className="relative overflow-hidden" style={{ backgroundColor: backgroundColor || 'transparent' }}>
      {/* Background Image */}
      {backgroundImage && (
        <Image
          source={typeof backgroundImage === 'string' ? { uri: backgroundImage } : backgroundImage}
          className="absolute inset-0 w-full h-full"
          style={{ resizeMode: 'cover' }}
        />
      )}

      {/* Overlay for better text visibility */}
      {backgroundImage && (
        <View className="absolute inset-0 bg-black/30" />
      )}

      <View className="px-6 z-10" style={{ paddingTop: 32, paddingBottom: 24 }}>
        {showBackButton ? (
          // Two-row layout when back button is visible
          <>
            {/* First row: Back button and Settings */}
            <View className="flex-row justify-between items-start mb-6">
              <TouchableOpacity
                className="w-14 h-14 rounded-full justify-center items-center"
                style={{ backgroundColor: accentColor }}
                onPress={onBackPress}
              >
                <ArrowLeft size={24} color="white" />
              </TouchableOpacity>
              {showSettings && (
                <TouchableOpacity
                  className="w-10 h-10 rounded-full bg-transparent justify-center items-center"
                  onPress={onSettingsPress}
                >
                  <Settings size={24} color={backgroundImage ? "white" : "#1A1A1A"} />
                </TouchableOpacity>
              )}
            </View>

            {/* Second row: Title and Subtitle */}
            <View className="mb-4">
              {title && (
                <Text className="text-xl font-lufga-medium mb-2" style={{ color: backgroundImage ? 'white' : '#111827' }}>
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text className="text-sm font-lufga-regular leading-5 mb-2" style={{ color: backgroundImage ? 'rgba(255,255,255,0.9)' : '#374151' }}>
                  {subtitle}
                </Text>
              )}
              {itemCount !== undefined && itemCount !== null && (
                <Text className="text-xs font-lufga-medium" style={{ color: backgroundImage ? 'rgba(255,255,255,0.8)' : '#6B7280' }}>
                  {itemCount} {itemCount === 1 ? (itemCountLabel || 'item') : (itemCountLabel || 'items')}
                </Text>
              )}
            </View>
          </>
        ) : (
          // Single-row layout when no back button
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1 mr-4">
              {title && (
                <Text className="text-xl font-lufga-medium mb-2" style={{ color: backgroundImage ? 'white' : '#111827' }}>
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text className="text-sm font-lufga-regular leading-5 mb-2" style={{ color: backgroundImage ? 'rgba(255,255,255,0.9)' : '#374151' }}>
                  {subtitle}
                </Text>
              )}
              {itemCount !== undefined && itemCount !== null && (
                <Text className="text-xs font-lufga-medium" style={{ color: backgroundImage ? 'rgba(255,255,255,0.8)' : '#6B7280' }}>
                  {itemCount} {itemCount === 1 ? (itemCountLabel || 'item') : (itemCountLabel || 'items')}
                </Text>
              )}
            </View>
            {showSettings && (
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-transparent justify-center items-center"
                onPress={onSettingsPress}
              >
                <Settings size={24} color={backgroundImage ? "white" : "#1A1A1A"} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
