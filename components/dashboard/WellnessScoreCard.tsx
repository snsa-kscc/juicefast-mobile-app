import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated } from "react-native";
import { Info } from "lucide-react-native";
import { CircularProgress } from "@/components/tracker/shared";
import {
  MealIcon,
  StepsIcon,
  MindfulnessIcon,
  SleepIcon,
  WaterIcon,
} from "./icons/TrackerIcons";

interface WellnessProgressBarProps {
  icon: React.ReactNode;
  value: number;
  backgroundColor: string;
  fillColor: string;
}

const WellnessProgressBar = ({
  icon,
  value,
  backgroundColor,
  fillColor,
}: WellnessProgressBarProps) => (
  <View className="flex-col items-center">
    <View
      className="w-14 h-24 rounded-full border flex-col items-center justify-center mb-1 relative overflow-hidden"
      style={{ backgroundColor, borderColor: fillColor }}
    >
      <View
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: `${Math.min(100, value)}%`,
          backgroundColor: fillColor,
        }}
      />
      <View className="flex-col items-center justify-evenly z-10 absolute inset-0">
        <View className="mb-1">{icon}</View>
        <Text
          className={`font-semibold ${value > 50 ? "text-white" : "text-black"}`}
        >
          {value}
        </Text>
      </View>
    </View>
  </View>
);

interface WellnessScoreCardProps {
  averageScore: number;
  dailyProgress: {
    steps: number;
    mindfulness: number;
    meals: number;
    sleep: number;
    water: number;
  };
}

export function WellnessScoreCard({
  averageScore,
  dailyProgress,
}: WellnessScoreCardProps) {
  const [displayedScore, setDisplayedScore] = useState<number>(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: averageScore,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value }) => {
      setDisplayedScore(Math.round(value));
    });

    return () => animatedValue.removeListener(listener);
  }, [averageScore]);

  return (
    <View className="bg-white rounded-2xl p-6 mb-6">
      <View className="flex-row items-center justify-center mb-4">
        <Text className="text-sm font-semibold tracking-widest uppercase">
          WELLNESS SCORE
        </Text>
        <Info size={16} color="#9CA3AF" className="ml-2" />
      </View>

      <View className="items-center mb-6">
        <CircularProgress
          value={displayedScore}
          maxValue={100}
          color="#E8D5B0"
          backgroundColor="#F2E9D8"
          displayValue={displayedScore}
          size={250}
        />
        <Text className="text-xs text-gray-500 mt-3 text-center">
          One step and one goal at a time.
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-center font-semibold text-xs tracking-widest uppercase mb-4">
          DAILY PROGRESS SUMMARY (%)
        </Text>
        <View className="flex-row justify-around gap-2">
          <WellnessProgressBar
            icon={<StepsIcon size={24} color="#FFC856" />}
            value={dailyProgress.steps}
            backgroundColor="#FFF8E7"
            fillColor="#FFC856"
          />
          <WellnessProgressBar
            icon={<MindfulnessIcon size={24} color="#FE8E77" />}
            value={dailyProgress.mindfulness}
            backgroundColor="#FFF0F0"
            fillColor="#FE8E77"
          />
          <WellnessProgressBar
            icon={<MealIcon size={24} color="#0DC99B" />}
            value={dailyProgress.meals}
            backgroundColor="#F0FFF4"
            fillColor="#0DC99B"
          />
          <WellnessProgressBar
            icon={<SleepIcon size={24} color="#625FD3" />}
            value={dailyProgress.sleep}
            backgroundColor="#EEEDFF"
            fillColor="#625FD3"
          />
          <WellnessProgressBar
            icon={<WaterIcon size={24} color="#4CC3FF" />}
            value={dailyProgress.water}
            backgroundColor="#EBF9FF"
            fillColor="#4CC3FF"
          />
        </View>
      </View>
    </View>
  );
}
