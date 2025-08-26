import { z } from "zod";

export const MealsSchema = z.object({
  name: z.string().describe("Name of the dish/food"),
  calories: z.number().describe("Calorie content in kcal"),
  protein: z.number().describe("Protein content in grams"),
  carbs: z.number().describe("Carbohydrate content in grams"),
  fat: z.number().describe("Fat content in grams"),
  description: z.string().describe("Brief description of the meal"),
  timestamp: z.date().describe("When the meal was logged"),
});

export type Meal = z.infer<typeof MealsSchema>;