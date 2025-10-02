import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import {
  Activity,
  Brain,
  Droplets,
  FileText,
  Heart,
  Moon,
  Plus,
  Scale,
  Thermometer,
  X,
} from "lucide-react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActionOption {
  id: string;
  title: string;
  iconColor: string;
  route: string;
}

export function AddActionButton() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["75%"], []);

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        onPress={handleCloseBottomSheet}
      />
    ),
    []
  );

  const wellnessOptions: ActionOption[] = [
    {
      id: "activity",
      title: "Activity",
      iconColor: "#FF6B6B",
      route: "/steps",
    },
    {
      id: "mindfulness",
      title: "Mindfulness",
      iconColor: "#4ECDC4",
      route: "/mindfulness",
    },
    {
      id: "hydration",
      title: "Hydration",
      iconColor: "#45B7D1",
      route: "/hydration",
    },
    { id: "sleep", title: "Sleep", iconColor: "#9B59B6", route: "/sleep" },
  ];

  const diaryOptions: ActionOption[] = [
    { id: "note", title: "Add note", iconColor: "#FF6B6B", route: "/notes" },
    {
      id: "moods",
      title: "Log moods and symptoms",
      iconColor: "#FF6B6B",
      route: "/moods",
    },
    {
      id: "weight",
      title: "Add weight",
      iconColor: "#FF6B6B",
      route: "/weight",
    },
    {
      id: "temperature",
      title: "Add temperature",
      iconColor: "#FF8C42",
      route: "/temperature",
    },
  ];

  const handleOptionPress = (route: string) => {
    handleCloseBottomSheet();

    // Check if route exists, otherwise show alert or handle gracefully
    const existingRoutes = ["/steps", "/mindfulness", "/hydration", "/sleep"];

    if (existingRoutes.includes(route)) {
      router.push(route as any);
    } else {
      // For now, just log - you can implement these routes later
      console.log(`Route ${route} not implemented yet`);
      // Optionally show an alert or navigate to a placeholder
    }
  };

  const renderIcon = (id: string, color: string) => {
    switch (id) {
      case "activity":
        return <Activity size={20} color={color} />;
      case "mindfulness":
        return <Brain size={20} color={color} />;
      case "hydration":
        return <Droplets size={20} color={color} />;
      case "sleep":
        return <Moon size={20} color={color} />;
      case "note":
        return <FileText size={20} color={color} />;
      case "moods":
        return <Heart size={20} color={color} />;
      case "weight":
        return <Scale size={20} color={color} />;
      case "temperature":
        return <Thermometer size={20} color={color} />;
      default:
        return <Activity size={20} color={color} />;
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.fab}
          onPress={handleOpenBottomSheet}
          activeOpacity={0.8}
        >
          <Plus size={28} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableOverDrag={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleCloseBottomSheet}
              style={styles.closeButton}
            >
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>WELLNESS LOG</Text>
            {wellnessOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionRow}
                onPress={() => handleOptionPress(option.route)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{option.title}</Text>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: option.iconColor },
                  ]}
                >
                  {renderIcon(option.id, "#FFFFFF")}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MY DIARY</Text>
            {diaryOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionRow}
                onPress={() => handleOptionPress(option.route)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{option.title}</Text>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: option.iconColor },
                  ]}
                >
                  {renderIcon(option.id, "#FFFFFF")}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.footerText}>
            For the most accurate insights,{"\n"}log daily.
          </Text>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 999,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  bottomSheetBackground: {
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: "#000",
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "flex-end",
    paddingTop: 10,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 20,
  },
});
