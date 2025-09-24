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
        console.log('Referral code stored from app install deep link:', referralCode);
        return;
      }
    }

    // Check for iOS App Store referral parameters
    // iOS App Store can pass referral data through the URL scheme or universal links
    const iOSReferralCode = await getIOSAppStoreReferral();
    if (iOSReferralCode) {
      await ReferralStorage.storeReferralCode(iOSReferralCode);
      console.log('Referral code stored from iOS App Store:', iOSReferralCode);
      return;
    }

    // Check for Google Play Store referral parameters
    // Google Play Store can pass referral data through the INSTALL_REFERRER intent
    const androidReferralCode = await getAndroidPlayStoreReferral();
    if (androidReferralCode) {
      await ReferralStorage.storeReferralCode(androidReferralCode);
      console.log('Referral code stored from Google Play Store:', androidReferralCode);
      return;
    }

    console.log('No referral code found from app install sources');
  } catch (error) {
    console.error('Error handling app install with referral:', error);
  }
};

/**
 * Get referral code from iOS App Store installation
 * This handles referral codes passed through iOS App Store campaigns
 */
const getIOSAppStoreReferral = async (): Promise<string | null> => {
  try {
    // iOS App Store can pass referral data through:
    // 1. Custom URL schemes (e.g., juicefast://referral=CODE123)
    // 2. Universal links
    // 3. User Activity from NSUserActivity

    // For now, we'll check the initial URL again with iOS-specific parameters
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      const url = new URL(initialUrl);

      // Check for iOS-specific parameters
      const iOSReferral = url.searchParams.get('ref');
      const campaignReferral = url.searchParams.get('campaign');
      const sourceReferral = url.searchParams.get('source');

      // Return the first valid referral code found
      return iOSReferral || campaignReferral || sourceReferral || null;
    }

    return null;
  } catch (error) {
    console.error('Error getting iOS App Store referral:', error);
    return null;
  }
};

/**
 * Get referral code from Google Play Store installation
 * This handles referral codes passed through Google Play Store install referrals
 */
const getAndroidPlayStoreReferral = async (): Promise<string | null> => {
  try {
    // Android Play Store install referrals come through the INSTALL_REFERRER intent
    // This would typically be handled by a native module that reads the install referrer
    // For now, we'll check if there's a way to access this through React Native

    // Note: Full Android Play Store install referrer handling would require
    // a native module to access the INSTALL_REFERRER broadcast intent
    // For Expo apps, this might need to be handled through a config plugin or custom dev client

    // For now, check if there are any Android-specific parameters in the initial URL
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      const url = new URL(initialUrl);

      // Check for Android-specific parameters
      const androidReferral = url.searchParams.get('referrer');
      const utmSource = url.searchParams.get('utm_source');
      const utmCampaign = url.searchParams.get('utm_campaign');

      // Return the first valid referral code found
      return androidReferral || utmSource || utmCampaign || null;
    }

    return null;
  } catch (error) {
    console.error('Error getting Android Play Store referral:', error);
    return null;
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