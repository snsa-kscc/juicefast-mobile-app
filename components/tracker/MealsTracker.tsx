import * as ImagePicker from "expo-image-picker";
import {
  Camera,
  Image,
  Coffee,
  Sandwich,
  UtensilsCrossed,
  Cookie,
} from "lucide-react-native";
import React, {
  useOptimistic,
  useState,
  startTransition,
  useMemo,
} from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useMutation, useQuery } from "convex/react";
import { useAuth } from "@clerk/clerk-expo";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { TrackerButton, WellnessHeader } from "@/components/tracker/shared";
import { generateAPIUrl } from "@/utils";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface MealEntry {
  _id: Id<"mealEntry">;
  _creationTime: number;
  userID: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: string;
  timestamp: number;
}

interface MealsTrackerProps {
  onBack?: () => void;
  onSettingsPress?: () => void;
}

export function MealsTracker({ onBack, onSettingsPress }: MealsTrackerProps) {
  const createMealEntry = useMutation(api.mealEntry.create);
  const deleteMealEntry = useMutation(api.mealEntry.deleteByUserIdAndTimestamp);

  const { startTime, endTime } = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    return {
      startTime: startOfDay.getTime(),
      endTime: endOfDay.getTime(),
    };
  }, []);

  const mealEntries = useQuery(api.mealEntry.getByUserId, {
    startTime: startTime,
    endTime: endTime,
  });

  const [optimisticMeals, addOptimisticMeal] = useOptimistic(
    mealEntries || [],
    (state, newMeal: MealEntry) => [...state, newMeal]
  );

  const [activeEntryTab, setActiveEntryTab] = useState<"scan" | "manual">(
    "scan"
  );
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<MealType>("breakfast");
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    description: "",
  });

  const { getToken } = useAuth();

  const analyzeMealImage = async (imageUri: string): Promise<any> => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const token = await getToken();
    const apiResponse = await fetch(generateAPIUrl("/api/analyze-meal"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        imageBase64: base64,
      }),
    });

    if (!apiResponse.ok) {
      throw new Error("Failed to analyze meal image");
    }

    const result = await apiResponse.json();

    if (!result.name || !result.calories) {
      throw new Error("Invalid response from meal analyzer");
    }

    return result;
  };

  const handleMealAdded = async (mealData: any) => {
    const newMeal: MealEntry = {
      ...mealData,
      meal_type: selectedMealType!,
      timestamp: Date.now(),
    };

    startTransition(() => {
      addOptimisticMeal(newMeal);
    });

    try {
      await createMealEntry({
        name: mealData.name,
        description: mealData.description,
        calories: mealData.calories,
        protein: mealData.protein,
        carbs: mealData.carbs,
        fat: mealData.fat,
        meal_type: selectedMealType!,
      });
      Alert.alert("Success", "Meal added successfully!");
      setSelectedMealType(null);
    } catch (error) {
      console.error("Failed to save meal data:", error);
    }
  };

  const handleAddMealByType = (mealType: MealType) => {
    setSelectedMealType(mealType);
    setActiveTab(mealType);
  };

  const handleCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Camera permission is required to take photos"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setIsProcessingImage(true);
        try {
          const analyzedMeal = await analyzeMealImage(result.assets[0].uri);
          await handleMealAdded(analyzedMeal);
        } catch (error) {
          console.error("Camera analysis error:", error);
          Alert.alert(
            "Error",
            "Failed to analyze meal. Please try manual entry."
          );
        } finally {
          setIsProcessingImage(false);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to access camera");
    }
  };

  const handleGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Gallery permission is required to select photos"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setIsProcessingImage(true);
        try {
          const analyzedMeal = await analyzeMealImage(result.assets[0].uri);
          await handleMealAdded(analyzedMeal);
        } catch (error) {
          console.error("Gallery analysis error:", error);
          Alert.alert(
            "Error",
            "Failed to analyze meal. Please try manual entry."
          );
        } finally {
          setIsProcessingImage(false);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to access gallery");
    }
  };

  const handleManualEntry = async () => {
    const missingFields = [];

    if (!formData.name.trim()) missingFields.push("Meal Name");
    if (!formData.calories.trim()) missingFields.push("Calories");
    if (!formData.protein.trim()) missingFields.push("Protein");
    if (!formData.carbs.trim()) missingFields.push("Carbs");
    if (!formData.fat.trim()) missingFields.push("Fat");

    if (missingFields.length > 0) {
      Alert.alert(
        "Missing Fields",
        `Please fill in: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      const mealData = {
        name: formData.name,
        calories: parseFloat(formData.calories),
        protein: parseFloat(formData.protein),
        carbs: parseFloat(formData.carbs),
        fat: parseFloat(formData.fat),
        description: formData.description,
      };

      await handleMealAdded(mealData);

      setFormData({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        description: "",
      });
    } catch (error: any) {
      Alert.alert("Validation Error", "Please check your input values");
    }
  };

  const dailyTotals = useMemo(() => {
    if (!optimisticMeals) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

    return optimisticMeals.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [optimisticMeals]);

  const getMealsByType = (mealType: MealType) => {
    if (!optimisticMeals) return [];
    return optimisticMeals.filter((meal) => meal.meal_type === mealType);
  };

  const currentMeals = getMealsByType(activeTab);

  const handleDeleteEntry = async (timestamp: number) => {
    try {
      await deleteMealEntry({ timestamp });
    } catch (error) {
      console.error("Failed to delete meal entry:", error);
    }
  };

  return (
    <View className="flex-1 bg-jf-gray">
      <KeyboardAwareScrollView
        className="flex-1"
        enableOnAndroid={true}
        extraScrollHeight={20}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <WellnessHeader
          title="Meal Tracker"
          subtitle="What you eat builds your energy, mood and body. Let's track it."
          accentColor="rgb(13, 201, 155)"
          showBackButton={true}
          onBackPress={onBack}
          onSettingsPress={onSettingsPress}
        />

        {!selectedMealType ? (
          <View className="px-6 mb-6">
            <Text className="font-lufga-semibold text-2xl mb-4">
              What meal would you like to add?
            </Text>

            <View className="flex-row flex-wrap gap-3">
              <TouchableOpacity
                className="bg-emerald-500 rounded-lg p-4 flex-1 min-w-[45%] items-center justify-center h-28"
                onPress={() => handleAddMealByType("breakfast")}
              >
                <Coffee size={32} color="white" />
                <Text className="text-lg font-lufga-medium text-white mt-2">
                  Breakfast
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-emerald-500 rounded-lg p-4 flex-1 min-w-[45%] items-center justify-center h-28"
                onPress={() => handleAddMealByType("lunch")}
              >
                <Sandwich size={32} color="white" />
                <Text className="text-lg font-lufga-medium text-white mt-2">
                  Lunch
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-emerald-500 rounded-lg p-4 flex-1 min-w-[45%] items-center justify-center h-28"
                onPress={() => handleAddMealByType("dinner")}
              >
                <UtensilsCrossed size={32} color="white" />
                <Text className="text-lg font-lufga-medium text-white mt-2">
                  Dinner
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-emerald-500 rounded-lg p-4 flex-1 min-w-[45%] items-center justify-center h-28"
                onPress={() => handleAddMealByType("snack")}
              >
                <Cookie size={32} color="white" />
                <Text className="text-lg font-lufga-medium text-white mt-2">
                  Snack
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="px-6 mb-6">
            <Text className="font-lufga-semibold text-2xl mb-4">
              Add {selectedMealType}
            </Text>

            <View className="flex-row gap-4 mb-4">
              <TouchableOpacity
                className={`flex-1 rounded-md py-4 items-center ${activeEntryTab === "scan" ? "bg-emerald-500" : "bg-white border border-gray-200"}`}
                onPress={() => setActiveEntryTab("scan")}
              >
                <Text
                  className={`font-lufga-medium ${activeEntryTab === "scan" ? "text-white" : "text-black"}`}
                >
                  Upload image
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 rounded-md py-4 items-center ${activeEntryTab === "manual" ? "bg-emerald-500" : "bg-white border border-gray-200"}`}
                onPress={() => setActiveEntryTab("manual")}
              >
                <Text
                  className={`font-lufga-medium ${activeEntryTab === "manual" ? "text-white" : "text-black"}`}
                >
                  Manual entry
                </Text>
              </TouchableOpacity>
            </View>

            {activeEntryTab === "scan" ? (
              <View>
                {isProcessingImage && (
                  <View className="bg-emerald-50 rounded-lg p-4 mb-4">
                    <Text className="text-emerald-700 text-center">
                      Analyzing meal...
                    </Text>
                  </View>
                )}
                <View className="flex-row gap-4 mb-4">
                  <TouchableOpacity
                    className="flex-1 flex-col items-center justify-center h-24 rounded-lg border-2 border-gray-200 bg-white"
                    onPress={() => {
                      handleCamera();
                    }}
                    disabled={isProcessingImage}
                  >
                    <Camera size={20} color="#6B7280" />
                    <Text className="text-sm mt-1">Camera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 flex-col items-center justify-center h-24 rounded-lg border-2 border-gray-200 bg-white"
                    onPress={() => {
                      handleGallery();
                    }}
                    disabled={isProcessingImage}
                  >
                    <Image size={20} color="#6B7280" />
                    <Text className="text-sm mt-1">Photos</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="bg-white rounded-lg p-4">
                <Text className="font-lufga-semibold text-xl mb-4">
                  Manual Meal Entry
                </Text>

                <View className="space-y-4">
                  <View>
                    <Text className="font-lufga text-sm text-gray-500 mb-1">
                      Meal Name
                    </Text>
                    <TextInput
                      className="border border-gray-300 rounded-md p-3 bg-white"
                      value={formData.name}
                      onChangeText={(text) =>
                        setFormData({ ...formData, name: text })
                      }
                      placeholder="Enter meal name"
                    />
                  </View>

                  <View className="flex-row gap-4">
                    <View className="flex-1">
                      <Text className="font-lufga text-sm text-gray-500 mb-1">
                        Calories
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-white"
                        value={formData.calories}
                        onChangeText={(text) =>
                          setFormData({ ...formData, calories: text })
                        }
                        placeholder="0"
                        keyboardType="numeric"
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="font-lufga text-sm text-gray-500 mb-1">
                        Protein (g)
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-white"
                        value={formData.protein}
                        onChangeText={(text) =>
                          setFormData({ ...formData, protein: text })
                        }
                        placeholder="0"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View className="flex-row gap-4">
                    <View className="flex-1">
                      <Text className="font-lufga text-sm text-gray-500 mb-1">
                        Carbs (g)
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-white"
                        value={formData.carbs}
                        onChangeText={(text) =>
                          setFormData({ ...formData, carbs: text })
                        }
                        placeholder="0"
                        keyboardType="numeric"
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="font-lufga text-sm text-gray-500 mb-1">
                        Fat (g)
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-white"
                        value={formData.fat}
                        onChangeText={(text) =>
                          setFormData({ ...formData, fat: text })
                        }
                        placeholder="0"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="font-lufga text-sm text-gray-500 mb-1">
                      Description (optional)
                    </Text>
                    <TextInput
                      className="border border-gray-300 rounded-md p-3 bg-white h-20"
                      value={formData.description}
                      onChangeText={(text) =>
                        setFormData({ ...formData, description: text })
                      }
                      placeholder="Enter description"
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                <View className="mt-4">
                  <TrackerButton
                    title="Add Meal"
                    onPress={handleManualEntry}
                    disabled={isProcessingImage}
                    backgroundColor="#10B981"
                  />
                </View>
              </View>
            )}
          </View>
        )}

        <View className="px-6 mb-6">
          <Text className="font-lufga-semibold text-2xl mb-4">
            Today's Meals
          </Text>

          <View className="flex-row mb-4">
            {(["breakfast", "snack", "lunch", "dinner"] as const).map(
              (mealType) => (
                <TouchableOpacity
                  key={mealType}
                  className={`flex-1 py-2 ${activeTab === mealType ? "border-b-2 border-black" : ""}`}
                  onPress={() => setActiveTab(mealType)}
                >
                  <Text
                    className={`text-sm text-center capitalize ${activeTab === mealType ? "font-lufga-medium text-black" : "text-gray-500 font-lufga"}`}
                  >
                    {mealType}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          {currentMeals.length === 0 ? (
            <View className="flex items-center justify-center py-8">
              <Text className="text-gray-500 font-lufga">
                No {activeTab} logged yet
              </Text>
            </View>
          ) : (
            <View className="space-y-3 mb-4">
              {currentMeals.map((meal, index) => {
                const date = new Date(meal.timestamp);
                return (
                  <View
                    key={meal._id || index}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="font-lufga-medium text-gray-900 flex-1">
                        {meal.name || "Meal"}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <View className="bg-emerald-100 px-2 py-1 rounded-full">
                          <Text className="text-sm font-lufga-bold text-emerald-700">
                            {meal.calories} kcal
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDeleteEntry(meal.timestamp)}
                          className="p-1 rounded-full bg-red-50 active:bg-red-100"
                        >
                          <Text className="text-red-500 text-sm">🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {meal.description && (
                      <Text className="text-sm font-lufga text-gray-600 mb-3">
                        {meal.description}
                      </Text>
                    )}

                    <View className="flex-row gap-2">
                      <View className="flex-1 bg-blue-50 p-2 rounded items-center">
                        <Text className="font-lufga-medium text-blue-700">
                          {meal.protein}g
                        </Text>
                        <Text className="text-xs font-lufga text-gray-600">
                          Protein
                        </Text>
                      </View>
                      <View className="flex-1 bg-amber-50 p-2 rounded items-center">
                        <Text className="font-lufga-medium text-amber-700">
                          {meal.carbs}g
                        </Text>
                        <Text className="text-xs font-lufga text-gray-600">
                          Carbs
                        </Text>
                      </View>
                      <View className="flex-1 bg-orange-50 p-2 rounded items-center">
                        <Text className="font-lufga-medium text-orange-700">
                          {meal.fat}g
                        </Text>
                        <Text className="text-xs font-lufga text-gray-600">
                          Fat
                        </Text>
                      </View>
                    </View>

                    <Text className="text-xs font-lufga text-gray-500 mt-2 text-right">
                      {date.toLocaleDateString()} at{" "}
                      {date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View className="px-6 mb-16">
          <Text className="font-lufga-semibold text-2xl mb-4">
            Daily nutrition totals
          </Text>

          <View className="flex-row gap-4">
            <View className="flex-1 bg-white rounded-lg p-4 items-center shadow-sm">
              <Text className="text-2xl font-lufga-bold text-emerald-500">
                {Math.round(dailyTotals.calories)}
              </Text>
              <Text className="text-xs font-lufga text-gray-500">Calories</Text>
            </View>
            <View className="flex-1 bg-white rounded-lg p-4 items-center shadow-sm">
              <Text className="text-2xl font-lufga-bold text-emerald-500">
                {Math.round(dailyTotals.protein)}g
              </Text>
              <Text className="text-xs font-lufga text-gray-500">Protein</Text>
            </View>
            <View className="flex-1 bg-white rounded-lg p-4 items-center shadow-sm">
              <Text className="text-2xl font-lufga-bold text-emerald-500">
                {Math.round(dailyTotals.carbs)}g
              </Text>
              <Text className="text-xs font-lufga text-gray-500">Carbs</Text>
            </View>
            <View className="flex-1 bg-white rounded-lg p-4 items-center shadow-sm">
              <Text className="text-2xl font-lufga-bold text-emerald-500">
                {Math.round(dailyTotals.fat)}g
              </Text>
              <Text className="text-xs font-lufga text-gray-500">Fat</Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
