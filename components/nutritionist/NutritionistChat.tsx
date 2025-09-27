import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import { Send, User } from 'lucide-react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/clerk-expo';
import { Spinner } from '@/components/Spinner';

interface Nutritionist {
  id: string;
  name: string;
  specialization: string;
  avatar?: string;
  isOnline: boolean;
}

interface ChatSession {
  id: string;
  nutritionistId: string;
  userId: string;
  status: 'active' | 'ended';
  createdAt: string;
}

interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  senderType: 'user' | 'nutritionist';
  content: string;
  timestamp: string;
  isRead: boolean;
}

export function NutritionistChat() {
  const { user } = useUser();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNutritionist, setSelectedNutritionist] = useState<Nutritionist | null>(null);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Convex hooks
  const nutritionists = useQuery(api.nutritionistChat.getOnlineNutritionists);
  const userSessions = useQuery(api.nutritionistChat.getUserSessions);
  const sendMessage = useMutation(api.nutritionistChat.sendMessage);
  const createSession = useMutation(api.nutritionistChat.createChatSession);
  const endSession = useMutation(api.nutritionistChat.endChatSession);
  const markMessagesAsRead = useMutation(api.nutritionistChat.markMessagesAsRead);
  const realtimeMessages = useQuery(api.nutritionistChat.getMessages,
    currentSession ? { sessionId: currentSession.id as Id<"chatSessions"> } : "skip"
  );

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Convert realtime messages to the expected Message interface format
  const messages = useMemo(() => {
    if (!realtimeMessages) return [];
    return realtimeMessages.map(msg => ({
      id: msg.id.toString(),
      sessionId: msg.sessionId.toString(),
      senderId: msg.senderId,
      senderType: msg.senderType,
      content: msg.content,
      timestamp: new Date(msg.timestamp).toISOString(),
      isRead: msg.isRead
    }));
  }, [realtimeMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark nutritionist messages as read when they are viewed
  useEffect(() => {
    if (currentSession && messages.length > 0) {
      const unreadNutritionistMessages = messages.filter(
        msg => msg.senderType === 'nutritionist' && !msg.isRead
      );

      if (unreadNutritionistMessages.length > 0) {
        markMessagesAsRead({
          sessionId: currentSession.id as Id<"chatSessions">,
          senderType: 'nutritionist'
        }).catch(error => {
          console.error('Failed to mark messages as read:', error);
        });
      }
    }
  }, [messages, currentSession, markMessagesAsRead]);

  const startChatSession = async (nutritionist: Nutritionist) => {
    if (!nutritionist.isOnline) {
      Alert.alert('Unavailable', `${nutritionist.name} is currently offline. Please try again later.`);
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Please sign in to start a chat session.');
      return;
    }

    setIsLoading(true);
    setSelectedNutritionist(nutritionist);

    try {
      // Create new session
      const sessionId = await createSession({ nutritionistId: nutritionist.id });

      const newSession: ChatSession = {
        id: sessionId.toString(),
        nutritionistId: nutritionist.id,
        userId: user.id,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      setCurrentSession(newSession);

    } catch (error) {
      console.error('Failed to create session:', error);
      Alert.alert('Error', 'Failed to start chat session. Please try again.');
      setSelectedNutritionist(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading || !currentSession || !selectedNutritionist || !user) return;

    setInputText('');
    setIsLoading(true);

    try {
      await sendMessage({
        sessionId: currentSession.id as Id<"chatSessions">,
        content: inputText.trim()
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
      setInputText(inputText.trim()); // Restore the text if send failed
    } finally {
      setIsLoading(false);
    }
  };

  
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEndSession = async () => {
    if (!currentSession) return;

    Alert.alert(
      'End Session',
      'Are you sure you want to end this chat session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: async () => {
            try {
              await endSession({ sessionId: currentSession.id as Id<"chatSessions"> });
              setCurrentSession(null);
              setSelectedNutritionist(null);
            } catch (error) {
              console.error('Failed to end session:', error);
              Alert.alert('Error', 'Failed to end session. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Show nutritionist selection if no active session
  if (!currentSession || !selectedNutritionist) {
    return (
      <View className="flex-1 bg-[#FCFBF8] px-4">
        <Text className="text-xl font-lufga-bold mb-4">Choose a Nutritionist</Text>
        <Text className="text-gray-600 font-lufga mb-6">
          Connect with one of our certified nutritionists for personalized guidance
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {nutritionists && nutritionists.length > 0 ? (
            nutritionists.map((nutritionist) => (
              <TouchableOpacity
                key={nutritionist.id}
                className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
                onPress={() => startChatSession(nutritionist)}
                disabled={!nutritionist.isOnline || isLoading}
              >
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-[#E1D5B9] rounded-full items-center justify-center mr-4">
                  <User size={24} color="#8B7355" />
                </View>
                
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-lg font-lufga-medium text-gray-900">
                      {nutritionist.name}
                    </Text>
                    <View className={`ml-2 w-3 h-3 rounded-full ${
                      nutritionist.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </View>
                  <Text className="text-sm font-lufga text-gray-600">
                    {nutritionist.specialization}
                  </Text>
                  <Text className={`text-xs font-lufga mt-1 ${
                    nutritionist.isOnline ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {nutritionist.isOnline ? 'Available now' : 'Currently offline'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            ))
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <User size={48} color="#E1D5B9" />
              <Text className="text-lg font-lufga-medium text-gray-900 mt-4">
                No nutritionists available
              </Text>
              <Text className="text-sm font-lufga text-gray-600 text-center mt-2">
                Please check back later when nutritionists are online.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // Show chat interface
  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-[#FCFBF8]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-[#E1D5B9] rounded-full items-center justify-center mr-3">
              <User size={20} color="#8B7355" />
            </View>
            <View>
              <Text className="font-lufga-medium text-gray-900">
                {selectedNutritionist.name}
              </Text>
              <Text className="text-xs font-lufga text-gray-600">
                {selectedNutritionist.specialization}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            className="bg-red-100 px-3 py-1 rounded-full"
            onPress={handleEndSession}
          >
            <Text className="text-red-600 text-xs font-lufga-medium">End Session</Text>
          </TouchableOpacity>
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
            className={`mb-4 ${message.senderType === 'user' ? 'items-end' : 'items-start'}`}
          >
            <View
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.senderType === 'user'
                  ? 'bg-[#E1D5B9] rounded-br-md'
                  : 'bg-white rounded-bl-md shadow-sm'
              }`}
            >
              <Text
                className={`text-base font-lufga leading-5 ${
                  message.senderType === 'user' ? 'text-gray-800' : 'text-gray-800'
                }`}
              >
                {message.content}
              </Text>
            </View>
            <Text className="text-xs font-lufga text-gray-400 mt-1 px-2">
              {formatTime(message.timestamp)}
            </Text>
          </View>
        ))}
        
        {isLoading && (
          <View className="items-start mb-4">
            <View className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
              <Spinner size={20} color="#E1D5B9" />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View className="px-4 pb-4 bg-[#FCFBF8]">
        <View className="flex-row items-end bg-white rounded-2xl shadow-sm border border-gray-100">
          <TextInput
            className="flex-1 px-4 py-3 text-base font-lufga text-gray-800 max-h-24"
            placeholder="Ask your nutritionist anything..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            textAlignVertical="top"
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity
            className={`p-3 m-1 rounded-xl ${
              inputText.trim() && !isLoading ? 'bg-[#E1D5B9]' : 'bg-gray-200'
            }`}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Send 
              size={20} 
              color={inputText.trim() && !isLoading ? '#8B7355' : '#9CA3AF'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
