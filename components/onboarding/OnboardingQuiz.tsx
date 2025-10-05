import React, { useState } from "react";
import { View } from "react-native";
import { useOnboardingManager } from "../../hooks/useOnboardingManager";
import { QuizComplete } from "./QuizComplete";
import { QuizStart } from "./QuizStart";
import { QuizQuestion } from "./QuizQuestion";

export function OnboardingQuiz() {
  const [currentStep, setCurrentStep] = useState<"start" | "quiz" | "complete">(
    "start"
  );
  const {
    currentQuestion,
    nextQuestion,
    previousQuestion,
    canGoBack,
    answers,
  } = useOnboardingManager();

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
    <View className="flex-1">
      <QuizQuestion
        question={currentQuestion}
        onAnswer={handleAnswer}
        onPrevious={previousQuestion}
        canGoBack={canGoBack}
      />
    </View>
  );
}
