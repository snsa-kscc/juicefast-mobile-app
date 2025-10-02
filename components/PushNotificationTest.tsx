import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import {
  getPushToken,
  sendPushNotification,
} from "@/services/messagingService";

export default function PushNotificationTest() {
  const [myToken, setMyToken] = useState("");
  const [otherToken, setOtherToken] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Get my token
    const fetchToken = async () => {
      try {
        const token = await getPushToken();
        if (token) {
          setMyToken(token);
          console.log("My Token:", token.substring(0, 20) + "...");
        } else {
          console.log(
            "No token obtained - check if running on physical device",
          );
        }
      } catch (error) {
        console.error("Error getting token:", error);
      }
    };

    fetchToken();
  }, []);

  const handleSend = async () => {
    if (!otherToken || !message) {
      Alert.alert("Error", "Enter token and message");
      return;
    }

    setIsSending(true);
    try {
      await sendPushNotification(otherToken, "Test User", message, "chat-123");
      Alert.alert("Success", "Notification sent!");
      setMessage("");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to send notification",
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSendToSelf = async () => {
    if (!myToken || !message) {
      Alert.alert("Error", "Wait for token or enter message");
      return;
    }

    setIsSending(true);
    try {
      await sendPushNotification(myToken, "Self Test", message, "chat-123");
      Alert.alert("Success", "Test notification sent to yourself!");
      setMessage("");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to send notification",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 pt-12">
        <Text className="text-xl font-bold mb-4">Test Push Notifications</Text>

        <Text className="text-sm font-medium mb-2">
          Platform: {Platform.OS}
        </Text>
        <Text className="text-sm font-medium mb-2">
          Device:{" "}
          {Platform.OS === "ios"
            ? (Platform as any).isPad
              ? "Tablet"
              : "Phone"
            : "Phone"}
        </Text>

        {/* Device info */}
        <Text className="text-sm font-medium mb-2">My Token:</Text>
        <Text className="text-xs bg-gray-100 p-3 mb-4 rounded-md" selectable>
          {myToken || "Loading... (Make sure you are on a physical device)"}
        </Text>

        {/* Input for other device's token */}
        <Text className="text-sm font-medium mb-2">Other Device Token:</Text>
        <TextInput
          className="border border-gray-300 p-3 mb-4 rounded-md text-sm"
          value={otherToken}
          onChangeText={setOtherToken}
          placeholder="Paste token from other device"
          multiline
        />

        {/* Message to send */}
        <Text className="text-sm font-medium mb-2">Message:</Text>
        <TextInput
          className="border border-gray-300 p-3 mb-4 rounded-md text-sm"
          value={message}
          onChangeText={setMessage}
          placeholder="Type a test message"
        />

        {/* Buttons */}
        <View className="space-y-2">
          <Button
            title={isSending ? "Sending..." : "Send to Other Device"}
            onPress={handleSend}
            disabled={isSending || !otherToken || !message}
          />
          <Button
            title={isSending ? "Sending..." : "Send to Self (Test)"}
            onPress={handleSendToSelf}
            disabled={isSending || !myToken || !message}
          />
        </View>

        {/* Instructions */}
        <View className="mt-6 p-4 bg-blue-50 rounded-md">
          <Text className="text-sm font-medium mb-2">Instructions:</Text>
          <Text className="text-xs text-gray-700 mb-1">
            • Must be on physical device (not simulator)
          </Text>
          <Text className="text-xs text-gray-700 mb-1">
            • Grant notification permissions when prompted
          </Text>
          <Text className="text-xs text-gray-700 mb-1">
            • Copy token from one device and paste into another
          </Text>
          <Text className="text-xs text-gray-700">
            • Check console logs for detailed error info
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
