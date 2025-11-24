import { generateAPIUrl } from "@/utils";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";

interface SubscriptionStatus {
  isActive: boolean;
  plan?: "monthly" | "yearly";
  expiryDate?: string;
  subscriptionId?: number;
}

// Simple in-memory cache that clears when app closes
const sessionCache = new Map<string, SubscriptionStatus>();

export const useWebSubscription = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(
    null
  );

  const email = user?.primaryEmailAddress?.emailAddress;

  const checkStatus = async () => {
    if (!email) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const cached = sessionCache.get(email);
      if (cached) {
        setSubscription(cached);
        setIsLoading(false);
        return;
      }
      const response = await fetch(
        generateAPIUrl(
          `/api/web-subscription?email=${encodeURIComponent(email)}`
        )
      );
      const data = await response.json();

      sessionCache.set(email, data);
      setSubscription(data);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscription({
        isActive: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [email]);

  const refreshSubscription = () => checkStatus();

  const clearCache = () => {
    if (email) {
      sessionCache.delete(email);
    }
  };

  return {
    isPremium: subscription?.isActive ?? false,
    plan: subscription?.plan,
    expiryDate: subscription?.expiryDate,
    subscriptionId: subscription?.subscriptionId,
    isLoading,
    refreshSubscription,
    clearCache,
  };
};
