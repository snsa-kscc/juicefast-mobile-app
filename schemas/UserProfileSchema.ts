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

  const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.2;
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
