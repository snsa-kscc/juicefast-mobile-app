import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/Spinner";
import { CircularProgress, WellnessHeader } from "@/components/tracker/shared";

interface UserProfile {
  id: string;
  name: string;
}

interface DailyHealthMetrics {
  date: string;
  score: number;
}

interface TrackingOption {
  id: string;
  name: string;
  target: string;
  icon: React.ReactNode;
  color: string;
  progress: number;
  unit: string;
}

interface TrackerClientProps {
  weeklyMetrics?: DailyHealthMetrics[];
  weeklyAverageScore?: number;
}

const MealIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 44 44" fill="none">
    <Path
      d="M16.5 13.7497H5.5"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.1359 38.5V22"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.9999 13.75V5.5"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M38.5 38.5C29.3873 38.5 22 31.1127 22 22C22 12.8873 29.3873 5.5 38.5 5.5"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M38.4999 31.1663C33.4373 31.1663 29.3333 27.0623 29.3333 21.9997C29.3333 16.9371 33.4373 12.833 38.4999 12.833"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.5 5.5V16.5C16.5 19.5376 14.0376 22 11 22V22C7.96243 22 5.5 19.5376 5.5 16.5V5.5"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const StepsIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 44 44" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M38.4999 22L27.4999 22C26.4874 22 25.6666 21.1792 25.6666 20.1667L25.6666 12.8333C25.6666 8.78324 28.9498 5.5 32.9999 5.5V5.5C37.05 5.5 40.3333 8.78324 40.3333 12.8333L40.3333 20.1667C40.3333 21.1792 39.5124 22 38.4999 22Z"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M33 33V33C29.9624 33 27.5 30.5376 27.5 27.5L27.5 22L38.5 22L38.5 27.5C38.5 30.5376 36.0376 33 33 33Z"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.4999 27.5L5.49992 27.5C4.4874 27.5 3.66658 26.6792 3.66658 25.6667L3.66658 18.3333C3.66658 14.2832 6.94983 11 10.9999 11V11C15.05 11 18.3333 14.2832 18.3333 18.3333L18.3333 25.6667C18.3333 26.6792 17.5124 27.5 16.4999 27.5Z"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 38.5V38.5C7.96243 38.5 5.5 36.0376 5.5 33L5.5 27.5L16.5 27.5L16.5 33C16.5 36.0376 14.0376 38.5 11 38.5Z"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MindfulnessIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 44 44" fill="none">
    <Path
      d="M12.8333 18.3331C13.5574 17.4439 14.5474 16.9397 15.5833 16.9397C16.6191 16.9397 17.5816 17.4439 18.3333 18.3331"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M25.6667 18.3331C26.3909 17.4439 27.3809 16.9397 28.4167 16.9397C29.4526 16.9397 30.4151 17.4439 31.1667 18.3331"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M33.6672 10.3327C40.1109 16.7764 40.1109 27.2236 33.6672 33.6672C27.2236 40.1109 16.7764 40.1109 10.3327 33.6672C3.88909 27.2236 3.88909 16.7764 10.3327 10.3327C16.7764 3.88909 27.2236 3.88909 33.6672 10.3327"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M28.4166 26.9277C28.4166 26.9277 26.0094 29.3331 21.9999 29.3331C17.9886 29.3331 15.5833 26.9277 15.5833 26.9277"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SleepIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 44 44" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.0346 22.0351C25.9791 17.9799 26.9151 11.868 24.3647 6.81817C24.2096 6.4998 24.2521 6.12051 24.4738 5.84433C24.6955 5.56815 25.0566 5.44464 25.401 5.52721C28.4396 6.25758 31.2176 7.81267 33.4288 10.0211C40.0647 16.485 40.2048 27.1043 33.7417 33.741C27.1054 40.2042 16.4865 40.0651 10.0216 33.4305C7.81354 31.2193 6.25834 28.4417 5.52723 25.4035C5.44463 25.0591 5.56813 24.698 5.8443 24.4763C6.12047 24.2546 6.49976 24.2121 6.81813 24.3672C11.868 26.9181 17.9804 25.9813 22.0346 22.0351Z"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const WaterIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 44 44" fill="none">
    <Path
      d="M30.5909 15.9248C35.3356 20.6695 35.3356 28.3621 30.5909 33.1086C25.8463 37.8551 18.1536 37.8533 13.4071 33.1086C8.66059 28.364 8.66242 20.6713 13.4071 15.9248"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.4016 15.9313L21.9999 7.33301"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M30.5983 15.9313L22 7.33301"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export function WellnessTracker({
  weeklyMetrics = [],
  weeklyAverageScore = 71,
}: TrackerClientProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [displayedScore, setDisplayedScore] = useState<number>(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Get today's date range
  const { startTime, endTime } = useMemo(() => {
    const today = new Date();
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0
    );
    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );
    return {
      startTime: start.getTime(),
      endTime: end.getTime(),
    };
  }, []);

  // Query all entries
  const stepEntries = useQuery(
    api.stepEntry.getByUserId,
    isSignedIn ? { startTime, endTime } : "skip"
  );
  const waterEntries = useQuery(
    api.waterIntake.getByUserId,
    isSignedIn ? { startTime, endTime } : "skip"
  );
  const mealEntries = useQuery(
    api.mealEntry.getByUserId,
    isSignedIn ? { startTime, endTime } : "skip"
  );
  const mindfulnessEntries = useQuery(
    api.mindfulnessEntry.getByUserId,
    isSignedIn ? { startTime, endTime } : "skip"
  );
  const sleepEntries = useQuery(
    api.sleepEntry.getByUserId,
    isSignedIn ? { startTime, endTime } : "skip"
  );

  // Calculate totals
  const todayData = useMemo(() => {
    if (
      !stepEntries ||
      !waterEntries ||
      !mealEntries ||
      !mindfulnessEntries ||
      !sleepEntries
    ) {
      return null;
    }

    const totalSteps = stepEntries.reduce((sum, entry) => sum + entry.count, 0);
    const totalWater = waterEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );
    const totalMindfulness = mindfulnessEntries.reduce(
      (sum, entry) => sum + entry.minutes,
      0
    );
    const totalSleep = sleepEntries.reduce(
      (sum, entry) => sum + entry.hoursSlept,
      0
    );
    const healthyMeals = mealEntries.length;

    const totalScore = Math.round(
      (totalSteps / 10000 +
        totalWater / 2200 +
        healthyMeals / 2 +
        totalMindfulness / 20 +
        totalSleep / 8) *
        20
    );

    return {
      steps: totalSteps,
      water: totalWater,
      mindfulness: totalMindfulness,
      sleep: totalSleep,
      healthyMeals,
      totalScore,
    };
  }, [
    stepEntries,
    waterEntries,
    mealEntries,
    mindfulnessEntries,
    sleepEntries,
  ]);

  const loading = !todayData && isSignedIn;

  useEffect(() => {
    if (todayData !== null) {
      Animated.timing(animatedValue, {
        toValue: todayData.totalScore,
        duration: 2000,
        useNativeDriver: false,
      }).start();

      const listener = animatedValue.addListener(({ value }) => {
        setDisplayedScore(Math.round(value));
      });

      return () => animatedValue.removeListener(listener);
    }
  }, [todayData]);

  const trackingOptions: TrackingOption[] = [
    {
      id: "meals",
      name: "Eat 2 healthy meals",
      target: "2",
      icon: <MealIcon />,
      color: "rgba(13, 201, 155, 0.25)",
      progress: todayData?.healthyMeals || 0,
      unit: "healthy meals today",
    },
    {
      id: "steps",
      name: "Take 10 000 steps",
      target: "10000",
      icon: <StepsIcon />,
      color: "rgba(255, 200, 86, 0.25)",
      progress: todayData?.steps || 0,
      unit: "steps today",
    },
    {
      id: "mindfulness",
      name: "Spend 20 quiet minutes",
      target: "20",
      icon: <MindfulnessIcon />,
      color: "rgba(254, 142, 119, 0.25)",
      progress: todayData?.mindfulness || 0,
      unit: "minutes today",
    },
    {
      id: "sleep",
      name: "Sleep 8 hours",
      target: "8",
      icon: <SleepIcon />,
      color: "rgba(98, 95, 211, 0.25)",
      progress: todayData?.sleep || 0,
      unit: "hours today",
    },
    {
      id: "water",
      name: "Drink 2.2L of water",
      target: "2.2",
      icon: <WaterIcon />,
      color: "rgba(76, 195, 255, 0.25)",
      progress: (todayData?.water || 0) / 1000,
      unit: "liters today",
    },
  ];

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-6">
        <Spinner size={32} color="rgb(76, 195, 255)" />
      </View>
    );
  }

  // const circumference = 2 * Math.PI * 110;
  // const strokeDashoffset = circumference - (circumference * Math.min(100, weeklyAverageScore)) / 100;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 bg-jf-gray"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <WellnessHeader
          title="Wellness Tracker"
          accentColor="rgb(76, 195, 255)"
          onSettingsPress={() => router.push("/profile")}
        />

        {/* Wellness Score */}
        <View className="px-6 py-6 items-center">
          <View className="flex-row justify-center gap-2 items-center w-full mb-6">
            <Text className="text-2xl font-lufga-semibold tracking-widest">
              WELLNESS SCORE
            </Text>
            <View className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center">
              <Text className="text-base text-slate-600 font-lufga-bold">
                i
              </Text>
            </View>
          </View>
          <Text className="font-lufga text-sm text-gray-500 mb-6">
            Your wellness score for today
          </Text>

          <CircularProgress
            value={displayedScore}
            maxValue={100}
            color="#E8D5B0"
            backgroundColor="#F2E9D8"
            displayValue={displayedScore}
          />
        </View>

        {/* Tracking Options */}
        <View className="px-6 py-6">
          <Text className="text-base font-lufga-medium text-center mb-4">
            What would you like to track today?
          </Text>

          {trackingOptions.map((option) => {
            const handlePress = () => {
              if (option.id === "meals") {
                router.push("/meals" as any);
              } else if (option.id === "steps") {
                router.push("/steps" as any);
              } else if (option.id === "sleep") {
                router.push("/sleep" as any);
              } else if (option.id === "mindfulness") {
                router.push("/mindfulness" as any);
              } else if (option.id === "water") {
                router.push("/hydration" as any);
              }
            };

            return (
              <TouchableOpacity
                key={option.id}
                className="rounded-xl mb-3 border border-transparent bg-white"
                onPress={handlePress}
                activeOpacity={
                  option.id === "meals" ||
                  option.id === "steps" ||
                  option.id === "sleep" ||
                  option.id === "mindfulness" ||
                  option.id === "water"
                    ? 0.7
                    : 1
                }
              >
                <View className="flex-row items-center p-4">
                  <View className="mr-3">{option.icon}</View>
                  <View className="flex-1">
                    <Text className="text-base font-lufga-medium mb-1">
                      {option.name}
                    </Text>
                    <View className="h-px bg-gray-200 my-1 w-[90%]" />
                    <Text className="font-lufga text-sm text-gray-500">
                      {option.progress} {option.unit}
                    </Text>
                  </View>
                  {(option.id === "meals" ||
                    option.id === "steps" ||
                    option.id === "sleep" ||
                    option.id === "mindfulness" ||
                    option.id === "water") && (
                    <View className="ml-2 w-12 h-12 rounded-full bg-white/20 items-center justify-center">
                      <Plus size={32} color="#6B7280" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
