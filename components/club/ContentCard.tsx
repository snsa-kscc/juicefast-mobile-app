import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProcessedClubItem } from "@/types/club";

interface ContentCardProps {
  item: ProcessedClubItem;
  onPress?: () => void;
  variant?: "large" | "medium" | "small";
}

export function ContentCard({
  item,
  onPress,
  variant = "medium",
}: ContentCardProps) {
  const getAspectRatio = () => {
    switch (variant) {
      case "large":
        return 1.5;
      case "small":
        return 1.5;
      default:
        return 1;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.imageContainer, { aspectRatio: getAspectRatio() }]}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          defaultSource={require("@/assets/images/icon.png")}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        {item.duration && (
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={12} color="#F59E0B" />
            <Text style={styles.duration}>{item.duration}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 18,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  duration: {
    fontSize: 12,
    color: "#F59E0B",
    marginLeft: 4,
  },
});
