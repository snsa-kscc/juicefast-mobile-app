import { Link, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSocialSignIn } from "../../hooks/useSocialSignIn";
import { useUser } from "@clerk/clerk-expo";
import { ReferralStorage } from "../../utils/referralStorage";
import { generateReferralCode } from "../../utils/referral";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";


export default function SSOSignUpScreen() {
  const router = useRouter();
  const { signInWithGoogle, signInWithFacebook, signInWithApple } = useSocialSignIn();
  const createOrUpdateUserProfile = useMutation(api.userProfile.createOrUpdate);
  const incrementReferralCount = useMutation(api.userProfile.incrementReferralCount);
  const getByReferralCode = useQuery(api.userProfile.getByReferralCode, { referralCode: "" });

  // Handle referral processing for social sign-ins
  const handleSocialSignupComplete = async () => {
    const { user } = useUser();
    if (!user) return;

    try {
      // Get referral code from secure storage
      const storedReferralCode = await ReferralStorage.getReferralCode();

      // Generate unique referral code for the new user
      const userFullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      const newReferralCode = generateReferralCode(userFullName);

      // Create user profile with referral data
      await createOrUpdateUserProfile({
        userID: user.id,
        referralCode: newReferralCode,
        referredBy: storedReferralCode || undefined,
        referralCount: 0,
      });

      // Increment referral count for the referrer if a valid referral code was used
      if (storedReferralCode) {
        const referralData = useQuery(api.userProfile.getByReferralCode, { referralCode: storedReferralCode });
        if (referralData) {
          await incrementReferralCount({ userID: referralData.userID });
        }
      }

      // Clear stored referral code after successful signup
      if (storedReferralCode) {
        await ReferralStorage.removeReferralCode();
      }

      router.replace("/onboarding");
    } catch (error) {
      console.error('Error processing social signup:', error);
      router.replace("/onboarding");
    }
  };

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
      <TouchableOpacity
        onPress={() => router.push("/(auth)/email-signup")}
        className="py-4 mb-8"
      >
        <Text className="text-gray-900 text-center font-semibold underline">Sign up with email</Text>
      </TouchableOpacity>

      <Text className="text-gray-900 text-center mb-6">or</Text>

      {/* Social Login Buttons */}
      <View className="space-y-3 mb-8 mt-4">
        <TouchableOpacity
          onPress={() => signInWithGoogle(handleSocialSignupComplete)}
          className="bg-gray-900 rounded-full py-4 flex-row items-center justify-center"
        >
          <Text className="text-white mr-2">G</Text>
          <Text className="text-white font-semibold">Continue with Google</Text>
        </TouchableOpacity>
  
        <TouchableOpacity
          onPress={() => signInWithFacebook(handleSocialSignupComplete)}
          className="bg-gray-900 rounded-full py-4 flex-row items-center justify-center"
        >
          <Text className="text-white mr-2">f</Text>
          <Text className="text-white font-semibold">Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signInWithApple(handleSocialSignupComplete)}
          className="bg-gray-900 rounded-full py-4 flex-row items-center justify-center"
        >
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