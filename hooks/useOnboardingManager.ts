import { useState } from 'react';
import { quizQuestions, QuizQuestionType } from '../data/onboarding/quizQuestions';

export const useOnboardingManager = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  const nextQuestion = (answer: string | string[] | number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
      return false; // Not complete
    }
    return true; // Quiz complete
  };

  const previousQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getCurrentAnswer = () => {
    return answers[currentQuestion.id];
  };

  return {
    currentQuestion,
    currentAnswer: getCurrentAnswer(),
    nextQuestion,
    previousQuestion,
    canGoBack: !isFirstQuestion,
    answers,
    progress: {
      current: currentQuestionIndex + 1,
      total: quizQuestions.length
    }
  };
};