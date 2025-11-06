import React, { useEffect } from "react";
import { ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface AnimatedScreenProps extends ViewProps {
  children: React.ReactNode;
}

export function AnimatedScreen({ children, style, ...props }: AnimatedScreenProps) {
  const translateX = useSharedValue(300);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
}
