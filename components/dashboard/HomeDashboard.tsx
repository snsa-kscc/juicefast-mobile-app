import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { WellnessScoreCard } from './WellnessScoreCard';
import { DaySelector } from './DaySelector';
import { DailyOverview } from './DailyOverview';

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
  userId: string;
  userName?: string;
  initialWeeklyData?: any[];
  initialAverageScore?: number;
}

export function HomeDashboard({ 
  userId, 
  userName, 
  initialWeeklyData = [], 
  initialAverageScore = 71 
}: HomeDashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateData, setSelectedDateData] = useState<DailyMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Generate array of dates for the current week (Monday to Sunday)
  const weekDates = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dates = [];

    // Calculate Monday of current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    // Generate array for Monday to Sunday
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }

    return dates;
  }, []);

  // Mock data fetch for selected date
  useEffect(() => {
    const fetchDateData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - replace with actual API call
      const mockData: DailyMetrics = {
        steps: 7000,
        water: 1500, // ml
        calories: 1800,
        mindfulness: 15, // minutes
        sleep: 7.5, // hours
        healthyMeals: 2,
        totalScore: 71,
      };
      
      setSelectedDateData(mockData);
      setIsLoading(false);
    };

    fetchDateData();
  }, [selectedDate, userId]);

  // Calculate daily progress percentages
  const dailyProgress = useMemo(() => {
    if (!selectedDateData) {
      return { steps: 70, mindfulness: 64, meals: 100, water: 0 };
    }

    return {
      steps: 70,
      mindfulness: 64,
      meals: 100,
      water: 0,
    };
  }, [selectedDateData]);

  const displayData = selectedDateData || {
    steps: 7000,
    water: 0,
    calories: 1800,
    mindfulness: 15,
    sleep: 7.5,
    totalScore: 71,
    healthyMeals: 2,
  };

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA]">
      {/* Header */}
      <View className="px-6 pt-12 pb-4 flex-row justify-between items-start">
        <View>
          <Text className="text-lg font-medium text-black">
            Hi, {userName ? userName.split(" ")[0] : "David"}!
          </Text>
          <Text className="text-gray-500 text-sm mt-1">What are we doing today?</Text>
        </View>
        <TouchableOpacity 
          className="p-2" 
          onPress={() => router.push('/profile' as any)}
        >
          <Settings size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Day Selector */}
      <DaySelector
        weekDates={weekDates}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      {/* Main Content */}
      <View className="px-6">
        {/* Wellness Score Card */}
        <WellnessScoreCard
          averageScore={initialAverageScore}
          dailyProgress={dailyProgress}
        />

        {/* Wellness Cards - Horizontal Scrollable */}
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            <TouchableOpacity className="w-28 h-20 rounded-xl overflow-hidden mr-3 bg-blue-200">
              <View className="absolute inset-0 bg-gradient-to-br from-blue-300 to-blue-400 justify-end p-3">
                <Text className="text-white text-xs font-medium">
                  Guided{"\n"}meditations
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="w-28 h-20 rounded-xl overflow-hidden mr-3 bg-green-200">
              <View className="absolute inset-0 bg-gradient-to-br from-green-300 to-green-400 justify-end p-3">
                <Text className="text-white text-xs font-medium">
                  Guided{"\n"}affirmations
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="w-28 h-20 rounded-xl overflow-hidden bg-pink-200">
              <View className="absolute inset-0 bg-gradient-to-br from-pink-300 to-pink-400 justify-end p-3">
                <Text className="text-white text-xs font-medium">
                  Strength{"\n"}exercises
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Daily Overview */}
        <DailyOverview data={displayData} />

        {/* Onboarding Button */}
        <TouchableOpacity 
          className="bg-green-600 px-6 py-4 rounded-xl mb-4"
          onPress={() => router.push('/onboarding')}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Take Onboarding Quiz
          </Text>
        </TouchableOpacity>

        {/* Challenge Banners */}
        <TouchableOpacity className="w-full mb-4">
          <Image 
            source={require('../../assets/images/challenge.png')}
            className="w-full h-32 rounded-xl"
            resizeMode="cover"
          />
        </TouchableOpacity>

        <TouchableOpacity className="w-full mb-20">
          <Image 
            source={require('../../assets/images/fasting.png')}
            className="w-full h-32 rounded-xl"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}