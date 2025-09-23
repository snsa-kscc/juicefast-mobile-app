import React, { useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { useUser } from '@clerk/clerk-expo';
import { HomeDashboard } from "@/components/dashboard";
import { AddActionButton } from "@/components/ui/AddActionButton";

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

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <HomeDashboard
        userName={user?.firstName || "User"}
      />
      
      <AddActionButton />
    </Animated.View>
  );
}