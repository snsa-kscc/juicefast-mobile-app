import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
  StyleSheet,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-expo";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Send, User, ArrowLeft, X } from "lucide-react-native";
import { Spinner } from "@/components/Spinner";
import {
  addNotificationListener,
  addForegroundNotificationListener,
} from "@/services/messagingService";

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
  const scrollViewRef = useRef<ScrollView>(null);

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
      scrollToBottom();
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
    if (!user || user.unsafeMetadata?.role !== "nutritionist") {
      Alert.alert("Access Denied", "This area is for nutritionists only.");
      router.replace("/chat");
      return;
    }

    if (!sessionId) {
      router.replace("/nutritionist/dashboard");
      return;
    }
  }, [sessionId, user]);

  // Listen for notification taps (when app was closed/background)
  useEffect(() => {
    if (!user) return;

    const unsubscribeTap = addNotificationListener(
      (chatId, intendedRecipientId) => {
        // Validate that the current user is the intended recipient
        if (intendedRecipientId && intendedRecipientId !== user.id) {
          console.log(
            "Ignoring notification - not the intended recipient:",
            intendedRecipientId
          );
          return; // Silent ignore - wrong user logged in
        }

        console.log("Nutritionist tapped notification for chat:", chatId);
        // Handle navigation to specific chat if needed
      }
    );

    return unsubscribeTap;
  }, [user]);

  // Listen for notifications when app is OPEN
  useEffect(() => {
    if (!user) return;

    const unsubscribeForeground = addForegroundNotificationListener(
      (senderName, messageText, chatId, intendedRecipientId) => {
        // Validate that the current user is the intended recipient
        if (intendedRecipientId && intendedRecipientId !== user.id) {
          console.log(
            "Ignoring foreground notification - not the intended recipient:",
            intendedRecipientId
          );
          return; // Silent ignore - wrong user logged in
        }

        console.log("New message while app open:", messageText);
        // You could show an in-app notification or handle it silently
      }
    );

    return unsubscribeForeground;
  }, [user]);

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

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
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleEndSession = async () => {
    if (!currentSession || currentSession.status !== "active") {
      Alert.alert("Error", "No active session to end.");
      return;
    }

    Alert.alert(
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
              Alert.alert("Success", "Chat has been ended.");
              router.back();
            } catch (error: any) {
              console.error("Failed to end chat:", error);
              Alert.alert(
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
    user.unsafeMetadata?.role !== "nutritionist" ||
    !currentSession
  ) {
    return (
      <View className="items-center justify-center flex-1 bg-jf-gray">
        <Spinner size={32} color="#8B7355" />
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
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((message) => (
          <View
            key={message.id}
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
        ))}

        {isLoading && (
          <View className="items-end mb-4">
            <View className="bg-[#8B7355] px-4 py-3 rounded-2xl rounded-br-md">
              <Spinner size={20} color="white" />
            </View>
          </View>
        )}
      </ScrollView>

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
            onFocus={scrollToBottom}
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
