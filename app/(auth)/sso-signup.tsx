import { useUser } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { api } from "../../convex/_generated/api";
import { useSocialSignIn } from "../../hooks/useSocialSignIn";
import { generateReferralCode } from "../../utils/referral";
import { ReferralStorage } from "../../utils/referralStorage";

export default function SSOSignUpScreen() {
  const router = useRouter();
  const { signInWithGoogle, signInWithFacebook, signInWithApple } = useSocialSignIn();
  const createOrUpdateUserProfile = useMutation(api.userProfile.createOrUpdate);
  const incrementReferralCount = useMutation(api.userProfile.incrementReferralCount);
  const { user, isLoaded } = useUser();

  // Track if we've already processed this user to avoid duplicate processing
  const processedUserRef = useRef<string | null>(null);

  // Handle referral processing for social sign-ins
  const handleSocialSignupComplete = async (userId: string) => {
    console.log("Processing social signup for user:", userId);

    // Prevent duplicate processing
    if (processedUserRef.current === userId) {
      console.log("User already processed, skipping");
      return;
    }

    try {
      // Get referral code from secure storage
      const storedReferralCode = await ReferralStorage.getReferralCode();

      // Generate unique referral code for the new user
      const userFullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
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
          console.log("Referral count incremented for code:", storedReferralCode);
        } catch (referralError) {
          console.error("Error incrementing referral count:", referralError);
          // Don't fail the whole process if referral increment fails
        }
      }

      // Clear stored referral code after successful signup
      if (storedReferralCode) {
        await ReferralStorage.removeReferralCode();
      }

      // Mark this user as processed
      processedUserRef.current = userId;

      console.log("Social signup processing completed successfully");
      router.replace("/onboarding");
    } catch (error) {
      console.error("Error processing social signup:", error);
      router.replace("/onboarding");
    }
  };

  // useEffect to handle user state changes after SSO
  useEffect(() => {
    // Only process if user is loaded, exists, and hasn't been processed yet
    if (isLoaded && user && processedUserRef.current !== user.id) {
      console.log("User detected after SSO, processing...");
      handleSocialSignupComplete(user.id);
    }
  }, [isLoaded, user]); // Dependencies: when user loads or changes

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-amber-50"
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 64 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      {/* Logo */}
      <View className="items-center mb-8">
        <View className="w-16 h-16 bg-black rounded-2xl items-center justify-center mb-6">
          <Text className="text-white text-2xl font-bold">J</Text>
        </View>
        <Text className="text-2xl font-bold text-center mb-2">Become the best version of yourself</Text>
      </View>

      {/* Continue with Email Button */}
      <TouchableOpacity onPress={() => router.push("/(auth)/email-signup")} className="py-4 mb-8">
        <Text className="text-gray-900 text-center font-semibold underline">Sign up with email</Text>
      </TouchableOpacity>

      <Text className="text-gray-900 text-center mb-6">or</Text>

      {/* Social Login Buttons */}
      <View className="space-y-3 mb-8 mt-4">
        <TouchableOpacity onPress={() => signInWithGoogle()} className="bg-gray-900 rounded-full py-4 flex-row items-center justify-center">
          <Text className="text-white mr-2">G</Text>
          <Text className="text-white font-semibold">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => signInWithFacebook()} className="bg-gray-900 rounded-full py-4 flex-row items-center justify-center">
          <Text className="text-white mr-2">f</Text>
          <Text className="text-white font-semibold">Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => signInWithApple()} className="bg-gray-900 rounded-full py-4 flex-row items-center justify-center">
          <Text className="text-white mr-2">🍎</Text>
          <Text className="text-white font-semibold">Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View className="flex-row items-center mb-8">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="text-gray-500 mx-4">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Terms Text */}
      <Text className="text-xs text-gray-500 text-center mb-0">
        By joining, you're cool with our
        <Text className="text-blue-600"> Terms</Text> and <Text className="text-blue-600">Privacy Policy</Text>
      </Text>
      <Text className="text-xs text-gray-500 text-center mb-6">Respect, privacy, and good vibes only</Text>

      {/* Sign In Link */}
      <View className="flex-row justify-center">
        <Text className="text-gray-500">Already have an account? </Text>
        <Link href="/(auth)/sign-in">
          <Text className="text-black font-semibold">Log in</Text>
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}
