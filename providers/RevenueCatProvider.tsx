import React, { createContext, useContext, useEffect, useState } from "react";
import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
  LOG_LEVEL,
} from "react-native-purchases";
import { Platform } from "react-native";
import { useUser } from "@clerk/clerk-expo";

// DEBUG: Set to true to bypass subscription check and always have premium access
const PREMIUM_ACCESS_DEBUG = false;

interface RevenueCatContextType {
  isSubscribed: boolean;
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
  offerings: PurchasesOfferings | null;
  restorePurchases: () => Promise<void>;
  purchasePackage: (
    pkg: PurchasesPackage
  ) => Promise<{ customerInfo: CustomerInfo; success: boolean }>;
  simulateNoSubscription: () => void; // Debug helper
}

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(
  undefined
);

export function RevenueCatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeRevenueCat();
  }, [user?.id]); // Re-initialize when user changes

  const initializeRevenueCat = async () => {
    try {
      Purchases.setLogLevel(LOG_LEVEL.ERROR); // Only show errors, not debug/info logs

      // Get the appropriate API key for the platform
      let apiKey: string | null = null;
      switch (Platform.OS) {
        case "ios":
          apiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? null;
          break;
        case "android":
          apiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? null;
          break;
        default:
          apiKey = null;
          break;
      }

      if (!apiKey) {
        console.log("RevenueCat not configured for this platform");
        setIsLoading(false);
        return;
      }

      // Configure RevenueCat
      Purchases.configure({ apiKey });

      // Login user with Clerk ID if available
      if (user?.id) {
        await Purchases.logIn(user.id);
      }

      // Get initial customer info
      const info = await Purchases.getCustomerInfo();
      updateCustomerInfo(info);

      // Get offerings
      const fetchedOfferings = await Purchases.getOfferings();
      setOfferings(fetchedOfferings);
    } catch (error) {
      console.error("Error initializing RevenueCat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCustomerInfo = (info: CustomerInfo) => {
    setCustomerInfo(info);
    // Check if user has any active entitlements
    const hasActiveSubscription =
      Object.keys(info.entitlements.active).length > 0;

    // DEBUG: Force premium access in development if flag is enabled
    if (__DEV__ && PREMIUM_ACCESS_DEBUG) {
      console.log(
        "[DEBUG] Forcing premium access (PREMIUM_ACCESS_DEBUG = true)"
      );
      setIsSubscribed(true);
    } else {
      setIsSubscribed(hasActiveSubscription);
    }
  };

  const restorePurchases = async () => {
    try {
      const info = await Purchases.restorePurchases();
      updateCustomerInfo(info);
    } catch (error) {
      console.error("Error restoring purchases:", error);
      throw error;
    }
  };

  const purchasePackage = async (pkg: PurchasesPackage) => {
    try {
      console.log("Starting purchase for package:", pkg.identifier);
      const { customerInfo: info } = await Purchases.purchasePackage(pkg);
      console.log("Purchase successful!", {
        userId: info.originalAppUserId,
        entitlements: Object.keys(info.entitlements.active),
        activeSubscriptions: info.activeSubscriptions,
      });
      updateCustomerInfo(info);
      return { customerInfo: info, success: true };
    } catch (error: any) {
      console.error("Error purchasing package:", error);
      // Check if user cancelled
      if (error.userCancelled) {
        console.log("User cancelled purchase");
        return { customerInfo: customerInfo!, success: false };
      }
      throw error;
    }
  };

  // Debug helper to simulate no subscription state
  const simulateNoSubscription = () => {
    console.log("[DEBUG] Simulating no subscription state");
    setIsSubscribed(false);
  };

  return (
    <RevenueCatContext.Provider
      value={{
        isSubscribed,
        customerInfo,
        isLoading,
        offerings,
        restorePurchases,
        purchasePackage,
        simulateNoSubscription,
      }}
    >
      {children}
    </RevenueCatContext.Provider>
  );
}

export function useRevenueCat() {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error("useRevenueCat must be used within a RevenueCatProvider");
  }
  return context;
}
