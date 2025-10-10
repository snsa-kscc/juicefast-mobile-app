import Slider from "@react-native-community/slider";
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { QuizQuestionType } from "../../data/onboarding/quizQuestions";
import { QuizProgress } from "./QuizProgress";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { useOnboardingCompletion } from "../../utils/onboarding";
import { WeightPicker } from "./WeightPicker";

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
    <View className="flex-1" style={{ backgroundColor: "#F8F6F2" }}>
      {/* Header with back button and progress */}
      <View className="flex-row items-center px-6 pt-12 pb-4">
        <TouchableOpacity
          onPress={onPrevious}
          disabled={!canGoBack}
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: canGoBack ? "#11B364" : "#9CA3AF" }}
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
          <Text
            className="text-3xl font-bold text-center mb-3"
            style={{ color: "#1A1A1A", lineHeight: 38 }}
          >
            {question.title}
          </Text>
          {question.description && (
            <Text
              className="text-base text-center leading-relaxed"
              style={{ color: "#1A1A1A" }}
            >
              {question.description}
            </Text>
          )}
        </View>

        {/* Main content - white card */}
        <View className="mx-6 mb-6 bg-white rounded-3xl p-6">
          {/* Question indicator */}
          <View className="pb-4">
            <Text className="text-sm" style={{ color: "#1A1A1A" }}>
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
          <View className="border-b mb-6" style={{ borderColor: "#F3F4F6" }} />

          {/* Single choice options with radio buttons */}
          {question.type === "single" && question.options && (
            <View>
              {question.options.map((option, index) => {
                const isSelected = answer === option.value;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSingleChoice(option.value)}
                    className="flex-row items-center border rounded-lg p-4 mb-3 bg-white"
                    style={{
                      borderColor: isSelected ? "#11B364" : "#E5E7EB",
                      height: 56,
                    }}
                  >
                    {/* Radio button - circle with filled dot when selected */}
                    <View
                      className="w-5 h-5 rounded-full items-center justify-center mr-3"
                      style={{
                        borderWidth: 2,
                        borderColor: isSelected ? "#11B364" : "#D1D5DB",
                      }}
                    >
                      {isSelected && (
                        <View
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: "#11B364" }}
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        color: isSelected ? "#11B364" : "#1A1A1A",
                        fontWeight: isSelected ? "500" : "400",
                      }}
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
                    className="flex-row items-center border rounded-lg p-4 mb-3 bg-white"
                    style={{
                      borderColor: isSelected ? "#11B364" : "#E5E7EB",
                      height: 56,
                    }}
                  >
                    {/* Checkbox - square with checkmark when selected */}
                    <View
                      className="w-5 h-5 rounded items-center justify-center mr-3"
                      style={{
                        borderWidth: 2,
                        borderColor: isSelected ? "#11B364" : "#D1D5DB",
                        backgroundColor: isSelected ? "#11B364" : "transparent",
                      }}
                    >
                      {isSelected && (
                        <Text
                          style={{
                            color: "white",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                    <Text
                      style={{
                        color: isSelected ? "#11B364" : "#1A1A1A",
                        fontWeight: isSelected ? "500" : "400",
                      }}
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
                    <View
                      className="items-center py-2 px-6 rounded-md self-center"
                      style={{ backgroundColor: "#E7F6EF" }}
                    >
                      <Text
                        className="text-2xl font-bold"
                        style={{ color: "#1A1A1A" }}
                      >
                        {typeof answer === "number"
                          ? answer
                          : question.min || 0}{" "}
                        <Text className="text-lg">{question.unit}</Text>
                      </Text>
                    </View>
                    <Slider
                      style={{ width: "100%", height: 40, marginTop: 16 }}
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
                      <Text className="text-sm" style={{ color: "#6B7280" }}>
                        {question.min} {question.unit}
                      </Text>
                      <Text className="text-sm" style={{ color: "#6B7280" }}>
                        {question.max} {question.unit}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          )}

          {/* Divider */}
          <View className="border-b my-6" style={{ borderColor: "#F3F4F6" }} />

          {/* Next button */}
          <View className="items-center">
            <TouchableOpacity
              onPress={handleNext}
              disabled={!isAnswerValid()}
              className="px-14 rounded-full"
              style={{
                backgroundColor: isAnswerValid() ? "#1A1A1A" : "#D1D5DB",
                height: 56,
              }}
            >
              <View className="flex-1 justify-center">
                <Text className="text-white text-base font-semibold text-center">
                  {question.nextButtonText || "Continue"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Skip link */}
            <TouchableOpacity onPress={handleSkip} disabled={isSkipping} className="mt-4">
              <Text
                className="text-sm font-medium underline"
                style={{ color: "#1A1A1A" }}
              >
                {isSkipping ? "Skipping..." : "Skip onboarding"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
