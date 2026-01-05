import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-expo";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Send, User, ArrowLeft, X } from "lucide-react-native";
import { setActiveSessionId } from "@/services/messagingService";
import { showCrossPlatformAlert } from "@/utils/alert";

interface Message {
  id: Id<"chatMessages">;
  sessionId: Id<"chatSessions">;
  senderId: string;
  senderType: "user" | "nutritionist";
  content: string;
  timestamp: number;
  isRead: boolean;
}

export default function NutritionistChatSession() {
  const { user } = useUser();
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const sessionData = useQuery(api.nutritionistChat.getNutritionistSessions);
  const currentSession = sessionData?.find((s) => s.id === sessionId);
  const messagesData = useQuery(
    api.nutritionistChat.getMessages,
    sessionId ? { sessionId: sessionId as Id<"chatSessions"> } : "skip"
  );

  const sendMessage = useMutation(api.nutritionistChat.sendNutritionistMessage);
  const markAsRead = useMutation(api.nutritionistChat.markMessagesAsRead);
  const endSession = useMutation(api.nutritionistChat.endChatSession);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (
      !user ||
      (user.unsafeMetadata?.role !== "nutritionist" &&
        user.unsafeMetadata?.role !== "admin")
    ) {
      showCrossPlatformAlert(
        "Access Denied",
        "This area is for nutritionists only."
      );
      router.replace("/chat");
      return;
    }

    if (!sessionId) {
      router.replace("/nutritionist/dashboard");
      return;
    }

    // Set active session ID when component mounts
    setActiveSessionId(sessionId as string);

    // Clear active session ID when component unmounts
    return () => {
      setActiveSessionId(null);
    };
  }, [sessionId, user, router]);

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);

      // Mark user messages as read
      if (messagesData.length > 0) {
        markAsRead({
          sessionId: sessionId as Id<"chatSessions">,
          senderType: "user",
        });
      }
    }
  }, [messagesData, sessionId, markAsRead]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading || !sessionId || !currentSession) return;

    setIsLoading(true);

    try {
      // Send message - push notification is handled server-side
      await sendMessage({
        sessionId: sessionId as Id<"chatSessions">,
        content: inputText.trim(),
      });

      setInputText("");
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsLoading(false);
      showCrossPlatformAlert(
        "Error",
        "Failed to send message. Please try again."
      );
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleEndSession = async () => {
    if (!currentSession || currentSession.status !== "active") {
      showCrossPlatformAlert("Error", "No active session to end.");
      return;
    }

    showCrossPlatformAlert(
      "End Chat",
      "Are you sure you want to end this chat? This will close your conversation.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Chat",
          style: "destructive",
          onPress: async () => {
            try {
              await endSession({ sessionId: sessionId as Id<"chatSessions"> });
              showCrossPlatformAlert("Success", "Chat has been ended.");
              router.back();
            } catch (error: any) {
              console.error("Failed to end chat:", error);
              showCrossPlatformAlert(
                "Error",
                `Failed to end chat: ${error.message || "Please try again."}`
              );
            }
          },
        },
      ]
    );
  };

  if (
    !user ||
    (user.unsafeMetadata?.role !== "nutritionist" &&
      user.unsafeMetadata?.role !== "admin") ||
    !currentSession
  ) {
    return (
      <View className="items-center justify-center flex-1 bg-jf-gray">
        <ActivityIndicator size="large" color="#2d2d2d" />
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-jf-gray"
      style={{ paddingBottom: keyboardHeight }}
    >
      {/* Chat header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={handleBack} className="mr-3 p-2">
              <ArrowLeft size={24} color="#8B7355" />
            </TouchableOpacity>
            <View className="w-10 h-10 bg-[#E1D5B9] rounded-full items-center justify-center mr-3">
              <User size={20} color="#8B7355" />
            </View>
            <View>
              <Text className="font-lufga-medium text-gray-900">
                {currentSession.userName || "Client"}
              </Text>
              <Text className="text-xs font-lufga text-gray-600">
                {currentSession.status === "active"
                  ? "Active chat"
                  : "Chat ended"}
              </Text>
            </View>
          </View>

          {currentSession.status === "active" && (
            <TouchableOpacity
              className="bg-red-100 px-3 py-2 rounded-full"
              onPress={handleEndSession}
            >
              <View className="flex-row items-center">
                <X size={14} color="#dc2626" />
                <Text className="text-red-600 text-xs font-lufga-medium ml-1">
                  End Chat
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        className="flex-1 px-4 py-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
        inverted
        data={[...messages].reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item: message }) => (
          <View
            className={`mb-4 ${message.senderType === "nutritionist" ? "items-end" : "items-start"}`}
          >
            <View
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.senderType === "nutritionist"
                  ? "bg-[#8B7355] rounded-br-md"
                  : "bg-white rounded-bl-md"
              }`}
            >
              <Text
                className={`text-base font-lufga leading-5 ${
                  message.senderType === "nutritionist"
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                {message.content}
              </Text>
            </View>
            <View className="flex-row items-center mt-1 px-2">
              <Text className="text-xs font-lufga text-gray-400">
                {formatTime(message.timestamp)}
              </Text>
              {message.senderType === "nutritionist" && (
                <View
                  className={`ml-2 w-2 h-2 rounded-full ${
                    message.isRead ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              )}
            </View>
          </View>
        )}
        ListHeaderComponent={
          isLoading ? (
            <View className="items-end mb-4">
              <View className="bg-[#8B7355] px-4 py-3 rounded-2xl rounded-br-md">
                <ActivityIndicator size="small" color="white" />
              </View>
            </View>
          ) : null
        }
      />

      {/* Input */}
      <View className="px-4 py-3 bg-white border-t border-gray-100">
        <View className="flex-row items-end bg-white rounded-2xl border border-gray-100">
          <TextInput
            className="flex-1 px-4 py-3 text-base font-lufga text-gray-800 max-h-24"
            placeholder="Type your response..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            textAlignVertical="top"
            onSubmitEditing={handleSend}
            editable={currentSession.status === "active"}
          />
          <TouchableOpacity
            className={`p-3 m-1 rounded-xl ${
              inputText.trim() &&
              !isLoading &&
              currentSession.status === "active"
                ? "bg-[#8B7355]"
                : "bg-gray-200"
            }`}
            onPress={handleSend}
            disabled={
              !inputText.trim() ||
              isLoading ||
              currentSession.status !== "active"
            }
          >
            <Send
              size={20}
              color={
                inputText.trim() &&
                !isLoading &&
                currentSession.status === "active"
                  ? "white"
                  : "#9CA3AF"
              }
            />
          </TouchableOpacity>
        </View>

        {currentSession.status !== "active" && (
          <Text className="text-xs font-lufga text-gray-500 text-center mt-2">
            This chat has ended. You cannot send new messages.
          </Text>
        )}
      </View>
    </View>
  );
}
