import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  MealIcon,
  MindfulnessIcon,
  SleepIcon,
  StepsIcon,
  WaterIcon,
} from "@/components/dashboard/icons/TrackerIcons";

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
  isToday: boolean;
}

interface TaskItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const TaskItem = ({ icon, title, subtitle, onPress }: TaskItemProps) => (
  <TouchableOpacity
    className="flex-row items-center bg-white rounded-xl p-4 mb-3"
    onPress={onPress}
  >
    <View className="mr-4">{icon}</View>
    <View className="flex-1">
      <Text className="text-sm font-lufga-medium text-black mb-1">{title}</Text>
      <View className="h-[3px] bg-[#F8F9FA] mb-1 w-[60%]" />
      <Text className="text-xs text-gray-500">{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

export function DailyOverview({ data, isToday }: DailyOverviewProps) {
  const router = useRouter();

  const handleTrackerPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View className="mb-6">
      <Text className="font-lufga-semibold text-center mb-4 text-xs tracking-widest uppercase">
        DAILY OVERVIEW
      </Text>

      <View>
        <TaskItem
          icon={<MealIcon size={28} />}
          title="Eat 2 healthy meals"
          subtitle={
            isToday
              ? `${data.healthyMeals} healthy meals today`
              : `Logged ${data.healthyMeals} healthy meals`
          }
          onPress={() => handleTrackerPress("/meals")}
        />

        <TaskItem
          icon={<StepsIcon size={28} />}
          title="Take 10,000 steps"
          subtitle={
            isToday
              ? `${data.steps.toLocaleString()} steps today`
              : `Logged ${data.steps.toLocaleString()} steps`
          }
          onPress={() => handleTrackerPress("/steps")}
        />

        <TaskItem
          icon={<MindfulnessIcon size={28} />}
          title="Spend 20 quiet minutes"
          subtitle={
            isToday
              ? `${data.mindfulness} minutes today`
              : `Logged ${data.mindfulness} minutes`
          }
          onPress={() => handleTrackerPress("/mindfulness")}
        />

        <TaskItem
          icon={<SleepIcon size={28} />}
          title="Sleep 8 hours"
          subtitle={
            isToday ? `${data.sleep} hours today` : `Logged ${data.sleep} hours`
          }
          onPress={() => handleTrackerPress("/sleep")}
        />

        <TaskItem
          icon={<WaterIcon size={28} />}
          title="Drink 2.2L of water"
          subtitle={
            isToday
              ? `${(data.water / 1000).toFixed(1)}L today`
              : `Logged ${(data.water / 1000).toFixed(1)}L`
          }
          onPress={() => handleTrackerPress("/hydration")}
        />
      </View>
    </View>
  );
}
