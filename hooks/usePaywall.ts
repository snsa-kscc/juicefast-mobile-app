import { useRevenueCat } from "@/providers/RevenueCatProvider";

export function usePaywall() {
  const { isSubscribed, isLoading, restorePurchases } = useRevenueCat();

  return {
    isSubscribed,
    isLoading,
    restorePurchases,
    isPremium: isSubscribed,
  };
}
