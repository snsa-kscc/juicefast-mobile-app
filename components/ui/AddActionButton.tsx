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
  Utensils,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ActionOption {
  id: string;
  title: string;
  iconColor: string;
  route: string;
}

export function AddActionButton() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const rotation = useSharedValue(0);
  const snapPoints = useMemo(() => ["75%"], []);

  useEffect(() => {
    rotation.value = withTiming(isOpen ? 90 : 0, { duration: 200 });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
    setIsOpen(true);
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsOpen(false);
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
      id: "meals",
      title: "Meals",
      iconColor: "#0DC99B",
      route: "/meals",
    },
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



  const handleOptionPress = (route: string) => {
    handleCloseBottomSheet();

    // Check if route exists, otherwise show alert or handle gracefully
    const existingRoutes = ["/meals", "/steps", "/mindfulness", "/hydration", "/sleep"];

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
      case "meals":
        return <Utensils size={20} color={color} />;
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
          onPress={isOpen ? handleCloseBottomSheet : handleOpenBottomSheet}
          activeOpacity={0.8}
        >
          <Animated.View style={animatedStyle}>
            {isOpen ? (
              <X size={28} color="#000000" />
            ) : (
              <Plus size={28} color="#000000" />
            )}
          </Animated.View>
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
        onClose={() => setIsOpen(false)}
      >
        <BottomSheetView style={styles.contentContainer}>
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
    paddingTop: 20,
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
