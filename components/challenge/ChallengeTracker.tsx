import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SquarePen } from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  HabitTargetIcon,
  CaloriesIcon,
  TimerIcon,
  CircleGradientBorder,
} from "@/components/challenge/ChallengeIcons";

export function ChallengeTracker() {
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesRemaining, setCaloriesRemaining] = useState(2536);

  const [proteinValue, setProteinValue] = useState(0);
  const [fatValue, setFatValue] = useState(0);
  const [carbsValue, setCarbsValue] = useState(0);

  const [waterValue, setWaterValue] = useState(0);
  const [stepsValue, setStepsValue] = useState(0);

  const router = useRouter();

  return (
    <View className="px-6 mb-32">
      {/* Challenge Timer Card */}
      <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm">
        <View className="flex-row items-center gap-5">
          {/* Left side - Circle Gradient Border  */}
          <View className="relative">
            <CircleGradientBorder size={109} />
          </View>

          {/* Right side - Content */}
          <View className="flex-1 justify-center gap-2.5">
            {/* Title with Clock Badge */}
            <View className="flex-row items-center gap-1.5">
              <TimerIcon size={22} />
              <Text className="text-base font-lufga-semibold text-black">
                Challenge Timer
              </Text>
            </View>

            {/* Description */}
            <Text className="text-sm font-lufga text-black leading-[18px]">
              Press for the best version of yourself in 2026
            </Text>

            {/* Button */}
            <TouchableOpacity
              className="rounded-xl items-center justify-center py-3.5 px-11"
              style={{ backgroundColor: "#baf2c4" }}
              onPress={() => router.push("/challenge/progress-dashboard")}
            >
              <Text
                className="text-sm font-lufga-semibold text-center"
                style={{ color: "#003d29", letterSpacing: -0.28 }}
              >
                Progress Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Calories Card */}
      <View className="bg-white rounded-2xl px-4 py-5 mb-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-end gap-2">
            <CaloriesIcon size={24} />
            <Text className="text-base font-lufga-medium text-black">
              Calories
            </Text>
          </View>

          <TouchableOpacity
            className="h-5 w-5 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Edit calories"
          >
            <SquarePen size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View className="h-5" />

        {/* Calories Stats */}
        <View className="flex-row items-start justify-evenly">
          <LinearGradient
            colors={["#A5ECC9", "#F8F6EB", "#EFEFEF"]}
            locations={[0.17894, 1, 1]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 40,
              borderWidth: 1,
              borderColor: "rgba(107, 212, 186, 0.29)",
              padding: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              className="text-2xl font-lufga-semibold text-black"
              style={{ lineHeight: 32 }}
            >
              {caloriesBurned}
            </Text>
            <Text className="text-sm font-lufga text-black">Burned</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#A5ECC9", "#F8F6EB", "#EFEFEF"]}
            locations={[0.17894, 1, 1]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 40,
              borderWidth: 1,
              borderColor: "rgba(107, 212, 186, 0.29)",
              padding: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              className="text-2xl font-lufga-semibold text-black"
              style={{ lineHeight: 32 }}
            >
              {caloriesConsumed}
            </Text>
            <Text className="text-sm font-lufga text-black">Consumed</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#A5ECC9", "#F8F6EB", "#EFEFEF"]}
            locations={[0.17894, 1, 1]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 40,
              borderWidth: 1,
              borderColor: "rgba(107, 212, 186, 0.29)",
              padding: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              className="text-2xl font-lufga-semibold text-black"
              style={{ lineHeight: 32 }}
            >
              {caloriesRemaining.toLocaleString()}
            </Text>
            <Text className="text-sm font-lufga text-black">Remaining</Text>
          </LinearGradient>
        </View>
      </View>

      {/* Add a meal section */}
      <View className="bg-white rounded-xl px-4 py-2 mb-4 flex-row items-center justify-between">
        <Text className="text-base font-lufga text-black">Add a meal</Text>
        <TouchableOpacity
          className="items-center justify-center"
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            backgroundColor: "#BAF2C4",
          }}
          onPress={() => router.push("/meals")}
        >
          <Text className="text-base font-lufga-medium text-black">+</Text>
        </TouchableOpacity>
      </View>

      {/* Macros Row */}
      <View className="bg-white rounded-xl px-4 py-3 mb-4 flex-row items-center justify-between">
        {/* Protein */}
        <View className="flex-1 items-center" style={{ gap: 6 }}>
          <Text className="text-lg font-lufga text-[#666] text-center w-full">
            Protein
          </Text>
          <View
            className="w-full h-1.5 rounded-2xl"
            style={{ backgroundColor: "#F1F4F3" }}
          />
          <Text className="text-base font-lufga text-[#506484] text-center w-full">
            {proteinValue}/159g
          </Text>
        </View>

        {/* Fat */}
        <View className="flex-1 items-center" style={{ gap: 6 }}>
          <Text className="text-lg font-lufga text-[#666] text-center w-full">
            Fat
          </Text>
          <View
            className="w-full h-1.5 rounded-2xl"
            style={{ backgroundColor: "#F1F4F3" }}
          />
          <Text className="text-base font-lufga text-[#506484] text-center w-full">
            {fatValue}/106g
          </Text>
        </View>

        {/* Carbs */}
        <View className="flex-1 items-center" style={{ gap: 6 }}>
          <Text className="text-lg font-lufga text-[#666] text-center w-full">
            Carbs
          </Text>
          <View
            className="w-full h-1.5 rounded-2xl"
            style={{ backgroundColor: "#F1F4F3" }}
          />
          <Text className="text-base font-lufga text-[#506484] text-center w-full">
            {carbsValue}/396g
          </Text>
        </View>
      </View>

      {/* Water Row */}
      <View className="bg-white rounded-xl px-4 py-2 mb-3 flex-row items-center justify-between">
        <Text className="text-base font-lufga text-black">Water</Text>
        <View className="flex-row items-center">
          <Text className="text-base font-lufga text-gray-600 mr-3">
            {waterValue}ml
          </Text>
          <TouchableOpacity
            className="items-center justify-center"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: "#BAF2C4",
            }}
            onPress={() => router.push("/hydration")}
          >
            <Text className="text-base font-lufga-medium text-black">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Steps Row */}
      <View className="bg-white rounded-xl px-4 py-2 mb-4 flex-row items-center justify-between">
        <Text className="text-base font-lufga text-black">Steps</Text>
        <View className="flex-row items-center">
          <Text className="text-base font-lufga text-gray-600 mr-3">
            {stepsValue}
          </Text>
          <TouchableOpacity
            className="items-center justify-center"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: "#BAF2C4",
            }}
            onPress={() => router.push("/steps")}
          >
            <Text className="text-base font-lufga-medium text-black">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Habits Section */}
      <LinearGradient
        colors={["#A5ECC9", "#F8F6EB", "#EFEFEF"]}
        locations={[0.17894, 1, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ borderRadius: 16 }}
        className="mb-4 px-4 py-3"
      >
        <View
          className="flex-row items-center justify-between pb-1"
          style={{ borderBottomWidth: 0.5, borderBottomColor: "#FFFFFF" }}
        >
          <Text className="text-base font-lufga text-black">Habits</Text>
          <Text className="text-base font-lufga text-black">
            Done for today
          </Text>
        </View>

        {/* Progress Line */}
        <View className="h-4 justify-center my-4">
          <LinearGradient
            colors={["#FBBF24", "#F97316"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 4, width: "100%", borderRadius: 999 }}
          />
        </View>

        <View className="flex-row items-center mt-3" style={{ gap: 12 }}>
          <View style={{ width: 54, height: 55 }}>
            <View
              className="overflow-hidden items-center justify-center"
              style={{ width: 54, height: 55, borderRadius: 999 }}
            >
              <HabitTargetIcon size={54} />
            </View>
          </View>

          <View className="flex-1" style={{ gap: 5 }}>
            <Text
              className="text-xl font-lufga-semibold text-black"
              style={{ lineHeight: 20 }}
            >
              Fat Loss
            </Text>
            <Text
              className="text-base font-lufga text-black"
              style={{ lineHeight: 17 }}
            >
              Congratulations, you completed the healthy habit!
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="items-center justify-center rounded-xl py-1.5 mt-3"
          style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
        >
          <Text className="text-base font-lufga text-black text-center">
            Add habit
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
