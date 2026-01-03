import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MailIcon, LockIcon } from "@/components/icons/AuthIcons";
import { getInputFieldPadding } from "@/utils/platformStyles";

export default function ForgotPasswordPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Send the password reset code to the user's email
  const onSendResetCode = async () => {
    if (!isLoaded || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      console.error("Error sending reset code:", err);

      let errorMessage = "Failed to send reset code. Please try again.";
      if (err?.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        errorMessage =
          firstError.longMessage || firstError.message || errorMessage;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the user's password
  const onResetPassword = async () => {
    if (!isLoaded || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "needs_second_factor") {
        setError("2FA is required. Please contact support.");
      } else if (result.status === "complete") {
        // Set the active session and redirect
        await setActive({ session: result.createdSessionId });
        router.replace("/onboarding");
      } else {
        setError("Password reset incomplete. Please try again.");
        console.error("Reset attempt incomplete:", result.status);
      }
    } catch (err: any) {
      console.error("Error resetting password:", err);

      let errorMessage = "Failed to reset password. Please try again.";
      if (err?.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        errorMessage =
          firstError.longMessage || firstError.message || errorMessage;
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
            className="w-32 h-32"
          />
        </View>
        <Text className="text-4xl font-lufga-bold text-center mb-4 mt-14">
          {!successfulCreation ? "Forgot Password?" : "Reset Password"}
        </Text>
        <Text className="text-gray-500 font-lufga text-center mb-8 px-4">
          {!successfulCreation
            ? "Enter your email and we'll send you a code to reset your password"
            : "Enter the code sent to your email and your new password"}
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
        {!successfulCreation ? (
          <>
            {/* Email Input */}
            <View
              className={`bg-white rounded-2xl border border-gray-200 px-4 ${getInputFieldPadding()} flex-row items-center mb-6`}
            >
              <View className="mr-3">
                <MailIcon />
              </View>
              <TextInput
                autoCapitalize="none"
                value={email}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-base text-gray-500 font-lufga"
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            {/* Send Code Button */}
            <TouchableOpacity
              onPress={onSendResetCode}
              className={`rounded-full py-4 ${isLoading ? "bg-gray-600" : "bg-gray-900"}`}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-lufga-semibold">
                {isLoading ? "Sending..." : "Send Reset Code"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Code Input */}
            <View
              className={`bg-white rounded-2xl border border-gray-200 px-4 ${getInputFieldPadding()} flex-row items-center mb-4`}
            >
              <View className="mr-3">
                <LockIcon />
              </View>
              <TextInput
                value={code}
                placeholder="Reset Code"
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-base text-gray-500 font-lufga"
                onChangeText={setCode}
                keyboardType="number-pad"
              />
            </View>

            {/* New Password Input */}
            <View
              className={`bg-white rounded-2xl border border-gray-200 px-4 ${getInputFieldPadding()} flex-row items-center mb-6`}
            >
              <View className="mr-3">
                <LockIcon />
              </View>
              <TextInput
                value={password}
                placeholder="New Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={true}
                className="flex-1 text-base text-gray-500 font-lufga"
                onChangeText={setPassword}
              />
            </View>

            {/* Reset Password Button */}
            <TouchableOpacity
              onPress={onResetPassword}
              className={`rounded-full py-4 ${isLoading ? "bg-gray-600" : "bg-gray-900"}`}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-lufga-semibold">
                {isLoading ? "Resetting..." : "Reset Password"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Back to Sign In Link */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="items-center mt-8"
      >
        <Text className="text-gray-900 font-lufga-semibold underline">
          Back to Sign In
        </Text>
      </TouchableOpacity>

      {/* Android Navigation Bar Spacer */}
      {Platform.OS === "android" && <View className="h-16" />}
    </KeyboardAwareScrollView>
  );
}
