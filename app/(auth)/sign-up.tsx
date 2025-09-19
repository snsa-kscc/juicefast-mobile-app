import { useSignUp, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSocialSignIn } from "../../hooks/useSocialSignIn";
import { ReferralStorage } from "../../utils/referralStorage";
import { generateReferralCode } from "../../utils/referral";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();
  const router = useRouter();
  const { signInWithGoogle, signInWithFacebook, signInWithApple } = useSocialSignIn();
  const createOrUpdateUserProfile = useMutation(api.userProfile.createOrUpdate);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");
  const [verificationError, setVerificationError] = useState("");

  // Load referral code from secure storage on component mount
  useEffect(() => {
    const loadReferralCode = async () => {
      try {
        const storedCode = await ReferralStorage.getReferralCode();
        if (storedCode) {
          setReferralCode(storedCode);
        }
      } catch (error) {
        console.error('Error loading referral code:', error);
      }
    };

    loadReferralCode();
  }, []);

  // Handle referral processing for social sign-ins
  const handleSocialSignupComplete = async () => {
    if (!user) return;

    try {
      // Determine which referral code to use (input takes priority over stored)
      const storedReferralCode = await ReferralStorage.getReferralCode();
      const finalReferralCode = referralCode || storedReferralCode;

      // Generate unique referral code for the new user
      const userFullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      const newReferralCode = generateReferralCode(userFullName);

      // Create user profile with referral data
      await createOrUpdateUserProfile({
        userID: user.id,
        referralCode: newReferralCode,
        referredBy: finalReferralCode || undefined,
        referralCount: 0,
      });

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

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded || isLoading) return;

    setIsLoading(true);
    setError(""); // Clear previous errors
    
    // Start sign-up process using email and password provided
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

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error("Sign up error:", err);
      
      // Extract user-friendly error message
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
    setVerificationError(""); // Clear previous errors

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        // Get the user ID from Clerk
        const user = signUpAttempt.createdUserId;
        if (user) {
          // Determine which referral code to use (input takes priority over stored)
          const storedReferralCode = await ReferralStorage.getReferralCode();
          const finalReferralCode = referralCode || storedReferralCode;

          // Generate unique referral code for the new user
          const userFullName = `${firstName} ${lastName}`.trim();
          const newReferralCode = generateReferralCode(userFullName);

          // Create user profile with referral data
          await createOrUpdateUserProfile({
            userID: user,
            referralCode: newReferralCode,
            referredBy: finalReferralCode || undefined,
            referralCount: 0,
          });

          // Clear stored referral code after successful signup
          if (storedReferralCode) {
            await ReferralStorage.removeReferralCode();
          }
        }

        router.replace("/onboarding");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setVerificationError("Verification incomplete. Please try again.");
        console.error("Sign up attempt incomplete:", signUpAttempt.status);
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error("Verification error:", err);

      // Extract user-friendly error message
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
          <Text className="text-2xl font-bold text-center mb-2">Verify your email</Text>
        </View>

        {/* Verification Error Message */}
        {verificationError ? (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <Text className="text-red-600 text-sm text-center">{verificationError}</Text>
          </View>
        ) : null}

        <View className="bg-white rounded-xl px-4 py-4 mb-6">
          <TextInput value={code} placeholder="Enter your verification code" className="text-base" onChangeText={(code) => setCode(code)} />
        </View>

        <TouchableOpacity onPress={onVerifyPress} className={`rounded-full py-4 ${isVerifying ? "bg-gray-600" : "bg-black"}`} disabled={isVerifying}>
          <Text className="text-white text-center font-semibold text-base">{isVerifying ? "Verifying..." : "Verify"}</Text>
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
        <Text className="text-2xl font-bold text-center mb-2">Welcome to</Text>
        <Text className="text-2xl font-bold text-center">Juicefast</Text>
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
          <Text className="text-gray-400 mr-3">👤</Text>
          <TextInput value={firstName} placeholder="First name" className="flex-1 text-base" onChangeText={(firstName) => setFirstName(firstName)} />
        </View>

        <View className="bg-white rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">👤</Text>
          <TextInput value={lastName} placeholder="Last name" className="flex-1 text-base" onChangeText={(lastName) => setLastName(lastName)} />
        </View>

        <View className="bg-white rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">✉</Text>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email"
            className="flex-1 text-base"
            onChangeText={(email) => setEmailAddress(email)}
          />
        </View>

        <View className="bg-white rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">🔒</Text>
          <TextInput
            value={password}
            placeholder="Create a password"
            secureTextEntry={true}
            className="flex-1 text-base"
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <View className="bg-white rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">🎟️</Text>
          <TextInput
            value={referralCode}
            placeholder="Referral code (optional)"
            className="flex-1 text-base"
            onChangeText={(referralCode) => setReferralCode(referralCode)}
          />
        </View>
      </View>

      {/* Create Account Button */}
      <TouchableOpacity onPress={onSignUpPress} className={`rounded-full py-4 mb-6 ${isLoading ? "bg-gray-600" : "bg-black"}`} disabled={isLoading}>
        <Text className="text-white text-center font-semibold text-base">{isLoading ? "Signing..." : "Create account"}</Text>
      </TouchableOpacity>

      {/* Terms Text */}
      <Text className="text-xs text-gray-500 text-center mb-6">
        Your email will be used to send you product and{"\n"}
        marketing updates
      </Text>

      {/* Checkbox */}
      <View className="flex-row items-center mb-6">
        <View className="w-5 h-5 border border-gray-300 rounded mr-3" />
        <Text className="text-sm text-gray-600 flex-1">I don't want to receive updates and information via email</Text>
      </View>

      {/* Social Login Buttons */}
      <View className="space-y-3 mb-8">
        <TouchableOpacity onPress={() => signInWithFacebook(handleSocialSignupComplete)} className="bg-black rounded-full py-4 flex-row items-center justify-center">
          <Text className="text-white mr-2">f</Text>
          <Text className="text-white font-semibold">Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => signInWithApple(handleSocialSignupComplete)} className="bg-black rounded-full py-4 flex-row items-center justify-center">
          <Text className="text-white mr-2">🍎</Text>
          <Text className="text-white font-semibold">Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => signInWithGoogle(handleSocialSignupComplete)} className="bg-black rounded-full py-4 flex-row items-center justify-center">
          <Text className="text-white mr-2">G</Text>
          <Text className="text-white font-semibold">Google</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Link */}
      <View className="flex-row justify-center">
        <Text className="text-gray-500">Already have an account? </Text>
        <Link href="/sign-in">
          <Text className="text-black font-semibold">Log in</Text>
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}
