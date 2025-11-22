import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

interface SubscriptionStatus {
  isActive: boolean;
  plan?: "monthly" | "yearly";
  expiryDate?: string;
  subscriptionId?: number;
  timestamp: number;
}

const CACHE_KEY = "subscription_status";
const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes

export const useWebSubscription = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(
    null
  );

  const email = user?.primaryEmailAddress?.emailAddress;

  const checkStatus = async (forceRefresh = false) => {
    if (!email) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      if (!forceRefresh) {
        const cached = storage.getString(`${CACHE_KEY}_${email}`);
        if (cached) {
          const parsedCache: SubscriptionStatus = JSON.parse(cached);
          const age = Date.now() - parsedCache.timestamp;

          if (age < CACHE_DURATION) {
            setSubscription(parsedCache);
            setIsLoading(false);
            return;
          }
        }
      }

      const response = await fetch(
        `/api/web-subscription?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();

      const subscriptionData: SubscriptionStatus = {
        ...data,
        timestamp: Date.now(),
      };

      storage.set(`${CACHE_KEY}_${email}`, JSON.stringify(subscriptionData));

      setSubscription(subscriptionData);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscription({
        isActive: false,
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [email]);

  const refreshSubscription = () => checkStatus(true);

  const getCacheAge = () => {
    if (!subscription?.timestamp) return null;
    return Date.now() - subscription.timestamp;
  };

  const clearCache = () => {
    if (email) {
      storage.remove(`${CACHE_KEY}_${email}`);
    }
  };

  return {
    isPremium: subscription?.isActive ?? false,
    plan: subscription?.plan,
    expiryDate: subscription?.expiryDate,
    subscriptionId: subscription?.subscriptionId,
    isLoading,
    cacheAge: getCacheAge(),
    refreshSubscription,
    clearCache,
  };
};
