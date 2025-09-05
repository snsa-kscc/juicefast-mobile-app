import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { QuizQuestionType } from '../../data/onboarding/quizQuestions';
import { QuizProgress } from './QuizProgress';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (answer: string | string[] | number) => void;
  onPrevious: () => void;
  canGoBack: boolean;
}

export function QuizQuestion({ question, onAnswer, onPrevious, canGoBack }: QuizQuestionProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState(question.min || 0);

  const handleSingleSelect = (value: string) => {
    onAnswer(value);
  };

  const handleMultipleSelect = (value: string) => {
    const newSelected = selectedOptions.includes(value)
      ? selectedOptions.filter(item => item !== value)
      : [...selectedOptions, value];
    
    if (question.maxSelections && newSelected.length <= question.maxSelections) {
      setSelectedOptions(newSelected);
    }
  };

  const handleSliderComplete = () => {
    onAnswer(sliderValue);
  };

  const handleNext = () => {
    if (question.type === 'multiple' && selectedOptions.length > 0) {
      onAnswer(selectedOptions);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <QuizProgress current={question.questionNumber || 1} total={question.totalQuestions || 13} />
      
      <View className="flex-1 px-6 py-8">
        <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">
          {question.title}
        </Text>
        
        {question.description && (
          <Text className="text-lg text-gray-600 mb-8 text-center">
            {question.description}
          </Text>
        )}
        
        {question.type === 'slider' ? (
          <View className="mb-8">
            <Text className="text-center text-xl mb-4">
              {sliderValue} {question.unit}
            </Text>
            <Slider
              style={{ width: '100%', height: 40 }}
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
              <Text className="text-white text-lg font-semibold text-center">
                {question.nextButtonText || 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4">
            {question.options?.map((option, index) => {
              const isSelected = question.type === 'multiple' 
                ? selectedOptions.includes(option.value)
                : false;
              
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => question.type === 'single' 
                    ? handleSingleSelect(option.value)
                    : handleMultipleSelect(option.value)
                  }
                  className={`border rounded-lg p-4 ${
                    isSelected ? 'bg-green-100 border-green-600' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <Text className={`text-lg text-center ${
                    isSelected ? 'text-green-800' : 'text-gray-800'
                  }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
            
            {question.type === 'multiple' && selectedOptions.length > 0 && (
              <TouchableOpacity
                onPress={handleNext}
                className="bg-green-600 px-6 py-3 rounded-lg mt-4"
              >
                <Text className="text-white text-lg font-semibold text-center">
                  {question.nextButtonText || 'Next'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
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