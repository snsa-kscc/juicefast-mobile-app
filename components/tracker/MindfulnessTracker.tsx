import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Brain } from "lucide-react-native";
import Slider from "@react-native-community/slider";
import { TrackerHeader, CircularProgress, ProgressBar, TrackerButton, TrackerStats } from './shared';

interface MindfulnessEntry {
  minutes: number;
  activity: string;
  timestamp: Date;
}

interface DailyHealthMetrics {
  mindfulness?: MindfulnessEntry[];
}

interface MindfulnessTrackerProps {
  userId: string;
  initialMindfulnessData: DailyHealthMetrics | null;
}

const MINDFULNESS_TRACKER_CONFIG = {
  defaultDuration: 10,
  meditationTypes: [
    { id: "meditation", label: "Meditation" },
    { id: "breathing", label: "Breathing" },
    { id: "mindful-walk", label: "Mindful Walk" },
    { id: "body-scan", label: "Body Scan" },
  ],
};

const DAILY_TARGETS = {
  mindfulness: 20,
};

export function MindfulnessTracker({ userId, initialMindfulnessData }: MindfulnessTrackerProps) {
  const router = useRouter();
  const [minutes, setMinutes] = useState<number>(MINDFULNESS_TRACKER_CONFIG.defaultDuration);
  const [mindfulnessEntries, setMindfulnessEntries] = useState<MindfulnessEntry[]>([]);
  const [totalMinutes, setTotalMinutes] = useState<number>(0);
  const [displayedMinutes, setDisplayedMinutes] = useState<number>(0);
  const [selectedActivity, setSelectedActivity] = useState<string>(MINDFULNESS_TRACKER_CONFIG.meditationTypes[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dailyGoal] = useState<number>(DAILY_TARGETS.mindfulness);

  const previousValueRef = useRef<number>(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (initialMindfulnessData?.mindfulness) {
      setMindfulnessEntries(initialMindfulnessData.mindfulness);
      const total = initialMindfulnessData.mindfulness.reduce((sum, entry) => sum + entry.minutes, 0);
      setTotalMinutes(total);
      previousValueRef.current = total;

      // Animate counter
      Animated.timing(animatedValue, {
        toValue: total,
        duration: 1500,
        useNativeDriver: false,
      }).start();

      const listener = animatedValue.addListener(({ value }) => {
        setDisplayedMinutes(value);
      });

      return () => animatedValue.removeListener(listener);
    } else {
      setMindfulnessEntries([]);
      setTotalMinutes(0);
      setDisplayedMinutes(0);
      previousValueRef.current = 0;
    }
  }, [initialMindfulnessData]);

  const handleAddMindfulness = async () => {
    if (minutes <= 0 || !userId || isLoading) return;

    setIsLoading(true);

    try {
      const today = new Date();
      const activity = MINDFULNESS_TRACKER_CONFIG.meditationTypes.find(act => act.id === selectedActivity);

      if (!activity) {
        throw new Error("Invalid activity selected");
      }

      const newEntry: MindfulnessEntry = {
        minutes: minutes,
        activity: selectedActivity,
        timestamp: today,
      };

      // Update local state
      const updatedEntries = [...mindfulnessEntries, newEntry];
      setMindfulnessEntries(updatedEntries);
      const newTotal = totalMinutes + minutes;
      setTotalMinutes(newTotal);

      // Animate to new value
      Animated.timing(animatedValue, {
        toValue: newTotal,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      // Reset form
      setMinutes(MINDFULNESS_TRACKER_CONFIG.defaultDuration);

      Alert.alert("Success", "Mindfulness session logged successfully!");
    } catch (error) {
      console.error("Error adding mindfulness entry:", error);
      Alert.alert("Error", "Failed to log mindfulness session");
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = Math.min(100, Math.round((displayedMinutes / dailyGoal) * 100));

  return (
    <ScrollView className="flex-1 bg-[#FCFBF8]">
      <TrackerHeader 
        title="Mindfulness Tracker"
        subtitle="Mindfulness practice improves mental clarity,\nreduces stress, and enhances well-being."
        onBack={() => router.back()}
        accentColor="#4CC3FF"
      />

      <TrackerStats 
        title="DAILY MINDFULNESS"
        subtitle={`${Math.round(displayedMinutes)} out of ${dailyGoal} minutes goal`}
      >
        <CircularProgress
          value={displayedMinutes}
          maxValue={dailyGoal}
          color="#FE8E77"
          backgroundColor="#FFEFEB"
          displayValue={progressPercentage}
          strokeWidth={10}
        />
        
        <View className="mb-6" />
        
        <ProgressBar
          value={displayedMinutes}
          maxValue={dailyGoal}
          color="#FE8E77"
          backgroundColor="#FFEFEB"
          showMarkers
          markers={['0', '5', '10', '15', '20']}
        />
        
        <Text className="text-sm text-center text-gray-600 mb-8 mt-6">
          Mindfulness improves focus and reduces stress
        </Text>
      </TrackerStats>

      {/* Add Minutes Form */}
      <View className="w-full px-6 pb-8">
        <Text className="font-semibold mb-3">Add minutes</Text>
        
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs text-gray-500">Minutes</Text>
          <Text className="text-xs font-medium">{minutes} min</Text>
        </View>

        <View className="mb-4">
          <Slider
            value={minutes}
            minimumValue={1}
            maximumValue={60}
            step={1}
            onValueChange={setMinutes}
            minimumTrackTintColor="#FE8E77"
            maximumTrackTintColor="#FFEFEB"
            thumbTintColor="#FE8E77"
            disabled={isLoading}
          />
        </View>

        <View className="mb-4">
          <Text className="text-xs text-gray-500 mb-2">Activity type</Text>
          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {MINDFULNESS_TRACKER_CONFIG.meditationTypes.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                onPress={() => setSelectedActivity(activity.id)}
                disabled={isLoading}
                className={`flex-row items-center px-3 py-2 rounded-md border ${
                  selectedActivity === activity.id 
                    ? 'bg-[#FE8E77] border-[#FE8E77]' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <Brain 
                  size={16} 
                  color={selectedActivity === activity.id ? 'white' : '#6B7280'} 
                />
                <Text className={`ml-2 text-sm ${
                  selectedActivity === activity.id ? 'text-white' : 'text-gray-700'
                }`}>
                  {activity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TrackerButton
          title={isLoading ? "Logging..." : "Add minutes"}
          onPress={handleAddMindfulness}
          disabled={isLoading}
          backgroundColor="#000000"
        />

        {/* Tips Card */}
        <View className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <Text className="font-semibold mb-2">Mindfulness Tips</Text>
          <View>
            <View className="flex-row items-start mb-2">
              <View className="bg-indigo-100 rounded-full p-1 mr-2 mt-0.5">
                <Brain size={12} color="#6366F1" />
              </View>
              <Text className="text-sm flex-1">Start with just 5 minutes a day and gradually increase</Text>
            </View>
            <View className="flex-row items-start mb-2">
              <View className="bg-indigo-100 rounded-full p-1 mr-2 mt-0.5">
                <Brain size={12} color="#6366F1" />
              </View>
              <Text className="text-sm flex-1">Focus on your breath when your mind wanders</Text>
            </View>
            <View className="flex-row items-start">
              <View className="bg-indigo-100 rounded-full p-1 mr-2 mt-0.5">
                <Brain size={12} color="#6366F1" />
              </View>
              <Text className="text-sm flex-1">Practice at the same time each day to build a habit</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}