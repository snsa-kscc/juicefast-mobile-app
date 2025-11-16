import { useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSocialSignIn } from "@/hooks/useSocialSignIn";
import { usePushTokenStorage } from "@/hooks/usePushTokenStorage";
import { ReferralStorage } from "@/utils/referralStorage";
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
      className="flex-1 bg-jf-gray pt-20 px-6"
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      {/* Logo */}
      <View className="items-center">
        <View className="w-16 h-16 bg-black rounded-2xl items-center justify-center mb-6">
          <Image
            source={require("@/assets/images/jf-picto.png")}
            className="w-24 h-24 rounded-xl"
          />
        </View>
        <Text className="text-4xl font-lufga-bold text-center mb-16 mt-14">
          Become the best version of yourself
        </Text>
      </View>

      {/* Continue with Email Button */}
      <TouchableOpacity
        onPress={() => router.push("/(auth)/email-signup")}
        className="mb-4"
      >
        <Text className="text-gray-900 text-center font-lufga-semibold underline">
          Sign up with email
        </Text>
      </TouchableOpacity>

      <Text className="text-gray-900 font-lufga text-center mb-4">or</Text>

      {/* Social Login Buttons */}
      <View className="mt-2 px-4">
        <TouchableOpacity
          onPress={() => signInWithApple()}
          className="bg-gray-900 rounded-xl py-4 flex-row items-center mb-4"
        >
          <Image
            source={require("@/assets/images/socials/apple.png")}
            className="w-6 h-6 ml-14"
          />
          <Text className="text-white font-lufga-semibold ml-8">
            Continue with Apple
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signInWithGoogle()}
          className="bg-gray-900 rounded-xl py-4 flex-row items-center mb-4"
        >
          <Image
            source={require("@/assets/images/socials/google.png")}
            className="w-6 h-6 ml-14"
          />
          <Text className="text-white font-lufga-semibold ml-8">
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* Facebook sign-in - commented out */}
        {/* <TouchableOpacity
          onPress={() => signInWithFacebook()}
          className="bg-gray-900 rounded-xl py-4 flex-row items-center"
        >
          <Image
            source={require("@/assets/images/socials/fb.png")}
            className="w-6 h-6 ml-14"
          />
          <Text className="text-white font-lufga-semibold ml-8">
            Continue with Facebook
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* Terms Text */}
      <View className="my-12">
        <Text className="text-xs text-black text-center mb-0 font-lufga">
          By joining, you&apos;re cool with our{" "}
          <Link href="/terms">
            <Text className="underline">Terms</Text>
          </Link>{" "}
          and{" "}
          <Link href="/privacy">
            <Text className="underline">Privacy Policy</Text>
          </Link>
          .
        </Text>
        <Text className="text-xs text-black text-center font-lufga">
          Respect, privacy, and good vibes only.
        </Text>
      </View>

      {/* Sign In Link */}
      <View className="flex-row justify-center">
        <Text className="text-black font-lufga-semibold">
          Already have an account?{" "}
        </Text>
        <Link href="/(auth)/sign-in">
          <Text className="text-black font-lufga-semibold underline">
            Log in
          </Text>
        </Link>
      </View>
      <View className="h-24"></View>
    </KeyboardAwareScrollView>
  );
}
