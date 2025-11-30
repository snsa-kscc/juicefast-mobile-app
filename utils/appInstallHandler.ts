import { ReferralStorage } from "@/utils/referralStorage";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";

/**
 * Handle app install with referral code
 * This function should be called when the app first launches
 * to check if there's a referral code from the app store or clipboard
 */
export const handleAppInstallWithReferral = async (): Promise<void> => {
  try {
    // First check if app was opened with a deep link containing referral code
    const deepLinkReferral = await getDeepLinkReferral();
    if (deepLinkReferral) {
      await storeInstallReferralCode(deepLinkReferral);
      return;
    }

    // Then check clipboard for referral code (copied from web page)
    const clipboardReferral = await getClipboardReferral();
    if (clipboardReferral) {
      await storeInstallReferralCode(clipboardReferral);
      return;
    }
  } catch (error) {
    console.error("Error handling app install with referral:", error);
  }
};

/**
 * Get referral code from deep link
 * This handles referral codes passed through deep links
 */
const getDeepLinkReferral = async (): Promise<string | null> => {
  try {
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      const url = new URL(initialUrl);
      const referralCode =
        url.searchParams.get("referral") ||
        url.searchParams.get("referrer") ||
        url.searchParams.get("ref");

      if (referralCode) {
        return referralCode;
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting deep link referral:", error);
    return null;
  }
};

/**
 * Get referral code from clipboard
 * This handles referral codes copied from the web referral page
 */
const getClipboardReferral = async (): Promise<string | null> => {
  try {
    const clipboardContent = await Clipboard.getStringAsync();

    if (!clipboardContent || clipboardContent.trim().length === 0) {
      return null;
    }

    // Check if clipboard content looks like a referral code
    // Basic validation: alphanumeric, 3-20 characters
    const referralCode = clipboardContent.trim();
    const referralCodePattern = /^[A-Z0-9]{3,20}$/i;

    if (referralCodePattern.test(referralCode)) {
      return referralCode;
    }

    return null;
  } catch (error) {
    console.error("Error getting clipboard referral:", error);
    return null;
  }
};

/**
 * Store referral code from app store installation
 * This can be called directly when you receive the referral code
 * from the app store installation process
 */
export const storeInstallReferralCode = async (
  referralCode: string
): Promise<void> => {
  try {
    if (referralCode && referralCode.trim().length > 0) {
      await ReferralStorage.storeReferralCode(referralCode.trim());
      console.log("Referral code stored from app install:", referralCode);
    }
  } catch (error) {
    console.error("Error storing install referral code:", error);
    throw error;
  }
};

/**
 * Debug function to test referral storage manually
 * Call this function to verify the referral system works
 */
export const debugReferralSystem = async (): Promise<void> => {
  try {
    console.log("=== Referral System Debug ===");

    // Test storing a referral code
    const testCode = "TEST123";
    await storeInstallReferralCode(testCode);
    console.log("✓ Stored test referral code:", testCode);

    // Test retrieving the referral code
    const retrievedCode = await ReferralStorage.getReferralCode();
    console.log("✓ Retrieved referral code:", retrievedCode);

    // Test checking if referral code exists
    const hasCode = await ReferralStorage.hasReferralCode();
    console.log("✓ Has referral code:", hasCode);

    // Clean up test data
    await ReferralStorage.removeReferralCode();
    const cleanedUp = !(await ReferralStorage.hasReferralCode());
    console.log("✓ Cleanup successful:", cleanedUp);

    console.log("=== Referral System Debug Complete ===");
  } catch (error) {
    console.error("❌ Referral system debug failed:", error);
  }
};
