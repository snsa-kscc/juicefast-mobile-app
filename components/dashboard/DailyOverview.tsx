import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { MealIcon, StepsIcon, MindfulnessIcon, SleepIcon, WaterIcon } from './icons/TrackerIcons';

interface DailyData {
  steps: number;
  water: number;
  calories: number;
  mindfulness: number;
  sleep: number;
  healthyMeals: number;
}

interface DailyOverviewProps {
  data: DailyData;
}

interface TaskItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
}

const TaskItem = ({ icon, title, subtitle, href }: TaskItemProps) => (
  <Link href={href} asChild>
    <TouchableOpacity className="flex-row items-center bg-white rounded-xl p-4 mb-3">
      <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium text-black mb-1">{title}</Text>
        <Text className="text-xs text-gray-500">{subtitle}</Text>
      </View>
    </TouchableOpacity>
  </Link>
);

export function DailyOverview({ data }: DailyOverviewProps) {
  return (
    <View className="mb-6">
      <Text className="font-semibold text-center mb-4 text-xs tracking-widest uppercase">
        DAILY OVERVIEW
      </Text>
      
      <View>
        <TaskItem
          icon={<MealIcon size={20} />}
          title="Eat 2 healthy meals"
          subtitle={`${data.healthyMeals} healthy meals today`}
          href="/meals"
        />
        
        <TaskItem
          icon={<StepsIcon size={20} />}
          title="Take 10,000 steps"
          subtitle={`${data.steps.toLocaleString()} steps today`}
          href="/steps"
        />
        
        <TaskItem
          icon={<MindfulnessIcon size={20} />}
          title="Spend 20 quiet minutes"
          subtitle={`${data.mindfulness} minutes today`}
          href="/mindfulness"
        />
        
        <TaskItem
          icon={<SleepIcon size={20} />}
          title="Sleep 8 hours"
          subtitle={`${data.sleep} hours today`}
          href="/sleep"
        />
        
        <TaskItem
          icon={<WaterIcon size={20} />}
          title="Drink 2.2L of water"
          subtitle={`${(data.water / 1000).toFixed(1)}L today`}
          href="/hydration"
        />
      </View>
    </View>
  );
}