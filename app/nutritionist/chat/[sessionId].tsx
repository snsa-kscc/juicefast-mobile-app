import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/clerk-expo';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Send, User, ArrowLeft } from 'lucide-react-native';
import { Spinner } from '@/components/Spinner';

interface Message {
  id: Id<"chatMessages">;
  sessionId: Id<"chatSessions">;
  senderId: string;
  senderType: 'user' | 'nutritionist';
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
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sessionData = useQuery(api.nutritionistChat.getNutritionistSessions);
  const currentSession = sessionData?.find(s => s.id === sessionId);
  const messagesData = useQuery(api.nutritionistChat.getMessages, sessionId ? { sessionId: sessionId as Id<"chatSessions"> } : "skip");

  const sendMessage = useMutation(api.nutritionistChat.sendMessage);
  const markAsRead = useMutation(api.nutritionistChat.markMessagesAsRead);

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

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);

      // Mark user messages as read
      if (messagesData.length > 0) {
        markAsRead({ sessionId: sessionId as Id<"chatSessions">, senderType: "user" });
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
    if (!inputText.trim() || isLoading || !sessionId) return;

    setIsLoading(true);

    try {
      await sendMessage({
        sessionId: sessionId as Id<"chatSessions">,
        content: inputText.trim()
      });

      setInputText('');
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsLoading(false);
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleBack = () => {
    router.back();
  };

  if (!user || user.unsafeMetadata?.role !== "nutritionist" || !currentSession) {
    return (
      <View className="flex-1 bg-[#FCFBF8] items-center justify-center">
        <Spinner size={32} color="#8B7355" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#FCFBF8]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={handleBack} className="mr-3">
              <ArrowLeft size={20} color="#8B7355" />
            </TouchableOpacity>
            <View className="w-10 h-10 bg-[#E1D5B9] rounded-full items-center justify-center mr-3">
              <User size={20} color="#8B7355" />
            </View>
            <View>
              <Text className="font-lufga-medium text-gray-900">
                {currentSession.userName || 'Client'}
              </Text>
              <Text className="text-xs font-lufga text-gray-600">
                {currentSession.status === "active" ? "Active session" : "Session ended"}
              </Text>
            </View>
          </View>

          {currentSession.unreadCount > 0 && (
            <View className="bg-red-500 px-2 py-1 rounded-full">
              <Text className="text-xs font-lufga-medium text-white">
                {currentSession.unreadCount} new
              </Text>
            </View>
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
            className={`mb-4 ${message.senderType === 'nutritionist' ? 'items-end' : 'items-start'}`}
          >
            <View
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.senderType === 'nutritionist'
                  ? 'bg-[#8B7355] rounded-br-md'
                  : 'bg-white rounded-bl-md shadow-sm'
              }`}
            >
              <Text
                className={`text-base font-lufga leading-5 ${
                  message.senderType === 'nutritionist' ? 'text-white' : 'text-gray-800'
                }`}
              >
                {message.content}
              </Text>
            </View>
            <View className="flex-row items-center mt-1 px-2">
              <Text className="text-xs font-lufga text-gray-400">
                {formatTime(message.timestamp)}
              </Text>
              {message.senderType === 'nutritionist' && (
                <View className={`ml-2 w-2 h-2 rounded-full ${
                  message.isRead ? 'bg-green-500' : 'bg-gray-400'
                }`} />
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
      <View className="px-4 pb-4 bg-[#FCFBF8]">
        <View className="flex-row items-end bg-white rounded-2xl shadow-sm border border-gray-100">
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
              inputText.trim() && !isLoading && currentSession.status === "active"
                ? 'bg-[#8B7355]'
                : 'bg-gray-200'
            }`}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading || currentSession.status !== "active"}
          >
            <Send
              size={20}
              color={inputText.trim() && !isLoading && currentSession.status === "active"
                ? 'white'
                : '#9CA3AF'
              }
            />
          </TouchableOpacity>
        </View>

        {currentSession.status !== "active" && (
          <Text className="text-xs font-lufga text-gray-500 text-center mt-2">
            This session has ended. You cannot send new messages.
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}