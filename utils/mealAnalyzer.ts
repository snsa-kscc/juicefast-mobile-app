import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const MealAnalysisSchema = z.object({
  calories: z.number().min(0).max(5000),
  protein: z.number().min(0).max(200),
  carbs: z.number().min(0).max(500),
  fat: z.number().min(0).max(200),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
});

export type MealAnalysis = z.infer<typeof MealAnalysisSchema>;

export interface MealAnalysisResult {
  success: boolean;
  data?: MealAnalysis;
  error?: string;
}

export class MealAnalyzer {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not configured");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeMeal(
    imageBase64: string,
    mimeType: string = "image/jpeg"
  ): Promise<MealAnalysisResult> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const imageParts = [
        {
          inlineData: {
            data: imageBase64,
            mimeType,
          },
        },
      ];

      const prompt = `You are a professional nutritionist. Analyze this food image and provide detailed nutritional information.

Please respond with a JSON object containing:
- calories: total calories for the entire meal shown
- protein: protein content in grams
- carbs: carbohydrate content in grams
- fat: fat content in grams
- name: a descriptive name for the meal
- description: a brief description of what you see in the image

Be accurate and realistic in your assessment. If you cannot clearly identify the food, provide your best estimate based on similar dishes.

Respond with ONLY the JSON object, no additional text.`;

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = result.response;
      const text = response.text();

      // Clean the response text
      const cleanText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      let parsedData;
      try {
        parsedData = JSON.parse(cleanText);
      } catch {
        return {
          success: false,
          error: "Failed to parse AI response",
        };
      }

      // Validate with Zod schema
      const validatedData = MealAnalysisSchema.safeParse(parsedData);
      if (!validatedData.success) {
        return {
          success: false,
          error: "Invalid response format from AI",
        };
      }

      return {
        success: true,
        data: validatedData.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to analyze meal",
      };
    }
  }

  // Fallback meal data for when AI analysis fails
  static getFallbackMealData(): MealAnalysis {
    return {
      calories: 350,
      protein: 25,
      carbs: 40,
      fat: 12,
      name: "Mixed Meal",
      description:
        "Could not analyze this meal. Please enter nutrition information manually.",
    };
  }
}
