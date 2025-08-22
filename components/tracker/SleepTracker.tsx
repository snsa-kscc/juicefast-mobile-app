import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, BedIcon, MoonIcon, SunIcon, Settings } from "lucide-react-native";
import Slider from "@react-native-community/slider";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

interface SleepEntry {
  hoursSlept: number;
  quality: number;
  startTime: Date;
  endTime: Date;
}

interface DailyHealthMetrics {
  sleep?: SleepEntry;
}

interface SleepTrackerClientProps {
  userId: string;
  initialSleepData: DailyHealthMetrics | null;
}

const SLEEP_TRACKER_CONFIG = {
  dailyGoal: 8,
  defaultBedtime: "22:00",
  defaultWakeTime: "06:00",
};

export function SleepTrackerClient({ userId, initialSleepData }: SleepTrackerClientProps) {
  const router = useRouter();
  const [sleepEntry, setSleepEntry] = useState<SleepEntry | null>(initialSleepData?.sleep || null);
  const [hoursSlept, setHoursSlept] = useState<number>(sleepEntry?.hoursSlept || SLEEP_TRACKER_CONFIG.dailyGoal);
  const [displayedHours, setDisplayedHours] = useState<number>(0);
  const [sleepQuality, setSleepQuality] = useState<number>(sleepEntry?.quality || 3);
  const [bedTime, setBedTime] = useState<string>(SLEEP_TRACKER_CONFIG.defaultBedtime);
  const [wakeTime, setWakeTime] = useState<string>(SLEEP_TRACKER_CONFIG.defaultWakeTime);
  const [dailyGoal] = useState<number>(SLEEP_TRACKER_CONFIG.dailyGoal);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const previousValueRef = useRef<number>(0);

  useEffect(() => {
    if (initialSleepData?.sleep) {
      setSleepEntry(initialSleepData.sleep);
      setHoursSlept(initialSleepData.sleep.hoursSlept);
      setDisplayedHours(initialSleepData.sleep.hoursSlept);
      setSleepQuality(initialSleepData.sleep.quality);
      previousValueRef.current = initialSleepData.sleep.hoursSlept;

      const bedTimeDate = new Date(initialSleepData.sleep.startTime);
      const wakeTimeDate = new Date(initialSleepData.sleep.endTime);

      setBedTime(formatTimeForInput(bedTimeDate));
      setWakeTime(formatTimeForInput(wakeTimeDate));
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
      setDisplayedHours(calculatedHours);
      previousValueRef.current = calculatedHours;

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
      {/* Header */}
      <View className="relative overflow-hidden py-6">
        <View className="absolute w-64 h-64 rounded-full bg-[#4CC3FF]/40 blur-[80px] -top-5 z-0" />
        <View className="flex-row items-center justify-between p-4 relative z-10">
          <TouchableOpacity
            className="rounded-full bg-[#8B5CF6] h-10 w-10 items-center justify-center"
            onPress={() => router.push("/tracker")}
          >
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold">Sleep Tracker</Text>
          <TouchableOpacity className="rounded-full bg-transparent h-10 w-10 items-center justify-center">
            <Settings size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View className="px-6 py-2 items-center relative z-10">
          <Text className="text-sm text-gray-500 text-center">
            Quality sleep improves focus, mood,{"\n"}and overall health. Track your rest.
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6 py-8 items-center">
        <Text className="text-xl font-bold mb-1">DAILY SLEEP</Text>
        <Text className="text-sm text-gray-500 mb-6">
          {sleepEntry ? `${displayedHours} out of ${dailyGoal} hours goal` : "No sleep data recorded today"}
        </Text>

        {/* Circular Progress */}
        <View className="w-[250px] h-[250px] mb-8 items-center justify-center">
          <Svg width="250" height="250" viewBox="0 0 250 250">
            <Circle
              cx="125"
              cy="125"
              r="110"
              fill="white"
              stroke="#EDE9FE"
              strokeWidth="8"
            />
            <Circle
              cx="125"
              cy="125"
              r="110"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="8"
              strokeDasharray="628"
              strokeDashoffset={628 - (628 * progressPercentage) / 100}
              transform="rotate(-90 125 125)"
            />
            <SvgText
              x="125"
              y="125"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="44"
              fontWeight="bold"
              fill="#000"
            >
              {progressPercentage}
            </SvgText>
          </Svg>
        </View>

        {/* Progress markers */}
        <View className="w-full max-w-xs flex-row justify-between items-center mb-4">
          <Text className="text-xs text-gray-500">0h</Text>
          <Text className="text-xs text-gray-500">2h</Text>
          <Text className="text-xs text-gray-500">4h</Text>
          <Text className="text-xs text-gray-500">6h</Text>
          <Text className="text-xs text-gray-500">8h</Text>
        </View>

        {/* Progress bar */}
        <View className="w-full max-w-xs bg-[#EDE9FE] rounded-full h-2 mb-6">
          <View 
            className="bg-[#8B5CF6] h-2 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          />
        </View>

        {/* Sleep quality indicator */}
        <Text className="text-sm text-center text-gray-600 mb-8">
          {sleepEntry ? `Sleep quality: ${sleepQuality}/5` : "No sleep data recorded"}
        </Text>
      </View>

      {/* Sleep Entry Form */}
      <View className="w-full px-6 pb-8">
        <Text className="font-semibold mb-3">Log your sleep</Text>

        {/* Bed time and wake time */}
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-1">Bed time</Text>
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
            <Text className="text-xs text-gray-500 mb-1">Wake time</Text>
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
            <Text className="text-xs text-gray-500">Sleep quality</Text>
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
            thumbStyle={{ backgroundColor: "#8B5CF6" }}
            disabled={isLoading}
          />
          <View className="flex-row justify-between mt-1">
            <Text className="text-xs text-gray-500">Poor</Text>
            <Text className="text-xs text-gray-500">Excellent</Text>
          </View>
        </View>

        <TouchableOpacity
          className="w-full bg-[#8B5CF6] rounded-md py-3 items-center"
          onPress={handleSaveSleep}
          disabled={isLoading}
        >
          <Text className="text-white font-medium">
            {isLoading ? "Saving..." : "Save sleep data"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}