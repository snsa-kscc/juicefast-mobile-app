import { useRevenueCat } from "@/providers/RevenueCatProvider";
import { useWebSubscription } from "./useWebSubscription";

export function usePaywall() {
  const {
    isSubscribed: isMobileAppSubscribed,
    isLoading: revenueCatLoading,
    restorePurchases,
  } = useRevenueCat();
  const { isPremium: isWooCommerceSubscribed, isLoading: wooCommerceLoading } =
    useWebSubscription();

  const isPremiumOnAnyPlatform =
    isMobileAppSubscribed || isWooCommerceSubscribed;
  const isLoading = revenueCatLoading || wooCommerceLoading;

  return {
    isMobileAppSubscribed,
    isWooCommerceSubscribed,
    isLoading,
    restorePurchases,
    isPremiumOnAnyPlatform,
  };
}
