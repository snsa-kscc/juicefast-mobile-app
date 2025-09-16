import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSocialSignIn } from "../../hooks/useSocialSignIn";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { signInWithGoogle, signInWithFacebook, signInWithApple } = useSocialSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        <Text className="text-2xl font-bold text-center mb-2">Welcome back</Text>
      </View>

      {/* Error Message */}
      {error ? (
        <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </View>
      ) : null}

      {/* Form */}
      <View className="space-y-4 mb-8">
        <View className="bg-white rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">✉</Text>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email"
            className="flex-1 text-base"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
        </View>

        <View className="bg-white rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">🔒</Text>
          <TextInput
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            className="flex-1 text-base"
            onChangeText={(password) => setPassword(password)}
          />
        </View>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity className="mb-6">
        <Text className="text-gray-500 text-center">Forgot password?</Text>
      </TouchableOpacity>

      {/* Log In Button */}
      <TouchableOpacity onPress={onSignInPress} className={`rounded-full py-4 mb-6 ${isLoading ? "bg-gray-600" : "bg-black"}`} disabled={isLoading}>
        <Text className="text-white text-center font-semibold text-base">{isLoading ? "Signing..." : "Log in"}</Text>
      </TouchableOpacity>

      {/* Social Login Buttons */}
      <View className="space-y-3 mb-8">
        <TouchableOpacity onPress={signInWithFacebook} className="bg-black rounded-full py-4 flex-row items-center justify-center">
          <Text className="text-white mr-2">f</Text>
          <Text className="text-white font-semibold">Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={signInWithApple} className="bg-black rounded-full py-4 flex-row items-center justify-center">
          <Text className="text-white mr-2">🍎</Text>
          <Text className="text-white font-semibold">Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={signInWithGoogle} className="bg-black rounded-full py-4 flex-row items-center justify-center">
          <Text className="text-white mr-2">G</Text>
          <Text className="text-white font-semibold">Google</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <View className="flex-row justify-center">
        <Text className="text-gray-500">Not a member yet? </Text>
        <Link href="/sign-up">
          <Text className="text-black font-semibold">Start your journey</Text>
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}
