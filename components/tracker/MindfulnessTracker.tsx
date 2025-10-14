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

interface MindfulnessEntry {
  minutes: number;
  activity: string;
  timestamp: Date;
}

interface MindfulnessTrackerProps {
  initialMindfulnessData?: { mindfulness: MindfulnessEntry[] } | null;
  onBack?: () => void;
  onSettingsPress?: () => void;
}

const DAILY_GOAL = 20; // minutes
const ACTIVITIES = [
  { id: "meditation", label: "Meditation" },
  { id: "breathing", label: "Breathing" },
  { id: "mindful-walk", label: "Mindful Walk" },
  { id: "body-scan", label: "Body Scan" },
];

export function MindfulnessTracker({
  initialMindfulnessData,
  onBack,
  onSettingsPress,
}: MindfulnessTrackerProps) {
  const { user } = useUser() || {};
  const [minutes, setMinutes] = useState<number>(10);
  const [displayedMinutes, setDisplayedMinutes] = useState<number>(0);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string>(
    ACTIVITIES[0].id
  );

  const createMindfulnessEntry = useMutation(api.mindfulnessEntry.create);
  const deleteMindfulnessEntry = useMutation(
    api.mindfulnessEntry.deleteByUserIdAndTimestamp
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

  const mindfulnessEntries = useQuery(
    api.mindfulnessEntry.getByUserId,
    user?.id ? { startTime: startTime, endTime: endTime } : "skip"
  );

  const totalMinutes = useMemo(() => {
    if (!mindfulnessEntries) return 0;
    return mindfulnessEntries.reduce((sum, entry) => sum + entry.minutes, 0);
  }, [mindfulnessEntries]);

  const [optimisticMinutes, addOptimisticMinutes] = useOptimistic(
    totalMinutes || 0,
    (state, newMinutes: number) => state + newMinutes
  );

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: totalMinutes,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value }) => {
      setDisplayedMinutes(Math.round(value));
    });

    return () => animatedValue.removeListener(listener);
  }, [totalMinutes]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: optimisticMinutes,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [optimisticMinutes]);

  const handleAddMindfulness = async () => {
    if (minutes <= 0 || !user?.id || isAdding) return;

    setIsAdding(true);
    startTransition(() => {
      addOptimisticMinutes(minutes);
    });

    try {
      await createMindfulnessEntry({ minutes, activity: selectedActivity });
    } catch (error) {
      console.error("Failed to save mindfulness data:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteEntry = async (entryId: string, timestamp: number) => {
    if (!user?.id) return;

    try {
      await deleteMindfulnessEntry({ timestamp });
    } catch (error) {
      console.error("Failed to delete mindfulness entry:", error);
    }
  };

  const progressPercentage = Math.min(
    100,
    (displayedMinutes / DAILY_GOAL) * 100
  );

  return (
    <ScrollView 
      className="flex-1 bg-[#FCFBF8]"
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
      <WellnessHeader
        title="Mindfulness Tracker"
        subtitle="Mindfulness practice improves mental clarity and reduces stress."
        accentColor="rgb(254, 142, 119)"
        showBackButton={true}
        onBackPress={onBack}
        onSettingsPress={onSettingsPress}
      />

      <TrackerStats
        title="DAILY MINDFULNESS"
        subtitle={`${displayedMinutes} out of ${DAILY_GOAL} minutes`}
      >
        <CircularProgress
          value={displayedMinutes}
          maxValue={DAILY_GOAL}
          color="rgb(254, 142, 119)"
          backgroundColor="rgba(254, 142, 119, 0.25)"
        />

        <View className="mb-6" />

        <ProgressBar
          value={displayedMinutes}
          maxValue={DAILY_GOAL}
          color="rgb(254, 142, 119)"
          backgroundColor="rgba(254, 142, 119, 0.25)"
          showMarkers
          markers={["0", "5", "10", "15", "20"]}
        />

        <Text className="font-lufga text-sm text-center text-gray-600 mb-8 mt-6">
          Sessions completed: {mindfulnessEntries?.length || 0}
        </Text>
      </TrackerStats>

      {/* Add Mindfulness Form */}
      <View className="px-6">
        <Text className="font-semibold mb-1">Add mindfulness session</Text>
        <View className="flex-row justify-between mb-1">
          <Text className="font-lufga text-xs text-gray-500">Duration</Text>
          <Text className="text-xs font-medium">{minutes} minutes</Text>
        </View>

        <View className="mb-4">
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={1}
            maximumValue={60}
            step={1}
            value={minutes}
            onValueChange={setMinutes}
            minimumTrackTintColor="rgb(254, 142, 119)"
            maximumTrackTintColor="rgba(254, 142, 119, 0.25)"
            thumbTintColor="rgb(254, 142, 119)"
          />
        </View>

        <View className="mb-4">
          <Text className="font-lufga text-xs text-gray-500 mb-2">
            Activity type
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {ACTIVITIES.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                className={`border rounded-md px-3 py-2 ${
                  selectedActivity === activity.id
                    ? "border-tracker-mindfulness bg-tracker-mindfulness/25"
                    : "border-gray-300"
                }`}
                onPress={() => setSelectedActivity(activity.id)}
              >
                <Text
                  className={`font-lufga text-sm ${
                    selectedActivity === activity.id
                      ? "text-[#D2691E]"
                      : "text-gray-700"
                  }`}
                >
                  {activity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TrackerButton title="Add session" onPress={handleAddMindfulness} isLoading={isAdding} loadingText="Adding..." />
      </View>

      {/* Mindfulness Entries List */}
      {mindfulnessEntries && mindfulnessEntries.length > 0 && (
        <View className="px-6 mt-6">
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="font-semibold mb-3">
              Today's Mindfulness Sessions
            </Text>
            {mindfulnessEntries.map((entry, index) => {
              const date = new Date(entry.timestamp);
              const activity = ACTIVITIES.find(a => a.id === entry.activity);
              const activityLabel = activity ? activity.label : entry.activity.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
              return (
                <View
                  key={entry._id}
                  className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <View className="flex-1 mr-2">
                    <Text className="font-lufga text-sm font-medium" numberOfLines={2}>
                      {entry.minutes} minutes - {activityLabel}
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
          <Text className="font-semibold mb-2">Mindfulness Tips</Text>
          <View className="space-y-2">
            {[
              "Start with just 5 minutes a day and gradually increase",
              "Focus on your breath when your mind wanders",
              "Practice at the same time each day to build a habit",
            ].map((tip, index) => (
              <View key={index} className="flex-row items-start">
                <View className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
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
