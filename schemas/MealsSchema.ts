import { z } from "zod";

export const MealsSchema = z.object({
  id: z.string().describe("Unique identifier for the meal"),
  userId: z.string().describe("User ID who logged the meal"),
  name: z.string().min(1).describe("Name of the dish/food"),
  meal: z
    .enum(["breakfast", "lunch", "dinner", "snack"])
    .describe("Type of meal"),
  calories: z.number().min(0).describe("Calorie content in kcal"),
  protein: z.number().min(0).describe("Protein content in grams"),
  carbs: z.number().min(0).describe("Carbohydrate content in grams"),
  fat: z.number().min(0).describe("Fat content in grams"),
  description: z.string().optional().describe("Brief description of the meal"),
  timestamp: z.string().describe("When the meal was logged (ISO string)"),
});

export type Meal = z.infer<typeof MealsSchema>;

export const CreateMealSchema = MealsSchema.omit({ id: true, timestamp: true });
export type CreateMeal = z.infer<typeof CreateMealSchema>;
