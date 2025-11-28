import { useSignIn, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSocialSignIn } from "@/hooks/useSocialSignIn";
import { usePushTokenStorage } from "@/hooks/usePushTokenStorage";
import { ReferralStorage } from "@/utils/referralStorage";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/icons/AuthIcons";
import { getInputFieldPadding } from "@/utils/platformStyles";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { user } = useUser();
  const { signInWithGoogle, signInWithFacebook, signInWithApple } =
    useSocialSignIn();

  // Automatically store push token when user signs in
  usePushTokenStorage({ skip: !user });

  // Handle referral processing for social sign-ins
  const handleSocialSignInComplete = async () => {
    try {
      // For existing users signing in with social, check if profile exists
      if (user) {
        try {
          await ReferralStorage.removeReferralCode();
        } catch (error) {
          console.log("No referral code to remove or error removing:", error);
        }
      }
      router.replace("/onboarding");
    } catch (error) {
      console.error("Error processing social signin:", error);
      router.replace("/onboarding");
    }
  };

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle continue as guest
  const handleContinueAsGuest = () => {
    router.replace("/(tabs)/store");
  };

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded || isLoading) return;

    setIsLoading(true);
    setError(""); // Clear previous errors

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/onboarding");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        setError("Sign in incomplete. Please try again.");
        console.error("Sign in attempt incomplete:", signInAttempt.status);
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error("Sign in error:", err);

      // Extract user-friendly error message
      let errorMessage = "An error occurred during sign in. Please try again.";

      if (err?.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        if (firstError.message) {
          errorMessage = firstError.message;
        } else if (firstError.longMessage) {
          errorMessage = firstError.longMessage;
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-jf-gray pt-20 px-6"
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      {/* Logo */}
      <View className="items-center">
        <View className="w-16 h-16 rounded-2xl items-center justify-center mb-6">
          <Image
            source={require("@/assets/images/jf-picto.png")}
            style={{ width: 128, height: 128 }}
          />
        </View>
        <Text className="text-4xl font-lufga-bold text-center mb-16 mt-14">
          Welcome back
        </Text>
      </View>

      {/* Error Message */}
      {error ? (
        <View className="bg-red-50 border border-red-200 rounded-xl mx-4 py-3 mb-4">
          <Text className="text-red-600 text-sm text-center font-lufga">
            {error}
          </Text>
        </View>
      ) : null}

      {/* Form */}
      <View className="mb-6 px-4">
        <View
          className={`bg-white rounded-2xl border border-gray-200 px-4 ${getInputFieldPadding()} flex-row items-center mb-4`}
        >
          <View className="mr-3">
            <MailIcon />
          </View>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-base text-gray-500 font-lufga"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
        </View>

        <View
          className={`bg-white rounded-2xl border border-gray-200 px-4 ${getInputFieldPadding()} flex-row items-center mb-4`}
        >
          <View className="mr-3">
            <LockIcon />
          </View>
          <TextInput
            value={password}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPassword}
            className="flex-1 text-base text-gray-500 font-lufga"
            onChangeText={(password) => setPassword(password)}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="ml-2"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </TouchableOpacity>
        </View>

        {/* Forgot Password and Log In Button */}
        <View className="flex-row items-center justify-between">
          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity>
              <Text className="text-gray-500 font-lufga underline">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            onPress={onSignInPress}
            className={`rounded-full px-14 py-4 ${isLoading ? "bg-gray-600" : "bg-gray-900"}`}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-lufga-semibold">
              {isLoading ? "Logging in..." : "Log in"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-gray-900 font-lufga text-center my-4">or</Text>

      {/* Social Login Buttons */}
      <View className="mt-2 px-4">
        <TouchableOpacity
          onPress={() => signInWithApple(handleSocialSignInComplete)}
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
          onPress={() => signInWithGoogle(handleSocialSignInComplete)}
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
          onPress={() => signInWithFacebook(handleSocialSignInComplete)}
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
        {/* Continue as Guest Button */}
        <View className="mt-4">
          <TouchableOpacity
            onPress={handleContinueAsGuest}
            className="border border-gray-300 rounded-xl py-4 flex-row items-center justify-center"
          >
            <Text className="text-gray-700 font-lufga-semibold">
              Continue as Guest
            </Text>
          </TouchableOpacity>
          <Text className="text-xs text-gray-500 text-center mt-2 font-lufga">
            Browse the store without creating an account
          </Text>
        </View>
      </View>

      {/* Sign Up Link */}
      <View className="flex-row justify-center mt-12">
        <Text className="text-gray-500 font-lufga">Not a member yet? </Text>
        <Link href="/(auth)/sso-signup">
          <Text className="text-black font-lufga-semibold underline">
            Start your journey
          </Text>
        </Link>
      </View>

      <View className="h-16" />
    </KeyboardAwareScrollView>
  );
}
