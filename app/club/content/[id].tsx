import React, { useState, useEffect } from "react";
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
import { getImageWithFallback, DEFAULT_IMAGES } from "@/utils/imageUtils";
import { PaywallGuard } from "@/components/paywall/PaywallGuard";

export default function ClubContentDetail() {
  const { id, isFree } = useLocalSearchParams<{
    id: string;
    isFree?: string;
  }>();
  const isItemFree = isFree === "true";
  const [showVideo, setShowVideo] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [audioPosition, setAudioPosition] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  // Find the item from club data
  const item = CLUB_DATA.find((item: ProcessedClubItem) => item.id === id);

  // Create video/audio player - always call hook but conditionally use it
  const mediaUrl =
    (item?.type === "video" ||
      item?.type === "audio" ||
      item?.type === "meditation" ||
      item?.type === "track") &&
    item.url
      ? item.url
      : "";

  const player = useVideoPlayer(mediaUrl, (player) => {
    if (player) {
      player.loop = false;
      player.showNowPlayingNotification = item?.type !== "video";
    }
  });

  // Track playing state
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player?.playing || false,
  });

  // Track audio progress
  useEffect(() => {
    if (
      (item?.type === "audio" ||
        item?.type === "meditation" ||
        item?.type === "track") &&
      player
    ) {
      const interval = setInterval(() => {
        if (player.playing) {
          setAudioPosition(player.currentTime || 0);
          setAudioDuration(player.duration || 0);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [player, isPlaying, item?.type]);

  if (!item) {
    return (
      <SafeAreaView className="flex-1 bg-jf-gray">
        <WellnessHeader
          title="Content Not Found"
          subtitle="The wellness content you're looking for doesn't exist"
          showBackButton={true}
          onBackPress={() => router.back()}
          showSettings={true}
          onSettingsPress={() => router.push("/profile")}
        />
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-2xl font-lufga-bold text-gray-900 mb-4">
            Content Not Found
          </Text>
          <Text className="text-base font-lufga-regular text-gray-500 text-center mb-6">
            The wellness content you&apos;re looking for doesn&apos;t exist.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getActionText = () => {
    switch (item.type) {
      case "meditation":
        return showAudio
          ? isPlaying
            ? "Pause Meditation"
            : "Resume Meditation"
          : "Start Meditation";
      case "track":
        return showAudio
          ? isPlaying
            ? "Pause Track"
            : "Resume Track"
          : "Play Track";
      case "video":
        return showVideo
          ? isPlaying
            ? "Pause Video"
            : "Resume Video"
          : "Watch Video";
      case "audio":
        return showAudio
          ? isPlaying
            ? "Pause Audio"
            : "Resume Audio"
          : "Play Audio";
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
    } else if (
      item.type === "audio" ||
      item.type === "meditation" ||
      item.type === "track"
    ) {
      // Handle audio content types
      if (!item.url) {
        Alert.alert("Error", "Audio URL is not available for this content.");
        return;
      }

      if (!player) {
        Alert.alert("Error", "Audio player is not available.");
        return;
      }

      if (!showAudio) {
        // Show audio player for the first time
        setShowAudio(true);
        try {
          player.play();
        } catch (error) {
          console.error("Audio play error:", error);
          Alert.alert(
            "Playback Error",
            "Unable to start audio playback. Please try again."
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
          console.error("Audio playback error:", error);
          Alert.alert(
            "Playback Error",
            "Unable to control audio playback. Please try again."
          );
        }
      }
    } else {
      // Handle other content types
      Alert.alert(
        "Content Not Supported",
        "This content type is not yet supported."
      );
    }
  };

  const content = (
    <SafeAreaView className="flex-1 bg-jf-gray">
      <WellnessHeader
        title={item.title}
        subtitle={
          item.subcategory
            ? `${item.subcategory.charAt(0).toUpperCase() + item.subcategory.slice(1)}${item.duration ? ` • ${item.duration}` : ""}`
            : item.duration || ""
        }
        showBackButton={true}
        onBackPress={() => router.back()}
        showSettings={true}
        onSettingsPress={() => router.push("/profile")}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Video or Audio Container */}
        <View className="relative w-full aspect-video bg-black">
          {showVideo && item.type === "video" && player ? (
            <VideoView
              player={player}
              className="w-full h-full"
              nativeControls={true}
              fullscreenOptions={{ enable: true }}
              allowsPictureInPicture={true}
            />
          ) : showAudio &&
            (item.type === "audio" ||
              item.type === "meditation" ||
              item.type === "track") &&
            player ? (
            // Audio player interface
            <View className="w-full h-full bg-gradient-to-b from-gray-900 to-black flex flex-col justify-center items-center px-6">
              {/* Audio Icon */}
              <View className="bg-white/20 rounded-full p-8 mb-6">
                <Ionicons
                  name={
                    item.type === "meditation"
                      ? "flower"
                      : item.type === "track"
                        ? "radio"
                        : "volume-high"
                  }
                  size={48}
                  color="#FFFFFF"
                />
              </View>

              {/* Audio Title */}
              <Text className="text-white text-xl font-lufga-bold text-center mb-2">
                {item.title}
              </Text>
              <Text className="text-white/80 text-sm font-lufga-regular text-center mb-8">
                {item.subcategory} • {item.duration}
              </Text>

              {/* Progress Bar */}
              <View className="w-full mb-6">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white/60 text-xs font-lufga-regular">
                    {formatTime(audioPosition)}
                  </Text>
                  <Text className="text-white/60 text-xs font-lufga-regular">
                    {formatTime(audioDuration)}
                  </Text>
                </View>
                <View className="h-1 bg-white/20 rounded-full">
                  <View
                    className="h-full bg-white rounded-full"
                    style={{
                      width: `${audioDuration > 0 ? (audioPosition / audioDuration) * 100 : 0}%`,
                    }}
                  />
                </View>
              </View>

              {/* Play Controls */}
              <View className="flex-row items-center gap-6">
                <TouchableOpacity>
                  <Ionicons name="play-skip-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePlayPress}
                  className="bg-white rounded-full p-4"
                >
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={24}
                    color="#000000"
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons
                    name="play-skip-forward"
                    size={24}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Image
                source={getImageWithFallback(
                  item.imageUrl,
                  DEFAULT_IMAGES.icon
                )}
                className="w-full h-full"
              />
              {/* Video overlay controls */}
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

              {/* Audio overlay controls */}
              {(item.type === "audio" ||
                item.type === "meditation" ||
                item.type === "track") &&
                !showAudio && (
                  <TouchableOpacity
                    onPress={handlePlayPress}
                    className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/30"
                  >
                    <View className="bg-black/60 rounded-full p-6">
                      <Ionicons
                        name={
                          item.type === "meditation"
                            ? "flower"
                            : item.type === "track"
                              ? "radio"
                              : "volume-high"
                        }
                        size={40}
                        color="#FFFFFF"
                      />
                    </View>
                    <View className="mt-4">
                      <Text className="text-white text-lg font-lufga-bold">
                        {item.type === "meditation"
                          ? "Start Meditation"
                          : item.type === "track"
                            ? "Play Track"
                            : "Play Audio"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
            </>
          )}
        </View>

        {/* Content actions */}
        <View className="p-4">
          {/* Play button */}
          <TouchableOpacity
            className="bg-green-500 flex-row items-center justify-center py-3 rounded-[25px] mb-4"
            onPress={handlePlayPress}
          >
            <Ionicons
              name={
                item.type === "video" && showVideo && isPlaying
                  ? "pause"
                  : "play"
              }
              size={20}
              color="#FFFFFF"
            />
            <Text className="text-white text-base font-lufga-semibold ml-2">
              {getActionText()}
            </Text>
          </TouchableOpacity>

          {/* Secondary actions */}
          <View className="flex-row justify-between">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2 border border-gray-200 rounded-lg mx-1">
              <Ionicons name="bookmark-outline" size={16} color="#374151" />
              <Text className="text-gray-700 text-sm font-lufga-regular ml-1">
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2 border border-gray-200 rounded-lg mx-1">
              <Ionicons name="share-outline" size={16} color="#374151" />
              <Text className="text-gray-700 text-sm font-lufga-regular ml-1">
                Share
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2 border border-gray-200 rounded-lg mx-1">
              <Ionicons name="heart-outline" size={16} color="#374151" />
              <Text className="text-gray-700 text-sm font-lufga-regular ml-1">
                Like
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View className="px-4 pb-8">
          <Text className="text-lg font-lufga-bold text-gray-900 mb-2">
            About
          </Text>
          <Text className="text-base font-lufga-regular text-gray-500 leading-6">
            {getDescriptionForType(item.type)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // Wrap with PaywallGuard only if item is not free
  return isItemFree ? content : <PaywallGuard>{content}</PaywallGuard>;
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
