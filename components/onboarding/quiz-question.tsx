import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { QuizProgress } from './quiz-progress';

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface QuizQuestionProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  onPrevious: () => void;
  canGoBack: boolean;
}

export function QuizQuestion({
  question,
  currentQuestion,
  totalQuestions,
  onAnswer,
  onPrevious,
  canGoBack
}: QuizQuestionProps) {
  return (
    <View className="flex-1 bg-white">
      <QuizProgress current={currentQuestion} total={totalQuestions} />
      
      <View className="flex-1 px-6 py-8">
        <Text className="text-2xl font-bold text-gray-900 mb-8 text-center">
          {question.question}
        </Text>
        
        <View className="space-y-4">
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onAnswer(option)}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <Text className="text-lg text-gray-800 text-center">
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {canGoBack && (
          <TouchableOpacity
            onPress={onPrevious}
            className="mt-8 self-center"
          >
            <Text className="text-green-600 text-lg font-medium">
              Previous
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}