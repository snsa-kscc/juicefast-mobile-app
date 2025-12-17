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
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { User, MessageSquare, Trash2 } from "lucide-react-native";
import { WellnessHeader } from "@/components/ui/CustomHeader";
import { showCrossPlatformAlert } from "@/utils/alert";

interface ChatSession {
  id: Id<"chatSessions">;
  userId: string;
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
}

export default function NutritionistDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "ended">("all");
  const [displayedChats, setDisplayedChats] = useState(10);

  const nutritionistStatus = useQuery(
    api.nutritionistChat.getNutritionistStatus,
    user ? undefined : "skip"
  );

  const chats = useQuery(
    api.nutritionistChat.getNutritionistSessions,
    user ? undefined : "skip"
  );
  const activeChats = useQuery(
    api.nutritionistChat.getActiveSessionsForNutritionist,
    user ? undefined : "skip"
  );
  const updateStatus = useMutation(
    api.nutritionistChat.updateNutritionistStatus
  );
  const deleteChatSession = useMutation(api.nutritionistChat.deleteChatSession);
  const endChatSession = useMutation(api.nutritionistChat.endChatSession);

  useEffect(() => {
    if (
      user?.unsafeMetadata?.role !== "nutritionist" &&
      user?.unsafeMetadata?.role !== "admin"
    ) {
      showCrossPlatformAlert(
        "Access Denied",
        "This area is for nutritionists only."
      );
      router.replace("/chat");
      return;
    }
    // Set the actual online status from database
    if (nutritionistStatus !== undefined) {
      setIsOnline(nutritionistStatus);
    }
  }, [user, nutritionistStatus]);

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
    setDisplayedChats(10); // Reset pagination on refresh
    // Refetch queries will happen automatically
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const toggleOnlineStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    updateNutritionistOnlineStatus(newStatus);
  };

  const handleChatPress = (chatId: Id<"chatSessions">) => {
    router.push(`/nutritionist/chat/${chatId}`);
  };

  const handleLoadMore = () => {
    setDisplayedChats((prev) => prev + 5);
  };

  const handleDeleteChat = (chatId: Id<"chatSessions">, userName: string) => {
    showCrossPlatformAlert(
      "Delete Chat",
      `Are you sure you want to delete the chat with ${userName}? This action cannot be undone and will remove all messages.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // First end the chat session if it's active
              await endChatSession({ sessionId: chatId });

              // Then delete the chat session and all messages
              await deleteChatSession({ sessionId: chatId });

              // The UI will automatically update due to Convex reactivity
            } catch (error) {
              console.error("Failed to delete chat:", error);
              showCrossPlatformAlert(
                "Error",
                "Failed to delete chat. Please try again."
              );
            }
          },
        },
      ]
    );
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

  const filteredChats = chats?.filter((chat) => {
    if (filter === "all") return true;
    if (filter === "active") return chat.status === "active";
    if (filter === "ended") return chat.status === "ended";
    return true;
  });

  const getChatStatus = (chat: ChatSession) => {
    if (chat.status === "active")
      return { text: "Active", color: "bg-green-100 text-green-800" };
    if (chat.status === "ended")
      return { text: "Ended", color: "bg-gray-100 text-gray-800" };
    return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
  };

  if (
    !user ||
    (user.unsafeMetadata?.role !== "nutritionist" &&
      user.unsafeMetadata?.role !== "admin") ||
    !chats
  ) {
    return (
      <View className="flex-1 bg-[#FCFBF8] items-center justify-center">
        <ActivityIndicator size="large" color="#2d2d2d" />
        <Text className="text-gray-600 font-lufga mt-4">Loading chats...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-jf-gray">
      <WellnessHeader
        title="Nutritionist Dashboard"
        subtitle={`Welcome back, ${user.firstName || user.username}`}
        accentColor="#8B7355"
        backgroundColor="white"
        showBackButton={true}
        showSettings={false}
        onBackPress={() => router.back()}
      />

      {/* Online Status Toggle */}
      <View className="bg-white px-6 pb-3 border-b border-gray-100">
        <View className="flex-row justify-end">
          <TouchableOpacity
            className={`px-3 py-1 rounded-full flex-row items-center ${
              isOnline ? "bg-green-100" : "bg-gray-200"
            }`}
            onPress={toggleOnlineStatus}
          >
            <View
              className={`w-2 h-2 rounded-full mr-2 ${
                isOnline ? "bg-green-500" : "bg-gray-500"
              }`}
            />
            <Text
              className={`text-xs font-lufga-medium ${
                isOnline ? "text-green-800" : "text-gray-600"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chats List */}
      <View className="flex-1 px-4 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-lufga-bold text-gray-900">Chats</Text>
          <Text className="text-sm font-lufga text-gray-600">
            {filteredChats?.length || 0} shown
          </Text>
        </View>

        {/* Filter buttons */}
        <View className="flex-row gap-2 mb-4">
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-lg ${
              filter === "all" ? "bg-[#8B7355]" : "bg-gray-200"
            }`}
            onPress={() => setFilter("all")}
          >
            <Text
              className={`text-center font-lufga-medium ${
                filter === "all" ? "text-white" : "text-gray-700"
              }`}
            >
              All ({chats?.length || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-lg ${
              filter === "active" ? "bg-green-500" : "bg-gray-200"
            }`}
            onPress={() => setFilter("active")}
          >
            <Text
              className={`text-center font-lufga-medium ${
                filter === "active" ? "text-white" : "text-gray-700"
              }`}
            >
              Active ({activeChats?.length || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-lg ${
              filter === "ended" ? "bg-gray-500" : "bg-gray-200"
            }`}
            onPress={() => setFilter("ended")}
          >
            <Text
              className={`text-center font-lufga-medium ${
                filter === "ended" ? "text-white" : "text-gray-700"
              }`}
            >
              Ended ({chats?.filter((s) => s.status === "ended").length || 0})
            </Text>
          </TouchableOpacity>
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
          {filteredChats && filteredChats.length > 0 ? (
            filteredChats.slice(0, displayedChats).map((chat) => {
              const statusInfo = getChatStatus(chat);
              return (
                <View
                  key={chat.id}
                  className="bg-white rounded-xl p-4 mb-3 border border-gray-100"
                >
                  <View className="flex-row items-start justify-between">
                    <TouchableOpacity
                      className="flex-1"
                      onPress={() => handleChatPress(chat.id)}
                    >
                      <View className="flex-row items-center mb-2">
                        <View className="w-8 h-8 bg-[#E1D5B9] rounded-full items-center justify-center mr-3">
                          <User size={16} color="#8B7355" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-lufga-medium text-gray-900">
                            {chat.userName ||
                              `Client ${chat.userId.slice(0, 8)}`}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <View
                              className={`px-2 py-1 rounded-full ${statusInfo.color}`}
                            >
                              <Text className="text-xs font-lufga-medium">
                                {statusInfo.text}
                              </Text>
                            </View>
                            {chat.status === "active" &&
                              chat.lastMessage?.senderType === "user" &&
                              !chat.lastMessage?.isRead && (
                                <View className="ml-2 w-3 h-3 bg-blue-500 rounded-full" />
                              )}
                          </View>
                        </View>
                      </View>

                      {chat.lastMessage && (
                        <View className="ml-11">
                          <Text className="text-sm font-lufga text-gray-600 line-clamp-1">
                            {chat.lastMessage.senderType === "user"
                              ? "Client: "
                              : "You: "}
                            {chat.lastMessage.content}
                          </Text>
                          <Text className="text-xs font-lufga text-gray-400 mt-1">
                            {formatTime(chat.lastMessage.timestamp)}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    <View className="flex-col items-end ml-3">
                      <View className="flex-row items-center gap-2">
                        <MessageSquare size={16} color="#8B7355" />
                        <TouchableOpacity
                          onPress={() =>
                            handleDeleteChat(
                              chat.id,
                              chat.userName ||
                                `Client ${chat.userId.slice(0, 8)}`
                            )
                          }
                          className="p-1 rounded-full bg-red-50 active:bg-red-100"
                        >
                          <Trash2 size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                      <Text className="text-xs font-lufga text-gray-400 mt-2">
                        {formatTime(chat.lastMessageAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <MessageSquare size={48} color="#E1D5B9" />
              <Text className="text-lg font-lufga-medium text-gray-900 mt-4">
                No chats yet
              </Text>
              <Text className="text-sm font-lufga text-gray-600 text-center mt-2">
                When clients start chatting with you, chats will appear here.
              </Text>
            </View>
          )}

          {/* Show more button */}
          {filteredChats && filteredChats.length > displayedChats && (
            <TouchableOpacity
              className="bg-[#8B7355] py-3 rounded-lg mt-4"
              onPress={handleLoadMore}
            >
              <Text className="text-white font-lufga-medium text-center">
                Show More ({filteredChats.length - displayedChats} remaining)
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
