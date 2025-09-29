import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { Send, User, Users } from 'lucide-react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/clerk-expo';
import { useRouter, useLocalSearchParams } from 'expo-router';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
});

export function NutritionistChat() {
  const { user } = useUser();
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [selectedNutritionist, setSelectedNutritionist] = useState<Nutritionist | null>(null);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [showSessionSwitcher, setShowSessionSwitcher] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Convex hooks
  const nutritionists = useQuery(api.nutritionistChat.getNutritionists);
  const userSessions = useQuery(api.nutritionistChat.getUserSessions);
  const sendMessage = useMutation(api.nutritionistChat.sendMessage);
  const endSession = useMutation(api.nutritionistChat.endChatSession);
  const markMessagesAsRead = useMutation(api.nutritionistChat.markMessagesAsRead);
  const realtimeMessages = useQuery(api.nutritionistChat.getMessages,
    currentSession ? { sessionId: currentSession.id as Id<"chatSessions"> } : "skip"
  );

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

  // Handle session restoration from URL parameters
  useEffect(() => {
    if (sessionId && userSessions && !currentSession) {
      const targetSession = userSessions.find(session =>
        session.id.toString() === sessionId && session.status === "active"
      );

      if (targetSession) {
        const nutritionist = nutritionists?.find(n => n.id === targetSession.nutritionistId);
        if (nutritionist) {
          setCurrentSession({
            id: targetSession.id.toString(),
            nutritionistId: targetSession.nutritionistId,
            userId: user?.id || "",
            status: 'active',
            createdAt: new Date(targetSession.startedAt).toISOString(),
          });
          setSelectedNutritionist(nutritionist);
        }
      }
    }
  }, [sessionId, userSessions, currentSession, nutritionists, user]);

  // Check for existing active sessions and restore the most recent one
  useEffect(() => {
    if (userSessions && !currentSession && !sessionId) {
      const activeSessions = userSessions.filter(session => session.status === "active");
      if (activeSessions.length > 0) {
        // Sort by most recent activity and get the most recent one
        const mostRecentSession = activeSessions.sort((a, b) =>
          Math.max(b.lastMessageAt, b.startedAt) - Math.max(a.lastMessageAt, a.startedAt)
        )[0];

        // Find the nutritionist for this session
        const nutritionist = nutritionists?.find(n => n.id === mostRecentSession.nutritionistId);
        if (nutritionist) {
          setCurrentSession({
            id: mostRecentSession.id.toString(),
            nutritionistId: mostRecentSession.nutritionistId,
            userId: user?.id || "",
            status: 'active',
            createdAt: new Date(mostRecentSession.startedAt).toISOString(),
          });
          setSelectedNutritionist(nutritionist);
        }
      }
    }
  }, [userSessions, currentSession, nutritionists, user, sessionId]);


  const switchToSession = (session: any) => {
    const nutritionist = nutritionists?.find(n => n.id === session.nutritionistId);
    if (nutritionist) {
      setCurrentSession({
        id: session.id.toString(),
        nutritionistId: session.nutritionistId,
        userId: user?.id || "",
        status: 'active',
        createdAt: new Date(session.startedAt).toISOString(),
      });
      setSelectedNutritionist(nutritionist);
      setShowSessionSwitcher(false);
    }
  };

  const handleViewSessions = () => {
    router.push("/chat/sessions");
  };


  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading || !selectedNutritionist || !user) return;

    setInputText('');
    setIsLoading(true);

    try {
      // This will automatically create a session if needed
      await sendMessage({
        nutritionistId: selectedNutritionist.id,
        content: inputText.trim()
      });

      // The session will be created automatically, so we need to fetch the latest sessions
      // to update our currentSession state
      if (!currentSession) {
        // The component will automatically update due to the userSessions query
        // and the useEffect that restores the most recent session
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', error.message || 'Failed to send message. Please try again.');
      setInputText(inputText.trim()); // Restore the text if send failed
    } finally {
      setIsLoading(false);
    }
  };


  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEndSession = async () => {
    if (!currentSession) {
      Alert.alert('Error', 'No active session to end.');
      return;
    }

    Alert.alert(
      'End Chat',
      'Are you sure you want to end this chat? This will close your conversation and you will need to start a new chat to chat again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Chat',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              console.log('Ending session with ID:', currentSession.id);
              const result = await endSession({ sessionId: currentSession.id as Id<"chatSessions"> });
              console.log('Session ended successfully:', result);
              setCurrentSession(null);
              setSelectedNutritionist(null);
              setShowSessionSwitcher(false);
              Alert.alert('Success', 'Chat has been ended.');
              setTimeout(() => {
                router.push('/chat/nutritionist');
              }, 1000);
            } catch (error: any) {
              console.error('Failed to end session:', error);
              Alert.alert('Error', `Failed to end chat: ${error.message || 'Please try again.'}`);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // Show nutritionist selection if no nutritionist selected
  if (!selectedNutritionist) {
    const activeSessions = userSessions?.filter(session => session.status === "active") || [];

    return (
      <View style={[styles.container, { backgroundColor: '#FCFBF8' }]}>
        <View className="px-4 mb-4">
          <Text className="text-xl font-lufga-bold">Choose a Nutritionist</Text>
        </View>
        <Text className="text-gray-600 font-lufga mb-6 px-4">
          Connect with one of our certified nutritionists for personalized guidance
        </Text>
        <Text className="text-gray-500 font-lufga mb-6 text-sm px-4">
          💡 You can message nutritionists even when they're offline - they'll receive your message when they're back online
        </Text>

        {/* Show active sessions if any exist */}
        {activeSessions.length > 0 && (
          <View className="mb-6 px-4">
            <Text className="text-green-800 font-lufga-medium mb-3">
              Your Active Chats ({activeSessions.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
              {activeSessions.map((session) => {
                const nutritionist = nutritionists?.find(n => n.id === session.nutritionistId);
                return (
                  <TouchableOpacity
                    key={session.id.toString()}
                    className="bg-green-50 border border-green-200 rounded-xl p-3 mr-3 min-w-[200px]"
                    onPress={() => {
                      if (nutritionist) {
                        setCurrentSession({
                          id: session.id.toString(),
                          nutritionistId: session.nutritionistId,
                          userId: user?.id || "",
                          status: 'active',
                          createdAt: new Date(session.startedAt).toISOString(),
                        });
                        setSelectedNutritionist(nutritionist);
                      }
                    }}
                  >
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 bg-green-200 rounded-full items-center justify-center mr-2">
                        <User size={16} color="#059669" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-green-800 font-lufga-medium text-sm">
                          {nutritionist?.name || 'Nutritionist'}
                        </Text>
                        <Text className="text-green-600 text-xs font-lufga">
                          Tap to resume
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false} className="px-4">
          {nutritionists && nutritionists.length > 0 ? (
            nutritionists.map((nutritionist) => {
              // Check if user already has active session with this nutritionist
              const hasActiveSession = userSessions?.some(
                session => session.nutritionistId === nutritionist.id && session.status === "active"
              );

              return (
                <TouchableOpacity
                  key={nutritionist.id}
                  className={`bg-white rounded-xl p-4 mb-4 shadow-sm border ${
                    hasActiveSession ? 'border-green-300 bg-green-50' : 'border-gray-100'
                  }`}
                  onPress={() => setSelectedNutritionist(nutritionist)}
                  disabled={isLoading || hasActiveSession}
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
                    hasActiveSession ? 'text-green-600' : nutritionist.isOnline ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {hasActiveSession ? 'Chat in progress' : nutritionist.isOnline ? 'Available now' : 'Offline - message will be delivered when online'}
                  </Text>
                </View>
                {hasActiveSession && (
                  <View className="bg-green-100 px-2 py-1 rounded-full">
                    <Text className="text-green-700 text-xs font-lufga-medium">Active</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            );
            })
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
    <View style={[styles.container, { backgroundColor: '#FCFBF8' }]}>
      <View style={[styles.inner, { paddingBottom: keyboardHeight }]}>
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

            <View className="flex-row items-center">
              {/* Session switcher button - only show if multiple active sessions exist */}
              {userSessions && userSessions.filter(s => s.status === "active").length > 1 && (
                <TouchableOpacity
                  className="bg-blue-100 px-3 py-1 rounded-full mr-2"
                  onPress={() => setShowSessionSwitcher(!showSessionSwitcher)}
                >
                  <View className="flex-row items-center">
                    <Users size={14} color="#1e40af" />
                    <Text className="text-blue-600 text-xs font-lufga-medium ml-1">
                      {userSessions.filter(s => s.status === "active").length}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* End session button - only show when there's an active session */}
              {currentSession && currentSession.status === 'active' && (
                <TouchableOpacity
                  className={`bg-red-100 px-2 py-1 rounded-full ${isLoading ? 'opacity-50' : ''}`}
                  onPress={handleEndSession}
                  disabled={isLoading}
                >
                  <Text className="text-red-600 text-xs font-lufga-medium">
                    {isLoading ? 'Ending...' : 'End chat'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Session switcher dropdown */}
          {showSessionSwitcher && (
            <View className="absolute top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
              <Text className="text-gray-700 font-lufga-medium px-3 py-2 border-b border-gray-100">
                Switch to:
              </Text>
              {userSessions
                ?.filter(session => session.status === "active" && session.nutritionistId !== selectedNutritionist?.id)
                .map((session) => {
                  const nutritionist = nutritionists?.find(n => n.id === session.nutritionistId);
                  return (
                    <TouchableOpacity
                      key={session.id.toString()}
                      className="px-3 py-2 border-b border-gray-50 hover:bg-gray-50"
                      onPress={() => switchToSession(session)}
                    >
                      <View className="flex-row items-center">
                        <View className="w-6 h-6 bg-gray-200 rounded-full items-center justify-center mr-2">
                          <User size={12} color="#6b7280" />
                        </View>
                        <View>
                          <Text className="text-gray-900 font-lufga text-sm">
                            {nutritionist?.name || 'Nutritionist'}
                          </Text>
                          <Text className="text-gray-500 text-xs font-lufga">
                            {nutritionist?.specialization}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
          )}
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
        <View className="px-4 py-2 bg-white border-t border-gray-100">
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
      </View>
    </View>
  );
}