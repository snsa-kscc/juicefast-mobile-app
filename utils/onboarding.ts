import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ReferralStorage } from "./referralStorage";
import { generateReferralCode } from "./referral";
import * as SecureStore from "expo-secure-store";

export const useOnboardingCompletion = () => {
  const { user } = useUser();
  const router = useRouter();
  const createOrUpdateUserProfile = useMutation(api.userProfile.createOrUpdate);
  const incrementReferralCount = useMutation(
    api.userProfile.incrementReferralCount
  );

  const markOnboardingCompleted = async () => {
    if (!user) return;

    try {
      // Process referral code and create user profile
      await processOnboardingCompletion(user);

      // Update Clerk metadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: "user",
          onboardingCompleted: true,
        },
      });
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      throw error;
    }
  };

  const processOnboardingCompletion = async (user: any) => {
    try {
      // Get stored referral code from SecureStore
      const storedReferralCode = await ReferralStorage.getReferralCode();

      // Generate unique referral code for the new user
      const userFullName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim();
      const newReferralCode = generateReferralCode(userFullName);

      // Create user profile with referral data
      await createOrUpdateUserProfile({
        referralCode: newReferralCode,
        referredBy: storedReferralCode || undefined,
        referralCount: 0,
      });

      // Handle referral count increment if there was a referrer
      if (storedReferralCode) {
        try {
          await incrementReferralCount({ referralCode: storedReferralCode });
          console.log(
            "Referral count incremented for code:",
            storedReferralCode
          );
        } catch (referralError) {
          console.error("Error incrementing referral count:", referralError);
          // Don't fail the whole process if referral increment fails
        }
      }

      // Clear stored referral code after successful processing
      if (storedReferralCode) {
        await ReferralStorage.removeReferralCode();
      }

      console.log("Onboarding completion processed successfully");
    } catch (error) {
      console.error("Error processing onboarding completion:", error);
      throw error;
    }
  };

  const isOnboardingCompleted = () => {
    return user?.unsafeMetadata?.onboardingCompleted === true;
  };

  const redirectAfterAuth = () => {
    // Wait for user to be loaded before checking onboarding status
    if (!user) {
      setTimeout(() => redirectAfterAuth(), 100);
      return;
    }

    if (isOnboardingCompleted()) {
      router.replace("/(tabs)");
    } else {
      router.replace("/onboarding");
    }
  };

  return {
    markOnboardingCompleted,
    isOnboardingCompleted,
    redirectAfterAuth,
  };
};
