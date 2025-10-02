import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PremiumSubscriptionDrawerProps {
  children: React.ReactNode;
}

export function PremiumSubscriptionDrawer({
  children,
}: PremiumSubscriptionDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);

  const openDrawer = () => setIsVisible(true);
  const closeDrawer = () => setIsVisible(false);

  return (
    <>
      <TouchableOpacity onPress={openDrawer}>{children}</TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeDrawer}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Go Premium</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="star" size={48} color="#F59E0B" />
            </View>

            <Text style={styles.title}>Unlock Premium Features</Text>
            <Text style={styles.description}>
              Get access to exclusive content, detailed analytics, and premium
              insights
            </Text>

            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.featureText}>
                  Unlimited access to all content
                </Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.featureText}>
                  Detailed analytics & insights
                </Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.featureText}>PDF data export</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.featureText}>
                  Better wellness predictions
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={closeDrawer}
            >
              <Text style={styles.subscribeButtonText}>
                Start Premium Trial
              </Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              7-day free trial, then $9.99/month. Cancel anytime.
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresContainer: {
    width: "100%",
    marginBottom: 32,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
  },
  subscribeButton: {
    width: "100%",
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  termsText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
