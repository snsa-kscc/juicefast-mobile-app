import { BouncingDots } from "@/components/BouncingDots";
import { generateAPIUrl } from "@/utils";
import { useChat } from "@ai-sdk/react";
import { useAuth } from "@clerk/clerk-expo";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { Send } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AIChatProps {
  userId: string;
}

export function AIChat({ userId: _userId }: AIChatProps) {
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const { getToken } = useAuth();

  const { messages, error, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl("/api/chat"),
      headers: async () => {
        const token = await getToken({ template: "convex" });
        return {
          Authorization: `Bearer ${token}`,
        };
      },
      body: {
        userId: _userId,
      },
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const messageText = inputText.trim();
    setInputText(""); // Clear input immediately for better UX

    await sendMessage({
      role: "user",
      parts: [{ type: "text", text: messageText }],
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={10}
    >
      <View className="flex-1">
        {/* Error state */}
        {error && (
          <View className="px-4 py-2">
            <View className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <Text className="text-red-800 text-sm font-lufga">
                {error instanceof Error ? error.message : "An error occurred"}
              </Text>
            </View>
          </View>
        )}

        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-2"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 ${message.role === "user" ? "items-end" : "items-start"}`}
            >
              <View
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${message.role === "user" ? "bg-[#4CC3FF] rounded-br-md" : "bg-white rounded-bl-md shadow-sm"}`}
              >
                <Text
                  className={`text-base font-lufga leading-5 ${message.role === "user" ? "text-white" : "text-gray-800"}`}
                >
                  {message.parts?.map((part, index) => (
                    <Text key={index}>
                      {part.type === "text" ? part.text : ""}
                    </Text>
                  ))}
                </Text>
              </View>
              <Text className="text-xs font-lufga text-gray-400 mt-1 px-2">
                {formatTime(new Date())}
              </Text>
            </View>
          ))}

          {/* Show bouncing dots on assistant side while waiting for response */}
          {status === "submitted" && (
            <View className="items-start mb-4">
              <View className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <BouncingDots color="#9CA3AF" size={8} />
              </View>
            </View>
          )}
        </ScrollView>

        <View className="px-4 pb-4 bg-[#FCFBF8]">
          <View className="flex-row items-end bg-white rounded-2xl border-gray-100">
            <TextInput
              className="flex-1 px-4 py-3 text-base font-lufga text-gray-800 max-h-24"
              placeholder="Ask me about nutrition, fasting, or wellness..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
              textAlignVertical="top"
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity
              className={`p-3 m-1 rounded-xl ${inputText.trim() && !isLoading ? "bg-[#4CC3FF]" : "bg-gray-200"}`}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Send
                size={20}
                color={inputText.trim() && !isLoading ? "white" : "#9CA3AF"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
