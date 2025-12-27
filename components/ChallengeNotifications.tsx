import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { showCrossPlatformAlert } from "@/utils/alert";

interface Participant {
  userId: string;
  name: string;
  pushToken?: string;
  startedAt: number;
  hasPushToken: boolean;
}

export default function AdminNotifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Fetch challenge participants
  const participants = useQuery(
    api.challengeNotifications.getChallengeParticipants
  );
  const participantsCount = useQuery(
    api.challengeNotifications.getChallengeParticipantsCount
  );

  // Mutation to send notifications
  const sendNotification = useMutation(
    api.challengeNotifications.sendNotificationToChallengeParticipants
  );

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      await showCrossPlatformAlert(
        "Error",
        "Please fill in both title and message"
      );
      return;
    }

    setIsSending(true);
    try {
      const result = await sendNotification({
        title: title.trim(),
        message: message.trim(),
      });

      await showCrossPlatformAlert(
        "Notification Sent",
        `Successfully sent to ${result.successCount} users${
          result.failureCount > 0
            ? `\nFailed to send to ${result.failureCount} users`
            : ""
        }`
      );

      // Clear form
      setTitle("");
      setMessage("");
    } catch (error) {
      await showCrossPlatformAlert(
        "Error",
        error instanceof Error ? error.message : "Failed to send notifications"
      );
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <ScrollView className="flex-1 bg-jf-gray">
      <View className="p-4 pt-12">
        {/* Header with back button */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2">
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-lufga-bold">
            Send Notifications to Challenge Participants
          </Text>
        </View>

        {/* Statistics */}
        {participantsCount && (
          <View className="bg-blue-50 p-4 rounded-md mb-6">
            <Text className="text-sm font-lufga-bold mb-2">
              Challenge Participants Statistics:
            </Text>
            <Text className="text-xs text-gray-700 mb-1">
              • Total enrolled: {participantsCount.total}
            </Text>
            <Text className="text-xs text-gray-700 mb-1">
              • With push tokens: {participantsCount.withPushTokens}
            </Text>
            <Text className="text-xs text-gray-700">
              • Without push tokens: {participantsCount.withoutPushTokens}
            </Text>
          </View>
        )}

        {/* Notification Form */}
        <View className="bg-white p-4 rounded-md mb-6">
          <Text className="text-sm font-lufga-medium mb-2">
            Notification Title:
          </Text>
          <TextInput
            className="border border-gray-300 p-3 mb-4 rounded-md text-sm"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter notification title"
            maxLength={100}
          />

          <Text className="text-sm font-lufga-medium mb-2">Message:</Text>
          <TextInput
            className="border border-gray-300 p-3 mb-4 rounded-md text-sm"
            style={{ minHeight: 120, textAlignVertical: "top" }}
            value={message}
            onChangeText={setMessage}
            placeholder="Enter notification message"
            multiline
            numberOfLines={6}
            maxLength={500}
          />

          <Text className="text-xs text-gray-500 mb-4">
            {title.length}/100 characters (title)
          </Text>
          <Text className="text-xs text-gray-500 mb-4">
            {message.length}/500 characters (message)
          </Text>

          {/* Send Buttons */}
          <View className="flex-col gap-3">
            <TouchableOpacity
              className={`py-3 px-4 rounded-md ${
                isSending || !title.trim() || !message.trim()
                  ? "bg-gray-300"
                  : "bg-orange-500"
              }`}
              onPress={() => handleSendNotification()}
              disabled={isSending || !title.trim() || !message.trim()}
            >
              <Text className="text-white text-center font-lufga-semibold text-base">
                {isSending ? "Sending..." : "Send to All Participants"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Participants List */}
        <Text className="text-lg font-lufga-bold mb-3">
          Challenge Participants ({participants?.length || 0})
        </Text>

        {participants === undefined ? (
          <ActivityIndicator size="large" />
        ) : participants && participants.length > 0 ? (
          participants.map((participant: Participant) => (
            <View
              key={participant.userId}
              className="bg-white p-3 mb-2 rounded-md flex-row justify-between items-center"
            >
              <View className="flex-1">
                <Text className="text-sm font-lufga-medium">
                  {participant.name}
                </Text>
                <Text className="text-xs text-gray-500">
                  Started: {formatDate(participant.startedAt)}
                </Text>
              </View>
              <View
                className={`px-2 py-1 rounded ${
                  participant.hasPushToken ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <Text
                  className={`text-xs font-lufga-medium ${
                    participant.hasPushToken ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {participant.hasPushToken ? "Has Token" : "No Token"}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-sm text-gray-500 text-center py-4">
            No participants have started the challenge yet.
          </Text>
        )}

        {/* Instructions */}
        <View className="mt-6 p-4 bg-yellow-50 rounded-md">
          <Text className="text-sm font-lufga-bold mb-2">Instructions:</Text>
          <Text className="text-xs text-gray-700 mb-1">
            • Only users with push tokens will receive notifications
          </Text>
          <Text className="text-xs text-gray-700 mb-1">
            • Users must have the app installed to receive push notifications
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
