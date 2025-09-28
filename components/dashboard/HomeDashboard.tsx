import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Settings } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../convex/_generated/api";
import { Spinner } from "../Spinner";
import { DailyOverview } from "./DailyOverview";
import { DaySelector } from "./DaySelector";
import { WellnessScoreCard } from "./WellnessScoreCard";

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
  const { isSignedIn } = useAuth();

  // Calculate start and end timestamps for selected date
  const { startTime, endTime } = useMemo(() => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);
    return {
      startTime: start.getTime(),
      endTime: end.getTime(),
    };
  }, [selectedDate]);

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
    if (!stepEntries || !waterEntries || !mealEntries || !mindfulnessEntries || !sleepEntries) {
      return null;
    }

    const totalSteps = stepEntries.reduce((sum, entry) => sum + entry.count, 0);
    const totalWater = waterEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const totalCalories = mealEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const totalMindfulness = mindfulnessEntries.reduce((sum, entry) => sum + entry.minutes, 0);
    const totalSleep = sleepEntries.reduce((sum, entry) => sum + entry.hoursSlept, 0);
    const healthyMeals = mealEntries.length;

    return {
      steps: totalSteps,
      water: totalWater,
      calories: totalCalories,
      mindfulness: totalMindfulness,
      sleep: totalSleep,
      healthyMeals,
      totalScore: Math.round((totalSteps / 10000 + totalWater / 2200 + healthyMeals / 2 + totalMindfulness / 20 + totalSleep / 8) * 20), // Simple scoring based on goal completion
    };
  }, [stepEntries, waterEntries, mealEntries, mindfulnessEntries, sleepEntries]);

  // Update loading state based on query status
  useEffect(() => {
    const isQueryLoading =
      stepEntries === undefined || waterEntries === undefined || mealEntries === undefined || mindfulnessEntries === undefined || sleepEntries === undefined;
    setIsLoading(isQueryLoading);
  }, [stepEntries, waterEntries, mealEntries, mindfulnessEntries, sleepEntries]);

  // Calculate daily progress percentages based on goals
  const dailyProgress = useMemo(() => {
    if (!selectedDateData) {
      return { steps: 0, mindfulness: 0, meals: 0, water: 0 };
    }

    const stepGoal = 10000;
    const mindfulnessGoal = 20; // minutes
    const mealGoal = 2;
    const waterGoal = 2200; // ml

    return {
      steps: Math.min(100, Math.round((selectedDateData.steps / stepGoal) * 100)),
      mindfulness: Math.min(100, Math.round((selectedDateData.mindfulness / mindfulnessGoal) * 100)),
      meals: Math.min(100, Math.round((selectedDateData.healthyMeals / mealGoal) * 100)),
      water: Math.min(100, Math.round((selectedDateData.water / waterGoal) * 100)),
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

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA]">
      {/* Header */}
      <View className="px-6 pt-12 pb-4 flex-row justify-between items-start">
        <View>
          <Text className="text-lg font-medium text-black">Hi, {userName ? userName.split(" ")[0] : "David"}!</Text>
          <Text className="text-gray-500 text-sm mt-1">What are we doing today?</Text>
        </View>
        <TouchableOpacity className="p-2" onPress={() => router.push("/profile" as any)}>
          <Settings size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Day Selector */}
      <DaySelector selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {/* Main Content */}
      <View className="px-6">
        {/* Wellness Score Card */}
        <WellnessScoreCard averageScore={selectedDateData?.totalScore || 0} dailyProgress={dailyProgress} />

        {/* Wellness Cards - Horizontal Scrollable */}
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            <TouchableOpacity className="w-28 h-20 rounded-xl overflow-hidden mr-3 bg-blue-200">
              <View className="absolute inset-0 bg-gradient-to-br from-blue-300 to-blue-400 justify-end p-3">
                <Text className="text-white text-xs font-medium">Guided{"\n"}meditations</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="w-28 h-20 rounded-xl overflow-hidden mr-3 bg-green-200">
              <View className="absolute inset-0 bg-gradient-to-br from-green-300 to-green-400 justify-end p-3">
                <Text className="text-white text-xs font-medium">Guided{"\n"}affirmations</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="w-28 h-20 rounded-xl overflow-hidden bg-pink-200">
              <View className="absolute inset-0 bg-gradient-to-br from-pink-300 to-pink-400 justify-end p-3">
                <Text className="text-white text-xs font-medium">Strength{"\n"}exercises</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Daily Overview */}
        {!isSignedIn ? (
          <View className="items-center py-8">
            <Text className="text-gray-500">Please sign in to view your wellness data</Text>
          </View>
        ) : isLoading ? (
          <View className="items-center py-8">
            <Spinner size={32} />
            <Text className="text-gray-500 mt-2">Loading daily data...</Text>
          </View>
        ) : (
          <DailyOverview data={displayData} isToday={isToday} />
        )}

        {/* Onboarding Button */}
        <TouchableOpacity className="bg-green-600 px-6 py-4 rounded-xl mb-4" onPress={() => router.push("/onboarding?retake=true")}>
          <Text className="text-white text-lg font-semibold text-center">Take Onboarding Quiz</Text>
        </TouchableOpacity>

        {/* Challenge Banners */}
        <TouchableOpacity className="w-full mb-4">
          <Image source={require("../../assets/images/challenge.png")} className="w-full h-32 rounded-xl" resizeMode="cover" />
        </TouchableOpacity>

        <TouchableOpacity className="w-full mb-20">
          <Image source={require("../../assets/images/fasting.png")} className="w-full h-32 rounded-xl" resizeMode="cover" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
