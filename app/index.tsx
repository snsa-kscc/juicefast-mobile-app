import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { WellnessTracker } from "@/components/tracker/WellnessTracker";

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
      <View className="absolute top-16 right-4 z-10">
        <TouchableOpacity
          onPress={() => router.push('/hello')}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">
            TanStack Query Demo
          </Text>
        </TouchableOpacity>
      </View>
      
      <WellnessTracker 
        userId="user123"
        weeklyMetrics={[
          { date: '2024-01-01', score: 75 },
          { date: '2024-01-02', score: 68 },
          { date: '2024-01-03', score: 82 },
          { date: '2024-01-04', score: 71 },
          { date: '2024-01-05', score: 79 },
          { date: '2024-01-06', score: 73 },
          { date: '2024-01-07', score: 77 }
        ]}
        weeklyAverageScore={75}
      />
    </Animated.View>
  );
}