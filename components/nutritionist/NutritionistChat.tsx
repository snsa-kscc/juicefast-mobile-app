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
import { Send, User } from 'lucide-react-native';
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
}

interface NutritionistChatProps {
  userId: string;
  nutritionists: Nutritionist[];
  activeSession?: ChatSession | null;
  initialMessages: Message[];
}

export function NutritionistChat({ 
  userId, 
  nutritionists, 
  activeSession, 
  initialMessages 
}: NutritionistChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNutritionist, setSelectedNutritionist] = useState<Nutritionist | null>(
    activeSession ? nutritionists.find(n => n.id === activeSession.nutritionistId) || null : null
  );
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(activeSession || null);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChatSession = async (nutritionist: Nutritionist) => {
    if (!nutritionist.isOnline) {
      Alert.alert('Unavailable', `${nutritionist.name} is currently offline. Please try again later.`);
      return;
    }

    setSelectedNutritionist(nutritionist);
    
    // Create new session (mock implementation)
    const newSession: ChatSession = {
      id: Date.now().toString(),
      nutritionistId: nutritionist.id,
      userId,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    
    setCurrentSession(newSession);
    
    // Add welcome message from nutritionist
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      sessionId: newSession.id,
      senderId: nutritionist.id,
      senderType: 'nutritionist',
      content: `Hi! I'm ${nutritionist.name}, your ${nutritionist.specialization}. I'm here to help you with your nutrition goals. How can I assist you today?`,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading || !currentSession || !selectedNutritionist) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sessionId: currentSession.id,
      senderId: userId,
      senderType: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate nutritionist response (replace with actual API call)
    setTimeout(() => {
      const nutritionistResponse: Message = {
        id: (Date.now() + 1).toString(),
        sessionId: currentSession.id,
        senderId: selectedNutritionist.id,
        senderType: 'nutritionist',
        content: generateNutritionistResponse(userMessage.content),
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, nutritionistResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const generateNutritionistResponse = (userInput: string): string => {
    // Simple response logic - replace with actual nutritionist chat
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('weight') || lowerInput.includes('lose') || lowerInput.includes('gain')) {
      return "Weight management is a journey that requires a balanced approach. I'd recommend focusing on sustainable habits rather than quick fixes. Can you tell me about your current eating patterns and goals?";
    }
    
    if (lowerInput.includes('diet') || lowerInput.includes('meal') || lowerInput.includes('food')) {
      return "Great question about nutrition! A balanced diet should include a variety of whole foods. I'd love to help you create a personalized meal plan. What are your dietary preferences or restrictions?";
    }
    
    if (lowerInput.includes('supplement') || lowerInput.includes('vitamin')) {
      return "Supplements can be helpful, but it's best to get nutrients from whole foods first. I'd need to know more about your current diet and any deficiencies to make specific recommendations. Have you had any recent blood work done?";
    }
    
    return "That's a great question! As your nutritionist, I'm here to provide personalized guidance based on your specific needs and goals. Could you share more details about your current situation so I can better assist you?";
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const endSession = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this chat session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            setCurrentSession(null);
            setSelectedNutritionist(null);
            setMessages([]);
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
          {nutritionists.map((nutritionist) => (
            <TouchableOpacity
              key={nutritionist.id}
              className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
              onPress={() => startChatSession(nutritionist)}
              disabled={!nutritionist.isOnline}
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
          ))}
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
            onPress={endSession}
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
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            className={`p-3 m-1 rounded-xl ${
              inputText.trim() && !isLoading ? 'bg-[#E1D5B9]' : 'bg-gray-200'
            }`}
            onPress={sendMessage}
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
