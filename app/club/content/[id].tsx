import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { VideoView, useVideoPlayer } from "expo-video";
import { CLUB_DATA } from "@/utils/clubData";
import { ProcessedClubItem } from "@/types/club";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClubContentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showVideo, setShowVideo] = useState(false);

  // Find the item from club data
  const item = CLUB_DATA.find((item: ProcessedClubItem) => item.id === id);

  // Create video player only for video content
  const player = item?.type === 'video' && item.url ? useVideoPlayer(item.url, player => {
    player.loop = false;
  }) : null;

  // Track playing state - only for video content with valid player
  const { isPlaying } = player ? useEvent(player, 'playingChange', { 
    isPlaying: player.playing 
  }) : { isPlaying: false };

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Content Not Found</Text>
          <Text style={styles.errorText}>The wellness content you're looking for doesn't exist.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={16} color="#374151" />
            <Text style={styles.backButtonText}>Back to Club</Text>
          </TouchableOpacity>
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
        return showVideo ? (isPlaying ? "Pause Video" : "Resume Video") : "Watch Video";
      case "audio":
        return "Play Audio";
      default:
        return "Start Content";
    }
  };

  const handlePlayPress = async () => {
    if (item.type === 'video') {
      if (!item.url) {
        Alert.alert('Error', 'Video URL is not available for this content.');
        return;
      }
      
      if (!player) {
        Alert.alert('Error', 'Video player is not available.');
        return;
      }
      
      if (!showVideo) {
        // Show video player for the first time
        setShowVideo(true);
        try {
          player.play();
        } catch (error) {
          console.error('Video play error:', error);
          Alert.alert('Playback Error', 'Unable to start video playback. Please try again.');
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
          console.error('Video playback error:', error);
          Alert.alert('Playback Error', 'Unable to control video playback. Please try again.');
        }
      }
    } else {
      // Handle other content types
      Alert.alert('Coming Soon', 'Audio playback functionality will be available soon.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed header with back button and content info */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{item.title}</Text>
          <View style={styles.headerMeta}>
            {item.subcategory && (
              <Text style={styles.headerSubtitle}>
                {item.subcategory.charAt(0).toUpperCase() + item.subcategory.slice(1)}
              </Text>
            )}
            {item.duration && (
              <View style={styles.durationBadge}>
                <Ionicons name="time-outline" size={14} color="#6B7280" />
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Video or Image Container */}
        <View style={styles.mediaContainer}>
          {showVideo && item.type === 'video' && player ? (
            <VideoView
              player={player}
              style={styles.videoPlayer}
              nativeControls={true}
              fullscreenOptions={{ enable: true }}
              allowsPictureInPicture={true}
            />
          ) : (
            <>
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.mediaImage} 
                defaultSource={require("@/assets/images/icon.png")} 
              />
              {/* Video overlay controls (only show when video is not playing) */}
              {item.type === 'video' && !showVideo && (
                <TouchableOpacity onPress={handlePlayPress} style={styles.videoPlayOverlay}>
                  <View style={styles.playIconContainer}>
                    <Ionicons name="play" size={32} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Content actions */}
        <View style={styles.actionsContainer}>
          {/* Play button */}
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
            <Ionicons 
              name={item.type === 'video' && showVideo && isPlaying ? "pause" : "play"} 
              size={20} 
              color="#FFFFFF" 
            />
            <Text style={styles.playButtonText}>{getActionText()}</Text>
          </TouchableOpacity>

          {/* Secondary actions */}
          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="bookmark-outline" size={16} color="#374151" />
              <Text style={styles.actionButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={16} color="#374151" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={16} color="#374151" />
              <Text style={styles.actionButtonText}>Like</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About</Text>
          <Text style={styles.descriptionText}>{getDescriptionForType(item.type)}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  fixedHeader: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerInfo: {
    marginTop: 8,
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#374151",
  },
  mediaContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000000",
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
  videoPlayOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  playIconContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 40,
    padding: 16,
  },
  headerBackButton: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 28,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  actionsContainer: {
    padding: 16,
  },
  playButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 16,
  },
  playButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: "#374151",
    fontSize: 14,
    marginLeft: 4,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
});
