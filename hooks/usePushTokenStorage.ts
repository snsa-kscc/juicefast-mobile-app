import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
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

  useEffect(() => {
    if (!isLoaded || !user || options.skip) return;

    const storePushToken = async () => {
      try {
        const token = await getPushToken();
        if (token) {
          await updatePushToken({
            userId: user.id,
            pushToken: token,
            name: user.fullName || user.firstName || user.lastName || undefined,
            role: user.unsafeMetadata?.role === "nutritionist" ? "nutritionist" : "user",
          });
          console.log("Push token stored for user:", user.id);
        }
      } catch (error) {
        console.error("Failed to store push token:", error);
        // Don't throw error - authentication should continue even if push token fails
      }
    };

    storePushToken();
  }, [isLoaded, user, updatePushToken, options.skip]);

  return { isLoaded, user };
}