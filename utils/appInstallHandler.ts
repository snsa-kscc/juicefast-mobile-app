import { ReferralStorage } from './referralStorage';
import * as Linking from 'expo-linking';

/**
 * Handle app install with referral code
 * This function should be called when the app first launches
 * to check if there's a referral code from the app store
 */
export const handleAppInstallWithReferral = async (): Promise<void> => {
  try {
    // Check if app was opened with a deep link containing referral code
    const initialUrl = await Linking.getInitialURL();

    if (initialUrl) {
      // Parse the URL to extract referral code
      const url = new URL(initialUrl);
      const referralCode = url.searchParams.get('referral');

      if (referralCode) {
        // Store the referral code securely
        await ReferralStorage.storeReferralCode(referralCode);
        console.log('Referral code stored from app install:', referralCode);
      }
    }
  } catch (error) {
    console.error('Error handling app install with referral:', error);
  }
};

/**
 * Store referral code from app store installation
 * This can be called directly when you receive the referral code
 * from the app store installation process
 */
export const storeInstallReferralCode = async (referralCode: string): Promise<void> => {
  try {
    if (referralCode && referralCode.trim().length > 0) {
      await ReferralStorage.storeReferralCode(referralCode.trim());
      console.log('Referral code stored from app install:', referralCode);
    }
  } catch (error) {
    console.error('Error storing install referral code:', error);
    throw error;
  }
};