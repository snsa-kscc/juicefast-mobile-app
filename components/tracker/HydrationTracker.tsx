import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import { TrackerHeader, CircularProgress, ProgressBar, TrackerButton, TrackerStats } from './shared';
import { Droplets } from 'lucide-react-native';

interface WaterIntake {
  amount: number;
  timestamp: Date;
}

interface HydrationTrackerProps {
  userId: string;
  initialWaterData?: { waterIntake: WaterIntake[] } | null;
  onBack?: () => void;
}

const DAILY_GOAL = 2000; // 2L in ml
const DEFAULT_AMOUNT = 250;
const MIN_AMOUNT = 50;
const MAX_AMOUNT = 1000;
const STEP_SIZE = 50;
const QUICK_ADD_AMOUNTS = [250, 500, 750];

export function HydrationTracker({ userId, initialWaterData, onBack }: HydrationTrackerProps) {
  const [waterAmount, setWaterAmount] = useState<number>(DEFAULT_AMOUNT);
  const [waterEntries, setWaterEntries] = useState<WaterIntake[]>(initialWaterData?.waterIntake || []);
  const [totalWater, setTotalWater] = useState<number>(0);
  const [displayedTotal, setDisplayedTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (initialWaterData?.waterIntake) {
      const total = initialWaterData.waterIntake.reduce((sum, entry) => sum + entry.amount, 0);
      setTotalWater(total);
      
      // Animate counter
      Animated.timing(animatedValue, {
        toValue: total,
        duration: 1500,
        useNativeDriver: false,
      }).start();

      const listener = animatedValue.addListener(({ value }) => {
        setDisplayedTotal(Math.round(value));
      });

      return () => animatedValue.removeListener(listener);
    }
  }, [initialWaterData]);

  useEffect(() => {
    if (totalWater > 0) {
      Animated.timing(animatedValue, {
        toValue: totalWater,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [totalWater]);

  const handleAddWater = async () => {
    if (!userId || isLoading) return;

    try {
      setIsLoading(true);
      const newEntry: WaterIntake = {
        amount: waterAmount,
        timestamp: new Date(),
      };

      const updatedEntries = [...waterEntries, newEntry];
      const newTotal = totalWater + waterAmount;

      setWaterEntries(updatedEntries);
      setTotalWater(newTotal);
    } catch (error) {
      console.error('Failed to save water data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatWaterAmount = (amount: number): string => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}L`;
    }
    return `${amount}ml`;
  };

  const progressPercentage = Math.min(100, Math.round((displayedTotal / DAILY_GOAL) * 100));

  return (
    <ScrollView className="flex-1 bg-[#FCFBF8]">
      <TrackerHeader 
        title="Water Tracker"
        subtitle="Hydration fuels your focus, energy\nand digestion. Keep it flowing."
        onBack={onBack}
        accentColor="#3BB9FF"
      />

      <TrackerStats 
        title="DAILY HYDRATION"
        subtitle={`${formatWaterAmount(displayedTotal)} out of ${formatWaterAmount(DAILY_GOAL)} goal achieved`}
      >
        <CircularProgress
          value={displayedTotal}
          maxValue={DAILY_GOAL}
          color="#3BB9FF"
          backgroundColor="#E6F4FF"
          displayValue={formatWaterAmount(displayedTotal).replace('ml', '')}
        />
        
        <View className="mb-6" />
        
        <ProgressBar
          value={displayedTotal}
          maxValue={DAILY_GOAL}
          color="#3BB9FF"
          backgroundColor="#E6F4FF"
          showMarkers
          markers={['0', '500ml', '1L', '1.5L', '2L']}
        />
        
        <Text className="font-sans text-sm text-center text-gray-600 mb-8 mt-6">
          Your body is {progressPercentage}% water. You're{'\n'}giving it what it needs.
        </Text>
      </TrackerStats>

      {/* Add Water Form */}
      <View className="px-6">
        <Text className="font-sans font-semibold mb-1">Add water</Text>
        <View className="flex-row justify-between mb-1">
          <Text className="font-sans text-xs text-gray-500">Amount (ml)</Text>
          <Text className="font-sans text-xs font-medium">{waterAmount}ml</Text>
        </View>

        <View className="mb-4">
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={MIN_AMOUNT}
            maximumValue={MAX_AMOUNT}
            step={STEP_SIZE}
            value={waterAmount}
            onValueChange={setWaterAmount}
            minimumTrackTintColor="#3BB9FF"
            maximumTrackTintColor="#E6F4FF"
            thumbTintColor="#3BB9FF"
            disabled={isLoading}
          />
        </View>

        {/* Quick add buttons */}
        <View className="flex-row justify-between mb-4">
          {QUICK_ADD_AMOUNTS.map((amount) => (
            <TouchableOpacity
              key={amount}
              className="border border-gray-300 rounded-md px-3 py-2"
              onPress={() => setWaterAmount(amount)}
              disabled={isLoading}
            >
              <Text className="font-sans text-sm">{amount} ml</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TrackerButton
          title={isLoading ? 'Adding...' : 'Add water'}
          onPress={handleAddWater}
          disabled={isLoading}
        />
      </View>

      {/* Tips Card */}
      <View className="px-6 mt-6 mb-20">
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="font-sans font-semibold mb-2">Hydration Tips</Text>
          <View className="space-y-2">
            {[
              'Drink a glass of water first thing in the morning',
              'Carry a reusable water bottle with you throughout the day',
              'Set reminders to drink water every hour'
            ].map((tip, index) => (
              <View key={index} className="flex-row items-start">
                <View className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                  <Droplets size={12} color="#3BB9FF" />
                </View>
                <Text className="font-sans text-sm flex-1">{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}