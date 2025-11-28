import Slider from "@react-native-community/slider";
import { startTransition, useEffect, useMemo, useOptimistic, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-expo";
import { api } from "@/convex/_generated/api";
import {
  CircularProgress,
  ProgressBar,
  TrackerButton,
  WellnessHeader,
  TrackerStats,
} from "@/components/tracker/shared";

interface WaterEntry {
  amount: number;
  timestamp: Date;
}

interface HydrationTrackerProps {
  initialWaterData?: { water: WaterEntry[] } | null;
  onBack?: () => void;
  onSettingsPress?: () => void;
}

const DAILY_GOAL = 2000; // ml
const ML_PER_GLASS = 250;

export function HydrationTracker({
  initialWaterData,
  onBack,
  onSettingsPress,
}: HydrationTrackerProps) {
  const { user } = useUser();
  const [waterAmount, setWaterAmount] = useState<number>(250);
  const [displayedWater, setDisplayedWater] = useState<number>(0);
  const [isAdding, setIsAdding] = useState(false);

  const createWaterEntry = useMutation(api.waterIntake.create);
  const deleteWaterEntry = useMutation(
    api.waterIntake.deleteByUserIdAndTimestamp
  );

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

  const waterEntries = useQuery(
    api.waterIntake.getByUserId,
    user?.id ? { startTime: startTime, endTime: endTime } : "skip"
  );

  const totalWater = useMemo(() => {
    if (!waterEntries) return 0;
    return waterEntries.reduce((sum, entry) => sum + entry.amount, 0);
  }, [waterEntries]);

  const [optimisticWater, addOptimisticWater] = useOptimistic(
    totalWater || 0,
    (state, newWater: number) => state + newWater
  );

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: totalWater,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value }) => {
      setDisplayedWater(Math.round(value));
    });

    return () => animatedValue.removeListener(listener);
  }, [totalWater]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: optimisticWater,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [optimisticWater]);

  const handleAddWater = async () => {
    if (waterAmount <= 0 || !user?.id || isAdding) return;

    setIsAdding(true);
    startTransition(() => {
      addOptimisticWater(waterAmount);
    });

    try {
      await createWaterEntry({ amount: waterAmount });
    } catch (error) {
      console.error("Failed to save water data:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteEntry = async (entryId: string, timestamp: number) => {
    if (!user?.id) return;

    try {
      await deleteWaterEntry({ timestamp });
    } catch (error) {
      console.error("Failed to delete water entry:", error);
    }
  };

  const progressPercentage = Math.min(100, (displayedWater / DAILY_GOAL) * 100);

  return (
    <ScrollView
      className="flex-1 bg-jf-gray"
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
      <WellnessHeader
        title="Hydration Tracker"
        subtitle="Stay hydrated, stay healthy — every drop counts."
        accentColor="rgb(76, 195, 255)"
        showBackButton={true}
        onBackPress={onBack}
        onSettingsPress={onSettingsPress}
      />

      <TrackerStats
        title="DAILY WATER INTAKE"
        subtitle={`${displayedWater}ml out of ${DAILY_GOAL}ml`}
      >
        <CircularProgress
          value={displayedWater}
          maxValue={DAILY_GOAL}
          color="rgb(76, 195, 255)"
          backgroundColor="rgba(76, 195, 255, 0.25)"
        />

        <View className="mb-6" />

        <ProgressBar
          value={displayedWater}
          maxValue={DAILY_GOAL}
          color="rgb(76, 195, 255)"
          backgroundColor="rgba(76, 195, 255, 0.25)"
          showMarkers
          markers={["0", "500ml", "1L", "1.5L", "2L"]}
        />

        <Text className="font-lufga text-sm text-center text-gray-600 mb-8 mt-6">
          Glasses consumed: {Math.round(displayedWater / ML_PER_GLASS)} glasses
        </Text>
      </TrackerStats>

      {/* Add Water Form */}
      <View className="px-6">
        <Text className="font-lufga-semibold mb-1 text-2xl">
          Add water intake
        </Text>
        <View className="flex-row justify-between mb-1">
          <Text className="font-lufga text-sm text-gray-500">Amount</Text>
          <Text className="text-sm font-lufga-medium">{waterAmount}ml</Text>
        </View>

        <View className="mb-4">
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={1000}
            step={50}
            value={waterAmount}
            onValueChange={setWaterAmount}
            minimumTrackTintColor="rgb(76, 195, 255)"
            maximumTrackTintColor="rgba(76, 195, 255, 0.25)"
            thumbTintColor="rgb(76, 195, 255)"
          />
        </View>

        {/* Quick add buttons */}
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity
            className={`border rounded-md px-3 py-2 ${
              waterAmount === 250
                ? "border-tracker-water bg-tracker-water/25"
                : "border-gray-300"
            }`}
            onPress={() => setWaterAmount(250)}
          >
            <Text
              className={`font-lufga ${
                waterAmount === 250 ? "text-[#0277BD]" : "text-gray-700"
              }`}
            >
              250ml
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`border rounded-md px-3 py-2 ${
              waterAmount === 500
                ? "border-tracker-water bg-tracker-water/25"
                : "border-gray-300"
            }`}
            onPress={() => setWaterAmount(500)}
          >
            <Text
              className={`font-lufga ${
                waterAmount === 500 ? "text-[#0277BD]" : "text-gray-700"
              }`}
            >
              500ml
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`border rounded-md px-3 py-2 ${
              waterAmount === 750
                ? "border-tracker-water bg-tracker-water/25"
                : "border-gray-300"
            }`}
            onPress={() => setWaterAmount(750)}
          >
            <Text
              className={`font-lufga ${
                waterAmount === 750 ? "text-[#0277BD]" : "text-gray-700"
              }`}
            >
              750ml
            </Text>
          </TouchableOpacity>
        </View>

        <TrackerButton
          title="Add water"
          onPress={handleAddWater}
          isLoading={isAdding}
          loadingText="Adding..."
        />
      </View>

      {/* Water Entries List */}
      {waterEntries && waterEntries.length > 0 && (
        <View className="px-6 mt-6">
          <View className="bg-white rounded-lg p-4">
            <Text className="font-lufga-semibold mb-3 text-xl">
              Today's Water Entries
            </Text>
            {waterEntries.map((entry, index) => {
              const date = new Date(entry.timestamp);
              return (
                <View
                  key={entry._id}
                  className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <View>
                    <Text className="text-sm font-lufga-medium">
                      {entry.amount}ml
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
      <View className="px-4 mt-6 mb-16">
        <View className="bg-white rounded-2xl p-4">
          <Text className="font-lufga-semibold text-xl mb-2">
            Hydration Tips
          </Text>
          <View>
            {[
              "Start your day with a glass of water",
              "Keep a water bottle with you at all times",
              "Set reminders to drink water every hour",
            ].map((tip, index, array) => (
              <View
                key={index}
                className={`flex-row items-start ${index < array.length - 1 ? "mb-2" : ""}`}
              >
                <View className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                  <View className="w-2 h-2" />
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
