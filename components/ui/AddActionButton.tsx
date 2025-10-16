import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { usePathname, useRouter } from "expo-router";
import { Plus, X } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  MealIcon,
  MindfulnessIcon,
  SleepIcon,
  StepsIcon,
  WaterIcon,
} from "../icons/TrackerIcons";

interface ActionOption {
  id: string;
  title: string;
  iconColor: string;
  route: string;
}

export function AddActionButton() {
  const router = useRouter();
  const pathname = usePathname();
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
    { id: "meals", title: "Meals", iconColor: "rgba(13, 201, 155, 1)", route: "/meals" },
    { id: "activity", title: "Steps", iconColor: "rgba(255, 200, 86, 1)", route: "/steps" },
    { id: "mindfulness", title: "Mindfulness", iconColor: "rgba(254, 142, 119, 1)", route: "/mindfulness" },
    { id: "sleep", title: "Sleep", iconColor: "rgba(98, 95, 211, 1)", route: "/sleep" },
    { id: "hydration", title: "Water", iconColor: "rgba(76, 195, 255, 1)", route: "/hydration" },
  ];

  const handleOptionPress = (route: string) => {
    if (pathname === route) return;
    handleCloseBottomSheet();

    const existingRoutes = [
      "/meals",
      "/steps",
      "/mindfulness",
      "/hydration",
      "/sleep",
    ];

    if (existingRoutes.includes(route)) {
      router.push(route as any);
    } else {
      console.log(`Route ${route} not implemented yet`);
    }
  };

  const renderIcon = (id: string, color: string) => {
    switch (id) {
      case "meals":
        return <MealIcon color={color} />;
      case "activity":
        return <StepsIcon color={color} />;
      case "mindfulness":
        return <MindfulnessIcon color={color} />;
      case "hydration":
        return <WaterIcon color={color} />;
      case "sleep":
        return <SleepIcon color={color} />;
      default:
        return <StepsIcon color={color} />;
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <View style={styles.fabContainer} pointerEvents="auto">
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
            {wellnessOptions.map((option) => {
              const isCurrentScreen = pathname === option.route;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionRow,
                    isCurrentScreen && styles.optionRowDisabled,
                  ]}
                  onPress={() => handleOptionPress(option.route)}
                  activeOpacity={isCurrentScreen ? 1 : 0.7}
                  disabled={isCurrentScreen}
                >
                  <View style={styles.iconContainer}>
                    {renderIcon(option.id, option.iconColor)}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      isCurrentScreen && styles.optionTextDisabled,
                    ]}
                  >
                    {option.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
  },
  optionRowDisabled: {
    backgroundColor: "#F0F0F0",
    opacity: 0.6,
  },
  optionText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  optionTextDisabled: {
    color: "#999",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 36,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 20,
    paddingBottom: 40,
  },
});
