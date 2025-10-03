import { useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useRef, useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSocialSignIn } from "../../hooks/useSocialSignIn";
import { usePushTokenStorage } from "../../hooks/usePushTokenStorage";
import { ReferralStorage } from "../../utils/referralStorage";
import { Image } from "react-native";

export default function SSOSignUpScreen() {
  const router = useRouter();
  const { signInWithGoogle, signInWithFacebook, signInWithApple } =
    useSocialSignIn();
  const { user, isLoaded } = useUser();

  // Automatically store push token when user signs up
  usePushTokenStorage({ skip: !user });

  // Track if we've already processed this user to avoid duplicate processing
  const processedUserRef = useRef<string | null>(null);

  // Log any existing referral code for debugging
  useEffect(() => {
    const logExistingReferralCode = async () => {
      try {
        const storedCode = await ReferralStorage.getReferralCode();
        if (storedCode) {
          console.log(
            "SSO Signup: Found existing referral code in SecureStore:",
            storedCode
          );
        }
      } catch (error) {
        console.error("Error checking existing referral code:", error);
      }
    };

    logExistingReferralCode();
  }, []);

  // Handle redirect after SSO authentication
  const handleSocialSignupComplete = useCallback(
    async (userId: string) => {
      console.log("Processing social signup for user:", userId);

      // Prevent duplicate processing
      if (processedUserRef.current === userId) {
        console.log("User already processed, skipping");
        return;
      }

      // Log that we're proceeding to onboarding (referral code should already be stored from app install)
      const storedCode = await ReferralStorage.getReferralCode();
      if (storedCode) {
        console.log(
          "SSO user proceeding to onboarding with stored referral code:",
          storedCode
        );
      } else {
        console.log("SSO user proceeding to onboarding without referral code");
      }

      // Mark this user as processed
      processedUserRef.current = userId;

      console.log("Social signup processing completed successfully");
      router.replace("/onboarding");
    },
    [router]
  );

  // useEffect to handle user state changes after SSO
  useEffect(() => {
    // Only process if user is loaded, exists, and hasn't been processed yet
    if (isLoaded && user && processedUserRef.current !== user.id) {
      console.log("User detected after SSO, processing...");
      handleSocialSignupComplete(user.id);
    }
  }, [isLoaded, user, handleSocialSignupComplete]); // Dependencies: when user loads or changes

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
          <Image
            source={require("../../assets/images/jf-picto.png")}
            className="w-32 h-32 rounded-xl"
          />
        </View>
        <Text className="text-2xl font-bold text-center mb-2">
          Become the best version of yourself
        </Text>
      </View>

      {/* Continue with Email Button */}
      <TouchableOpacity
        onPress={() => router.push("/(auth)/email-signup")}
        className="py-4 mb-8"
      >
        <Text className="text-gray-900 text-center font-semibold underline">
          Sign up with email
        </Text>
      </TouchableOpacity>

      <Text className="text-gray-900 text-center mb-6">or</Text>

      {/* Social Login Buttons */}
      <View className="mb-8 mt-4">
        <TouchableOpacity
          onPress={() => signInWithGoogle()}
          className="bg-gray-900 rounded-full py-4 flex-row items-center justify-center mb-3"
        >
          <Text className="text-white mr-2">G</Text>
          <Text className="text-white font-semibold">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signInWithFacebook()}
          className="bg-gray-900 rounded-full py-4 flex-row items-center justify-center mb-3"
        >
          <Text className="text-white mr-2">f</Text>
          <Text className="text-white font-semibold">
            Continue with Facebook
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signInWithApple()}
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
      <View className="mb-6">
        <Text className="text-xs text-gray-500 text-center mb-0">
          By joining, you&apos;re cool with our{" "}
          <Link href="/terms">
            <Text className="text-blue-600">Terms</Text>
          </Link>{" "}
          and{" "}
          <Link href="/privacy">
            <Text className="text-blue-600">Privacy Policy</Text>
          </Link>
        </Text>
        <Text className="text-xs text-gray-500 text-center mt-2">
          Respect, privacy, and good vibes only
        </Text>
      </View>

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
