import { Platform, Alert } from "react-native";

export interface AlertButton {
  text?: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

export const showCrossPlatformAlert = (
  title: string,
  message: string,
  buttons?: AlertButton[]
): Promise<void> => {
  return new Promise((resolve) => {
    if (Platform.OS === "web") {
      // On web, use native browser confirm/alert for simple cases
      if (!buttons || buttons.length <= 2) {
        const hasCancel = buttons?.some((btn) => btn.style === "cancel");
        const destructiveIndex = buttons?.findIndex(
          (btn) => btn.style === "destructive"
        );

        if (buttons && buttons.length === 2) {
          // Use confirm for two-button dialogs
          const result = window.confirm(`${title}\n\n${message}`);
          if (result) {
            const confirmButton = buttons.find((btn) => btn.style !== "cancel");
            confirmButton?.onPress?.();
          } else {
            const cancelButton = buttons.find((btn) => btn.style === "cancel");
            cancelButton?.onPress?.();
          }
        } else if (buttons && buttons.length === 1) {
          // Use alert for single-button dialogs
          window.alert(`${title}\n\n${message}`);
          buttons[0].onPress?.();
        } else {
          // No buttons or more complex case, just show alert
          window.alert(`${title}\n\n${message}`);
        }
        resolve();
      } else {
        // For complex multi-button dialogs, fall back to simple alert
        window.alert(`${title}\n\n${message}`);
        resolve();
      }
    } else {
      // On mobile, use React Native Alert
      Alert.alert(title, message, buttons, { cancelable: true });
      resolve();
    }
  });
};

export const showCrossPlatformConfirm = (
  title: string,
  message: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (Platform.OS === "web") {
      const result = window.confirm(`${title}\n\n${message}`);
      resolve(result);
    } else {
      Alert.alert(title, message, [
        { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
        { text: "OK", onPress: () => resolve(true) },
      ]);
    }
  });
};
