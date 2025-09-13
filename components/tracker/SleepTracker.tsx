import Slider from "@react-native-community/slider";
import React, { useEffect, useOptimistic, useRef, useState, startTransition, useMemo } from "react";
import { Animated, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-expo";
import { api } from "../../convex/_generated/api";
import { CircularProgress, ProgressBar, TrackerButton, WellnessHeader, TrackerStats } from "./shared";

interface SleepEntry {
  hoursSlept: number;
  quality: number;
  startTime: Date;
  endTime: Date;
}

interface SleepTrackerProps {
  initialSleepData?: { sleep: SleepEntry[] } | null;
  onBack?: () => void;
}

const DAILY_GOAL = 8; // hours

export function SleepTracker({ initialSleepData, onBack }: SleepTrackerProps) {
  const { user, isLoaded } = useUser() || {};
  const [hoursSlept, setHoursSlept] = useState<number>(8);
  const [displayedHours, setDisplayedHours] = useState<number>(0);
  const [sleepQuality, setSleepQuality] = useState<number>(3);
  const [bedTime, setBedTime] = useState<string>("22:00");
  const [wakeTime, setWakeTime] = useState<string>("06:00");
  
  const createSleepEntry = useMutation(api.sleepEntry.create);
  const deleteSleepEntry = useMutation(api.sleepEntry.deleteByUserIdAndTimestamp);
  
  const { startTime, endTime } = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return {
      startTime: startOfDay.getTime(),
      endTime: endOfDay.getTime()
    };
  }, []);
  
  const sleepEntries = useQuery(api.sleepEntry.getByUserId, 
    user?.id ? { userID: user.id, startTime: startTime, endTime: endTime } : "skip"
  );
  
  const totalHours = useMemo(() => {
    if (!sleepEntries) return 0;
    return sleepEntries.reduce((sum, entry) => sum + entry.hoursSlept, 0);
  }, [sleepEntries]);
  
  const [optimisticHours, addOptimisticHours] = useOptimistic(
    totalHours || 0,
    (state, newHours: number) => state + newHours
  );

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (totalHours > 0) {
      Animated.timing(animatedValue, {
        toValue: totalHours,
        duration: 1500,
        useNativeDriver: false,
      }).start();

      const listener = animatedValue.addListener(({ value }) => {
        setDisplayedHours(Math.round(value * 10) / 10);
      });

      return () => animatedValue.removeListener(listener);
    }
  }, [totalHours]);

  useEffect(() => {
    if (optimisticHours > 0) {
      Animated.timing(animatedValue, {
        toValue: optimisticHours,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [optimisticHours]);

  const calculateSleepHours = () => {
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
    return {
      hours: parseFloat(sleepDuration.toFixed(1)),
      startTime: bedDateTime.getTime(),
      endTime: wakeDateTime.getTime()
    };
  };

  const handleAddSleep = async () => {
    if (!user?.id) return;

    const { hours, startTime: sleepStartTime, endTime: sleepEndTime } = calculateSleepHours();
    
    startTransition(() => {
      addOptimisticHours(hours);
    });
    
    try {
      await createSleepEntry({ 
        userID: user.id, 
        hoursSlept: hours, 
        quality: sleepQuality,
        startTime: sleepStartTime,
        endTime: sleepEndTime
      });
    } catch (error) {
      console.error("Failed to save sleep data:", error);
    }
  };

  const handleDeleteEntry = async (entryId: string, timestamp: number) => {
    if (!user?.id) return;
    
    try {
      await deleteSleepEntry({ userID: user.id, timestamp });
    } catch (error) {
      console.error("Failed to delete sleep entry:", error);
    }
  };

  const progressPercentage = Math.min(100, (displayedHours / DAILY_GOAL) * 100);

  if (!isLoaded) {
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-[#FCFBF8]">
      <WellnessHeader title="Sleep Tracker" subtitle="Quality sleep improves focus, mood, and overall health." accentColor="#8B5CF6" showBackButton={true} onBackPress={onBack} />

      <TrackerStats title="DAILY SLEEP" subtitle={`${displayedHours}h out of ${DAILY_GOAL}h`}>
        <CircularProgress
          value={displayedHours}
          maxValue={DAILY_GOAL}
          color="#8B5CF6"
          backgroundColor="#EDE9FE"
          displayValue={Math.round(displayedHours * 10) / 10}
        />

        <View className="mb-6" />

        <ProgressBar
          value={displayedHours}
          maxValue={DAILY_GOAL}
          color="#8B5CF6"
          backgroundColor="#EDE9FE"
          showMarkers
          markers={["0h", "2h", "4h", "6h", "8h"]}
        />

        <Text className="font-lufga text-sm text-center text-gray-600 mb-8 mt-6">
          Sleep sessions: {sleepEntries?.length || 0}
        </Text>
      </TrackerStats>

      {/* Add Sleep Form */}
      <View className="px-6">
        <Text className="font-semibold mb-1">Log your sleep</Text>
        
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <Text className="font-lufga text-xs text-gray-500 mb-1">Bedtime</Text>
            <TextInput
              value={bedTime}
              onChangeText={setBedTime}
              className="border border-gray-300 rounded-md px-3 py-2"
              placeholder="22:00"
            />
          </View>
          <View className="flex-1">
            <Text className="font-lufga text-xs text-gray-500 mb-1">Wake time</Text>
            <TextInput
              value={wakeTime}
              onChangeText={setWakeTime}
              className="border border-gray-300 rounded-md px-3 py-2"
              placeholder="06:00"
            />
          </View>
        </View>

        <View className="mb-4">
          <View className="flex-row justify-between mb-1">
            <Text className="font-lufga text-xs text-gray-500">Sleep quality</Text>
            <Text className="text-xs font-medium">{sleepQuality}/5</Text>
          </View>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={sleepQuality}
            onValueChange={setSleepQuality}
            minimumTrackTintColor="#8B5CF6"
            maximumTrackTintColor="#EDE9FE"
            thumbTintColor="#8B5CF6"
          />
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-500">Poor</Text>
            <Text className="text-xs text-gray-500">Excellent</Text>
          </View>
        </View>

        <TrackerButton title="Add sleep" onPress={handleAddSleep} />
      </View>

      {/* Sleep Entries List */}
      {sleepEntries && sleepEntries.length > 0 && (
        <View className="px-6 mt-6">
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="font-semibold mb-3">Today's Sleep Entries</Text>
            {sleepEntries.map((entry, index) => {
              const date = new Date(entry.timestamp);
              return (
                <View key={entry._id} className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <View>
                    <Text className="font-lufga text-sm font-medium">{entry.hoursSlept}h - Quality: {entry.quality}/5</Text>
                    <Text className="font-lufga text-xs text-gray-500">
                      {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => handleDeleteEntry(entry._id, entry.timestamp)}
                    className="p-2 rounded-full bg-red-50 active:bg-red-100"
                  >
                    <Text className="text-red-500 text-lg">🗑️</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Tips Card */}
      <View className="px-6 mt-6 mb-20">
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="font-semibold mb-2">Sleep Tips</Text>
          <View className="space-y-2">
            {["Keep a consistent sleep schedule, even on weekends", "Avoid screens for at least 1 hour before bedtime", "Create a relaxing bedtime routine to signal it's time to sleep"].map(
              (tip, index) => (
                <View key={index} className="flex-row items-start">
                  <View className="bg-purple-100 rounded-full p-1 mr-2 mt-0.5">
                    <View className="w-3 h-3" />
                  </View>
                  <Text className="font-lufga text-sm flex-1">{tip}</Text>
                </View>
              )
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
