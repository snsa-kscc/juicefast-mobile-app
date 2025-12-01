import { View, Text, TouchableOpacity, Platform } from "react-native";
import { ArrowRight, Sparkles, ShoppingBag } from "lucide-react-native";
import { openBrowserAsync } from "expo-web-browser";
import { getQuestionTitle, formatAnswer } from "@/utils/quizFormatters";

export function RecommendationsSection({
  recommendations,
}: {
  recommendations: { title: string; description: string; icon: string }[];
}) {
  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-center mb-6">
        <Sparkles size={24} color="#1A1A1A" className="mr-2" />
        <Text className="text-2xl font-lufga-bold text-black">
          Your Personalized Recommendations
        </Text>
      </View>

      {recommendations.map((rec, index) => (
        <View key={index} className="bg-white/50 rounded-2xl p-6 mb-4">
          <View className="flex-row items-center mb-3">
            <Text className="text-2xl mr-3">{rec.icon}</Text>
            <Text className="font-lufga-semibold text-lg flex-1 text-black">
              {rec.title}
            </Text>
          </View>
          <Text className="leading-relaxed text-gray-500 font-lufga">
            {rec.description}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function ProductRecommendationSection({
  productRecommendation,
}: {
  productRecommendation: {
    title: string;
    description: string;
    link: string;
  } | null;
}) {
  if (!productRecommendation) {
    return null;
  }

  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-center mb-6">
        <ShoppingBag size={24} color="#1A1A1A" className="mr-2" />
        <Text className="text-2xl font-lufga-bold text-black">
          Recommended For You
        </Text>
      </View>

      <View className="bg-white/50 rounded-2xl p-6">
        <Text className="font-lufga-semibold text-lg mb-3 text-black">
          {productRecommendation.title}
        </Text>
        <Text className="leading-relaxed text-gray-500 font-lufga mb-4">
          {productRecommendation.description}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            if (Platform.OS !== "web") {
              await openBrowserAsync(productRecommendation.link);
            } else {
              window.open(productRecommendation.link, "_blank");
            }
          }}
          className="flex-row items-center justify-center px-6 py-3 rounded-full bg-black"
        >
          <Text className="text-white text-base font-lufga-semibold mr-2">
            View Products
          </Text>
          <ArrowRight size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function AnswerSummarySection({
  answerEntries,
}: {
  answerEntries: [string, string | string[] | number][];
}) {
  return (
    <View className="mb-8">
      <Text className="text-2xl font-lufga-bold text-center mb-6 text-black">
        Your Responses Summary
      </Text>
      <View className="flex-row flex-wrap -mx-2">
        {answerEntries.map(([questionId, answer], index) => (
          <View key={index} className="w-1/2 px-2 mb-4">
            <View className="bg-white/30 rounded-xl p-4">
              <Text
                className="text-sm mb-2 text-gray-500 font-lufga"
                numberOfLines={2}
              >
                {getQuestionTitle(questionId)}
              </Text>
              <Text
                className="font-lufga-semibold text-sm text-black"
                numberOfLines={2}
              >
                {formatAnswer(answer, questionId)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
