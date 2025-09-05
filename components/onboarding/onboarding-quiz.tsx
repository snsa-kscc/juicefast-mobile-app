import React, { useState } from 'react';
import { View } from 'react-native';
import { QuizStart } from './quiz-start';
import { QuizQuestion } from './quiz-question';
import { QuizComplete } from './quiz-complete';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What's your primary goal with juice fasting?",
    options: [
      "Weight loss",
      "Detox and cleanse",
      "Improved energy",
      "Better digestion"
    ]
  },
  {
    id: 2,
    question: "How experienced are you with fasting?",
    options: [
      "Complete beginner",
      "Some experience",
      "Experienced",
      "Very experienced"
    ]
  },
  {
    id: 3,
    question: "How long would you like to fast?",
    options: [
      "1-3 days",
      "3-5 days",
      "5-7 days",
      "More than 7 days"
    ]
  }
];

export function OnboardingQuiz() {
  const [currentStep, setCurrentStep] = useState<'start' | 'quiz' | 'complete'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleStart = () => {
    setCurrentStep('quiz');
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [QUIZ_QUESTIONS[currentQuestion].id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
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
        question={QUIZ_QUESTIONS[currentQuestion]}
        currentQuestion={currentQuestion + 1}
        totalQuestions={QUIZ_QUESTIONS.length}
        onAnswer={handleAnswer}
        onPrevious={handlePrevious}
        canGoBack={currentQuestion > 0}
      />
    </View>
  );
}