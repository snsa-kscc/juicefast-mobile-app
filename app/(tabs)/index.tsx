import { HomeDashboard } from "@/components/dashboard";
import { AddActionButton } from "@/components/ui/AddActionButton";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useUser();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const Container = Platform.OS === "android" ? SafeAreaView : View;

  return (
    <Container className="flex-1">
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <HomeDashboard userName={user?.firstName || "User"} />
        <AddActionButton />
      </Animated.View>
    </Container>
  );
}
