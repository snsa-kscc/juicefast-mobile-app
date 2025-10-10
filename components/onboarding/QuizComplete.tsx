import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useOnboardingCompletion } from "../../utils/onboarding";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react-native";
import { quizQuestions } from "../../data/onboarding/quizQuestions";

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

function getQuestionTitle(questionId: string): string {
  const question = quizQuestions.find((q) => q.id === questionId);
  return question?.title || questionId;
}

function formatAnswer(
  answer: string | string[] | number,
  questionId: string
): string {
  const question = quizQuestions.find((q) => q.id === questionId);
  if (!question) return String(answer);

  if (question.type === "slider" && typeof answer === "number") {
    return `${answer} ${question.unit || ""}`;
  }

  if (Array.isArray(answer)) {
    if (question.type === "multiple" && question.options) {
      return answer
        .map((a) => {
          const option = question.options?.find((o) => o.value === a);
          return option?.label || a;
        })
        .join(", ");
    }
    return answer.join(", ");
  }

  if (question.type === "single" && question.options) {
    const option = question.options.find((o) => o.value === answer);
    return option?.label || String(answer);
  }

  return String(answer);
}

function getRecommendations(
  answers: Record<string, string | string[] | number>
): { title: string; description: string; icon: string }[] {
  const recommendations: {
    title: string;
    description: string;
    icon: string;
  }[] = [];

  // Goal-based recommendation
  const goalAnswer = answers.goal;
  if (Array.isArray(goalAnswer) && goalAnswer.length > 0) {
    if (goalAnswer.includes("lose_weight")) {
      recommendations.push({
        title: "Weight Loss Journey",
        description:
          "Focus on creating a sustainable calorie deficit through balanced nutrition and regular exercise. Track your meals to stay on target.",
        icon: "⬇️",
      });
    } else if (goalAnswer.includes("boost_energy")) {
      recommendations.push({
        title: "Energy Boost",
        description:
          "Prioritize nutrient-dense foods, stay hydrated, and maintain consistent sleep patterns to naturally increase your energy levels.",
        icon: "⚡",
      });
    } else if (goalAnswer.includes("build_healthy_habits")) {
      recommendations.push({
        title: "Healthy Habits",
        description:
          "Start small and build consistency. We'll help you track daily habits that compound into lasting wellness transformation.",
        icon: "🌱",
      });
    } else {
      recommendations.push({
        title: "Wellness Optimization",
        description:
          "Focus on balanced nutrition, regular exercise, and consistent healthy habits to improve your overall well-being.",
        icon: "❤️",
      });
    }
  }

  // Water intake recommendation
  const waterAnswer = answers.water_intake;
  if (waterAnswer === "less_than_1l" || waterAnswer === "1_2l") {
    recommendations.push({
      title: "Hydration Boost",
      description:
        "Aim for 2-3L of water daily. Set reminders or use our water tracking feature to build this healthy habit.",
      icon: "💧",
    });
  } else if (waterAnswer === "2_3l" || waterAnswer === "3l_plus") {
    recommendations.push({
      title: "Great Hydration",
      description:
        "You're maintaining excellent hydration levels! Keep up this healthy habit for optimal body function.",
      icon: "✨",
    });
  }

  // Movement recommendation
  const movementAnswer = answers.movement;
  if (movementAnswer === "rarely" || movementAnswer === "never") {
    recommendations.push({
      title: "Movement Matters",
      description:
        "Start with 150 minutes of moderate exercise per week. Even a 10-minute daily walk can make a significant difference!",
      icon: "🚶",
    });
  } else if (movementAnswer === "daily" || movementAnswer === "few_times") {
    recommendations.push({
      title: "Active Lifestyle",
      description:
        "You're maintaining an excellent activity level! Continue your current routine and consider varying your workouts.",
      icon: "🏃",
    });
  }

  // Eating habits recommendation
  const eatingHabitsAnswer = answers.eating_habits;
  if (
    Array.isArray(eatingHabitsAnswer) &&
    (eatingHabitsAnswer.includes("chaotic") ||
      eatingHabitsAnswer.includes("emotional_eater"))
  ) {
    recommendations.push({
      title: "Mindful Eating",
      description:
        "We'll help you develop a more structured eating routine and track your meals to build healthier patterns.",
      icon: "🥗",
    });
  }

  return recommendations;
}

export function QuizComplete({ answers }: QuizCompleteProps) {
  const [isCompleting, setIsCompleting] = React.useState(false);
  const { markOnboardingCompleted } = useOnboardingCompletion();
  const recommendations = getRecommendations(answers);
  const answerEntries = Object.entries(answers);

  const handleContinue = async () => {
    setIsCompleting(true);
    try {
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
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: "#F8F6F2" }}>
      <View className="px-6 py-12">
        {/* Success icon */}
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-6 self-center"
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
          className="text-xl text-center mb-12"
          style={{ color: "#6B7280", lineHeight: 28 }}
        >
          Based on your responses, we've created a personalized wellness plan
          just for you.
        </Text>

        {/* Recommendations */}
        <View className="mb-8">
          <View className="flex-row items-center justify-center mb-6">
            <Sparkles size={24} color="#1A1A1A" style={{ marginRight: 8 }} />
            <Text className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>
              Your Personalized Recommendations
            </Text>
          </View>

          {recommendations.map((rec, index) => (
            <View
              key={index}
              className="bg-white/50 rounded-2xl p-6 mb-4"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
            >
              <View className="flex-row items-center mb-3">
                <Text className="text-2xl mr-3">{rec.icon}</Text>
                <Text
                  className="font-semibold text-lg flex-1"
                  style={{ color: "#1A1A1A" }}
                >
                  {rec.title}
                </Text>
              </View>
              <Text className="leading-relaxed" style={{ color: "#6B7280" }}>
                {rec.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary of responses */}
        <View className="mb-8">
          <Text
            className="text-2xl font-bold text-center mb-6"
            style={{ color: "#1A1A1A" }}
          >
            Your Responses Summary
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            {answerEntries.map(([questionId, answer], index) => (
              <View key={index} className="w-1/2 px-2 mb-4">
                <View
                  className="bg-white/30 rounded-xl p-4"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                >
                  <Text
                    className="text-sm mb-2"
                    style={{ color: "#6B7280" }}
                    numberOfLines={2}
                  >
                    {getQuestionTitle(questionId)}
                  </Text>
                  <Text
                    className="font-semibold text-sm"
                    style={{ color: "#1A1A1A" }}
                    numberOfLines={2}
                  >
                    {formatAnswer(answer, questionId)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Continue button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={isCompleting}
          className="flex-row items-center justify-center px-8 rounded-full self-center"
          style={{
            backgroundColor: isCompleting ? "#6B7280" : "#1A1A1A",
            height: 56,
            width: "100%",
            maxWidth: 320,
          }}
        >
          <Text className="text-white text-base font-semibold mr-2">
            {isCompleting ? "Completing..." : "Complete Setup"}
          </Text>
          {!isCompleting && <ArrowRight size={20} color="white" />}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
