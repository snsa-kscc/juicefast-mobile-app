import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { Link, router } from "expo-router";
import { Plus } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../convex/_generated/api";
import { Spinner } from "../Spinner";
import { CircularProgress, WellnessHeader } from "../tracker/shared";
import { DaySelector } from "./DaySelector";
import {
  MealIcon,
  StepsIcon,
  MindfulnessIcon,
  SleepIcon,
  WaterIcon,
} from "./icons/TrackerIcons";

interface DailyMetrics {
  steps: number;
  water: number;
  calories: number;
  mindfulness: number;
  sleep: number;
  healthyMeals: number;
  totalScore: number;
}

interface HomeDashboardProps {
  userName?: string;
}

export function HomeDashboard({ userName }: HomeDashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [displayedScore, setDisplayedScore] = useState<number>(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { isSignedIn } = useAuth();

  // Calculate start and end timestamps for selected date
  const { startTime, endTime } = useMemo(() => {
    const start = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      0,
      0,
      0,
      0
    );
    const end = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      23,
      59,
      59,
      999
    );
    return {
      startTime: start.getTime(),
      endTime: end.getTime(),
    };
  }, [
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
  ]);

  // Query all 5 tables simultaneously - only when authenticated
  const stepEntries = useQuery(
    api.stepEntry.getByUserId,
    isSignedIn
      ? {
          startTime,
          endTime,
        }
      : "skip"
  );

  const waterEntries = useQuery(
    api.waterIntake.getByUserId,
    isSignedIn
      ? {
          startTime,
          endTime,
        }
      : "skip"
  );

  const mealEntries = useQuery(
    api.mealEntry.getByUserId,
    isSignedIn
      ? {
          startTime,
          endTime,
        }
      : "skip"
  );

  const mindfulnessEntries = useQuery(
    api.mindfulnessEntry.getByUserId,
    isSignedIn
      ? {
          startTime,
          endTime,
        }
      : "skip"
  );

  const sleepEntries = useQuery(
    api.sleepEntry.getByUserId,
    isSignedIn
      ? {
          startTime,
          endTime,
        }
      : "skip"
  );

  // Calculate aggregated data from queries
  const selectedDateData = useMemo(() => {
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
    const totalCalories = mealEntries.reduce(
      (sum, entry) => sum + entry.calories,
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

    return {
      steps: totalSteps,
      water: totalWater,
      calories: totalCalories,
      mindfulness: totalMindfulness,
      sleep: totalSleep,
      healthyMeals,
      totalScore: Math.round(
        (totalSteps / 10000 +
          totalWater / 2200 +
          healthyMeals / 2 +
          totalMindfulness / 20 +
          totalSleep / 8) *
          20
      ), // Simple scoring based on goal completion
    };
  }, [
    stepEntries,
    waterEntries,
    mealEntries,
    mindfulnessEntries,
    sleepEntries,
  ]);

  // Update loading state based on query status
  useEffect(() => {
    const isQueryLoading =
      stepEntries === undefined ||
      waterEntries === undefined ||
      mealEntries === undefined ||
      mindfulnessEntries === undefined ||
      sleepEntries === undefined;
    setIsLoading(isQueryLoading);
  }, [
    stepEntries,
    waterEntries,
    mealEntries,
    mindfulnessEntries,
    sleepEntries,
  ]);

  // Animate score
  useEffect(() => {
    if (selectedDateData !== null) {
      Animated.timing(animatedValue, {
        toValue: selectedDateData.totalScore,
        duration: 1500,
        useNativeDriver: false,
      }).start();

      const listener = animatedValue.addListener(({ value }) => {
        setDisplayedScore(Math.round(value));
      });

      return () => animatedValue.removeListener(listener);
    }
  }, [selectedDateData]);

  // Calculate daily progress percentages based on goals
  const dailyProgress = useMemo(() => {
    if (!selectedDateData) {
      return { steps: 0, mindfulness: 0, meals: 0, sleep: 0, water: 0 };
    }

    const stepGoal = 10000;
    const mindfulnessGoal = 20; // minutes
    const mealGoal = 2;
    const sleepGoal = 8; // hours
    const waterGoal = 2200; // ml

    return {
      steps: Math.min(
        100,
        Math.round((selectedDateData.steps / stepGoal) * 100)
      ),
      mindfulness: Math.min(
        100,
        Math.round((selectedDateData.mindfulness / mindfulnessGoal) * 100)
      ),
      meals: Math.min(
        100,
        Math.round((selectedDateData.healthyMeals / mealGoal) * 100)
      ),
      sleep: Math.min(
        100,
        Math.round((selectedDateData.sleep / sleepGoal) * 100)
      ),
      water: Math.min(
        100,
        Math.round((selectedDateData.water / waterGoal) * 100)
      ),
    };
  }, [selectedDateData]);

  const displayData = selectedDateData || {
    steps: 0,
    water: 0,
    calories: 0,
    mindfulness: 0,
    sleep: 0,
    totalScore: 0,
    healthyMeals: 0,
  };

  const isToday = useMemo(() => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  }, [selectedDate]);

  if (isLoading && isSignedIn) {
    return (
      <View className="flex-1 bg-[#FCFBF8] justify-center items-center">
        <Spinner size={32} color="rgb(76, 195, 255)" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 bg-[#FCFBF8]"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <WellnessHeader
          title={`Hi, ${userName ? userName.split(" ")[0] : "David"}!`}
          subtitle="What are we doing today?"
          accentColor="rgb(76, 195, 255)"
          onSettingsPress={() => router.push("/profile" as any)}
        />

        {/* Day Selector */}
        <DaySelector
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* Wellness Score */}
        <View className="px-6 py-6 items-center">
          <View className="flex-row justify-center gap-2 items-center w-full mb-6">
            <Text className="text-2xl font-semibold tracking-widest">
              WELLNESS SCORE
            </Text>
            <View className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center">
              <Text className="text-base text-slate-600 font-bold">i</Text>
            </View>
          </View>
          <Text className="font-lufga text-sm text-gray-500 mb-6">
            {isToday
              ? "Your wellness score for today"
              : "Your wellness score for this day"}
          </Text>

          <CircularProgress
            value={displayedScore}
            maxValue={100}
            color="#E8D5B0"
            backgroundColor="#F2E9D8"
            displayValue={displayedScore}
          />
        </View>

        {/* Daily Progress Summary */}
        <View className="px-6 py-4">
          <Text className="text-center font-semibold text-xs tracking-widest uppercase mb-4">
            DAILY PROGRESS SUMMARY (%)
          </Text>
          <View className="flex-row justify-around gap-2 mb-6">
            <View className="flex-col items-center">
              <View
                className="w-14 h-24 rounded-full border flex-col items-center justify-center mb-1 relative overflow-hidden"
                style={{ backgroundColor: "#FFF8E7", borderColor: "#FFC856" }}
              >
                <View
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${Math.min(100, dailyProgress.steps)}%`,
                    backgroundColor: "#FFC856",
                  }}
                />
                <View className="flex-col items-center justify-evenly z-10 absolute inset-0">
                  <View className="mb-1">
                    <StepsIcon size={24} color="#FFC856" />
                  </View>
                  <Text
                    className={`font-semibold ${dailyProgress.steps > 50 ? "text-white" : "text-black"}`}
                  >
                    {dailyProgress.steps}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-col items-center">
              <View
                className="w-14 h-24 rounded-full border flex-col items-center justify-center mb-1 relative overflow-hidden"
                style={{ backgroundColor: "#FFF0F0", borderColor: "#FE8E77" }}
              >
                <View
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${Math.min(100, dailyProgress.mindfulness)}%`,
                    backgroundColor: "#FE8E77",
                  }}
                />
                <View className="flex-col items-center justify-evenly z-10 absolute inset-0">
                  <View className="mb-1">
                    <MindfulnessIcon size={24} color="#FE8E77" />
                  </View>
                  <Text
                    className={`font-semibold ${dailyProgress.mindfulness > 50 ? "text-white" : "text-black"}`}
                  >
                    {dailyProgress.mindfulness}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-col items-center">
              <View
                className="w-14 h-24 rounded-full border flex-col items-center justify-center mb-1 relative overflow-hidden"
                style={{ backgroundColor: "#F0FFF4", borderColor: "#0DC99B" }}
              >
                <View
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${Math.min(100, dailyProgress.meals)}%`,
                    backgroundColor: "#0DC99B",
                  }}
                />
                <View className="flex-col items-center justify-evenly z-10 absolute inset-0">
                  <View className="mb-1">
                    <MealIcon size={24} color="#0DC99B" />
                  </View>
                  <Text
                    className={`font-semibold ${dailyProgress.meals > 50 ? "text-white" : "text-black"}`}
                  >
                    {dailyProgress.meals}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-col items-center">
              <View
                className="w-14 h-24 rounded-full border flex-col items-center justify-center mb-1 relative overflow-hidden"
                style={{ backgroundColor: "#EEEDFF", borderColor: "#625FD3" }}
              >
                <View
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${Math.min(100, dailyProgress.sleep)}%`,
                    backgroundColor: "#625FD3",
                  }}
                />
                <View className="flex-col items-center justify-evenly z-10 absolute inset-0">
                  <View className="mb-1">
                    <SleepIcon size={24} color="#625FD3" />
                  </View>
                  <Text
                    className={`font-semibold ${dailyProgress.sleep > 50 ? "text-white" : "text-black"}`}
                  >
                    {dailyProgress.sleep}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-col items-center">
              <View
                className="w-14 h-24 rounded-full border flex-col items-center justify-center mb-1 relative overflow-hidden"
                style={{ backgroundColor: "#EBF9FF", borderColor: "#4CC3FF" }}
              >
                <View
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${Math.min(100, dailyProgress.water)}%`,
                    backgroundColor: "#4CC3FF",
                  }}
                />
                <View className="flex-col items-center justify-evenly z-10 absolute inset-0">
                  <View className="mb-1">
                    <WaterIcon size={24} color="#4CC3FF" />
                  </View>
                  <Text
                    className={`font-semibold ${dailyProgress.water > 50 ? "text-white" : "text-black"}`}
                  >
                    {dailyProgress.water}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Tracking Options */}
        <View className="px-6 py-6">
          <Text className="text-base font-medium text-center mb-4">
            What would you like to track {isToday ? "today" : "for this day"}?
          </Text>

          <TouchableOpacity
            className="rounded-xl mb-3 border border-transparent bg-white"
            onPress={() => router.push("/meals" as any)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center p-4">
              <View className="mr-3">
                <MealIcon size={36} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium mb-1">
                  Eat 2 healthy meals
                </Text>
                <View className="h-px bg-gray-200 my-1 w-[90%]" />
                <Text className="font-lufga text-sm text-gray-500">
                  {displayData.healthyMeals} healthy meals{" "}
                  {isToday ? "today" : "logged"}
                </Text>
              </View>
              <View className="ml-2 w-12 h-12 rounded-full bg-white/20 items-center justify-center">
                <Plus size={32} color="#6B7280" />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-xl mb-3 border border-transparent bg-white"
            onPress={() => router.push("/steps" as any)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center p-4">
              <View className="mr-3">
                <StepsIcon size={36} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium mb-1">
                  Take 10 000 steps
                </Text>
                <View className="h-px bg-gray-200 my-1 w-[90%]" />
                <Text className="font-lufga text-sm text-gray-500">
                  {displayData.steps} steps {isToday ? "today" : "logged"}
                </Text>
              </View>
              <View className="ml-2 w-12 h-12 rounded-full bg-white/20 items-center justify-center">
                <Plus size={32} color="#6B7280" />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-xl mb-3 border border-transparent bg-white"
            onPress={() => router.push("/mindfulness" as any)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center p-4">
              <View className="mr-3">
                <MindfulnessIcon size={36} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium mb-1">
                  Spend 20 quiet minutes
                </Text>
                <View className="h-px bg-gray-200 my-1 w-[90%]" />
                <Text className="font-lufga text-sm text-gray-500">
                  {displayData.mindfulness} minutes{" "}
                  {isToday ? "today" : "logged"}
                </Text>
              </View>
              <View className="ml-2 w-12 h-12 rounded-full bg-white/20 items-center justify-center">
                <Plus size={32} color="#6B7280" />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-xl mb-3 border border-transparent bg-white"
            onPress={() => router.push("/sleep" as any)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center p-4">
              <View className="mr-3">
                <SleepIcon size={36} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium mb-1">
                  Sleep 8 hours
                </Text>
                <View className="h-px bg-gray-200 my-1 w-[90%]" />
                <Text className="font-lufga text-sm text-gray-500">
                  {displayData.sleep} hours {isToday ? "today" : "logged"}
                </Text>
              </View>
              <View className="ml-2 w-12 h-12 rounded-full bg-white/20 items-center justify-center">
                <Plus size={32} color="#6B7280" />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-xl mb-3 border border-transparent bg-white"
            onPress={() => router.push("/hydration" as any)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center p-4">
              <View className="mr-3">
                <WaterIcon size={36} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium mb-1">
                  Drink 2.2L of water
                </Text>
                <View className="h-px bg-gray-200 my-1 w-[90%]" />
                <Text className="font-lufga text-sm text-gray-500">
                  {(displayData.water / 1000).toFixed(1)} liters{" "}
                  {isToday ? "today" : "logged"}
                </Text>
              </View>
              <View className="ml-2 w-12 h-12 rounded-full bg-white/20 items-center justify-center">
                <Plus size={32} color="#6B7280" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Additional Actions */}
        <View className="px-6">
          <TouchableOpacity
            className="bg-green-600 px-6 py-4 rounded-xl mb-4"
            onPress={() => router.push("/onboarding?retake=true")}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Take Onboarding Quiz
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-600 px-6 py-4 rounded-xl mb-4"
            onPress={() => router.push("/test-notifications")}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Test Push Notifications
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full mb-4"
            onPress={() => router.push("/(tabs)/store")}
          >
            <Image
              source={require("../../assets/images/challenge.png")}
              className="w-full h-32 rounded-xl"
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full mb-20"
            onPress={() => router.push("/(tabs)/store")}
          >
            <Image
              source={require("../../assets/images/fasting.png")}
              className="w-full h-32 rounded-xl"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
