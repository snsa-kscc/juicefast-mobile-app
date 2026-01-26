import { useRevenueCat } from "@/providers/RevenueCatProvider";
import { useWebSubscription } from "./useWebSubscription";
import { useUser } from "@clerk/clerk-expo";

export function usePaywall() {
  const { user } = useUser();
  const {
    isSubscribed: isMobileAppSubscribed,
    isLoading: revenueCatLoading,
    restorePurchases,
  } = useRevenueCat();
  const { isPremium: isWooCommerceSubscribed, isLoading: wooCommerceLoading } =
    useWebSubscription();

  const isPremiumFromClerk = user?.unsafeMetadata?.role === "pro";

  const isPremiumOnAnyPlatform =
    isMobileAppSubscribed || isWooCommerceSubscribed || isPremiumFromClerk;
  const isLoading = revenueCatLoading || wooCommerceLoading;

  return {
    isMobileAppSubscribed,
    isWooCommerceSubscribed,
    isLoading,
    restorePurchases,
    isPremiumOnAnyPlatform,
  };
}
