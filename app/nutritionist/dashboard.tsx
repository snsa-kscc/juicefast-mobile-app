import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { User, MessageSquare, Clock, CheckCircle, XCircle, LogOut } from 'lucide-react-native';
import { Spinner } from '@/components/Spinner';

interface ChatSession {
  id: Id<"chatSessions">;
  userId: string;
  status: string;
  startedAt: number;
  endedAt?: number;
  lastMessageAt: number;
  lastMessage: {
    content: string;
    senderType: string;
    timestamp: number;
    isRead: boolean;
  } | null;
  unreadCount: number;
}

export default function NutritionistDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const sessions = useQuery(api.nutritionistChat.getNutritionistSessions);
  const activeSessions = useQuery(api.nutritionistChat.getActiveSessionsForNutritionist);
  const updateStatus = useMutation(api.nutritionistChat.updateNutritionistStatus);

  useEffect(() => {
    if (user?.unsafeMetadata?.role !== "nutritionist") {
      Alert.alert("Access Denied", "This area is for nutritionists only.");
      router.replace("/chat");
      return;
    }
    setIsOnline(true);
    updateNutritionistOnlineStatus(true);
  }, [user]);

  const updateNutritionistOnlineStatus = async (online: boolean) => {
    if (!user) return;
    try {
      await updateStatus({ clerkId: user.id, isOnline: online });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Refetch queries will happen automatically
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const toggleOnlineStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    updateNutritionistOnlineStatus(newStatus);
  };

  const handleSessionPress = (sessionId: Id<"chatSessions">) => {
    router.push(`/nutritionist/chat/${sessionId}`);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getSessionStatus = (session: ChatSession) => {
    if (session.status === "active") return { text: "Active", color: "bg-green-100 text-green-800" };
    if (session.status === "ended") return { text: "Ended", color: "bg-gray-100 text-gray-800" };
    return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
  };

  const handleLogout = () => {
    Alert.alert(
      "Go Offline",
      "Are you sure you want to go offline? You won't receive new chat requests.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Go Offline",
          style: "destructive",
          onPress: () => {
            setIsOnline(false);
            updateNutritionistOnlineStatus(false);
          },
        },
      ]
    );
  };

  if (!user || user.unsafeMetadata?.role !== "nutritionist") {
    return (
      <View className="flex-1 bg-[#FCFBF8] items-center justify-center">
        <Spinner size={32} color="#8B7355" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FCFBF8]">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-lufga-bold text-gray-900">
              Nutritionist Dashboard
            </Text>
            <Text className="text-sm font-lufga text-gray-600 mt-1">
              Welcome back, {user.firstName || user.username}
            </Text>
          </View>

          <View className="flex-row items-center space-x-3">
            <TouchableOpacity
              className={`px-3 py-1 rounded-full flex-row items-center ${
                isOnline ? 'bg-green-100' : 'bg-gray-200'
              }`}
              onPress={toggleOnlineStatus}
            >
              <View className={`w-2 h-2 rounded-full mr-2 ${
                isOnline ? 'bg-green-500' : 'bg-gray-500'
              }`} />
              <Text className={`text-xs font-lufga-medium ${
                isOnline ? 'text-green-800' : 'text-gray-600'
              }`}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="p-2"
              onPress={handleLogout}
            >
              <LogOut size={20} color="#8B7355" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View className="px-4 py-4">
        <View className="grid grid-cols-3 gap-4">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-2xl font-lufga-bold text-[#8B7355]">
              {activeSessions?.length || 0}
            </Text>
            <Text className="text-sm font-lufga text-gray-600">Active Chats</Text>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-2xl font-lufga-bold text-[#8B7355]">
              {sessions?.filter(s => s.unreadCount > 0).length || 0}
            </Text>
            <Text className="text-sm font-lufga text-gray-600">Unread Messages</Text>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-2xl font-lufga-bold text-[#8B7355]">
              {sessions?.length || 0}
            </Text>
            <Text className="text-sm font-lufga text-gray-600">Total Sessions</Text>
          </View>
        </View>
      </View>

      {/* Sessions List */}
      <View className="flex-1 px-4 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-lufga-bold text-gray-900">
            Chat Sessions
          </Text>
          <Text className="text-sm font-lufga text-gray-600">
            {sessions?.length || 0} total
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#8B7355"
            />
          }
        >
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => {
              const statusInfo = getSessionStatus(session);
              return (
                <TouchableOpacity
                  key={session.id}
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
                  onPress={() => handleSessionPress(session.id)}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        <View className="w-8 h-8 bg-[#E1D5B9] rounded-full items-center justify-center mr-3">
                          <User size={16} color="#8B7355" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-lufga-medium text-gray-900">
                            Client {session.userId.slice(0, 8)}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <View className={`px-2 py-1 rounded-full ${statusInfo.color}`}>
                              <Text className="text-xs font-lufga-medium">
                                {statusInfo.text}
                              </Text>
                            </View>
                            {session.unreadCount > 0 && (
                              <View className="ml-2 bg-red-500 px-2 py-1 rounded-full">
                                <Text className="text-xs font-lufga-medium text-white">
                                  {session.unreadCount} new
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>

                      {session.lastMessage && (
                        <View className="ml-11">
                          <Text className="text-sm font-lufga text-gray-600 line-clamp-1">
                            {session.lastMessage.senderType === "user" ? "Client: " : "You: "}
                            {session.lastMessage.content}
                          </Text>
                          <Text className="text-xs font-lufga text-gray-400 mt-1">
                            {formatTime(session.lastMessage.timestamp)}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View className="flex-col items-end">
                      <MessageSquare size={16} color="#8B7355" />
                      <Text className="text-xs font-lufga text-gray-400 mt-2">
                        {formatTime(session.lastMessageAt)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <MessageSquare size={48} color="#E1D5B9" />
              <Text className="text-lg font-lufga-medium text-gray-900 mt-4">
                No chat sessions yet
              </Text>
              <Text className="text-sm font-lufga text-gray-600 text-center mt-2">
                When clients start chatting with you, sessions will appear here.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}