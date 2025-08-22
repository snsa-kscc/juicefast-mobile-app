import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import { TrackerHeader, CircularProgress, ProgressBar, TrackerButton, TrackerStats } from './shared';

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
      <TrackerHeader 
        title="Step Tracker"
        subtitle="Move your body, clear your mind —\nthe rest will follow."
        onBack={onBack}
        accentColor="#FFC856"
      />

      <TrackerStats 
        title="DAILY STEPS"
        subtitle={`${displayedSteps.toLocaleString()} out of ${DAILY_GOAL.toLocaleString()} steps`}
      >
        <CircularProgress
          value={displayedSteps}
          maxValue={DAILY_GOAL}
          color="#FFC856"
          backgroundColor="#FFF0D0"
          displayValue={Math.round(displayedSteps / 100)}
        />
        
        <View className="mb-6" />
        
        <ProgressBar
          value={displayedSteps}
          maxValue={DAILY_GOAL}
          color="#FFC856"
          backgroundColor="#FFF0D0"
          showMarkers
          markers={['0', '2.5k', '5k', '7.5k', '10k']}
        />
        
        <Text className="text-sm text-center text-gray-600 mb-8 mt-6">
          Estimated calories burned: {Math.round(displayedSteps * CALORIES_PER_STEP)} kcal
        </Text>
      </TrackerStats>

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

        <TrackerButton
          title={isLoading ? 'Adding...' : 'Add steps'}
          onPress={handleAddSteps}
          disabled={isLoading}
        />
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