import React from 'react';
import { View, Text } from 'react-native';
import { Info } from 'lucide-react-native';
import { CircularProgress } from '@/components/tracker/shared';
import { MealIcon, StepsIcon, MindfulnessIcon, WaterIcon } from './icons/TrackerIcons';

interface ProgressBarProps {
  icon: React.ReactNode;
  value: number;
  backgroundColor: string;
  fillColor: string;
}

const ProgressBar = ({ icon, value, backgroundColor, fillColor }: ProgressBarProps) => (
  <View className="flex-col items-center">
    <View className="w-12 h-16 rounded-2xl flex-col items-center justify-center mb-1 relative overflow-hidden" style={{ backgroundColor }}>
      <View 
        className="absolute bottom-0 left-0 right-0" 
        style={{ 
          height: `${Math.min(100, value)}%`,
          backgroundColor: fillColor 
        }} 
      />
      <View className="flex-col items-center justify-center z-10 absolute inset-0">
        <View className="mb-1">{icon}</View>
        <Text className={`text-xs font-semibold ${value > 80 ? 'text-white' : 'text-black'}`}>
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
    water: number;
  };
}

export function WellnessScoreCard({ averageScore, dailyProgress }: WellnessScoreCardProps) {
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
          value={averageScore}
          maxValue={100}
          color="#E8D5B0"
          backgroundColor="#F2E9D8"
          displayValue={Math.round(averageScore)}
          size={200}
        />
        <Text className="text-xs text-gray-500 mt-3 text-center">
          One step and one goal at a time.
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-center font-semibold text-xs tracking-widest uppercase mb-4">
          DAILY PROGRESS SUMMARY (%)
        </Text>
        <View className="flex-row justify-around">
          <ProgressBar
            icon={<StepsIcon size={16} />}
            value={dailyProgress.steps}
            backgroundColor="#FFF8E7"
            fillColor="#FFC856"
          />
          <ProgressBar
            icon={<MindfulnessIcon size={16} />}
            value={dailyProgress.mindfulness}
            backgroundColor="#FFF0F0"
            fillColor="#FF8080"
          />
          <ProgressBar
            icon={<MealIcon size={16} />}
            value={dailyProgress.meals}
            backgroundColor="#F0FFF4"
            fillColor="#11B364"
          />
          <ProgressBar
            icon={<WaterIcon size={16} />}
            value={dailyProgress.water}
            backgroundColor="#EBF9FF"
            fillColor="#4CC3FF"
          />
        </View>
      </View>
    </View>
  );
}