import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { VideoView, useVideoPlayer } from "expo-video";
import { CLUB_DATA } from "@/utils/clubData";
import { ProcessedClubItem } from "@/types/club";
import { SafeAreaView } from "react-native-safe-area-context";
import { WellnessHeader } from "@/components/ui/CustomHeader";

export default function ClubContentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showVideo, setShowVideo] = useState(false);

  // Find the item from club data
  const item = CLUB_DATA.find((item: ProcessedClubItem) => item.id === id);

  // Create video player only for video content
  const player =
    item?.type === "video" && item.url
      ? useVideoPlayer(item.url, (player) => {
          player.loop = false;
        })
      : null;

  // Track playing state - only for video content with valid player
  const { isPlaying } = player
    ? useEvent(player, "playingChange", {
        isPlaying: player.playing,
      })
    : { isPlaying: false };

  if (!item) {
    return (
      <SafeAreaView className="flex-1 bg-jf-gray">
        <WellnessHeader
          title="Content Not Found"
          subtitle="The wellness content you&apos;re looking for doesn&apos;t exist"
          showBackButton={true}
          onBackPress={() => router.back()}
          showSettings={true}
          onSettingsPress={() => router.push("/profile")}
        />
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-2xl font-lufga-bold text-gray-900 mb-4">Content Not Found</Text>
          <Text className="text-base font-lufga-regular text-gray-500 text-center mb-6">
            The wellness content you&apos;re looking for doesn&apos;t exist.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const getActionText = () => {
    switch (item.type) {
      case "meditation":
        return "Start Meditation";
      case "track":
        return "Play Track";
      case "video":
        return showVideo
          ? isPlaying
            ? "Pause Video"
            : "Resume Video"
          : "Watch Video";
      case "audio":
        return "Play Audio";
      default:
        return "Start Content";
    }
  };

  const handlePlayPress = async () => {
    if (item.type === "video") {
      if (!item.url) {
        Alert.alert("Error", "Video URL is not available for this content.");
        return;
      }

      if (!player) {
        Alert.alert("Error", "Video player is not available.");
        return;
      }

      if (!showVideo) {
        // Show video player for the first time
        setShowVideo(true);
        try {
          player.play();
        } catch (error) {
          console.error("Video play error:", error);
          Alert.alert(
            "Playback Error",
            "Unable to start video playback. Please try again."
          );
        }
      } else {
        // Toggle play/pause
        try {
          if (isPlaying) {
            player.pause();
          } else {
            player.play();
          }
        } catch (error) {
          console.error("Video playback error:", error);
          Alert.alert(
            "Playback Error",
            "Unable to control video playback. Please try again."
          );
        }
      }
    } else {
      // Handle other content types
      Alert.alert(
        "Coming Soon",
        "Audio playback functionality will be available soon."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-jf-gray">
      <WellnessHeader
        title={item.title}
        subtitle={item.subcategory ? `${item.subcategory.charAt(0).toUpperCase() + item.subcategory.slice(1)}${item.duration ? ` • ${item.duration}` : ''}` : item.duration || ''}
        showBackButton={true}
        onBackPress={() => router.back()}
        showSettings={true}
        onSettingsPress={() => router.push("/profile")}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Video or Image Container */}
        <View className="relative w-full aspect-video bg-black">
          {showVideo && item.type === "video" && player ? (
            <VideoView
              player={player}
              className="w-full h-full"
              nativeControls={true}
              fullscreenOptions={{ enable: true }}
              allowsPictureInPicture={true}
            />
          ) : (
            <>
              <Image
                source={{ uri: item.imageUrl }}
                className="w-full h-full"
                defaultSource={require("@/assets/images/icon.png")}
              />
              {/* Video overlay controls (only show when video is not playing) */}
              {item.type === "video" && !showVideo && (
                <TouchableOpacity
                  onPress={handlePlayPress}
                  className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/30"
                >
                  <View className="bg-black/60 rounded-full p-4">
                    <Ionicons name="play" size={32} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Content actions */}
        <View className="p-4">
          {/* Play button */}
          <TouchableOpacity className="bg-green-500 flex-row items-center justify-center py-3 rounded-[25px] mb-4" onPress={handlePlayPress}>
            <Ionicons
              name={
                item.type === "video" && showVideo && isPlaying
                  ? "pause"
                  : "play"
              }
              size={20}
              color="#FFFFFF"
            />
            <Text className="text-white text-base font-lufga-semibold ml-2">{getActionText()}</Text>
          </TouchableOpacity>

          {/* Secondary actions */}
          <View className="flex-row justify-between">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2 border border-gray-200 rounded-lg mx-1">
              <Ionicons name="bookmark-outline" size={16} color="#374151" />
              <Text className="text-gray-700 text-sm font-lufga-regular ml-1">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2 border border-gray-200 rounded-lg mx-1">
              <Ionicons name="share-outline" size={16} color="#374151" />
              <Text className="text-gray-700 text-sm font-lufga-regular ml-1">Share</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2 border border-gray-200 rounded-lg mx-1">
              <Ionicons name="heart-outline" size={16} color="#374151" />
              <Text className="text-gray-700 text-sm font-lufga-regular ml-1">Like</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View className="px-4 pb-8">
          <Text className="text-lg font-lufga-bold text-gray-900 mb-2">About</Text>
          <Text className="text-base font-lufga-regular text-gray-500 leading-6">
            {getDescriptionForType(item.type)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getDescriptionForType = (type: string): string => {
  switch (type) {
    case "meditation":
      return "This meditation helps you relax and focus on your breath. Find a comfortable position, close your eyes, and follow along.";
    case "track":
      return "This audio track is designed to help you relax and unwind. Find a quiet space, put on headphones for the best experience.";
    case "video":
      return "This video guide will walk you through the process step by step. Follow along at your own pace.";
    case "audio":
      return "This audio content provides valuable insights and guidance to improve your wellness journey.";
    default:
      return "This wellness content is designed to support your health and mindfulness journey.";
  }
};

