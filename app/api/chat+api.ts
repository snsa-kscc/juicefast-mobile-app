import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

export async function POST(request: Request) {
  try {
    const { messages, userId: requestUserId } = await request.json();

    // Get the Authorization header from the incoming request
    const authorizationHeader = request.headers.get("Authorization");

    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

    // If the header exists, set the auth token for this Convex request
    if (authorizationHeader) {
      // The token is the part after "Bearer "
      const token = authorizationHeader.split(" ")[1];
      convex.setAuth(token);
    }

    // Fetch today's health data from Convex
    const selectedDate = new Date();
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);
    const startTime = start.getTime();
    const endTime = end.getTime();

    // For now, use the userId from request body. In a real setup, you'd
    // get this from the decoded JWT token
    const userId = requestUserId || "current-user";

    // Query all 5 tables simultaneously from Convex using server-side functions
    const stepEntries = await convex.query(api.stepEntry.getByUserIdForServer, { userId, startTime, endTime });
    const waterEntries = await convex.query(api.waterIntake.getByUserIdForServer, { userId, startTime, endTime });
    const mealEntries = await convex.query(api.mealEntry.getByUserIdForServer, { userId, startTime, endTime });
    const mindfulnessEntries = await convex.query(api.mindfulnessEntry.getByUserIdForServer, { userId, startTime, endTime });
    const sleepEntries = await convex.query(api.sleepEntry.getByUserIdForServer, { userId, startTime, endTime });

    // Calculate aggregated data from queries
    const todayMetrics = {
      steps: stepEntries?.reduce((sum: number, entry: any) => sum + entry.count, 0) || 0,
      water: waterEntries?.reduce((sum: number, entry: any) => sum + entry.amount, 0) || 0,
      calories: mealEntries?.reduce((sum: number, entry: any) => sum + entry.calories, 0) || 0,
      mindfulness: mindfulnessEntries?.reduce((sum: number, entry: any) => sum + entry.minutes, 0) || 0,
      sleep: sleepEntries?.reduce((sum: number, entry: any) => sum + entry.hoursSlept, 0) || 0,
      healthyMeals: mealEntries?.length || 0,
      totalScore: Math.round(
        ((stepEntries?.reduce((sum: number, entry: any) => sum + entry.count, 0) || 0) / 10000 +
          (waterEntries?.reduce((sum: number, entry: any) => sum + entry.amount, 0) || 0) / 2200 +
          (mealEntries?.length || 0) / 2 +
          (mindfulnessEntries?.reduce((sum: number, entry: any) => sum + entry.minutes, 0) || 0) / 20 +
          (sleepEntries?.reduce((sum: number, entry: any) => sum + entry.hoursSlept, 0) || 0) / 8) *
          20
      ),
    };

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // Create a context message with the user's health data
    const healthContext = `
      User Health Data Context:
      - Meals: ${todayMetrics.healthyMeals > 0 ? `${todayMetrics.healthyMeals} meals logged` : "No meals logged"}
      - Water: ${todayMetrics.water > 0 ? `${todayMetrics.water}ml out of 2,200ml goal` : "No water intake logged"}
      - Steps: ${todayMetrics.steps > 0 ? `${todayMetrics.steps} steps out of 10,000 goal` : "No steps logged"}
      - Calories: ${todayMetrics.calories > 0 ? `${todayMetrics.calories} calories consumed` : "No calories logged"}
      - Sleep: ${todayMetrics.sleep > 0 ? `${todayMetrics.sleep} hours of sleep` : "No sleep data logged"}
      - Mindfulness: ${todayMetrics.mindfulness > 0 ? `${todayMetrics.mindfulness} minutes out of 20 minute goal` : "No mindfulness sessions logged"}
      - Overall Health Score: ${
        typeof todayMetrics.totalScore === "number" && todayMetrics.totalScore > 0 ? `${todayMetrics.totalScore.toFixed(1)}/100` : "Not calculated"
      }
    `;

    // Add system message with health context
    const systemMessage = {
      role: "system",
      content: `You are an AI health assistant that provides personalized advice based on the user's health tracking data. 
      Be helpful, encouraging, and provide actionable advice.
      
      ${healthContext}
      
      When responding:
      1. Reference the user's actual health data when relevant
      2. Provide specific, actionable advice based on their data
      3. Be encouraging and positive
      4. Keep responses concise and focused
      5. If asked about topics you don't have data for, acknowledge this and provide general advice
      6. Don't use markdown formatting in your responses`,
    };

    // Generate response using Vercel AI SDK
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemMessage.content,
      messages: convertToModelMessages(messages),
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    return result.toUIMessageStreamResponse({
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Encoding": "none",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return Response.json({ error: "Failed to process chat request" }, { status: 500 });
  }
}
