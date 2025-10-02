import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { Send } from 'lucide-react-native';
import { Spinner } from '@/components/Spinner';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { generateAPIUrl } from '@/utils';
import { useAuth } from '@clerk/clerk-expo';
import { fetch as expoFetch } from 'expo/fetch';

interface AIChatProps {
  userId: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
});

export function AIChat({ userId: _userId }: AIChatProps) {
  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { getToken } = useAuth();

  const {
    messages,
    error,
    status,
    sendMessage,
  } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl('/api/chat'),
      headers: async () => {
        const token = await getToken({ template: "convex" });
        return {
          Authorization: `Bearer ${token}`,
        };
      },
    }),
    onError: error => console.error(error, 'ERROR'),
  });

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || status === 'streaming') return;

    await sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: inputText.trim() }]
    });
    setInputText('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FCFBF8' }]}>
      <View style={[styles.inner, { paddingBottom: keyboardHeight }]}>
  
        {/* Error state */}
        {error && (
          <View className="px-4 py-2">
            <View className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <Text className="text-red-800 text-sm font-lufga">
                {error instanceof Error ? error.message : 'An error occurred'}
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
              className={`mb-4 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <View
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-[#4CC3FF] rounded-br-md'
                    : 'bg-white rounded-bl-md shadow-sm'
                }`}
              >
                {status === 'streaming' && !message.parts?.length ? (
                  // Show spinner while waiting for first chunk
                  <View className="flex-row items-center justify-center py-2">
                    <Spinner size={20} color="#4CC3FF" />
                  </View>
                ) : (
                  <Text
                    className={`text-base font-lufga leading-5 ${
                      message.role === 'user' ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {message.parts?.map((part, index) => (
                      <Text key={index}>
                        {part.type === 'text' ? part.text : ''}
                      </Text>
                    ))}
                    {status === 'streaming' && messages[messages.length - 1]?.id === message.id && (
                      <Text className="inline-block animate-pulse">▊</Text>
                    )}
                  </Text>
                )}
              </View>
              <Text className="text-xs font-lufga text-gray-400 mt-1 px-2">
                {formatTime(new Date())}
              </Text>
            </View>
          ))}

          {status === 'submitted' && messages.length === 0 && (
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
                inputText.trim() && status !== 'streaming' ? 'bg-[#4CC3FF]' : 'bg-gray-200'
              }`}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || status === 'streaming'}
            >
              <Send
                size={20}
                color={inputText.trim() && status !== 'streaming' ? 'white' : '#9CA3AF'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}