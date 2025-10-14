import Slider from "@react-native-community/slider";
import React, {
  useEffect,
  useOptimistic,
  useRef,
  useState,
  startTransition,
  useMemo,
} from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-expo";
import { api } from "../../convex/_generated/api";
import {
  CircularProgress,
  ProgressBar,
  TrackerButton,
  WellnessHeader,
  TrackerStats,
} from "./shared";

interface StepEntry {
  count: number;
  timestamp: Date;
}

interface StepsTrackerProps {
  initialStepsData?: { steps: StepEntry[] } | null;
  onBack?: () => void;
  onSettingsPress?: () => void;
}

const DAILY_GOAL = 10000;
const CALORIES_PER_STEP = 0.04;

export function StepsTracker({ initialStepsData, onBack, onSettingsPress }: StepsTrackerProps) {
  const { user } = useUser() || {};
  const [stepCount, setStepCount] = useState<number>(1000);
  const [displayedSteps, setDisplayedSteps] = useState<number>(0);
  const [isAdding, setIsAdding] = useState(false);

  const createStepEntry = useMutation(api.stepEntry.create);
  const deleteStepEntry = useMutation(api.stepEntry.deleteByUserIdAndTimestamp);

  const { startTime, endTime } = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    return {
      startTime: startOfDay.getTime(),
      endTime: endOfDay.getTime(),
    };
  }, []);

  const stepEntries = useQuery(
    api.stepEntry.getByUserId,
    user?.id ? { startTime, endTime } : "skip"
  );

  const totalSteps = useMemo(() => {
    if (!stepEntries) return 0;
    return stepEntries.reduce((sum, entry) => sum + entry.count, 0);
  }, [stepEntries]);

  const [optimisticSteps, addOptimisticStep] = useOptimistic(
    totalSteps || 0,
    (state, newSteps: number) => state + newSteps
  );

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: totalSteps,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value }) => {
      setDisplayedSteps(Math.round(value));
    });

    return () => animatedValue.removeListener(listener);
  }, [totalSteps]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: optimisticSteps,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [optimisticSteps]);

  const handleAddSteps = async () => {
    if (stepCount <= 0 || !user?.id || isAdding) return;

    setIsAdding(true);
    startTransition(() => {
      addOptimisticStep(stepCount);
    });

    try {
      await createStepEntry({ count: stepCount });
    } catch (error) {
      console.error("Failed to save steps data:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteEntry = async (entryId: string, timestamp: number) => {
    if (!user?.id) return;

    try {
      await deleteStepEntry({ timestamp });
    } catch (error) {
      console.error("Failed to delete step entry:", error);
    }
  };

  const progressPercentage = Math.min(100, (displayedSteps / DAILY_GOAL) * 100);
  // const circumference = 2 * Math.PI * 110;
  // const strokeDashoffset = circumference - (circumference * progressPercentage) / 100;

  return (
    <ScrollView 
      className="flex-1 bg-[#FCFBF8]"
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
      <WellnessHeader
        title="Step Tracker"
        subtitle="Move your body, clear your mind — the rest will follow."
        accentColor="rgb(255, 200, 86)"
        showBackButton={true}
        onBackPress={onBack}
        onSettingsPress={onSettingsPress}
      />

      <TrackerStats
        title="DAILY STEPS"
        subtitle={`${displayedSteps.toLocaleString()} out of ${DAILY_GOAL.toLocaleString()} steps`}
      >
        <CircularProgress
          value={displayedSteps}
          maxValue={DAILY_GOAL}
          color="rgb(255, 200, 86)"
          backgroundColor="rgba(255, 200, 86, 0.25)"
        />

        <View className="mb-6" />

        <ProgressBar
          value={displayedSteps}
          maxValue={DAILY_GOAL}
          color="rgb(255, 200, 86)"
          backgroundColor="rgba(255, 200, 86, 0.25)"
          showMarkers
          markers={["0", "2.5k", "5k", "7.5k", "10k"]}
        />

        <Text className="font-lufga text-sm text-center text-gray-600 mb-8 mt-6">
          Estimated calories burned:{" "}
          {Math.round(displayedSteps * CALORIES_PER_STEP)} kcal
        </Text>
      </TrackerStats>

      {/* Add Steps Form */}
      <View className="px-6">
        <Text className="font-semibold mb-1">Add steps</Text>
        <View className="flex-row justify-between mb-1">
          <Text className="font-lufga text-xs text-gray-500">Step count</Text>
          <Text className="text-xs font-medium">{stepCount} steps</Text>
        </View>

        <View className="mb-4">
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={10000}
            step={100}
            value={stepCount}
            onValueChange={setStepCount}
            minimumTrackTintColor="rgb(255, 200, 86)"
            maximumTrackTintColor="rgba(255, 200, 86, 0.25)"
            thumbTintColor="rgb(255, 200, 86)"
          />
        </View>

        {/* Quick add buttons */}
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity
            className={`border rounded-md px-3 py-2 ${
              stepCount === 1000
                ? "border-tracker-steps bg-tracker-steps/25"
                : "border-gray-300"
            }`}
            onPress={() => setStepCount(1000)}
          >
            <Text
              className={`font-lufga text-sm ${
                stepCount === 1000 ? "text-[#B8860B]" : "text-gray-700"
              }`}
            >
              1000 steps
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`border rounded-md px-3 py-2 ${
              stepCount === 2500
                ? "border-tracker-steps bg-tracker-steps/25"
                : "border-gray-300"
            }`}
            onPress={() => setStepCount(2500)}
          >
            <Text
              className={`font-lufga text-sm ${
                stepCount === 2500 ? "text-[#B8860B]" : "text-gray-700"
              }`}
            >
              2500 steps
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`border rounded-md px-3 py-2 ${
              stepCount === 5000
                ? "border-tracker-steps bg-tracker-steps/25"
                : "border-gray-300"
            }`}
            onPress={() => setStepCount(5000)}
          >
            <Text
              className={`font-lufga text-sm ${
                stepCount === 5000 ? "text-[#B8860B]" : "text-gray-700"
              }`}
            >
              5000 steps
            </Text>
          </TouchableOpacity>
        </View>

        <TrackerButton title="Add steps" onPress={handleAddSteps} isLoading={isAdding} loadingText="Adding..." />
      </View>

      {/* Step Entries List */}
      {stepEntries && stepEntries.length > 0 && (
        <View className="px-6 mt-6">
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="font-semibold mb-3">Today's Step Entries</Text>
            {stepEntries.map((entry, index) => {
              const date = new Date(entry.timestamp);
              return (
                <View
                  key={entry._id}
                  className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <View>
                    <Text className="font-lufga text-sm font-medium">
                      {entry.count.toLocaleString()} steps
                    </Text>
                    <Text className="font-lufga text-xs text-gray-500">
                      {date.toLocaleDateString()} at{" "}
                      {date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      handleDeleteEntry(entry._id, entry.timestamp)
                    }
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
          <Text className="font-semibold mb-2">Step Tips</Text>
          <View className="space-y-2">
            {[
              "Take the stairs instead of the elevator",
              "Park farther away from your destination",
              "Set a reminder to walk for 5 minutes every hour",
            ].map((tip, index) => (
              <View key={index} className="flex-row items-start">
                <View className="bg-amber-100 rounded-full p-1 mr-2 mt-0.5">
                  <View className="w-3 h-3" />
                </View>
                <Text className="font-lufga text-sm flex-1">{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
