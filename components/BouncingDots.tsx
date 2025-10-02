import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface BouncingDotsProps {
  color?: string;
  size?: number;
}

export function BouncingDots({
  color = "#4CC3FF",
  size = 8,
}: BouncingDotsProps) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation1 = createAnimation(dot1, 0);
    const animation2 = createAnimation(dot2, 150);
    const animation3 = createAnimation(dot3, 300);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: color,
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ translateY: dot1 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: color,
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ translateY: dot2 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: color,
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ translateY: dot3 }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    marginHorizontal: 2,
  },
});
