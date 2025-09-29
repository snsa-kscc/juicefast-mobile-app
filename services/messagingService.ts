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
  if (!Device.isDevice) {
    console.log("Push notifications only work on physical devices");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permission denied");
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync();

  return token.data;
}

// Send push notification to a token (call this from your backend or another user's device)
export async function sendPushNotification(targetToken: string, senderName: string, messageText: string, chatId?: string) {
  const message = {
    to: targetToken,
    sound: "default",
    title: senderName,
    body: messageText,
    data: { chatId },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

// Listen for notification taps (when app was closed/background)
export function addNotificationListener(callback: (chatId?: string) => void) {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const chatId = response.notification.request.content.data.chatId as string | undefined;
    callback(chatId);
  });

  return () => subscription.remove();
}

// Listen for notifications when app is OPEN
export function addForegroundNotificationListener(callback: (senderName: string, messageText: string, chatId?: string) => void) {
  const subscription = Notifications.addNotificationReceivedListener((notification) => {
    // This fires when notification arrives and app is OPEN
    const { title, body, data } = notification.request.content;
    const chatId = data?.chatId as string | undefined;
    callback(title || "Someone", body || "", chatId);
  });

  return () => subscription.remove();
}
