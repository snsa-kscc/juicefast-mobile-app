import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export const useOnboardingCompletion = () => {
  const { user } = useUser();
  const router = useRouter();

  const markOnboardingCompleted = async () => {
    if (!user) return;
    
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          onboardingCompleted: true
        }
      });
    } catch (error) {
      console.error('Failed to update onboarding status:', error);
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
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  };

  return {
    markOnboardingCompleted,
    isOnboardingCompleted,
    redirectAfterAuth
  };
};