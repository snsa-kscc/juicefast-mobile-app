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
import { useHealthChat } from '@/hooks/useHealthChat';

interface AIChatProps {
  userId: string;
}

export function AIChat({ userId: _userId }: AIChatProps) {
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    isMetricsLoading,
  } = useHealthChat();

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

    await sendMessage(inputText.trim());
    setInputText('');
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
      {/* Loading state for metrics */}
      {isMetricsLoading && (
        <View className="items-center py-8">
          <Spinner size={32} />
          <Text className="text-gray-500 mt-2">Loading your health data...</Text>
        </View>
      )}

      {/* Error state */}
      {error && (
        <View className="px-4 py-2">
          <View className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <Text className="text-red-800 text-sm font-lufga">{error}</Text>
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
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity
            className={`p-3 m-1 rounded-xl ${
              inputText.trim() && !isLoading ? 'bg-[#4CC3FF]' : 'bg-gray-200'
            }`}
            onPress={handleSendMessage}
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
