import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { TrackerHeader, TrackerButton } from './tracker/shared';
import { Camera, Image, FileText, Plus } from 'lucide-react-native';

interface MacroData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  name?: string;
  description?: string;
}

interface MealEntry extends MacroData {
  mealType: MealType;
  timestamp: Date;
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface MealsTrackerProps {
  userId: string;
  initialMealsData?: { meals: MealEntry[] } | null;
  onBack?: () => void;
}

export function MealsTracker({ userId, initialMealsData, onBack }: MealsTrackerProps) {
  const [activeEntryTab, setActiveEntryTab] = useState<'scan' | 'manual'>('scan');
  const [activeInputMethod, setActiveInputMethod] = useState<'camera' | 'photos' | 'files'>('camera');
  const [meals, setMeals] = useState<MealEntry[]>(initialMealsData?.meals || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [activeTab, setActiveTab] = useState<MealType>('breakfast');

  const handleMealAdded = async (mealData: MacroData, mealType?: MealType) => {
    if (!userId) return;

    try {
      setIsLoading(true);

      const newMeal: MealEntry = {
        mealType: mealType || activeTab,
        timestamp: new Date(),
        ...mealData,
      };

      const updatedMeals = [...meals, newMeal];
      setMeals(updatedMeals);
    } catch (error) {
      console.error('Failed to save meal data:', error);
      Alert.alert('Error', 'Failed to save meal data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMealByType = (mealType: MealType) => {
    setSelectedMealType(mealType);
    setActiveTab(mealType);
  };

  const handleImageScan = () => {
    Alert.alert('Image Scanner', 'Image scanning functionality would be implemented here');
  };

  const handleManualEntry = () => {
    Alert.alert('Manual Entry', 'Manual entry form would be implemented here');
  };

  const calculateDailyTotals = () => {
    return meals.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const getMealsByType = (mealType: MealType) => {
    return meals.filter(meal => meal.mealType === mealType);
  };

  const dailyTotals = calculateDailyTotals();
  const currentMeals = getMealsByType(activeTab);

  const getInputMethodIcon = (method: string) => {
    switch (method) {
      case 'camera': return <Camera size={20} color="#6B7280" />;
      case 'photos': return <Image size={20} color="#6B7280" />;
      case 'files': return <FileText size={20} color="#6B7280" />;
      default: return null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#FCFBF8]">
      <TrackerHeader 
        title="Meal Tracker"
        subtitle="What you eat builds your energy, mood and body. Let's track it."
        onBack={selectedMealType ? () => setSelectedMealType(null) : onBack}
        accentColor="#10B981"
      />

      {!selectedMealType ? (
        /* Meal type selection */
        <View className="px-4 mb-6">
          <Text className="text-xl font-bold mb-4">What meal would you like to add?</Text>
          
          <View className="space-y-3">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => (
              <TouchableOpacity
                key={mealType}
                className="bg-emerald-500 rounded-lg p-4"
                onPress={() => handleAddMealByType(mealType)}
              >
                <Text className="text-lg font-medium capitalize text-center text-white">{mealType}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        /* Scan meal image section */
        <View className="px-4 mb-6">
          <Text className="text-xl font-bold mb-4">Add {selectedMealType}</Text>

          <View className="flex-row gap-4 mb-4">
            <TouchableOpacity
              className={`flex-1 rounded-md py-4 items-center ${
                activeEntryTab === 'scan' ? 'bg-emerald-500' : 'bg-white border border-gray-200'
              }`}
              onPress={() => setActiveEntryTab('scan')}
            >
              <Text className={`font-medium ${
                activeEntryTab === 'scan' ? 'text-white' : 'text-black'
              }`}>
                Upload image
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded-md py-4 items-center ${
                activeEntryTab === 'manual' ? 'bg-emerald-500' : 'bg-white border border-gray-200'
              }`}
              onPress={() => setActiveEntryTab('manual')}
            >
              <Text className={`font-medium ${
                activeEntryTab === 'manual' ? 'text-white' : 'text-black'
              }`}>
                Manual entry
              </Text>
            </TouchableOpacity>
          </View>

          {activeEntryTab === 'scan' && (
            <View className="flex-row gap-4 mb-4">
              {(['camera', 'photos'] as const).map((method) => (
                <TouchableOpacity
                  key={method}
                  className={`flex-1 flex-col items-center justify-center h-24 rounded-lg border-2 ${
                    activeInputMethod === method ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => setActiveInputMethod(method)}
                >
                  {getInputMethodIcon(method)}
                  <Text className="text-sm mt-1 capitalize">{method}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TrackerButton
            title={activeEntryTab === 'scan' ? 'Scan Image' : 'Add Manually'}
            onPress={activeEntryTab === 'scan' ? handleImageScan : handleManualEntry}
            disabled={isLoading}
            backgroundColor="#10B981"
          />
        </View>
      )}

      {/* Today's Meals section */}
      <View className="px-4 mb-6">
        <Text className="text-xl font-bold mb-4">Today's Meals</Text>

        <View className="flex-row mb-4">
          {(['breakfast', 'snack', 'lunch', 'dinner'] as const).map((mealType) => (
            <TouchableOpacity
              key={mealType}
              className={`flex-1 py-2 ${
                activeTab === mealType ? 'border-b-2 border-black' : ''
              }`}
              onPress={() => setActiveTab(mealType)}
            >
              <Text className={`text-sm text-center capitalize ${
                activeTab === mealType ? 'font-medium text-black' : 'text-gray-500'
              }`}>
                {mealType}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {currentMeals.length === 0 ? (
          <View className="flex items-center justify-center py-8">
            <Text className="text-gray-500">No {activeTab} logged yet</Text>
          </View>
        ) : (
          <View className="space-y-3 mb-4">
            {currentMeals.map((meal, index) => (
              <View key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="font-medium text-gray-900 flex-1">{meal.name || 'Meal'}</Text>
                  <View className="bg-emerald-100 px-2 py-1 rounded-full">
                    <Text className="text-sm font-bold text-emerald-700">
                      {meal.calories} kcal
                    </Text>
                  </View>
                </View>
                
                {meal.description && (
                  <Text className="text-sm text-gray-600 mb-3">{meal.description}</Text>
                )}
                
                <View className="flex-row gap-2">
                  <View className="flex-1 bg-blue-50 p-2 rounded items-center">
                    <Text className="font-medium text-blue-700">{meal.protein}g</Text>
                    <Text className="text-xs text-gray-600">Protein</Text>
                  </View>
                  <View className="flex-1 bg-amber-50 p-2 rounded items-center">
                    <Text className="font-medium text-amber-700">{meal.carbs}g</Text>
                    <Text className="text-xs text-gray-600">Carbs</Text>
                  </View>
                  <View className="flex-1 bg-orange-50 p-2 rounded items-center">
                    <Text className="font-medium text-orange-700">{meal.fat}g</Text>
                    <Text className="text-xs text-gray-600">Fat</Text>
                  </View>
                </View>
                
                <Text className="text-xs text-gray-500 mt-2 text-right">
                  {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Daily nutrition totals */}
      <View className="px-4 mb-20">
        <Text className="text-xl font-bold mb-4">Daily nutrition totals</Text>

        <View className="flex-row gap-4">
          <View className="flex-1 bg-white rounded-lg p-4 items-center shadow-sm">
            <Text className="text-2xl font-bold text-emerald-500">{dailyTotals.calories}</Text>
            <Text className="text-xs text-gray-500">Calories</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg p-4 items-center shadow-sm">
            <Text className="text-2xl font-bold text-emerald-500">{dailyTotals.protein}g</Text>
            <Text className="text-xs text-gray-500">Protein</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg p-4 items-center shadow-sm">
            <Text className="text-2xl font-bold text-emerald-500">{dailyTotals.carbs}g</Text>
            <Text className="text-xs text-gray-500">Carbs</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg p-4 items-center shadow-sm">
            <Text className="text-2xl font-bold text-emerald-500">{dailyTotals.fat}g</Text>
            <Text className="text-xs text-gray-500">Fat</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}