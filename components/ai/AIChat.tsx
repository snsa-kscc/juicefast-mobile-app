import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Send } from 'lucide-react-native';
import { Spinner } from '@/components/Spinner';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatProps {
  userId: string;
}

export function AIChat({ userId }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI health assistant. I'm here to help you with your wellness journey, nutrition questions, and fasting guidance. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(userMessage.text),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    // Simple response logic - replace with actual AI integration
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('fast') || lowerInput.includes('fasting')) {
      return "Fasting can be a great tool for health when done properly. I'd recommend starting with intermittent fasting (16:8 method) if you're new to it. Always consult with a healthcare provider before starting any fasting regimen. What specific aspect of fasting would you like to know more about?";
    }
    
    if (lowerInput.includes('nutrition') || lowerInput.includes('eat') || lowerInput.includes('food')) {
      return "Great question about nutrition! A balanced diet with whole foods, plenty of vegetables, lean proteins, and healthy fats is key. During your eating windows, focus on nutrient-dense foods. What are your current eating habits or specific nutrition goals?";
    }
    
    if (lowerInput.includes('water') || lowerInput.includes('hydration')) {
      return "Hydration is crucial, especially during fasting periods! Aim for at least 8-10 glasses of water daily. You can also have herbal teas, black coffee, or water with a pinch of sea salt. Are you tracking your water intake?";
    }
    
    return "That's a great question! As your AI wellness assistant, I'm here to help with nutrition, fasting, hydration, and general wellness guidance. Could you tell me more about what specific area you'd like help with?";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-[#FCFBF8]"
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={20}
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-4 ${message.isUser ? 'items-end' : 'items-start'}`}
          >
            <View
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.isUser
                  ? 'bg-[#4CC3FF] rounded-br-md'
                  : 'bg-white rounded-bl-md shadow-sm'
              }`}
            >
              <Text
                className={`text-base font-lufga leading-5 ${
                  message.isUser ? 'text-white' : 'text-gray-800'
                }`}
              >
                {message.text}
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
              <Spinner size={20} color="#4CC3FF" />
            </View>
          </View>
        )}
      </ScrollView>

      <View className="px-4 pb-4 bg-[#FCFBF8]">
        <View className="flex-row items-end bg-white rounded-2xl shadow-sm border border-gray-100">
          <TextInput
            className="flex-1 px-4 py-3 text-base font-lufga text-gray-800 max-h-24"
            placeholder="Ask me about nutrition, fasting, or wellness..."
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
              inputText.trim() && !isLoading ? 'bg-[#4CC3FF]' : 'bg-gray-200'
            }`}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Send 
              size={20} 
              color={inputText.trim() && !isLoading ? 'white' : '#9CA3AF'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
