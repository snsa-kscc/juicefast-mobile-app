import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { ConvexHttpClient } from "convex/browser";

const MacroSchema = z.object({
  name: z.string().describe("Name of the dish/food"),
  calories: z.number().describe("Calorie content in kcal"),
  protein: z.number().describe("Protein content in grams"),
  carbs: z.number().describe("Carbohydrate content in grams"),
  fat: z.number().describe("Fat content in grams"),
  description: z.string().describe("Brief description of the meal"),
});

export async function POST(request: Request) {
  try {
    const authorizationHeader = request.headers.get("Authorization");
    if (!authorizationHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authorizationHeader.split(" ")[1];
    const convex = new ConvexHttpClient(process.env.EXPO_PUBLIC_CONVEX_URL!);
    convex.setAuth(token);

    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return Response.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: z.object({
        meal: MacroSchema,
      }),
      messages: [
        {
          role: "system",
          content:
            "You are a nutritionist who specializes in analyzing food images and providing nutritional information.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this food image and provide nutritional information. Provide macronutrient breakdown for a standard serving including calories, protein, carbs, and fat.",
            },
            {
              type: "image",
              image: imageBase64,
            },
          ],
        },
      ],
    });

    return Response.json(object.meal);
  } catch (error) {
    console.error("Error processing image:", error);
    return Response.json(
      { error: "Failed to analyze meal image" },
      { status: 500 }
    );
  }
}
