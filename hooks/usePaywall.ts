import { useRevenueCat } from "@/providers/RevenueCatProvider";
import { useSubscription } from "./useSubscription";

export function usePaywall() {
  const { isSubscribed, isLoading: revenueCatLoading, restorePurchases } = useRevenueCat();
  const { isPremium: isWooCommerceSubscribed, isLoading: wooCommerceLoading } = useSubscription();

  const isPremium = isSubscribed || isWooCommerceSubscribed;
  const isLoading = revenueCatLoading || wooCommerceLoading;

  return {
    isSubscribed: isPremium,
    isLoading,
    restorePurchases,
    isPremium,
  };
}
