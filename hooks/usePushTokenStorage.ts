import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
import { getPushToken } from "@/services/messagingService";

interface UsePushTokenStorageOptions {
  skip?: boolean;
}

/**
 * Hook to automatically store push token when user is authenticated
 * This ensures push notifications work immediately after login/signup
 * Also monitors permission changes and updates token when user enables notifications
 */
export function usePushTokenStorage(options: UsePushTokenStorageOptions = {}) {
  const { user, isLoaded } = useUser();
  const updatePushToken = useMutation(api.users.updatePushToken);
  const clearPushToken = useMutation(api.users.clearPushToken);
  const previousUserId = useRef<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  // Helper function to store push token
  const storePushToken = async () => {
    if (!user) return;

    try {
      const token = await getPushToken();
      if (token) {
        await updatePushToken({
          userId: user.id,
          pushToken: token,
          name: user.fullName || user.firstName || user.lastName || undefined,
          role:
            user.unsafeMetadata?.role === "nutritionist" ||
            user.unsafeMetadata?.role === "admin"
              ? "nutritionist"
              : "user",
        });
      }
    } catch (error) {
      console.error("Failed to store push token:", error);
      // Don't throw error - authentication should continue even if push token fails
    }
  };

  // Initial token storage on authentication
  useEffect(() => {
    if (!isLoaded) return;

    // Check if user has changed (logout/login scenario)
    if (previousUserId.current && previousUserId.current !== user?.id) {
      // Clear previous user's push token for security
      const clearPreviousToken = async () => {
        try {
          if (previousUserId.current) {
            await clearPushToken({ userId: previousUserId.current });
          }
        } catch (error) {
          console.error("Failed to clear previous push token:", error);
        }
      };

      clearPreviousToken();
    }

    // Update previous user ID
    previousUserId.current = user?.id || null;

    // Store push token for current user
    if (user && !options.skip) {
      storePushToken();
    }
  }, [isLoaded, user, updatePushToken, clearPushToken, options.skip]);

  // Monitor permission changes when app comes to foreground
  useEffect(() => {
    if (!user || options.skip) return;

    const checkPermissionChange = async () => {
      try {
        const { status } = await Notifications.getPermissionsAsync();

        // If permission changed from denied/undetermined to granted, store token
        if (
          permissionStatus !== null &&
          permissionStatus !== "granted" &&
          status === "granted"
        ) {
          await storePushToken();
        }

        setPermissionStatus(status);
      } catch (error) {
        console.error("Failed to check permission status:", error);
      }
    };

    // Check initial permission status
    checkPermissionChange();

    // Listen for app state changes (when user returns from Settings)
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkPermissionChange();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [user, options.skip, permissionStatus]);

  return { isLoaded, user };
}
