import { useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-expo";

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
}

export function useHealthChat(): UseHealthChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

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
      text: "",
      isUser: false,
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, aiChatMessage]);

    try {
      // Get the Clerk JWT token for Convex authentication
      const token = await getToken({ template: "convex" });

      // Call our API endpoint with health data for streaming
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add the Authorization header with the Clerk token
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: userMessage,
            },
          ],
          userId: "current-user", // You might want to get this from auth
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Debug: Log response headers and type
      console.log("Response type:", response.type);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries()),
      );
      console.log("Response body:", response.body);
      console.log("Response body used:", response.bodyUsed);

      if (!response.body) {
        // Fallback: try to get response as text since content-type is text/plain
        console.log("No response body, trying text fallback");
        try {
          const text = await response.text();
          const aiChatMessage: ChatMessage = {
            id: aiMessageId,
            text: text || "No response received",
            isUser: false,
            timestamp: new Date(),
            isStreaming: false,
          };
          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMessageId ? aiChatMessage : msg)),
          );
          return;
        } catch (textError) {
          console.error("Text fallback failed:", textError);
          try {
            const data = await response.json();
            const aiChatMessage: ChatMessage = {
              id: aiMessageId,
              text: data.message || data.text || "No response received",
              isUser: false,
              timestamp: new Date(),
              isStreaming: false,
            };
            setMessages((prev) =>
              prev.map((msg) => (msg.id === aiMessageId ? aiChatMessage : msg)),
            );
            return;
          } catch (jsonError) {
            throw new Error(
              "Response body is null and both text and JSON fallback failed",
            );
          }
        }
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        console.log("Received chunk:", chunk);

        // AI SDK 5 sends text chunks directly, no special parsing needed
        accumulatedText += chunk;

        // Update the streaming message with new content
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: accumulatedText } : msg,
          ),
        );
      }

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg,
        ),
      );
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to get response from AI. Please try again.");

      // Remove the streaming message and add error message
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== aiMessageId)
          .concat({
            id: (Date.now() + 2).toString(),
            text: "Sorry, I encountered an error. Please try again.",
            isUser: false,
            timestamp: new Date(),
          }),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

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
  };
}
