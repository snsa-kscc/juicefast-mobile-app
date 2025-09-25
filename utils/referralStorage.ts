import * as SecureStore from 'expo-secure-store';

const REFERRAL_CODE_KEY = 'referral_code';

export const ReferralStorage = {
  /**
   * Store referral code securely
   */
  async storeReferralCode(referralCode: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(REFERRAL_CODE_KEY, referralCode);
    } catch (error) {
      console.error('Error storing referral code:', error);
      throw new Error('Failed to store referral code');
    }
  },

  /**
   * Get stored referral code
   */
  async getReferralCode(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFERRAL_CODE_KEY);
    } catch (error) {
      console.error('Error retrieving referral code:', error);
      return null;
    }
  },

  /**
   * Remove stored referral code (for cleanup)
   */
  async removeReferralCode(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(REFERRAL_CODE_KEY);
    } catch (error) {
      console.error('Error removing referral code:', error);
      throw new Error('Failed to remove referral code');
    }
  },

  /**
   * Check if referral code exists
   */
  async hasReferralCode(): Promise<boolean> {
    try {
      const code = await this.getReferralCode();
      return code !== null && code.length > 0;
    } catch (error) {
      console.error('Error checking referral code:', error);
      return false;
    }
  }
};