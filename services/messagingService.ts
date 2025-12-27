import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Global session ID tracking for notification suppression
let activeSessionId: string | null = null;

export function setActiveSessionId(sessionId: string | null) {
  activeSessionId = sessionId;
}

// Configure notification behavior - don't show alerts when app is open and user is in active chat
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const chatId = notification.request.content.data?.chatId as
      | string
      | undefined;

    // Check if user is in the specific chat that's receiving the notification
    if (chatId && activeSessionId === chatId) {
      // Suppress notification display - user is in active chat
      return {
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false,
      };
    }

    return {
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

// Get push token for this device (only works on mobile)
export async function getPushToken(): Promise<string | null> {
  try {
    // Web platform cannot receive push tokens, only send notifications
    if (Platform.OS === "web") {
      console.log(
        "Push tokens are not available on web - web can only send notifications"
      );
      return null;
    }

    if (!Device.isDevice) {
      console.log("Push notifications only work on physical devices");
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Push notification permission denied");
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: "6e9c5757-7446-4974-80fa-fadd2ad8ebc4",
    });

    return token.data;
  } catch (error) {
    // Suppress Firebase initialization errors - push notifications are optional
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("FirebaseApp") || errorMessage.includes("FCM")) {
      console.log("Push notifications unavailable: Firebase not configured");
    } else {
      console.error("Failed to get push token:", error);
    }
    return null;
  }
}

// Send push notification to a token (call this from your backend or another user's device)
export async function sendPushNotification(
  getToken: () => Promise<string | null>, // Clerk's getToken function
  targetToken: string,
  senderName: string,
  messageText: string,
  chatId?: string
) {
  if (!targetToken) {
    console.error("Push notification failed: No target token provided");
    return;
  }

  const message = {
    to: targetToken,
    sound: "default",
    title: senderName,
    body: messageText,
    data: { chatId },
    priority: "high",
    channelId: "default",
  };

  try {
    // For web, use our authenticated API endpoint
    // For mobile, use Expo's API directly
    const apiUrl =
      Platform.OS === "web"
        ? "/api/push"
        : "https://exp.host/--/api/v2/push/send";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // For web, get the Clerk session token
    if (Platform.OS === "web") {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication required for push notifications");
      }
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(message),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Push notification failed:", result);
      throw new Error(result.message || "Failed to send push notification");
    }

    if (result.data?.status === "error") {
      console.error("Push notification error:", result.data);
      throw new Error(result.data.message || "Push notification error");
    }

    console.log("Push notification sent successfully:", result.data);
    return result.data;
  } catch (error) {
    console.error("Failed to send push notification:", error);
    throw error;
  }
}

// Listen for notification taps (when app was closed/background)
export function addNotificationListener(
  callback: (chatId?: string, intendedRecipientId?: string) => void
) {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const chatId = response.notification.request.content.data.chatId as
        | string
        | undefined;
      const intendedRecipientId = response.notification.request.content.data
        .intendedRecipientId as string | undefined;

      // Validate that the current user is the intended recipient
      if (intendedRecipientId) {
        // This will be handled by the chat components with user context
        // We just pass the validation data along
        callback(chatId, intendedRecipientId);
      } else {
        // Legacy notifications without recipient validation
        callback(chatId);
      }
    }
  );

  return () => subscription.remove();
}

// Listen for notifications when app is OPEN
export function addForegroundNotificationListener(
  callback: (
    senderName: string,
    messageText: string,
    chatId?: string,
    intendedRecipientId?: string
  ) => void
) {
  const subscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      // This fires when notification arrives and app is OPEN
      const { title, body, data } = notification.request.content;
      const chatId = data?.chatId as string | undefined;
      const intendedRecipientId = data?.intendedRecipientId as
        | string
        | undefined;

      // Pass recipient validation data along with the notification
      callback(title || "Someone", body || "", chatId, intendedRecipientId);
    }
  );

  return () => subscription.remove();
}
