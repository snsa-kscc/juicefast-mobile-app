import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { ReferralStorage } from "@/utils/referralStorage";
import { generateReferralCode } from "@/utils/referral";

/**
 * Helper functions for authentication and onboarding flows
 */

/**
 * Completes onboarding by updating user metadata and creating profile
 */
export const completeOnboarding = async ({
  userId,
  firstName,
  lastName,
}: {
  userId: string;
  firstName?: string;
  lastName?: string;
}) => {
  try {
    // Get stored referral code from SecureStore
    const storedReferralCode = await ReferralStorage.getReferralCode();

    // Generate new referral code for the user
    const userFullName = `${firstName || ""} ${lastName || ""}`.trim();
    const newReferralCode = generateReferralCode(userFullName);

    // Create user profile with referral data
    // This will be called from the onboarding component using Convex mutation
    return {
      referralCode: newReferralCode,
      referredBy: storedReferralCode || undefined,
      shouldIncrementReferralCount: !!storedReferralCode,
    };
  } catch (error) {
    console.error("Error in completeOnboarding:", error);
    throw error;
  }
};

/**
 * Hook to check if user has completed onboarding
 */
export const useOnboardingStatus = () => {
  const { isLoaded, user } = useUser();

  const hasCompletedOnboarding =
    user?.unsafeMetadata?.onboardingCompleted === true;
  const userRole = user?.unsafeMetadata?.role as string | undefined;

  return {
    hasCompletedOnboarding,
    userRole,
    isLoading: !isLoaded, // Loading until we have user data
  };
};

/**
 * Hook to get user's referral data from SecureStore
 */
export const useStoredReferralData = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReferralCode = async () => {
      try {
        const code = await ReferralStorage.getReferralCode();
        setReferralCode(code);
      } catch (error) {
        console.error("Error loading referral code:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReferralCode();
  }, []);

  return {
    referralCode,
    isLoading,
    clearReferralCode: async () => {
      try {
        await ReferralStorage.removeReferralCode();
        setReferralCode(null);
      } catch (error) {
        console.error("Error clearing referral code:", error);
      }
    },
  };
};

/**
 * Validates referral code against Convex database
 */
export const useReferralCodeValidation = (referralCode: string) => {
  return useQuery(
    api.userProfile.getByReferralCode,
    referralCode.trim() ? { referralCode: referralCode.trim() } : "skip"
  );
};
