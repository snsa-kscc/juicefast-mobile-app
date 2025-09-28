import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface DailyMetrics {
  steps: number;
  water: number;
  calories: number;
  mindfulness: number;
  sleep: number;
  healthyMeals: number;
  totalScore: number;
}

interface UseHealthChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  isMetricsLoading: boolean;
}

export function useHealthChat(): UseHealthChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();

  // Fetch today's metrics using the same logic as HomeDashboard
  const selectedDate = new Date();
  const { startTime, endTime } = (() => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);
    return {
      startTime: start.getTime(),
      endTime: end.getTime(),
    };
  })();

  // Query all 5 tables simultaneously - only when authenticated
  const stepEntries = useQuery(
    api.stepEntry.getByUserId,
    isSignedIn
      ? {
          startTime,
          endTime,
        }
      : 'skip'
  );

  const waterEntries = useQuery(
    api.waterIntake.getByUserId,
    isSignedIn
      ? {
          startTime,
          endTime,
        }
      : 'skip'
  );

  const mealEntries = useQuery(
    api.mealEntry.getByUserId,
    isSignedIn
      ? {
          startTime,
          endTime,
        }
      : 'skip'
  );

  const mindfulnessEntries = useQuery(
    api.mindfulnessEntry.getByUserId,
    isSignedIn
      ? {
          startTime,
          endTime,
        }
      : 'skip'
  );

  const sleepEntries = useQuery(
    api.sleepEntry.getByUserId,
    isSignedIn
      ? {
          startTime,
          endTime,
        }
      : 'skip'
  );

  // Calculate aggregated data from queries
  const todayMetrics: DailyMetrics | null = (() => {
    if (!stepEntries || !waterEntries || !mealEntries || !mindfulnessEntries || !sleepEntries) {
      return null;
    }

    const totalSteps = stepEntries.reduce((sum, entry) => sum + entry.count, 0);
    const totalWater = waterEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const totalCalories = mealEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const totalMindfulness = mindfulnessEntries.reduce((sum, entry) => sum + entry.minutes, 0);
    const totalSleep = sleepEntries.reduce((sum, entry) => sum + entry.hoursSlept, 0);
    const healthyMeals = mealEntries.length;

    return {
      steps: totalSteps,
      water: totalWater,
      calories: totalCalories,
      mindfulness: totalMindfulness,
      sleep: totalSleep,
      healthyMeals,
      totalScore: Math.round((totalSteps / 10000 + totalWater / 2200 + healthyMeals / 2 + totalMindfulness / 20 + totalSleep / 8) * 20),
    };
  })();

  const isMetricsLoading =
    stepEntries === undefined ||
    waterEntries === undefined ||
    mealEntries === undefined ||
    mindfulnessEntries === undefined ||
    sleepEntries === undefined;

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message to chat
    const userChatMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userChatMessage]);

    try {
      // Initialize Google Generative AI
      const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Create system prompt with today's metrics
      const systemPrompt = `You are a helpful AI health assistant.
The user is tracking their daily health metrics.

Here are today's values:

Steps: ${todayMetrics?.steps || 0}
Calories: ${todayMetrics?.calories || 0}
Sleep Hours: ${todayMetrics?.sleep || 0}
Water Intake: ${todayMetrics?.water || 0}ml
Healthy Meals: ${todayMetrics?.healthyMeals || 0}
Mindfulness Minutes: ${todayMetrics?.mindfulness || 0}
Total Wellness Score: ${todayMetrics?.totalScore || 0}

User message: ${userMessage}

AI response:`;

      // Generate response
      const result = await model.generateContent(systemPrompt);
      const response = result.response;
      const aiText = response.text();

      // Add AI response to chat
      const aiChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiChatMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get response from AI. Please try again.');

      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [todayMetrics]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isMetricsLoading,
  };
}