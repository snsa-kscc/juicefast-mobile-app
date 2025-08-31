import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MealIcon, MindfulnessIcon, SleepIcon, StepsIcon, WaterIcon } from "./icons/TrackerIcons";

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
  onPress: () => void;
}

const TaskItem = ({ icon, title, subtitle, onPress }: TaskItemProps) => (
  <TouchableOpacity className="flex-row items-center bg-white rounded-xl p-4 mb-3" onPress={onPress}>
    <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4">{icon}</View>
    <View className="flex-1">
      <Text className="text-sm font-medium text-black mb-1">{title}</Text>
      <Text className="text-xs text-gray-500">{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

export function DailyOverview({ data }: DailyOverviewProps) {
  const router = useRouter();

  const handleTrackerPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View className="mb-6">
      <Text className="font-semibold text-center mb-4 text-xs tracking-widest uppercase">DAILY OVERVIEW</Text>

      <View>
        <TaskItem
          icon={<MealIcon size={20} />}
          title="Eat 2 healthy meals"
          subtitle={`${data.healthyMeals} healthy meals today`}
          onPress={() => handleTrackerPress("/meals")}
        />

        <TaskItem
          icon={<StepsIcon size={20} />}
          title="Take 10,000 steps"
          subtitle={`${data.steps.toLocaleString()} steps today`}
          onPress={() => handleTrackerPress("/steps")}
        />

        <TaskItem
          icon={<MindfulnessIcon size={20} />}
          title="Spend 20 quiet minutes"
          subtitle={`${data.mindfulness} minutes today`}
          onPress={() => handleTrackerPress("/mindfulness")}
        />

        <TaskItem icon={<SleepIcon size={20} />} title="Sleep 8 hours" subtitle={`${data.sleep} hours today`} onPress={() => handleTrackerPress("/sleep")} />

        <TaskItem
          icon={<WaterIcon size={20} />}
          title="Drink 2.2L of water"
          subtitle={`${(data.water / 1000).toFixed(1)}L today`}
          onPress={() => handleTrackerPress("/hydration")}
        />
      </View>
    </View>
  );
}
