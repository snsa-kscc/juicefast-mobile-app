import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
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

    // Create initial streaming AI message
    const aiMessageId = (Date.now() + 1).toString();
    const aiChatMessage: ChatMessage = {
      id: aiMessageId,
      text: '',
      isUser: false,
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, aiChatMessage]);

    try {
      // Call our API endpoint with health data for streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: userMessage,
            }
          ],
          userId: 'current-user', // You might want to get this from auth
          healthData: todayMetrics,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Debug: Log response headers and type
      console.log('Response type:', response.type);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response body:', response.body);
      console.log('Response body used:', response.bodyUsed);

      if (!response.body) {
        // Fallback: try to get response as text since content-type is text/plain
        console.log('No response body, trying text fallback');
        try {
          const text = await response.text();
          const aiChatMessage: ChatMessage = {
            id: aiMessageId,
            text: text || 'No response received',
            isUser: false,
            timestamp: new Date(),
            isStreaming: false,
          };
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId ? aiChatMessage : msg
            )
          );
          return;
        } catch (textError) {
          console.error('Text fallback failed:', textError);
          try {
            const data = await response.json();
            const aiChatMessage: ChatMessage = {
              id: aiMessageId,
              text: data.message || data.text || 'No response received',
              isUser: false,
              timestamp: new Date(),
              isStreaming: false,
            };
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId ? aiChatMessage : msg
              )
            );
            return;
          } catch (jsonError) {
            throw new Error('Response body is null and both text and JSON fallback failed');
          }
        }
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        console.log('Received chunk:', chunk);

        // AI SDK 5 sends text chunks directly, no special parsing needed
        accumulatedText += chunk;

        // Update the streaming message with new content
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, text: accumulatedText }
              : msg
          )
        );
      }

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get response from AI. Please try again.');

      // Remove the streaming message and add error message
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== aiMessageId)
          .concat({
            id: (Date.now() + 2).toString(),
            text: 'Sorry, I encountered an error. Please try again.',
            isUser: false,
            timestamp: new Date(),
          })
      );
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