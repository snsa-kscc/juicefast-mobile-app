export interface UserProfile {
  id: string;
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
  referralCode?: string;
  referredBy?: string;
  referralCount?: number;
  referrals?: string[];
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string | null;
}

// Helper function to calculate daily calories
export function calculateDailyCalories(
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string
): string {
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Apply activity multiplier
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const multiplier =
    activityMultipliers[activityLevel as keyof typeof activityMultipliers] ||
    1.2;
  const calories = Math.round(bmr * multiplier);

  return `${calories} kcal`;
}

// Helper function to get activity level display text
export function getActivityLevelText(activityLevel: string): string {
  switch (activityLevel) {
    case "sedentary":
      return "Sedentary (little to no exercise)";
    case "light":
      return "Light (exercise 1-3 days/week)";
    case "moderate":
      return "Moderate (exercise 3-5 days/week)";
    case "active":
      return "Active (exercise 6-7 days/week)";
    case "very_active":
      return "Very Active (professional athlete level)";
    default:
      return "-";
  }
}

// Helper function to calculate BMI
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

// Helper function to calculate daily macronutrients
export function calculateDailyMacronutrients(
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string
): {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
} {
  // Calculate TDEE using existing function
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const multiplier =
    activityMultipliers[activityLevel as keyof typeof activityMultipliers] ||
    1.2;
  const calories = Math.round(bmr * multiplier);

  // Calculate protein: 2g per kg of body weight for active individuals
  const protein = Math.round(weight * 2);

  // Calculate fat: 25% of daily calories
  const fatCalories = calories * 0.25;
  const fat = Math.round(fatCalories / 9); // 9 calories per gram of fat

  // Calculate carbs: remaining calories after protein and fat
  const proteinCalories = protein * 4; // 4 calories per gram of protein
  const remainingCalories = calories - proteinCalories - fatCalories;
  const carbs = Math.round(remainingCalories / 4); // 4 calories per gram of carbs

  return {
    calories,
    protein,
    fat,
    carbs,
  };
}
