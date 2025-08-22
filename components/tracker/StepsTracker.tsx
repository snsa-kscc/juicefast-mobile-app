import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { ArrowLeft, Settings } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

interface StepEntry {
  count: number;
  timestamp: Date;
}

interface StepsTrackerProps {
  userId: string;
  initialStepsData?: { steps: StepEntry[] } | null;
  onBack?: () => void;
}

const DAILY_GOAL = 10000;
const CALORIES_PER_STEP = 0.04;

export function StepsTracker({ userId, initialStepsData, onBack }: StepsTrackerProps) {
  const [stepCount, setStepCount] = useState<number>(1000);
  const [stepEntries, setStepEntries] = useState<StepEntry[]>(initialStepsData?.steps || []);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [displayedSteps, setDisplayedSteps] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (initialStepsData?.steps) {
      const total = initialStepsData.steps.reduce((sum, entry) => sum + entry.count, 0);
      setTotalSteps(total);
      
      // Animate counter
      Animated.timing(animatedValue, {
        toValue: total,
        duration: 1500,
        useNativeDriver: false,
      }).start();

      const listener = animatedValue.addListener(({ value }) => {
        setDisplayedSteps(Math.round(value));
      });

      return () => animatedValue.removeListener(listener);
    }
  }, [initialStepsData]);

  useEffect(() => {
    if (totalSteps > 0) {
      Animated.timing(animatedValue, {
        toValue: totalSteps,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [totalSteps]);

  const handleAddSteps = async () => {
    if (stepCount <= 0 || !userId || isLoading) return;

    try {
      setIsLoading(true);
      const newEntry: StepEntry = {
        count: stepCount,
        timestamp: new Date(),
      };

      const updatedEntries = [...stepEntries, newEntry];
      const newTotal = totalSteps + stepCount;

      setStepEntries(updatedEntries);
      setTotalSteps(newTotal);
    } catch (error) {
      console.error('Failed to save steps data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = Math.min(100, (displayedSteps / DAILY_GOAL) * 100);
  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference - (circumference * progressPercentage) / 100;

  return (
    <ScrollView className="flex-1 bg-[#FCFBF8]">
      {/* Header */}
      <View className="relative overflow-hidden py-6">
        <View className="absolute w-64 h-64 rounded-full bg-[#4CC3FF]/40 blur-[80px] -top-5 z-0" />
        <View className="flex-row items-center justify-between px-4 relative z-10">
          <TouchableOpacity
            className="rounded-full bg-[#FFC856] h-10 w-10 items-center justify-center"
            onPress={onBack}
          >
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold">Step Tracker</Text>
          <TouchableOpacity className="rounded-full bg-transparent h-10 w-10 items-center justify-center">
            <Settings size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View className="px-6 py-2 items-center relative z-10">
          <Text className="text-sm text-gray-500 text-center">
            Move your body, clear your mind —{'\n'}the rest will follow.
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6 py-8 items-center">
        <Text className="text-xl font-bold mb-1">DAILY STEPS</Text>
        <Text className="text-sm text-gray-500 mb-6">
          {displayedSteps.toLocaleString()} out of {DAILY_GOAL.toLocaleString()} steps
        </Text>

        {/* Circular Progress */}
        <View className="w-[250px] h-[250px] mb-8">
          <Svg width="250" height="250" viewBox="0 0 250 250">
            <Circle
              cx="125"
              cy="125"
              r="110"
              fill="white"
              stroke="#FFF0D0"
              strokeWidth="10"
            />
            <Circle
              cx="125"
              cy="125"
              r="110"
              fill="none"
              stroke="#FFC856"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 125 125)"
            />
            <SvgText
              x="125"
              y="135"
              textAnchor="middle"
              fontSize="56"
              fontWeight="bold"
              fill="#FFC856"
            >
              {Math.round(displayedSteps / 100)}
            </SvgText>
          </Svg>
        </View>

        {/* Progress markers */}
        <View className="w-full max-w-xs flex-row justify-between items-center mb-4">
          {['0', '2.5k', '5k', '7.5k', '10k'].map((label) => (
            <Text key={label} className="text-xs text-gray-500">{label}</Text>
          ))}
        </View>

        {/* Progress bar */}
        <View className="w-full max-w-xs bg-[#FFF0D0] rounded-full h-2 mb-6">
          <View 
            className="bg-[#FFC856] h-2 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          />
        </View>

        {/* Estimated calories */}
        <Text className="text-sm text-center text-gray-600 mb-8">
          Estimated calories burned: {Math.round(displayedSteps * CALORIES_PER_STEP)} kcal
        </Text>
      </View>

      {/* Add Steps Form */}
      <View className="px-6">
        <Text className="font-semibold mb-1">Add steps</Text>
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs text-gray-500">Step count</Text>
          <Text className="text-xs font-medium">{stepCount} steps</Text>
        </View>

        <View className="mb-4">
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={10000}
            step={100}
            value={stepCount}
            onValueChange={setStepCount}
            minimumTrackTintColor="#FFC856"
            maximumTrackTintColor="#FFF0D0"
            thumbTintColor="#FFC856"
            disabled={isLoading}
          />
        </View>

        {/* Quick add buttons */}
        <View className="flex-row justify-between mb-4">
          {[1000, 2500, 5000].map((count) => (
            <TouchableOpacity
              key={count}
              className="border border-gray-300 rounded-md px-3 py-2"
              onPress={() => setStepCount(count)}
              disabled={isLoading}
            >
              <Text className="text-sm">{count} steps</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="w-full bg-black rounded-md py-3 items-center"
          onPress={handleAddSteps}
          disabled={isLoading}
        >
          <Text className="text-white font-medium">
            {isLoading ? 'Adding...' : 'Add steps'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tips Card */}
      <View className="px-6 mt-6 mb-20">
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="font-semibold mb-2">Step Tips</Text>
          <View className="space-y-2">
            {[
              'Take the stairs instead of the elevator',
              'Park farther away from your destination',
              'Set a reminder to walk for 5 minutes every hour'
            ].map((tip, index) => (
              <View key={index} className="flex-row items-start">
                <View className="bg-amber-100 rounded-full p-1 mr-2 mt-0.5">
                  <View className="w-3 h-3" />
                </View>
                <Text className="text-sm flex-1">{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}