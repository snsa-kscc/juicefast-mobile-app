import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Share,
  Switch,
  Linking,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import * as Clipboard from "expo-clipboard";
import { AuthService } from "@/utils/auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import {
  User,
  Ruler,
  Scale,
  Calendar,
  Activity,
  LogOut,
  Settings,
  Heart,
  Users,
  Copy,
  CreditCard,
} from "lucide-react-native";
import { WellnessHeader } from "@/components/ui/CustomHeader";
import {
  UserProfile,
  calculateDailyCalories,
  getActivityLevelText,
} from "@/schemas/UserProfileSchema";
import { ActivityLevelPopup } from "@/components/ActivityLevelPopup";
import { EditNameModal } from "@/components/EditNameModal";
import { EditPasswordModal } from "@/components/EditPasswordModal";
import { EditDetailsModal } from "@/components/EditDetailsModal";
import { usePaywall } from "@/hooks/usePaywall";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();
  const {
    isPremiumOnAnyPlatform,
    isMobileAppSubscribed,
    isWooCommerceSubscribed,
  } = usePaywall();
  const userProfile = useQuery(api.userProfile.getByUserId);
  const updateUserProfile = useMutation(api.userProfile.createOrUpdate);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Form state
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string | undefined>();
  const [activityLevel, setActivityLevel] = useState<string | undefined>();
  const [showActivityPopup, setShowActivityPopup] = useState(false);
  const [allowPromotion, setAllowPromotion] = useState(true);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (user?.unsafeMetadata) {
      setAllowPromotion(!(user.unsafeMetadata.disallow_promotion ?? false));
    }
  }, [user?.unsafeMetadata?.disallow_promotion]);

  useEffect(() => {
    if (user) {
      const passwordEnabled = user.passwordEnabled;
      setHasPassword(passwordEnabled);
    }
  }, [user]);

  useEffect(() => {
    if (userProfile) {
      const adaptedProfile: UserProfile = {
        id: userProfile.userID,
        height: userProfile.height,
        weight: userProfile.weight,
        age: userProfile.age,
        gender: userProfile.gender,
        activityLevel: userProfile.activityLevel as any,
        referralCode: userProfile.referralCode,
        referredBy: userProfile.referredBy,
        referralCount: userProfile.referralCount,
        referrals: [],
      };
      setProfile(adaptedProfile);
      setHeight(userProfile.height?.toString() || "");
      setWeight(userProfile.weight?.toString() || "");
      setAge(userProfile.age?.toString() || "");
      setGender(userProfile.gender);
      setActivityLevel(userProfile.activityLevel);
    }
  }, [userProfile]);

  const handleSaveProfile = async (
    modalHeight: string,
    modalWeight: string,
    modalAge: string,
    modalGender: string | undefined,
    modalActivityLevel: string | undefined
  ) => {
    try {
      if (!profile?.referralCode) {
        Alert.alert("Error", "Referral code is required");
        return;
      }

      await updateUserProfile({
        height: modalHeight ? parseInt(modalHeight) : undefined,
        weight: modalWeight ? parseInt(modalWeight) : undefined,
        age: modalAge ? parseInt(modalAge) : undefined,
        gender: modalGender,
        activityLevel: modalActivityLevel,
        referralCode: profile.referralCode,
        referredBy: profile.referredBy,
        referralCount: profile.referralCount,
      });

      // Update local state to reflect changes immediately
      setHeight(modalHeight);
      setWeight(modalWeight);
      setAge(modalAge);
      setGender(modalGender);
      setActivityLevel(modalActivityLevel);

      // Update the profile state as well
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              height: modalHeight ? parseInt(modalHeight) : undefined,
              weight: modalWeight ? parseInt(modalWeight) : undefined,
              age: modalAge ? parseInt(modalAge) : undefined,
              gender: modalGender,
              activityLevel: modalActivityLevel as any,
            }
          : null
      );

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      Alert.alert("Error", "Failed to save profile");
    }
  };

  const { signOut, user: clerkUser } = useClerk();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoggingOut(true);
            await signOut();
            AuthService.clearToken();
            await SecureStore.deleteItemAsync("REFERRAL_CODE");
            router.replace("/(auth)/sso-signup");
          } catch (error) {
            console.error("Sign out error:", error);
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    const warningMessage = isPremiumOnAnyPlatform
      ? "⚠️ You have an active subscription!\n\nYou can still delete your account, but please remember to cancel your subscription separately through your device's app store settings (App Store/Google Play) or on the website to avoid future charges.\n\nAre you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted."
      : "This action cannot be undone. All your data will be permanently deleted.";

    Alert.alert("Delete Account", warningMessage, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setIsDeletingAccount(true);
            router.replace("/(auth)/sso-signup");
            await clerkUser?.delete();
            AuthService.clearToken();
            await SecureStore.deleteItemAsync("REFERRAL_CODE");
          } catch (error) {
            console.error("Delete account error:", error);
            Alert.alert("Error", "Failed to delete account. Please try again.");
          } finally {
            setIsDeletingAccount(false);
          }
        },
      },
    ]);
  };

  const handleSaveName = async (firstName: string, lastName: string) => {
    await user?.update({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    await user?.reload();
    Alert.alert("Success", "Name updated successfully!");
  };

  const handleSavePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    await user?.updatePassword({
      currentPassword,
      newPassword,
    });
    Alert.alert("Success", "Password updated successfully!");
  };

  const handleShowActivityPopup = () => {
    setShowActivityPopup(true);
  };

  const handleCopyReferralLink = async () => {
    if (!profile?.referralCode) return;

    try {
      const referralLink = `https://juicefast.com/referral?code=${profile.referralCode}`;
      await Clipboard.setStringAsync(referralLink);
      Alert.alert("Success", "Referral link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
      Alert.alert("Error", "Failed to copy referral link");
    }
  };

  const handleShareReferralLink = async () => {
    if (!profile?.referralCode) return;

    try {
      const referralLink = `https://juicefast.com/referral?code=${profile.referralCode}`;
      const message = `Finally, a nutrition app that actually works. Get yours free here - ${referralLink}`;

      await Share.share({
        message,
        url: referralLink,
        title: "Join Juicefast - Your Personal Nutrition App",
      });
    } catch (error) {
      console.error("Failed to share link:", error);
      Alert.alert("Error", "Failed to share referral link");
    }
  };

  const handleManageSubscription = async () => {
    try {
      let url = "";

      if (Platform.OS === "ios") {
        // iOS deep link to subscription management in Settings
        url = "itms-apps://apps.apple.com/account/subscriptions";
      } else if (Platform.OS === "android") {
        // Android deep link to Play Store subscriptions
        url = "https://play.google.com/store/account/subscriptions";
      } else {
        Alert.alert(
          "Not Available",
          "Subscription management is only available on mobile devices."
        );
        return;
      }

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to open subscription management.");
      }
    } catch (error) {
      console.error("Failed to open subscription management:", error);
      Alert.alert("Error", "Failed to open subscription management.");
    }
  };

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const activityOptions = [
    { label: "Sedentary (little to no exercise)", value: "sedentary" },
    { label: "Light (exercise 1-3 days/week)", value: "light" },
    { label: "Moderate (exercise 3-5 days/week)", value: "moderate" },
    { label: "Active (exercise 6-7 days/week)", value: "active" },
    { label: "Very Active (professional athlete level)", value: "very_active" },
  ];

  if (isLoggingOut) {
    return (
      <View className="flex-1 bg-jf-gray items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="font-lufga-medium text-gray-600 mt-4">
          Logging out...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-jf-gray">
      <WellnessHeader
        title="Profile"
        subtitle="Manage your health profile"
        showBackButton
        onBackPress={() => router.back()}
        showSettings={false}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 mx-6">
          <Text className="text-xl font-lufga-bold mb-4">Your Profile</Text>

          <View className="items-center mb-6">
            <View className="w-24 h-24 rounded-full bg-blue-50 items-center justify-center mb-4 overflow-hidden">
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="w-full h-full"
                />
              ) : (
                <User size={48} color="#3B82F6" />
              )}
            </View>
            <Text className="text-xl font-lufga-semibold text-center">
              {user?.fullName ||
                user?.firstName ||
                (user?.emailAddresses?.[0]?.emailAddress
                  ? user.emailAddresses[0].emailAddress.split("@")[0]
                  : "Health Tracker User")}
            </Text>
            {user?.emailAddresses?.[0]?.emailAddress && (
              <Text className="text-sm font-lufga text-gray-500 text-center mt-1">
                {user.emailAddresses[0].emailAddress}
              </Text>
            )}
          </View>

          <View>
            <TouchableOpacity
              className="flex-row items-center p-4 bg-gray-50 rounded-[25px] mb-3"
              onPress={() => setShowEditNameModal(true)}
              activeOpacity={0.7}
            >
              <User size={20} color="#6B7280" />
              <Text className="font-lufga-medium ml-3 text-gray-900">
                Edit Name
              </Text>
            </TouchableOpacity>

            {hasPassword && (
              <TouchableOpacity
                className="flex-row items-center p-4 bg-gray-50 rounded-[25px] mb-3"
                onPress={() => setShowEditPasswordModal(true)}
                activeOpacity={0.7}
              >
                <Settings size={20} color="#6B7280" />
                <Text className="font-lufga-medium ml-3 text-gray-900">
                  Change Password
                </Text>
              </TouchableOpacity>
            )}

            {isMobileAppSubscribed && (
              <TouchableOpacity
                className="flex-row items-center p-4 bg-gray-50 rounded-[25px] mb-3"
                onPress={handleManageSubscription}
              >
                <CreditCard size={20} color="#6B7280" />
                <Text className="font-lufga-medium ml-3 text-gray-900">
                  Manage Subscription
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="flex-row items-center p-4 bg-red-50 rounded-[25px]"
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <LogOut size={20} color="#EF4444" />
              <Text className="font-lufga-medium ml-3 text-red-500">
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Details */}
        <View className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 mx-6">
          <Text className="text-xl font-lufga-bold mb-4">Your Details</Text>

          <View>
            <View className="flex-row flex-wrap mb-6">
              <View className="w-1/2 pr-2 mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                    <Ruler size={20} color="#3B82F6" />
                  </View>
                  <View>
                    <Text className="font-lufga text-sm text-gray-500">
                      Height
                    </Text>
                    <Text className="font-lufga-medium">
                      {profile?.height ?? "-"}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="w-1/2 pl-2 mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                    <Scale size={20} color="#3B82F6" />
                  </View>
                  <View>
                    <Text className="font-lufga text-sm text-gray-500">
                      Weight
                    </Text>
                    <Text className="font-lufga-medium">
                      {profile?.weight ?? "-"} kg
                    </Text>
                  </View>
                </View>
              </View>

              <View className="w-1/2 pr-2 mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                    <Calendar size={20} color="#3B82F6" />
                  </View>
                  <View>
                    <Text className="font-lufga text-sm text-gray-500">
                      Age
                    </Text>
                    <Text className="font-lufga-medium">
                      {profile?.age ?? "-"}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="w-1/2 pl-2 mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                    <User size={20} color="#3B82F6" />
                  </View>
                  <View>
                    <Text className="font-lufga text-sm text-gray-500">
                      Gender
                    </Text>
                    <Text className="font-lufga-medium">
                      {profile?.gender ?? "-"}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="w-full mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                    <Activity size={20} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-lufga text-sm text-gray-500">
                      Activity Level
                    </Text>
                    <Text className="font-lufga-medium">
                      {profile?.activityLevel
                        ? getActivityLevelText(profile.activityLevel)
                        : "-"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity
              className="bg-blue-500 py-3 rounded-[25px] items-center"
              onPress={() => setShowEditDetailsModal(true)}
              activeOpacity={0.7}
            >
              <Text className="text-white font-lufga-medium">Edit Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Metrics Summary */}
        <View className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 mx-6">
          <Text className="text-lg font-lufga-bold mb-1">
            Health Metrics and Goals
          </Text>
          <Text className="text-xs font-lufga text-gray-500 mb-3">
            Metrics are calculated according to WHO guidelines
          </Text>

          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/3 px-2 mb-4">
              <View className="bg-red-50 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-2 gap-1">
                  <Heart size={20} color="#EF4444" />
                  <Text className="font-lufga-bold mx-2">
                    {profile?.weight && profile?.height
                      ? (
                          profile.weight / Math.pow(profile.height / 100, 2)
                        ).toFixed(1)
                      : "-"}
                  </Text>
                </View>
                <Text className="text-sm font-lufga-medium text-gray-600">
                  BMI
                </Text>
              </View>
            </View>

            <View className="w-1/3 px-2 mb-4">
              <View className="bg-green-50 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-2 gap-1">
                  <Heart size={20} color="#10B981" />
                  <Text className=" font-lufga-bold mx-2">
                    {profile?.weight &&
                    profile?.height &&
                    profile?.age &&
                    profile?.gender &&
                    profile?.activityLevel
                      ? calculateDailyCalories(
                          profile.weight,
                          profile.height,
                          profile.age,
                          profile.gender,
                          profile.activityLevel
                        )
                      : "-"}
                  </Text>
                </View>
                <Text className="text-sm font-lufga-medium text-gray-600">
                  Calories
                </Text>
              </View>
            </View>

            <View className="w-1/3 px-2 mb-4">
              <View className="bg-blue-50 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-2 gap-1">
                  <Heart size={20} color="#3B82F6" />
                  <Text className="font-lufga-bold mx-2">
                    {profile?.weight
                      ? `${Math.round(profile.weight * 30)} ml`
                      : "-"}
                  </Text>
                </View>
                <Text className="text-sm font-lufga-medium text-gray-600">
                  Water
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Referral Section */}
        {profile?.referralCode && (
          <View className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 mx-6">
            <Text className="text-lg font-lufga-bold mb-4">
              Referral Program
            </Text>

            <View className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Users size={20} color="#3B82F6" />
                <Text className="text-lg font-lufga-bold">
                  {profile.referralCount || 0}
                </Text>
              </View>
              <Text className="text-sm font-lufga-medium text-gray-600 mb-2">
                Referrals Made
              </Text>
              <Text className="text-xs font-lufga text-gray-500">
                Your code: {profile.referralCode}
              </Text>
            </View>

            <View>
              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-sm font-lufga text-gray-600 flex-1 mr-2"
                    numberOfLines={2}
                  >
                    {profile?.referralCode
                      ? `https://juicefast.com/referral?code=${profile.referralCode}`
                      : "-"}
                  </Text>
                  <TouchableOpacity
                    onPress={handleCopyReferralLink}
                    className="p-2 bg-white rounded-lg"
                    activeOpacity={0.7}
                  >
                    <Copy size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                className="flex-row items-center justify-center bg-purple-500 py-3 rounded-[25px]"
                onPress={handleShareReferralLink}
                activeOpacity={0.7}
              >
                <Text className="text-white font-lufga-medium">Share Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Preferences Section */}
        <View className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 mx-6">
          <Text className="text-lg font-lufga-bold mb-4">Preferences</Text>

          <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
            <Text className="text-gray-900 font-lufga-medium flex-1 mr-3">
              Receive updates and promotions via email
            </Text>
            <Switch
              value={allowPromotion}
              onValueChange={(value) => {
                setAllowPromotion(value);
                if (!user) return;
                user
                  .update({
                    unsafeMetadata: {
                      ...user.unsafeMetadata,
                      disallow_promotion: !value,
                    },
                  })
                  .catch((error) => {
                    console.error("Failed to update preference:", error);
                    setAllowPromotion(!value);
                  });
              }}
              trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View className="bg-white rounded-2xl border border-red-200 p-6 mb-6 mx-6">
          <Text className="font-lufga-bold text-lg text-red-600 mb-2">
            Danger Zone
          </Text>
          <Text className="font-lufga text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
            {isPremiumOnAnyPlatform && (
              <Text className="text-orange-600 font-lufga-medium">
                {"\n"}⚠️ You have an active subscription. Remember to cancel it
                separately to avoid future charges.
              </Text>
            )}
          </Text>

          <TouchableOpacity
            className="flex-row items-center justify-center bg-red-500 py-3 rounded-[25px]"
            onPress={handleDeleteAccount}
            disabled={isDeletingAccount}
            activeOpacity={0.7}
          >
            <Text className="font-lufga-semibold text-white">
              {isDeletingAccount ? "Deleting..." : "Delete Account"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Legal Section */}
        <View className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 mx-6">
          <Text className="text-lg font-lufga-bold mb-4">Legal</Text>

          <View>
            <Link href="/citations" asChild>
              <TouchableOpacity
                className="flex-row items-center justify-between p-4 bg-gray-50 rounded-[25px] mb-3"
                activeOpacity={0.7}
              >
                <Text className="text-gray-900 font-lufga-medium">
                  Citations for Health Info and Metrics
                </Text>
                <Text className="text-gray-400 text-lg">→</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/terms" asChild>
              <TouchableOpacity
                className="flex-row items-center justify-between p-4 bg-gray-50 rounded-[25px] mb-3"
                activeOpacity={0.7}
              >
                <Text className="text-gray-900 font-lufga-medium">
                  Terms of Use (EULA)
                </Text>
                <Text className="text-gray-400 text-lg">→</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/privacy" asChild>
              <TouchableOpacity
                className="flex-row items-center justify-between p-4 bg-gray-50 rounded-[25px]"
                activeOpacity={0.7}
              >
                <Text className="text-gray-900 font-lufga-medium">
                  Privacy Policy
                </Text>
                <Text className="text-gray-400 text-lg">→</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Text className="text-xs font-lufga text-gray-500 text-center mt-4">
            Respect, privacy, and good vibes only ✨
          </Text>
        </View>

        {/* Edit Name Modal */}
        <EditNameModal
          visible={showEditNameModal}
          onClose={() => setShowEditNameModal(false)}
          initialFirstName={user?.firstName || ""}
          initialLastName={user?.lastName || ""}
          onSave={handleSaveName}
        />

        {/* Edit Password Modal */}
        <EditPasswordModal
          visible={showEditPasswordModal}
          onClose={() => setShowEditPasswordModal(false)}
          onSave={handleSavePassword}
        />

        {/* Edit Details Modal */}
        <EditDetailsModal
          visible={showEditDetailsModal}
          onClose={() => setShowEditDetailsModal(false)}
          initialHeight={height}
          initialWeight={weight}
          initialAge={age}
          initialGender={gender}
          initialActivityLevel={activityLevel}
          genderOptions={genderOptions}
          activityOptions={activityOptions}
          onSave={handleSaveProfile}
        />

        {/* Activity Level Popup */}
        <ActivityLevelPopup
          visible={showActivityPopup}
          onClose={() => setShowActivityPopup(false)}
          selectedValue={activityLevel}
          onSelect={setActivityLevel}
        />

        {/* Bottom padding */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
