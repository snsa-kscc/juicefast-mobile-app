import React, { useState } from 'react';
import { View } from 'react-native';
import { quizQuestions } from '../../data/onboarding/quizQuestions';
import { QuizComplete } from './QuizComplete';
import { QuizQuestion } from './QuizQuestion';
import { QuizStart } from './QuizStart';

export function OnboardingQuiz() {
  const [currentStep, setCurrentStep] = useState<'start' | 'quiz' | 'complete'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});

  const handleStart = () => {
    setCurrentStep('quiz');
  };

  const handleAnswer = (answer: string | string[] | number) => {
    const newAnswers = { ...answers, [quizQuestions[currentQuestion].id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentStep('complete');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (currentStep === 'start') {
    return <QuizStart onStart={handleStart} />;
  }

  if (currentStep === 'complete') {
    return <QuizComplete answers={answers} />;
  }

  return (
    <View className="flex-1">
      <QuizQuestion
        question={quizQuestions[currentQuestion]}
        onAnswer={handleAnswer}
        onPrevious={handlePrevious}
        canGoBack={currentQuestion > 0}
      />
    </View>
  );
}