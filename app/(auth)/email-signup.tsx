import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSignUp } from "@clerk/clerk-expo";
import { ReferralStorage } from "@/utils/referralStorage";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePushTokenStorage } from "@/hooks/usePushTokenStorage";
import {
  MailIcon,
  LockIcon,
  UserIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/icons/AuthIcons";
import { getInputFieldPadding } from "@/utils/platformStyles";
import { handleAppInstallWithReferral } from "@/utils/appInstallHandler";
import { showCrossPlatformAlert } from "@/utils/alert";

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
      : "skip"
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [noPromotions, setNoPromotions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load referral code from secure storage on component mount
  useEffect(() => {
    const loadReferralCode = async () => {
      try {
        await handleAppInstallWithReferral();
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

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    // Validate referral code if provided
    if (referralCodeInput.trim()) {
      if (referralData === undefined) {
        // Query is still loading, prevent submission
        showCrossPlatformAlert(
          "Loading",
          "Please wait while we validate your referral code."
        );
        return;
      }
      if (!referralData) {
        showCrossPlatformAlert(
          "Invalid Referral Code",
          "The referral code you entered is not valid. Please check and try again."
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
          disallow_promotion: noPromotions,
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
            Verify your email
          </Text>
        </View>

        {verificationError ? (
          <View className="bg-red-50 border border-red-200 rounded-xl mx-4 py-3 mb-4">
            <Text className="text-red-600 text-sm text-center font-lufga">
              {verificationError}
            </Text>
          </View>
        ) : null}

        <View className="mb-6 px-4">
          <View
            className={`bg-white rounded-2xl border border-gray-200 px-4 ${getInputFieldPadding()} mb-4`}
          >
            <TextInput
              value={code}
              placeholder="Enter your verification code"
              placeholderTextColor="#9CA3AF"
              className="text-base text-gray-500 font-lufga"
              onChangeText={(code) => setCode(code)}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            onPress={onVerifyPress}
            className={`rounded-full px-14 py-4 ${isVerifying ? "bg-gray-600" : "bg-gray-900"}`}
            disabled={isVerifying}
          >
            <Text className="text-white text-center font-lufga-semibold">
              {isVerifying ? "Verifying..." : "Verify"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Android Navigation Bar Spacer */}
        {Platform.OS === "android" && <View className="h-16" />}
      </KeyboardAwareScrollView>
    );
  }

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
          Welcome to Juicefast
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
            <UserIcon />
          </View>
          <TextInput
            value={firstName}
            placeholder="First name"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-base text-gray-500 font-lufga"
            onChangeText={(firstName) => setFirstName(firstName)}
          />
        </View>

        <View
          className={`bg-white rounded-2xl border border-gray-200 px-4 ${getInputFieldPadding()} flex-row items-center mb-4`}
        >
          <View className="mr-3">
            <UserIcon />
          </View>
          <TextInput
            value={lastName}
            placeholder="Last name"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-base text-gray-500 font-lufga"
            onChangeText={(lastName) => setLastName(lastName)}
          />
        </View>

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
            onChangeText={(email) => setEmailAddress(email)}
            keyboardType="email-address"
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
            placeholder="Create a password"
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

        <View
          className={`bg-white rounded-2xl border border-gray-200 px-4 ${getInputFieldPadding()} flex-row items-center mb-4`}
        >
          <View className="mr-3">
            <LockIcon />
          </View>
          <TextInput
            value={confirmPassword}
            placeholder="Confirm password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showConfirmPassword}
            className="flex-1 text-base text-gray-500 font-lufga"
            onChangeText={(confirmPassword) =>
              setConfirmPassword(confirmPassword)
            }
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            className="ml-2"
          >
            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </TouchableOpacity>
        </View>

        <View
          className={`bg-white rounded-2xl border border-gray-200 px-4 ${getInputFieldPadding()} flex-row items-center mb-4`}
        >
          <View className="mr-3">
            <LockIcon />
          </View>
          <TextInput
            value={referralCodeInput}
            placeholder="Referral code (optional)"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-base text-gray-500 font-lufga"
            onChangeText={(referralCode) => setReferralCodeInput(referralCode)}
          />
        </View>

        <TouchableOpacity
          onPress={onSignUpPress}
          className={`rounded-full py-4 mt-12 mb-6 ${isLoading ? "bg-gray-600" : "bg-gray-900"}`}
          disabled={isLoading}
        >
          <Text className="text-white text-center font-lufga-semibold">
            {isLoading ? "Creating account..." : "Create account"}
          </Text>
        </TouchableOpacity>

        <Text className="text-xs text-gray-500 text-center mb-6 font-lufga">
          Your email will be used to send you product and{"\n"}
          marketing updates
        </Text>

        <TouchableOpacity
          onPress={() => setNoPromotions(!noPromotions)}
          className="flex-row items-center mb-4"
        >
          <View
            className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
              noPromotions ? "bg-black border-black" : "border-gray-300"
            }`}
          >
            {noPromotions && <Text className="text-white text-xs">✓</Text>}
          </View>
          <Text className="text-sm text-gray-700 flex-1 font-lufga">
            I don&apos;t want to receive updates and promotions via email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Back to SSO Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-gray-50 rounded-full py-4 mx-4 mb-8"
      >
        <Text className="text-gray-700 text-center font-lufga-semibold">
          ← Back to all sign-up options
        </Text>
      </TouchableOpacity>

      {/* Android Navigation Bar Spacer */}
      {Platform.OS === "android" && <View className="h-16" />}
    </KeyboardAwareScrollView>
  );
}
