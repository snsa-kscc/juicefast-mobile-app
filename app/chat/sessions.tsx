import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { User, MessageSquare, ArrowLeft } from "lucide-react-native";

interface ChatSession {
  id: Id<"chatSessions">;
  nutritionistId: string;
  userName?: string;
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
  nutritionist: {
    name: string;
    specialization: string;
    isOnline: boolean;
    avatarUrl?: string;
  } | null;
}

export default function UserSessions() {
  const { user } = useUser();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch only active sessions for the logged-in user
  const sessions = useQuery(
    api.nutritionistChat.getActiveUserSessions,
    user ? undefined : "skip"
  );

  useEffect(() => {
    if (!user) {
      Alert.alert("Access Denied", "Please sign in to view your sessions.");
      router.replace("/chat");
      return;
    }
  }, [user, router]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Refetch queries will happen automatically
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleSessionPress = (sessionId: Id<"chatSessions">) => {
    // Navigate to the nutritionist chat with the specific session
    router.push({
      pathname: "/chat/nutritionist",
      params: { sessionId: sessionId.toString() },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatStartTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSessionStatus = (session: ChatSession) => {
    if (session.status === "active")
      return { text: "Active", color: "bg-green-100 text-green-800" };
    return { text: session.status, color: "bg-gray-100 text-gray-800" };
  };

  if (!user) {
    return (
      <View className="flex-1 bg-[#FCFBF8] items-center justify-center">
        <ActivityIndicator size="large" color="#2d2d2d" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FCFBF8]">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={handleBack} className="mr-3">
              <ArrowLeft size={20} color="#8B7355" />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-lufga-bold text-gray-900">
                My Sessions
              </Text>
              <Text className="text-sm font-lufga text-gray-600 mt-1">
                Your active nutritionist chats
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View className="px-4 py-4">
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-2xl font-lufga-bold text-[#8B7355]">
            {sessions?.length || 0}
          </Text>
          <Text className="text-sm font-lufga text-gray-600">
            Active Sessions
          </Text>
        </View>
      </View>

      {/* Sessions List */}
      <View className="flex-1 px-4 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-lufga-bold text-gray-900">
            Active Sessions
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
                            {session.nutritionist?.name || "Nutritionist"}
                          </Text>
                          <Text className="text-sm font-lufga text-gray-600">
                            {session.nutritionist?.specialization ||
                              "Health Specialist"}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <View
                              className={`px-2 py-1 rounded-full ${statusInfo.color}`}
                            >
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
                            {session.nutritionist?.isOnline && (
                              <View className="ml-2 flex-row items-center">
                                <View className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                                <Text className="text-xs font-lufga text-green-600">
                                  Online
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>

                      {session.lastMessage && (
                        <View className="ml-11">
                          <Text className="text-sm font-lufga text-gray-600 line-clamp-1">
                            {session.lastMessage.senderType === "user"
                              ? "You: "
                              : `${session.nutritionist?.name || "Nutritionist"}: `}
                            {session.lastMessage.content}
                          </Text>
                          <Text className="text-xs font-lufga text-gray-400 mt-1">
                            {formatTime(session.lastMessage.timestamp)}
                          </Text>
                        </View>
                      )}

                      <View className="ml-11 mt-2">
                        <Text className="text-xs font-lufga text-gray-500">
                          Started: {formatStartTime(session.startedAt)}
                        </Text>
                      </View>
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
                No Active Sessions
              </Text>
              <Text className="text-sm font-lufga text-gray-600 text-center mt-2">
                When you start chatting with nutritionists, your active sessions
                will appear here.
              </Text>
              <TouchableOpacity
                className="bg-[#8B7355] px-6 py-2 rounded-lg mt-4"
                onPress={() => router.push("/chat/nutritionist")}
              >
                <Text className="text-white font-lufga-medium">
                  Start a Chat
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
