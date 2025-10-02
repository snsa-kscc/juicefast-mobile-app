import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useRef } from "react";
import { getPushToken } from "@/services/messagingService";

interface UsePushTokenStorageOptions {
  skip?: boolean;
}

/**
 * Hook to automatically store push token when user is authenticated
 * This ensures push notifications work immediately after login/signup
 */
export function usePushTokenStorage(options: UsePushTokenStorageOptions = {}) {
  const { user, isLoaded } = useUser();
  const updatePushToken = useMutation(api.users.updatePushToken);
  const clearPushToken = useMutation(api.users.clearPushToken);
  const previousUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    // Check if user has changed (logout/login scenario)
    if (previousUserId.current && previousUserId.current !== user?.id) {
      // Clear previous user's push token for security
      const clearPreviousToken = async () => {
        try {
          if (previousUserId.current) {
            await clearPushToken({ userId: previousUserId.current });
            console.log(
              "Push token cleared for previous user:",
              previousUserId.current
            );
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
      const storePushToken = async () => {
        try {
          const token = await getPushToken();
          if (token) {
            await updatePushToken({
              userId: user.id,
              pushToken: token,
              name:
                user.fullName || user.firstName || user.lastName || undefined,
              role:
                user.unsafeMetadata?.role === "nutritionist"
                  ? "nutritionist"
                  : "user",
            });
            console.log("Push token stored for user:", user.id);
          }
        } catch (error) {
          console.error("Failed to store push token:", error);
          // Don't throw error - authentication should continue even if push token fails
        }
      };

      storePushToken();
    }
  }, [isLoaded, user, updatePushToken, clearPushToken, options.skip]);

  return { isLoaded, user };
}
