import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Bell, ChevronLeft, Check } from "lucide-react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ChallengeHabitsPage() {
  const router = useRouter();

  const habits = [
    {
      id: 1,
      day: "Day 1",
      text: 'Write down your "why" and hang it up',
      completed: false,
    },
    {
      id: 2,
      day: "Day 2",
      text: "On your marks, get (the timer) set, enjoy your first fast!",
      completed: false,
    },
    {
      id: 3,
      day: "Day 3",
      text: "Swap mindless eating with a healthier activity today",
      completed: false,
    },
    {
      id: 4,
      day: "Day 4",
      text: "Feed your brain with a book or podcast after your last meal",
      completed: false,
    },
    {
      id: 5,
      day: "Day 5",
      text: "Sip on herbal tea in your fasting window",
      completed: false,
    },
    {
      id: 6,
      day: "Day 6",
      text: "Plank for 60 seconds right now!",
      completed: false,
    },
    {
      id: 7,
      day: "Day 7",
      text: "Increase your fasting window by 30 mins",
      completed: false,
    },
    {
      id: 8,
      day: "Day 8",
      text: "Read a food label and swap for a healthier option",
      completed: false,
    },
    {
      id: 9,
      day: "Day 9",
      text: "Avoid all added sugar today",
      completed: false,
    },
    {
      id: 10,
      day: "Day 10",
      text: "Replace one refined grain with one whole grain today",
      completed: false,
    },
    {
      id: 11,
      day: "Day 11",
      text: "Just have water and healthy drinks today",
      completed: false,
    },
    {
      id: 12,
      day: "Day 12",
      text: "Plan to purchase package free foods today",
      completed: false,
    },
    {
      id: 13,
      day: "Day 13",
      text: "Swap processed sauces for spices and herbs",
      completed: false,
    },
    {
      id: 14,
      day: "Day 14",
      text: "Make a meal instead of eating out this week",
      completed: false,
    },
    {
      id: 15,
      day: "Day 15",
      text: "Rise and shine, and drink some water!",
      completed: false,
    },
    {
      id: 16,
      day: "Day 16",
      text: "Say goodnight to your phone 2 hours before bedtime",
      completed: false,
    },
    {
      id: 17,
      day: "Day 17",
      text: "Prep your meals for the next day",
      completed: false,
    },
    {
      id: 18,
      day: "Day 18",
      text: "Move at least 20 minutes today",
      completed: false,
    },
    {
      id: 19,
      day: "Day 19",
      text: "Have a fruit or vegetable with every meal and snack today",
      completed: false,
    },
    {
      id: 20,
      day: "Day 20",
      text: "Include protein and fiber in all meals today",
      completed: false,
    },
    {
      id: 21,
      day: "Day 21",
      text: "Stop comparing yourself to others",
      completed: false,
    },
  ];

  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));

  // Fetch user's challenge progress from Convex
  const challengeProgress = useQuery(
    api.challengeProgress.getUserChallengeProgress
  );

  // Create local state for completed habits
  const [completedHabits, setCompletedHabits] = useState<Set<number>>(
    new Set()
  );

  // Mutation for toggling habits with optimistic updates
  const toggleHabitMutation = useMutation(api.challengeProgress.toggleHabit);

  // Update local state when data from Convex changes
  useEffect(() => {
    if (challengeProgress?.completedHabits) {
      setCompletedHabits(new Set(challengeProgress.completedHabits));
    }
  }, [challengeProgress]);

  const toggleWeek = (weekNumber: number) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);
    }
    setExpandedWeeks(newExpanded);
  };

  const toggleHabit = async (id: number) => {
    // Check if user has started the challenge
    if (!challengeProgress) {
      // Optionally show an alert or navigate to start challenge
      console.log("Please start the challenge first");
      return;
    }

    // Optimistically update UI
    const newCompleted = new Set(completedHabits);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedHabits(newCompleted);

    // Then sync with Convex
    try {
      await toggleHabitMutation({ habitId: id });
    } catch (error) {
      // Revert on error
      console.error("Failed to toggle habit:", error);
      setCompletedHabits(completedHabits);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="relative px-4 pt-12 pb-3">
        <TouchableOpacity
          className="absolute left-4 top-6 w-16 h-16 bg-gray-100 rounded-full items-center justify-center"
          onPress={() => router.back()}
        >
          <ChevronLeft size={28} color="#750046" />
        </TouchableOpacity>
        <View className="items-center justify-center">
          <Text className="text-3xl font-lufga-medium text-[#750046]">
            Habits
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-jf-gray"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-4 pt-4">
          <View className="bg-white rounded-3xl shadow-sm px-4 pt-6 pb-4">
            <TouchableOpacity
              onPress={() => toggleWeek(1)}
              className="flex-row items-center justify-between mb-4"
            >
              <Text className="text-[#750046] text-base font-lufga">
                Week 1
              </Text>
              <View className="w-8 h-8 items-center justify-center">
                <ChevronLeft
                  size={16}
                  color="#750046"
                  style={{
                    transform: [
                      {
                        rotate: expandedWeeks.has(1) ? "-90deg" : "180deg",
                      },
                    ],
                  }}
                />
              </View>
            </TouchableOpacity>

            {expandedWeeks.has(1) &&
              habits.slice(0, 7).map((habit) => (
                <View key={habit.id} className="bg-white rounded-lg mb-2 p-3">
                  <Pressable
                    onPress={() => toggleHabit(habit.id)}
                    className="flex-row items-center justify-between"
                  >
                    <View className="flex-1 mr-3">
                      <Text className="text-[#4C6281] font-lufga leading-tight">
                        {habit.text}
                      </Text>
                      <Text className="text-[#9FA2BA] text-sm font-lufga mt-1">
                        {habit.day}
                      </Text>
                    </View>
                    <View
                      className={`w-5 h-5 rounded items-center justify-center ${
                        completedHabits.has(habit.id)
                          ? "bg-[#750046]"
                          : "bg-gray-200"
                      }`}
                    >
                      {completedHabits.has(habit.id) && (
                        <Check size={12} color="white" strokeWidth={3} />
                      )}
                    </View>
                  </Pressable>
                </View>
              ))}
          </View>

          <View className="bg-white rounded-3xl shadow-sm px-4 pt-6 pb-4 mt-4">
            <TouchableOpacity
              onPress={() => toggleWeek(2)}
              className="flex-row items-center justify-between mb-4"
            >
              <Text className="text-[#750046] text-base font-lufga">
                Week 2
              </Text>
              <View className="w-8 h-8 items-center justify-center">
                <ChevronLeft
                  size={16}
                  color="#750046"
                  style={{
                    transform: [
                      {
                        rotate: expandedWeeks.has(2) ? "-90deg" : "180deg",
                      },
                    ],
                  }}
                />
              </View>
            </TouchableOpacity>

            {expandedWeeks.has(2) &&
              habits.slice(7, 14).map((habit) => (
                <View key={habit.id} className="bg-white rounded-lg mb-2 p-3">
                  <Pressable
                    onPress={() => toggleHabit(habit.id)}
                    className="flex-row items-center justify-between"
                  >
                    <View className="flex-1 mr-3">
                      <Text className="text-[#4C6281] text-base font-lufga leading-tight">
                        {habit.text}
                      </Text>
                      <Text className="text-[#9FA2BA] text-sm font-lufga mt-1">
                        {habit.day}
                      </Text>
                    </View>
                    <View
                      className={`w-5 h-5 rounded items-center justify-center ${
                        completedHabits.has(habit.id)
                          ? "bg-[#750046]"
                          : "bg-gray-200"
                      }`}
                    >
                      {completedHabits.has(habit.id) && (
                        <Check size={12} color="white" strokeWidth={3} />
                      )}
                    </View>
                  </Pressable>
                </View>
              ))}
          </View>

          <View className="bg-white rounded-3xl shadow-sm px-4 pt-6 pb-4 mt-4">
            <TouchableOpacity
              onPress={() => toggleWeek(3)}
              className="flex-row items-center justify-between mb-4"
            >
              <Text className="text-[#750046] text-base font-lufga">
                Week 3
              </Text>
              <View className="w-8 h-8 items-center justify-center">
                <ChevronLeft
                  size={16}
                  color="#750046"
                  style={{
                    transform: [
                      {
                        rotate: expandedWeeks.has(3) ? "-90deg" : "180deg",
                      },
                    ],
                  }}
                />
              </View>
            </TouchableOpacity>

            {expandedWeeks.has(3) &&
              habits.slice(14).map((habit) => (
                <View key={habit.id} className="bg-white rounded-lg mb-2 p-3">
                  <Pressable
                    onPress={() => toggleHabit(habit.id)}
                    className="flex-row items-center justify-between"
                  >
                    <View className="flex-1 mr-3">
                      <Text className="text-[#4C6281] text-base font-lufga leading-tight">
                        {habit.text}
                      </Text>
                      <Text className="text-[#9FA2BA] text-sm font-lufga mt-1">
                        {habit.day}
                      </Text>
                    </View>
                    <View
                      className={`w-5 h-5 rounded items-center justify-center ${
                        completedHabits.has(habit.id)
                          ? "bg-[#750046]"
                          : "bg-gray-200"
                      }`}
                    >
                      {completedHabits.has(habit.id) && (
                        <Check size={12} color="white" strokeWidth={3} />
                      )}
                    </View>
                  </Pressable>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
