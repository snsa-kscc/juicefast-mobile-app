import { useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { VideoView, useVideoPlayer } from "expo-video";
import { CLUB_DATA } from "@/utils/clubData";
import { ProcessedClubItem } from "@/types/club";
import { WellnessHeader } from "@/components/ui/CustomHeader";
import { getImageWithFallback, DEFAULT_IMAGE } from "@/utils/imageUtils";
import { showCrossPlatformAlert } from "@/utils/alert";
import { ArticlePage } from "@/components/club/article/ArticlePage";
import {
  Article,
  getArticleById,
  getRandomArticles,
  getArticleCategoryById,
} from "@/utils/articleData";
import { getRecipesBySubcategory } from "@/utils/recipeData";
import { getBeautyItemsBySubcategory } from "@/utils/beautyData";

// Type for items that can be displayed
type DisplayItem =
  | ProcessedClubItem
  | (Article & {
      type: "recipe";
      subcategory: string;
      duration: string;
      imageUrl: string | null;
    });

export default function ClubContentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showVideo, setShowVideo] = useState(false);
  const [showAudio, setShowAudio] = useState(false);

  // Check if this is article content (id starts with "article-")
  const isArticleContent = id?.startsWith("article-");

  // Get article data if this is article content
  const article = isArticleContent
    ? getArticleById(id?.replace("article-", "") || "")
    : null;

  // Find the item from club data
  const item = CLUB_DATA.find((item: ProcessedClubItem) => item.id === id);

  // If not found in CLUB_DATA and it's an article, get it from article data
  const articleItem =
    !item && isArticleContent && article
      ? {
          ...article,
          type: "recipe" as const,
          subcategory: article.category.replace(/-/g, " "),
          duration:
            article.articleType === "recipe" &&
            article.prepTime !== undefined &&
            article.cookTime !== undefined
              ? `${article.prepTime + article.cookTime} min`
              : article.quickInfo?.time || "",
          imageUrl: article.image,
        }
      : null;

  // Create video/audio player - always call hook but conditionally use it
  const mediaUrl =
    (item?.type === "video" ||
      item?.type === "audio" ||
      item?.type === "meditation" ||
      item?.type === "track") &&
    item.url
      ? item.url
      : "";

  const displayItem = (item || articleItem) as DisplayItem | null;

  const player = useVideoPlayer(mediaUrl, (player) => {
    if (player) {
      player.loop = false;
      player.showNowPlayingNotification = displayItem?.type !== "video";
    }
  });

  // Track playing state
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player?.playing || false,
  });

  if (!item && !articleItem) {
    return (
      <View className="flex-1 bg-jf-gray">
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
          <Text className="text-base font-lufga text-gray-500 text-center mb-6">
            The wellness content you&apos;re looking for doesn&apos;t exist.
          </Text>
        </View>
      </View>
    );
  }

  const getActionText = () => {
    if (!displayItem) return "Start Content";
    switch (displayItem.type) {
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
    if (!displayItem) return;

    if (displayItem.type === "video") {
      if (!displayItem.url) {
        showCrossPlatformAlert(
          "Error",
          "Video URL is not available for this content."
        );
        return;
      }

      if (!player) {
        showCrossPlatformAlert("Error", "Video player is not available.");
        return;
      }

      if (!showVideo) {
        // Show video player for the first time
        setShowVideo(true);
        try {
          player.play();
        } catch {
          showCrossPlatformAlert(
            "Playback Error",
            "Unable to load video. The stream may be unavailable."
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
        } catch {
          showCrossPlatformAlert(
            "Playback Error",
            "Unable to control video playback. Please try again."
          );
        }
      }
    } else if (
      displayItem.type === "audio" ||
      displayItem.type === "meditation" ||
      displayItem.type === "track"
    ) {
      // Handle audio content types
      if (!displayItem.url) {
        showCrossPlatformAlert(
          "Error",
          "Audio URL is not available for this content."
        );
        return;
      }

      if (!player) {
        showCrossPlatformAlert("Error", "Audio player is not available.");
        return;
      }

      if (!showAudio) {
        // Show audio player for the first time
        setShowAudio(true);
        try {
          player.play();
        } catch {
          showCrossPlatformAlert(
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
        } catch {
          showCrossPlatformAlert(
            "Playback Error",
            "Unable to control audio playback. Please try again."
          );
        }
      }
    } else {
      // Handle other content types
      showCrossPlatformAlert(
        "Content Not Supported",
        "This content type is not yet supported."
      );
    }
  };

  // If this is article content, show the article page
  if (isArticleContent && article) {
    const categoryInfo = getArticleCategoryById(
      article.category,
      article.articleType
    );
    const randomArticles = useMemo(
      () => getRandomArticles(5, article.id, article.articleType),
      [article.id, article.articleType]
    );

    const handleBack = () => {
      router.back();
    };

    const footerItems = useMemo(
      () =>
        randomArticles.map((a) => ({
          name: a.title,
          image: a.image || "/images/placeholder.jpg",
        })),
      [randomArticles]
    );

    const handleFooterItemPress = useCallback(
      (footerItem: { name: string; image: string }) => {
        const fullArticle = randomArticles.find(
          (a) => a.title === footerItem.name
        );
        if (fullArticle) {
          router.push(`/club/content/article-${fullArticle.id}`);
        }
      },
      [randomArticles]
    );

    // Get item count based on article type
    const categoryItemCount =
      article.articleType === "recipe"
        ? getRecipesBySubcategory(article.category).length
        : getBeautyItemsBySubcategory(article.category).length;

    const footerTitle =
      article.articleType === "recipe"
        ? "More recipes for you"
        : "More for you";

    return (
      <View className="flex-1 bg-white">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <ArticlePage
            article={article}
            categoryName={categoryInfo?.name}
            categoryItemCount={categoryItemCount}
            onBackPress={handleBack}
            footerItems={footerItems}
            onFooterItemPress={handleFooterItemPress}
            footerTitle={footerTitle}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-jf-gray">
      <WellnessHeader
        title={displayItem?.title || ""}
        subtitle={
          displayItem?.subcategory
            ? `${displayItem?.subcategory.charAt(0).toUpperCase() + displayItem?.subcategory.slice(1)}${displayItem?.duration ? ` • ${displayItem?.duration}` : ""}`
            : displayItem?.duration || ""
        }
        showBackButton={true}
        onBackPress={() => router.back()}
        showSettings={true}
        onSettingsPress={() => router.push("/profile")}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Video or Audio Container */}
        <View className="relative w-full aspect-video bg-black">
          {showVideo && displayItem?.type === "video" && player ? (
            <>
              <VideoView
                player={player}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                nativeControls={true}
                fullscreenOptions={{ enable: true }}
                allowsPictureInPicture={true}
              />
            </>
          ) : showAudio &&
            (displayItem?.type === "audio" ||
              displayItem?.type === "meditation" ||
              displayItem?.type === "track") &&
            player ? (
            // Audio player - simple like video
            <View className="w-full h-full bg-black">
              <VideoView
                player={player}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                nativeControls={true}
                fullscreenOptions={{ enable: true }}
                allowsPictureInPicture={true}
              />
            </View>
          ) : (
            <>
              <Image
                source={getImageWithFallback(
                  displayItem?.imageUrl || "",
                  DEFAULT_IMAGE
                )}
                className="w-full h-full"
              />
              {/* Video overlay controls */}
              {displayItem?.type === "video" && !showVideo && (
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
              {(displayItem?.type === "audio" ||
                displayItem?.type === "meditation" ||
                displayItem?.type === "track") &&
                !showAudio && (
                  <TouchableOpacity
                    onPress={handlePlayPress}
                    className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/30"
                  >
                    <View className="bg-black/60 rounded-full p-6">
                      <Ionicons
                        name={
                          displayItem?.type === "meditation"
                            ? "flower"
                            : displayItem?.type === "track"
                              ? "radio"
                              : "volume-high"
                        }
                        size={40}
                        color="#FFFFFF"
                      />
                    </View>
                    <View className="mt-4">
                      <Text className="text-white text-lg font-lufga-bold">
                        {displayItem?.type === "meditation"
                          ? "Start Meditation"
                          : displayItem?.type === "track"
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
                (displayItem?.type === "video" && showVideo && isPlaying) ||
                (displayItem?.type === "audio" && showAudio && isPlaying) ||
                (displayItem?.type === "meditation" &&
                  showAudio &&
                  isPlaying) ||
                (displayItem?.type === "track" && showAudio && isPlaying)
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

          {/* Secondary actions - commented out */}
          {/* <View className="flex-row justify-between">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2 border border-gray-200 rounded-lg mx-1">
              <Ionicons name="bookmark-outline" size={16} color="#374151" />
              <Text className="text-gray-700 text-sm font-lufga ml-1">
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2 border border-gray-200 rounded-lg mx-1">
              <Ionicons name="share-outline" size={16} color="#374151" />
              <Text className="text-gray-700 text-sm font-lufga ml-1">
                Share
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2 border border-gray-200 rounded-lg mx-1">
              <Ionicons name="heart-outline" size={16} color="#374151" />
              <Text className="text-gray-700 text-sm font-lufga ml-1">
                Like
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
        <View className="px-4 pb-8">
          <Text className="text-lg font-lufga-bold text-gray-900 mb-2">
            About
          </Text>
          <Text className="text-base font-lufga text-gray-500 leading-6">
            {getDescriptionForType(displayItem?.type || "")}
          </Text>
        </View>
      </ScrollView>
    </View>
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
