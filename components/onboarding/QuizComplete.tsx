import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useOnboardingCompletion } from "../../utils/onboarding";
import { CheckCircle, ArrowRight } from "lucide-react-native";

interface QuizCompleteProps {
  answers: Record<string, string | string[] | number>;
}

const LINK_RULES = [
  {
    condition: (answers: Record<string, string | string[] | number>) => {
      const movementAnswer = answers.movement;
      return movementAnswer === "daily" || movementAnswer === "few_times";
    },
    link: "https://juicefast.com/functional-juices/",
  },
  {
    condition: (answers: Record<string, string | string[] | number>) => {
      const activitiesAnswer = answers.activities;
      return (
        Array.isArray(activitiesAnswer) &&
        (activitiesAnswer.includes("yoga") ||
          activitiesAnswer.includes("pilates"))
      );
    },
    link: "https://juicefast.com/proteins-adaptogens/",
  },
  {
    condition: (answers: Record<string, string | string[] | number>) => {
      const eatingHabitsAnswer = answers.eating_habits;
      return (
        Array.isArray(eatingHabitsAnswer) &&
        (eatingHabitsAnswer.includes("chaotic") ||
          eatingHabitsAnswer.includes("emotional_eater"))
      );
    },
    link: "https://juicefast.com/fasting/",
  },
];

function getSelectedLink(
  answers: Record<string, string | string[] | number>
): string | null {
  const matchingLinks = LINK_RULES.filter((rule) =>
    rule.condition(answers)
  ).map((rule) => rule.link);

  if (matchingLinks.length === 0) {
    return null;
  }

  if (matchingLinks.length === 1) {
    return matchingLinks[0];
  }

  const randomIndex = Math.floor(Math.random() * matchingLinks.length);
  return matchingLinks[randomIndex];
}

export function QuizComplete({ answers }: QuizCompleteProps) {
  const { markOnboardingCompleted } = useOnboardingCompletion();

  const handleContinue = async () => {
    await markOnboardingCompleted();

    const selectedLink = getSelectedLink(answers);

    if (selectedLink) {
      const encodedLink = encodeURIComponent(selectedLink);
      router.replace({
        pathname: "/(tabs)/store",
        params: { link: encodedLink },
      });
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: "#F8F6F2" }}>
      <View className="flex-1 items-center justify-center px-6 py-12">
        {/* Success icon */}
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: "#D1FAE5" }}
        >
          <CheckCircle size={40} color="#10B981" />
        </View>

        {/* Title */}
        <Text
          className="text-4xl font-bold text-center mb-4"
          style={{ color: "#1A1A1A", lineHeight: 44 }}
        >
          Your Wellness Profile is Ready!
        </Text>

        {/* Description */}
        <Text
          className="text-xl text-center mb-12 max-w-md"
          style={{ color: "#6B7280", lineHeight: 28 }}
        >
          Based on your responses, we've created a personalized wellness plan
          just for you.
        </Text>

        {/* Recommendations */}
        <View className="w-full max-w-md mb-8">
          <View className="flex-row items-center justify-center mb-6">
            <Text className="text-2xl mr-2">✨</Text>
            <Text className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>
              Your Personalized Plan
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-6 mb-4">
            <View className="flex-row items-center mb-3">
              <Text className="text-2xl mr-3">🍊</Text>
              <Text
                className="font-semibold text-lg"
                style={{ color: "#1A1A1A" }}
              >
                Wellness Journey
              </Text>
            </View>
            <Text className="leading-relaxed" style={{ color: "#6B7280" }}>
              Focus on balanced nutrition and consistent healthy habits to
              improve your overall well-being.
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-6 mb-4">
            <View className="flex-row items-center mb-3">
              <Text className="text-2xl mr-3">💧</Text>
              <Text
                className="font-semibold text-lg"
                style={{ color: "#1A1A1A" }}
              >
                Hydration Focus
              </Text>
            </View>
            <Text className="leading-relaxed" style={{ color: "#6B7280" }}>
              Stay hydrated throughout your journey. We'll help you track your
              daily water intake.
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-6">
            <View className="flex-row items-center mb-3">
              <Text className="text-2xl mr-3">🏋️</Text>
              <Text
                className="font-semibold text-lg"
                style={{ color: "#1A1A1A" }}
              >
                Movement Matters
              </Text>
            </View>
            <Text className="leading-relaxed" style={{ color: "#6B7280" }}>
              Regular activity is key. We'll support you in building sustainable
              exercise habits.
            </Text>
          </View>
        </View>

        {/* Continue button */}
        <TouchableOpacity
          onPress={handleContinue}
          className="flex-row items-center justify-center px-8 rounded-full w-full max-w-xs"
          style={{ backgroundColor: "#1A1A1A", height: 56 }}
        >
          <Text className="text-white text-base font-semibold mr-2">
            Complete Setup
          </Text>
          <ArrowRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
