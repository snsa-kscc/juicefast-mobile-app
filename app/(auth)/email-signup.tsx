import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSignUp } from "@clerk/clerk-expo";
import { ReferralStorage } from "../../utils/referralStorage";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { usePushTokenStorage } from "../../hooks/usePushTokenStorage";

export default function EmailSignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Automatically store push token when user signs up and signs in
  usePushTokenStorage();
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const referralData = useQuery(
    api.userProfile.getByReferralCode,
    referralCodeInput.trim()
      ? { referralCode: referralCodeInput.trim() }
      : "skip",
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verificationError, setVerificationError] = useState("");

  // Load referral code from secure storage on component mount
  React.useEffect(() => {
    const loadReferralCode = async () => {
      try {
        const storedCode = await ReferralStorage.getReferralCode();
        if (storedCode) {
          setReferralCodeInput(storedCode);
        }
      } catch (error) {
        console.error("Error loading referral code:", error);
      }
    };

    loadReferralCode();
  }, []);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded || isLoading) return;

    // Validate referral code if provided
    if (referralCodeInput.trim()) {
      if (referralData === undefined) {
        // Query is still loading, prevent submission
        Alert.alert(
          "Loading",
          "Please wait while we validate your referral code.",
        );
        return;
      }
      if (!referralData) {
        Alert.alert(
          "Invalid Referral Code",
          "The referral code you entered is not valid. Please check and try again.",
        );
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
        unsafeMetadata: {
          role: "user",
          onboardingCompleted: false,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error("Sign up error:", err);

      let errorMessage = "An error occurred during sign up. Please try again.";

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

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded || isVerifying) return;

    setIsVerifying(true);
    setVerificationError("");

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        // Store referral code in SecureStore if provided (don't create profile yet)
        if (referralCodeInput.trim()) {
          await ReferralStorage.storeReferralCode(referralCodeInput.trim());
        }

        router.replace("/onboarding");
      } else {
        setVerificationError("Verification incomplete. Please try again.");
        console.error("Sign up attempt incomplete:", signUpAttempt.status);
      }
    } catch (err: any) {
      console.error("Verification error:", err);

      let errorMessage = "Invalid verification code. Please try again.";

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

      setVerificationError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  if (pendingVerification) {
    return (
      <KeyboardAwareScrollView
        className="flex-1 bg-amber-50"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 64 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-black rounded-2xl items-center justify-center mb-6">
            <Text className="text-white text-2xl font-bold">J</Text>
          </View>
          <Text className="text-2xl font-bold text-center mb-2">
            Verify your email
          </Text>
          <Text className="text-gray-500 text-center">
            We sent you a verification code
          </Text>
        </View>

        {verificationError ? (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <Text className="text-red-600 text-sm text-center">
              {verificationError}
            </Text>
          </View>
        ) : null}

        <View className="bg-gray-50 rounded-xl px-4 py-4 mb-6">
          <TextInput
            value={code}
            placeholder="Enter your verification code"
            className="text-base"
            onChangeText={(code) => setCode(code)}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          onPress={onVerifyPress}
          className={`rounded-full py-4 ${isVerifying ? "bg-gray-600" : "bg-black"}`}
          disabled={isVerifying}
        >
          <Text className="text-white text-center font-semibold text-base">
            {isVerifying ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    );
  }

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
        <Text className="text-2xl font-bold text-center mb-2">
          Create your account
        </Text>
        <Text className="text-gray-500 text-center">
          Sign up with your email
        </Text>
      </View>

      {/* Error Message */}
      {error ? (
        <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </View>
      ) : null}

      {/* Form */}
      <View className="space-y-4 mb-6">
        <View className="bg-gray-50 rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">👤</Text>
          <TextInput
            value={firstName}
            placeholder="First name"
            className="flex-1 text-base"
            onChangeText={(firstName) => setFirstName(firstName)}
          />
        </View>

        <View className="bg-gray-50 rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">👤</Text>
          <TextInput
            value={lastName}
            placeholder="Last name"
            className="flex-1 text-base"
            onChangeText={(lastName) => setLastName(lastName)}
          />
        </View>

        <View className="bg-gray-50 rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">✉️</Text>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email"
            className="flex-1 text-base"
            onChangeText={(email) => setEmailAddress(email)}
            keyboardType="email-address"
          />
        </View>

        <View className="bg-gray-50 rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">🔒</Text>
          <TextInput
            value={password}
            placeholder="Create a password"
            secureTextEntry={true}
            className="flex-1 text-base"
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <View className="bg-gray-50 rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">🎟️</Text>
          <TextInput
            value={referralCodeInput}
            placeholder="Referral code (optional)"
            className="flex-1 text-base"
            onChangeText={(referralCode) => setReferralCodeInput(referralCode)}
          />
        </View>
      </View>

      {/* Create Account Button */}
      <TouchableOpacity
        onPress={onSignUpPress}
        className={`rounded-full py-4 mb-6 ${isLoading ? "bg-gray-600" : "bg-black"}`}
        disabled={isLoading}
      >
        <Text className="text-white text-center font-semibold text-base">
          {isLoading ? "Creating account..." : "Create account"}
        </Text>
      </TouchableOpacity>

      {/* Terms Text */}
      <Text className="text-xs text-gray-500 text-center mb-6">
        Your email will be used to send you product and{"\n"}
        marketing updates
      </Text>

      {/* Back to SSO Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-gray-50 rounded-full py-4 mb-8"
      >
        <Text className="text-gray-700 text-center font-semibold">
          ← Back to all sign-up options
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}
