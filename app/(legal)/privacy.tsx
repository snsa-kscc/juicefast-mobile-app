import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-amber-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-4 px-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-lg">← Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Privacy Policy</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Last updated: January 2025
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Introduction */}
        <View className="mb-6">
          <Text className="text-base text-gray-800 leading-6">
            Your privacy matters to us. This policy explains how we collect,
            use, and protect your personal information when you use JuiceFast.
          </Text>
        </View>

        {/* Section 1 */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">
            1. Information We Collect
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            We collect information to provide you with a better experience:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4 mb-2">
            <Text className="font-semibold">Account Information:</Text> Name,
            email address, and profile details when you sign up.
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4 mb-2">
            <Text className="font-semibold">Health Data:</Text> Meal logs,
            fasting schedules, and wellness goals you track in the app.
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4 mb-2">
            <Text className="font-semibold">Usage Data:</Text> How you interact
            with the app, features you use, and app performance data.
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            <Text className="font-semibold">Device Information:</Text> Device
            type, operating system, and unique device identifiers.
          </Text>
        </View>

        {/* Section 2 */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">
            2. How We Use Your Information
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            We use your information to:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • Provide and improve our services{"\n"}• Personalize your
            experience{"\n"}• Send you notifications and updates{"\n"}• Respond
            to your support requests{"\n"}• Analyze app usage to make
            improvements{"\n"}• Ensure security and prevent fraud
          </Text>
        </View>

        {/* Section 3 */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">3. Data Sharing</Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            We respect your privacy and don't sell your personal information.
            We may share data with:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4 mb-2">
            <Text className="font-semibold">Service Providers:</Text> Third
            parties who help us operate the app (e.g., cloud hosting,
            analytics).
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4 mb-2">
            <Text className="font-semibold">Legal Requirements:</Text> When
            required by law or to protect our rights.
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            <Text className="font-semibold">Business Transfers:</Text> In the
            event of a merger or acquisition.
          </Text>
        </View>

        {/* Section 4 */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">4. Data Security</Text>
          <Text className="text-base text-gray-700 leading-6">
            We use industry-standard security measures to protect your data,
            including encryption and secure servers. However, no method of
            transmission over the internet is 100% secure, so we can't guarantee
            absolute security.
          </Text>
        </View>

        {/* Section 5 */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">5. Your Rights</Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            You have control over your data:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • Access and download your data{"\n"}• Correct inaccurate
            information{"\n"}• Delete your account and data{"\n"}• Opt out of
            marketing communications{"\n"}• Request data portability
          </Text>
        </View>

        {/* Section 6 */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">6. Data Retention</Text>
          <Text className="text-base text-gray-700 leading-6">
            We keep your data as long as your account is active or as needed to
            provide services. When you delete your account, we'll delete your
            personal data within 30 days, except where we're required to retain
            it by law.
          </Text>
        </View>

        {/* Section 7 */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">
            7. Children's Privacy
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            JuiceFast is not intended for children under 13. We don't knowingly
            collect data from children. If you believe we've collected
            information from a child, please contact us immediately.
          </Text>
        </View>

        {/* Section 8 */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">8. Cookies and Tracking</Text>
          <Text className="text-base text-gray-700 leading-6">
            We use cookies and similar technologies to improve your experience,
            analyze usage, and personalize content. You can control cookie
            preferences through your device settings.
          </Text>
        </View>

        {/* Section 9 */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">
            9. Third-Party Services
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            Our app may contain links to third-party services (e.g., social
            media, payment processors). We're not responsible for their privacy
            practices, so please review their policies separately.
          </Text>
        </View>

        {/* Section 10 */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">
            10. Changes to This Policy
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            We may update this privacy policy from time to time. We'll notify
            you of significant changes through the app or via email. Your
            continued use means you accept the updated policy.
          </Text>
        </View>

        {/* Contact */}
        <View className="mb-8">
          <Text className="text-lg font-bold mb-2">11. Contact Us</Text>
          <Text className="text-base text-gray-700 leading-6">
            Questions or concerns about your privacy? Contact us at
            privacy@juicefast.com or through the app's support section.
          </Text>
        </View>

        {/* Footer */}
        <View className="border-t border-gray-200 pt-6 mb-6">
          <Text className="text-sm text-gray-500 text-center">
            We're committed to protecting your privacy 🔒
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
