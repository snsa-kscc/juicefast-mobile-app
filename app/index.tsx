import React, { useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { HomeDashboard } from "@/components/dashboard";
import { AddActionButton } from "@/components/ui/AddActionButton";

export default function Index() {
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
        userId="user123"
        userName="John Doe"
        initialWeeklyData={[
          { date: '2024-01-01', score: 75 },
          { date: '2024-01-02', score: 68 },
          { date: '2024-01-03', score: 82 },
          { date: '2024-01-04', score: 71 },
          { date: '2024-01-05', score: 79 },
          { date: '2024-01-06', score: 73 },
          { date: '2024-01-07', score: 77 }
        ]}
        initialAverageScore={75}
      />
      
      <AddActionButton />
    </Animated.View>
  );
}