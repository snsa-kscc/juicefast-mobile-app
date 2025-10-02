import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProcessedClubItem } from "@/types/club";

interface SubcategoryDetailProps {
  title: string;
  subtitle?: string;
  description?: string;
  items: ProcessedClubItem[];
  onBack?: () => void;
  onItemPress?: (item: ProcessedClubItem) => void;
  featuredImageUrl?: string;
}

export function SubcategoryDetail({
  title,
  subtitle,
  description,
  items,
  onBack,
  onItemPress,
  featuredImageUrl,
}: SubcategoryDetailProps) {
  // Group items by their subcategory for sections
  const groupedItems = items.reduce<Record<string, ProcessedClubItem[]>>(
    (acc, item) => {
      const group = item.subcategory || "Other";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    },
    {}
  );

  const headerImageUrl =
    featuredImageUrl || (items.length > 0 ? items[0].imageUrl : undefined);

  const renderItem = ({ item }: { item: ProcessedClubItem }) => (
    <TouchableOpacity
      style={styles.itemRow}
      onPress={() => onItemPress?.(item)}
    >
      <View style={styles.itemImageContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.itemImage}
          defaultSource={require("@/assets/images/icon.png")}
        />
      </View>

      <View style={styles.itemContent}>
        {item.duration && (
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={12} color="#F59E0B" />
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        )}
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>

      {item.type === "track" && (
        <View style={styles.playIconContainer}>
          <Ionicons name="play-circle-outline" size={24} color="#D1D5DB" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Featured Image Header */}
      {headerImageUrl && (
        <View style={styles.headerContainer}>
          <Image source={{ uri: headerImageUrl }} style={styles.headerImage} />
          <View style={styles.headerOverlay}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{title}</Text>
              {subtitle && (
                <Text style={styles.headerSubtitle}>{subtitle}</Text>
              )}
              {description && (
                <Text style={styles.headerDescription} numberOfLines={3}>
                  {description}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Content Sections */}
      <View style={styles.contentContainer}>
        {Object.entries(groupedItems).map(([group, groupItems]) => (
          <View key={group} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{group}</Text>
            <FlatList
              data={groupItems}
              renderItem={renderItem}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerContainer: {
    position: "relative",
    height: 224,
    marginBottom: 16,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "space-between",
    padding: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  backText: {
    color: "#FFFFFF",
    marginLeft: 4,
    fontSize: 16,
  },
  headerTextContainer: {
    alignSelf: "flex-start",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
    maxWidth: 280,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F59E0B",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  itemImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 6,
    overflow: "hidden",
    marginRight: 12,
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemContent: {
    flex: 1,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  durationText: {
    fontSize: 12,
    color: "#F59E0B",
    marginLeft: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    lineHeight: 18,
  },
  playIconContainer: {
    marginLeft: 8,
  },
});
