import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(request: Request) {
try {
    const { messages, userId, healthData } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // Create a context message with the user's health data
    const healthContext = `
      User Health Data Context:
      - Meals: ${healthData?.healthyMeals > 0 ? `${healthData.healthyMeals} meals logged` : "No meals logged"}
      - Water: ${healthData?.water > 0 ? `${healthData.water}ml out of 2,200ml goal` : "No water intake logged"}
      - Steps: ${healthData?.steps > 0 ? `${healthData.steps} steps out of 10,000 goal` : "No steps logged"}
      - Calories: ${healthData?.calories > 0 ? `${healthData.calories} calories consumed` : "No calories logged"}
      - Sleep: ${healthData?.sleep > 0 ? `${healthData.sleep} hours of sleep` : "No sleep data logged"}
      - Mindfulness: ${healthData?.mindfulness > 0 ? `${healthData.mindfulness} minutes out of 20 minute goal` : "No mindfulness sessions logged"}
      - Overall Health Score: ${
        typeof healthData?.totalScore === "number" && healthData.totalScore > 0
          ? `${healthData.totalScore.toFixed(1)}/100`
          : "Not calculated"
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
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return Response.json({ error: "Failed to process chat request" }, { status: 500 });
  }
}