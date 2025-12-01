import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useOnboardingCompletion } from "@/utils/onboarding";
import { CheckCircle, ArrowRight } from "lucide-react-native";
import { getRecommendations } from "@/utils/quizRecommendations";
import { getSelectedLink, getProductRecommendation } from "@/utils/quizLinks";
import {
  RecommendationsSection,
  ProductRecommendationSection,
  AnswerSummarySection,
} from "./QuizCompleteSections";

interface QuizCompleteProps {
  answers: Record<string, string | string[] | number>;
}

export function QuizComplete({ answers }: QuizCompleteProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const { markOnboardingCompleted } = useOnboardingCompletion();
  const recommendations = getRecommendations(answers);
  const productRecommendation = getProductRecommendation(answers);
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
    <ScrollView className="flex-1 bg-jf-gray">
      <View className="px-6 py-12">
        {/* Success icon */}
        <View className="w-20 h-20 rounded-full items-center justify-center mb-6 self-center bg-green-100">
          <CheckCircle size={40} color="#10B981" />
        </View>

        {/* Title */}
        <Text className="text-4xl font-lufga-bold text-center mb-4 text-black leading-[44px]">
          Your Wellness Profile is Ready!
        </Text>

        {/* Description */}
        <Text className="text-xl text-center mb-12 text-gray-500 leading-7 font-lufga">
          Based on your responses, we&apos;ve created a personalized wellness
          plan just for you.
        </Text>

        <RecommendationsSection recommendations={recommendations} />

        <AnswerSummarySection answerEntries={answerEntries} />

        <ProductRecommendationSection
          productRecommendation={productRecommendation}
        />

        {/* Continue button */}
        <TouchableOpacity
          onPress={handleContinue}
          className="flex-row items-center justify-center px-8 rounded-full self-center"
          style={{
            backgroundColor: "#1A1A1A",
            height: 56,
            width: "100%",
            maxWidth: 320,
          }}
        >
          <Text className="text-white text-base font-lufga-semibold mr-2">
            {isCompleting ? "Loading..." : "Show Products"}
          </Text>
          {!isCompleting && <ArrowRight size={20} color="white" />}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
