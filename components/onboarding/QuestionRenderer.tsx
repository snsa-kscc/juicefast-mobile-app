import Slider from "@react-native-community/slider";
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { QuizQuestionType } from "@/data/onboarding/quizQuestions";

interface QuestionRendererProps {
  question: QuizQuestionType;
  currentAnswer?: string | string[] | number;
  onAnswer: (answer: string | string[] | number) => void;
}

export function QuestionRenderer({
  question,
  currentAnswer,
  onAnswer,
}: QuestionRendererProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    Array.isArray(currentAnswer) ? currentAnswer : []
  );
  const [sliderValue, setSliderValue] = useState(
    typeof currentAnswer === "number" ? currentAnswer : question.min || 0
  );

  useEffect(() => {
    if (Array.isArray(currentAnswer)) {
      setSelectedOptions(currentAnswer);
    } else {
      setSelectedOptions([]);
    }

    if (typeof currentAnswer === "number") {
      setSliderValue(currentAnswer);
    }
  }, [currentAnswer, question.id]);

  const handleSingleSelect = (value: string) => {
    onAnswer(value);
  };

  const handleMultipleSelect = (value: string) => {
    const newSelected = selectedOptions.includes(value)
      ? selectedOptions.filter((item) => item !== value)
      : [...selectedOptions, value];

    if (
      question.maxSelections &&
      newSelected.length <= question.maxSelections
    ) {
      setSelectedOptions(newSelected);
    }
  };

  const handleSliderComplete = () => {
    onAnswer(sliderValue);
  };

  const handleMultipleNext = () => {
    if (selectedOptions.length > 0) {
      onAnswer(selectedOptions);
    }
  };

  if (question.type === "slider") {
    return (
      <View className="mb-8">
        <Text className="text-center text-xl mb-4 font-lufga-bold text-black">
          {sliderValue} {question.unit}
        </Text>
        <Slider
          className="w-full h-10"
          minimumValue={question.min}
          maximumValue={question.max}
          step={question.step}
          value={sliderValue}
          onValueChange={setSliderValue}
          minimumTrackTintColor="#16a34a"
          maximumTrackTintColor="#d1d5db"
        />
        <TouchableOpacity
          onPress={handleSliderComplete}
          className="bg-green-600 px-6 py-3 rounded-lg mt-4"
        >
          <Text className="text-white text-lg font-lufga-semibold text-center">
            {question.nextButtonText || "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="space-y-4">
      {question.options?.map((option, index) => {
        const isSelected =
          question.type === "multiple"
            ? selectedOptions.includes(option.value)
            : false;

        return (
          <TouchableOpacity
            key={index}
            onPress={() =>
              question.type === "single"
                ? handleSingleSelect(option.value)
                : handleMultipleSelect(option.value)
            }
            className={`border rounded-lg p-4 ${
              isSelected
                ? "bg-green-100 border-green-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <Text
              className={`text-lg text-center font-lufga ${
                isSelected ? "text-green-800" : "text-gray-800"
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}

      {question.type === "multiple" && selectedOptions.length > 0 && (
        <TouchableOpacity
          onPress={handleMultipleNext}
          className="bg-green-600 px-6 py-3 rounded-lg mt-4"
        >
          <Text className="text-white text-lg font-lufga-semibold text-center">
            {question.nextButtonText || "Next"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
