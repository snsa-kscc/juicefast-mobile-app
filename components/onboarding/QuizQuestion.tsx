import Slider from "@react-native-community/slider";
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { QuizQuestionType } from "@/data/onboarding/quizQuestions";
import { QuizProgress } from "@/components/onboarding/QuizProgress";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { useOnboardingCompletion } from "@/utils/onboarding";
import { WeightPicker } from "@/components/onboarding/WeightPicker";

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (answer: string | string[] | number) => void;
  onPrevious: () => void;
  canGoBack: boolean;
}

export function QuizQuestion({
  question,
  onAnswer,
  onPrevious,
  canGoBack,
}: QuizQuestionProps) {
  const [answer, setAnswer] = useState<string | string[] | number>(() => {
    if (question.type === "multiple") return [];
    if (question.type === "slider") return question.min || 0;
    return "";
  });
  const [isSkipping, setIsSkipping] = useState(false);
  const { markOnboardingCompleted } = useOnboardingCompletion();

  useEffect(() => {
    if (question.type === "multiple") {
      setAnswer([]);
    } else if (question.type === "slider") {
      setAnswer(question.min || 0);
    } else {
      setAnswer("");
    }
  }, [question.id, question.type, question.min]);

  const handleSingleChoice = (value: string) => {
    setAnswer(value);
  };

  const handleMultipleChoice = (value: string) => {
    const currentAnswers = Array.isArray(answer) ? answer : [];
    if (currentAnswers.includes(value)) {
      setAnswer(currentAnswers.filter((a) => a !== value));
      return;
    }
    if (
      question.maxSelections &&
      currentAnswers.length >= question.maxSelections
    ) {
      return;
    }
    setAnswer([...currentAnswers, value]);
  };

  const handleNext = () => {
    if (isAnswerValid()) {
      onAnswer(answer);
    }
  };

  const handleSkip = async () => {
    setIsSkipping(true);
    try {
      await markOnboardingCompleted();
      router.replace("/(tabs)");
    } finally {
      setIsSkipping(false);
    }
  };

  const isAnswerValid = () => {
    if (question.type === "multiple") {
      return Array.isArray(answer) && answer.length > 0;
    }
    if (question.type === "single") {
      return !!answer && answer !== "";
    }
    if (question.type === "slider") {
      return typeof answer === "number";
    }
    return false;
  };

  return (
    <View className="flex-1 bg-jf-gray">
      {/* Header with back button and progress */}
      <View className="flex-row items-center px-6 pt-12 pb-4">
        <TouchableOpacity
          onPress={onPrevious}
          disabled={!canGoBack}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            canGoBack ? "bg-[#11B364]" : "bg-gray-400"
          }`}
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <QuizProgress
          current={question.questionNumber || 1}
          total={question.totalQuestions || 13}
        />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Title and Description - outside the card */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-3xl font-lufga-bold text-center mb-3 text-black leading-[38px]">
            {question.title}
          </Text>
          {question.description && (
            <Text className="text-base text-center leading-relaxed text-black font-lufga">
              {question.description}
            </Text>
          )}
        </View>

        {/* Main content - white card */}
        <View className="mx-6 mb-6 bg-white rounded-3xl p-6">
          {/* Question indicator */}
          <View className="pb-4">
            <Text className="text-sm text-black font-lufga">
              Question {question.questionNumber}/{question.totalQuestions}
              {question.type === "single" && " - pick one answer"}
              {question.type === "multiple" &&
                question.maxSelections &&
                ` - pick up to ${question.maxSelections} ${question.maxSelections === 1 ? "answer" : "answers"}`}
              {question.type === "multiple" &&
                !question.maxSelections &&
                " - pick all that apply"}
            </Text>
          </View>

          {/* Divider */}
          <View className="border-b mb-6 border-gray-100" />

          {/* Single choice options with radio buttons */}
          {question.type === "single" && question.options && (
            <View>
              {question.options.map((option, index) => {
                const isSelected = answer === option.value;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSingleChoice(option.value)}
                    className={`flex-row items-center border rounded-lg p-4 mb-3 bg-white min-h-16 ${
                      isSelected ? "border-[#11B364]" : "border-gray-200"
                    }`}
                  >
                    {/* Radio button - circle with filled dot when selected */}
                    <View
                      className={`w-5 h-5 rounded-full items-center justify-center mr-3 border-2 ${
                        isSelected ? "border-[#11B364]" : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <View className="w-2.5 h-2.5 rounded-full bg-[#11B364]" />
                      )}
                    </View>
                    <Text
                      className={`font-lufga ${
                        isSelected
                          ? "text-[#11B364] font-lufga-medium"
                          : "text-black"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Multiple choice options with checkboxes */}
          {question.type === "multiple" && question.options && (
            <View>
              {question.options.map((option, index) => {
                const isSelected =
                  Array.isArray(answer) && answer.includes(option.value);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleMultipleChoice(option.value)}
                    className={`flex-row items-center border rounded-lg p-4 mb-3 bg-white min-h-16 ${
                      isSelected ? "border-[#11B364]" : "border-gray-200"
                    }`}
                  >
                    {/* Checkbox - square with checkmark when selected */}
                    <View
                      className={`w-5 h-5 rounded items-center justify-center mr-3 border-2 ${
                        isSelected
                          ? "border-[#11B364] bg-[#11B364]"
                          : "border-gray-300 bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <Text className="text-white text-xs font-lufga-bold">
                          ✓
                        </Text>
                      )}
                    </View>
                    <Text
                      className={`font-lufga ${
                        isSelected
                          ? "text-[#11B364] font-lufga-medium"
                          : "text-black"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Slider input */}
          {question.type === "slider" && (
            <View className="mb-6">
              <View className="bg-gray-50 p-4 rounded-lg mb-4">
                {question.unit === "kg" ? (
                  <WeightPicker
                    value={
                      typeof answer === "number" ? answer : question.min || 0
                    }
                    onChange={(value) => setAnswer(value)}
                    min={question.min || 40}
                    max={question.max || 150}
                  />
                ) : (
                  <>
                    <View className="items-center py-2 px-6 rounded-md self-center bg-[#E7F6EF]">
                      <Text className="text-2xl font-lufga-bold text-black">
                        {typeof answer === "number"
                          ? answer
                          : question.min || 0}{" "}
                        <Text className="text-lg font-lufga">
                          {question.unit}
                        </Text>
                      </Text>
                    </View>
                    <Slider
                      className="w-full h-10 mt-4"
                      minimumValue={question.min}
                      maximumValue={question.max}
                      step={question.step}
                      value={
                        typeof answer === "number" ? answer : question.min || 0
                      }
                      onValueChange={(value) => setAnswer(value)}
                      minimumTrackTintColor="#11B364"
                      maximumTrackTintColor="#d1d5db"
                    />
                    <View className="flex-row justify-between mt-2">
                      <Text className="text-sm text-gray-500 font-lufga">
                        {question.min} {question.unit}
                      </Text>
                      <Text className="text-sm text-gray-500 font-lufga">
                        {question.max} {question.unit}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          )}

          {/* Divider */}
          <View className="border-b my-6 border-gray-100" />

          {/* Next button */}
          <View className="items-center">
            <TouchableOpacity
              onPress={handleNext}
              disabled={!isAnswerValid()}
              className={`px-14 rounded-full h-14 ${
                isAnswerValid() ? "bg-gray-900" : "bg-gray-300"
              }`}
            >
              <View className="flex-1 justify-center">
                <Text className="text-white text-base font-lufga-semibold text-center">
                  {question.nextButtonText || "Continue"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Skip link */}
            <TouchableOpacity
              onPress={handleSkip}
              className="mt-4"
              disabled={isSkipping}
            >
              <Text className="text-sm font-lufga-medium underline text-black">
                {isSkipping ? "Skipping..." : "Skip onboarding"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
