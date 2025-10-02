import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

// Configure notification behavior - don't show alerts when app is open
Notifications.setNotificationHandler({
  handleNotification: async (notification) => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Get push token for this device
export async function getPushToken(): Promise<string | null> {
  try {
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

    const token = await Notifications.getExpoPushTokenAsync();
    console.log(
      "Push token obtained successfully:",
      token.data.substring(0, 20) + "..."
    );
    return token.data;
  } catch (error) {
    console.error("Failed to get push token:", error);
    return null;
  }
}

// Send push notification to a token (call this from your backend or another user's device)
export async function sendPushNotification(
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
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
