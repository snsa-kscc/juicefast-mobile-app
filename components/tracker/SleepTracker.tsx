import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { MoonIcon, SunIcon } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, ScrollView, Text, TextInput, View } from "react-native";
import { CircularProgress, ProgressBar, TrackerButton, TrackerHeader, TrackerStats } from "./shared";

interface SleepEntry {
  hoursSlept: number;
  quality: number;
  startTime: Date;
  endTime: Date;
}

interface DailyHealthMetrics {
  sleep?: SleepEntry;
}

interface SleepTrackerProps {
  userId: string;
  initialSleepData: DailyHealthMetrics | null;
}

const SLEEP_TRACKER_CONFIG = {
  dailyGoal: 8,
  defaultBedtime: "22:00",
  defaultWakeTime: "06:00",
};

export function SleepTracker({ userId, initialSleepData }: SleepTrackerProps) {
  const router = useRouter();
  const [sleepEntry, setSleepEntry] = useState<SleepEntry | null>(initialSleepData?.sleep || null);
  const [, setHoursSlept] = useState<number>(sleepEntry?.hoursSlept || SLEEP_TRACKER_CONFIG.dailyGoal);
  const [displayedHours, setDisplayedHours] = useState<number>(0);
  const [sleepQuality, setSleepQuality] = useState<number>(sleepEntry?.quality || 3);
  const [bedTime, setBedTime] = useState<string>(SLEEP_TRACKER_CONFIG.defaultBedtime);
  const [wakeTime, setWakeTime] = useState<string>(SLEEP_TRACKER_CONFIG.defaultWakeTime);
  const [dailyGoal] = useState<number>(SLEEP_TRACKER_CONFIG.dailyGoal);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const previousValueRef = useRef<number>(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (initialSleepData?.sleep) {
      setSleepEntry(initialSleepData.sleep);
      setHoursSlept(initialSleepData.sleep.hoursSlept);
      setSleepQuality(initialSleepData.sleep.quality);
      previousValueRef.current = initialSleepData.sleep.hoursSlept;

      const bedTimeDate = new Date(initialSleepData.sleep.startTime);
      const wakeTimeDate = new Date(initialSleepData.sleep.endTime);

      setBedTime(formatTimeForInput(bedTimeDate));
      setWakeTime(formatTimeForInput(wakeTimeDate));

      // Animate counter
      Animated.timing(animatedValue, {
        toValue: initialSleepData.sleep.hoursSlept,
        duration: 1500,
        useNativeDriver: false,
      }).start();

      const listener = animatedValue.addListener(({ value }) => {
        setDisplayedHours(value);
      });

      return () => animatedValue.removeListener(listener);
    } else {
      setDisplayedHours(0);
      previousValueRef.current = 0;
    }
  }, [initialSleepData]);

  const formatTimeForInput = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleSaveSleep = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const [bedHours, bedMinutes] = bedTime.split(":").map(Number);
      const bedDateTime = new Date(yesterday);
      bedDateTime.setHours(bedHours, bedMinutes, 0, 0);

      const [wakeHours, wakeMinutes] = wakeTime.split(":").map(Number);
      const wakeDateTime = new Date(today);
      wakeDateTime.setHours(wakeHours, wakeMinutes, 0, 0);

      if (bedDateTime >= wakeDateTime) {
        bedDateTime.setDate(bedDateTime.getDate() - 1);
      }

      const sleepDuration = (wakeDateTime.getTime() - bedDateTime.getTime()) / (1000 * 60 * 60);
      const calculatedHours = parseFloat(sleepDuration.toFixed(1));

      const newSleepEntry: SleepEntry = {
        hoursSlept: calculatedHours,
        quality: sleepQuality,
        startTime: bedDateTime,
        endTime: wakeDateTime,
      };

      setSleepEntry(newSleepEntry);
      setHoursSlept(calculatedHours);
      previousValueRef.current = calculatedHours;

      // Animate to new value
      Animated.timing(animatedValue, {
        toValue: calculatedHours,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      Alert.alert("Success", "Sleep data saved successfully!");
    } catch (error) {
      console.error("Error saving sleep data:", error);
      Alert.alert("Error", "Failed to save sleep data");
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = sleepEntry ? Math.min(100, Math.round((displayedHours / dailyGoal) * 100)) : 0;

  return (
    <ScrollView className="flex-1 bg-[#FCFBF8]">
      <TrackerHeader
        title="Sleep Tracker"
        subtitle="Quality sleep improves focus, mood,\nand overall health. Track your rest."
        onBack={() => router.back()}
        accentColor="#8B5CF6"
      />

      <TrackerStats title="DAILY SLEEP" subtitle={sleepEntry ? `${displayedHours} out of ${dailyGoal} hours goal` : "No sleep data recorded today"}>
        <CircularProgress
          value={displayedHours}
          maxValue={dailyGoal}
          color="#8B5CF6"
          backgroundColor="#EDE9FE"
          displayValue={progressPercentage}
          strokeWidth={8}
        />

        <View className="mb-6" />

        <ProgressBar
          value={displayedHours}
          maxValue={dailyGoal}
          color="#8B5CF6"
          backgroundColor="#EDE9FE"
          showMarkers
          markers={["0h", "2h", "4h", "6h", "8h"]}
        />

        <Text className="font-lufga text-sm text-center text-gray-600 mb-8 mt-6">
          {sleepEntry ? `Sleep quality: ${sleepQuality}/5` : "No sleep data recorded"}
        </Text>
      </TrackerStats>

      {/* Sleep Entry Form */}
      <View className="w-full px-6 pb-8">
        <Text className="font-semibold mb-3">Log your sleep</Text>

        {/* Bed time and wake time */}
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <Text className="font-lufga text-sm flex-1">Avoid screens for at least 1 hour before bedtime</Text>
            <View className="relative">
              <TextInput
                value={bedTime}
                onChangeText={setBedTime}
                className="border border-gray-300 rounded-md px-3 py-2 pl-9"
                placeholder="22:00"
                editable={!isLoading}
              />
              <View className="absolute left-3 top-1/2 -translate-y-1/2">
                <MoonIcon size={16} color="#9CA3AF" />
              </View>
            </View>
          </View>
          <View className="flex-1">
            <Text className="font-lufga text-sm flex-1">Create a relaxing bedtime routine to signal it's time to sleep</Text>
            <View className="relative">
              <TextInput
                value={wakeTime}
                onChangeText={setWakeTime}
                className="border border-gray-300 rounded-md px-3 py-2 pl-9"
                placeholder="06:00"
                editable={!isLoading}
              />
              <View className="absolute left-3 top-1/2 -translate-y-1/2">
                <SunIcon size={16} color="#9CA3AF" />
              </View>
            </View>
          </View>
        </View>

        {/* Sleep quality */}
        <View className="mb-4">
          <View className="flex-row justify-between mb-1">
            <Text className="font-lufga text-xs text-gray-500">Sleep quality</Text>
            <Text className="text-xs font-medium">{sleepQuality}/5</Text>
          </View>
          <Slider
            value={sleepQuality}
            minimumValue={1}
            maximumValue={5}
            step={1}
            onValueChange={setSleepQuality}
            minimumTrackTintColor="#8B5CF6"
            maximumTrackTintColor="#EDE9FE"
            thumbTintColor="#8B5CF6"
            disabled={isLoading}
          />
          <View className="flex-row justify-between mt-1">
            <Text className="text-xs text-gray-500">Poor</Text>
            <Text className="font-lufga text-sm flex-1">Keep a consistent sleep schedule, even on weekends</Text>
          </View>
        </View>

        <TrackerButton title={isLoading ? "Saving..." : "Save sleep data"} onPress={handleSaveSleep} disabled={isLoading} backgroundColor="#8B5CF6" />
      </View>
    </ScrollView>
  );
}
