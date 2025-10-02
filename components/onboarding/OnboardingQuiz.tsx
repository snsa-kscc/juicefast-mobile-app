import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useOnboardingManager } from "../../hooks/useOnboardingManager";
import { useOnboardingCompletion } from "../../utils/onboarding";
import { QuizComplete } from "./QuizComplete";
import { QuizProgress } from "./QuizProgress";
import { QuizStart } from "./QuizStart";
import { QuestionRenderer } from "./QuestionRenderer";

export function OnboardingQuiz() {
  const [currentStep, setCurrentStep] = useState<"start" | "quiz" | "complete">(
    "start",
  );
  const { markOnboardingCompleted } = useOnboardingCompletion();
  const {
    currentQuestion,
    currentAnswer,
    nextQuestion,
    previousQuestion,
    canGoBack,
    answers,
    progress,
  } = useOnboardingManager();

  const handleSkip = async () => {
    await markOnboardingCompleted();
    router.replace("/(tabs)");
  };

  const handleStart = () => {
    setCurrentStep("quiz");
  };

  const handleAnswer = (answer: string | string[] | number) => {
    const isComplete = nextQuestion(answer);
    if (isComplete) {
      setCurrentStep("complete");
    }
  };

  if (currentStep === "start") {
    return <QuizStart onStart={handleStart} />;
  }

  if (currentStep === "complete") {
    return <QuizComplete answers={answers} />;
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-6 pt-4">
        <QuizProgress current={progress.current} total={progress.total} />
        <TouchableOpacity onPress={handleSkip} className="px-4 py-2">
          <Text className="text-gray-600 text-sm font-medium">Skip to App</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-6 py-8">
        <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">
          {currentQuestion.title}
        </Text>

        {currentQuestion.description && (
          <Text className="text-lg text-gray-600 mb-8 text-center">
            {currentQuestion.description}
          </Text>
        )}

        <QuestionRenderer
          question={currentQuestion}
          currentAnswer={currentAnswer}
          onAnswer={handleAnswer}
        />

        {canGoBack && (
          <TouchableOpacity
            onPress={previousQuestion}
            className="mt-8 self-center"
          >
            <Text className="text-green-600 text-lg font-medium">Previous</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
