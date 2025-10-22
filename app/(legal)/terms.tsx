import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-amber-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-4 px-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-lg">← Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-lufga-bold">Terms of Service</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Last updated: January 2025
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Introduction */}
        <View className="mb-6">
          <Text className="text-base text-gray-800 leading-6">
            Welcome to JuiceFast! By using our app, you agree to these terms.
            We've kept them simple and straightforward.
          </Text>
        </View>

        {/* Section 1 */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            1. Acceptance of Terms
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            By accessing and using JuiceFast, you accept and agree to be bound
            by these Terms of Service. If you don't agree, please don't use our
            app.
          </Text>
        </View>

        {/* Section 2 */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            2. Use of Service
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            You agree to use JuiceFast for lawful purposes only. You must not:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • Violate any laws or regulations{"\n"}• Harass or harm other users
            {"\n"}• Share false or misleading information{"\n"}• Attempt to hack
            or disrupt the service
          </Text>
        </View>

        {/* Section 3 */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">3. User Accounts</Text>
          <Text className="text-base text-gray-700 leading-6">
            You're responsible for maintaining the security of your account.
            Keep your login credentials safe and notify us immediately if you
            suspect unauthorized access.
          </Text>
        </View>

        {/* Section 4 */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            4. Health Disclaimer
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            JuiceFast provides nutritional information and wellness guidance,
            but we're not a substitute for professional medical advice. Always
            consult with healthcare professionals before starting any new diet
            or wellness program.
          </Text>
        </View>

        {/* Section 5 */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            5. Content Ownership
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            All content provided by JuiceFast, including text, graphics, logos,
            and software, is our property or licensed to us. You may not copy,
            distribute, or create derivative works without permission.
          </Text>
        </View>

        {/* Section 6 */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            6. Subscription and Payments
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            Some features require a subscription. Payments are processed through
            your app store. Subscriptions auto-renew unless cancelled. Refunds
            are handled according to app store policies.
          </Text>
        </View>

        {/* Section 7 */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">7. Termination</Text>
          <Text className="text-base text-gray-700 leading-6">
            We reserve the right to suspend or terminate your account if you
            violate these terms. You can delete your account at any time through
            the app settings.
          </Text>
        </View>

        {/* Section 8 */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            8. Limitation of Liability
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            JuiceFast is provided "as is" without warranties. We're not liable
            for any indirect, incidental, or consequential damages arising from
            your use of the app.
          </Text>
        </View>

        {/* Section 9 */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            9. Changes to Terms
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            We may update these terms from time to time. We'll notify you of
            significant changes. Continued use of the app means you accept the
            updated terms.
          </Text>
        </View>

        {/* Contact */}
        <View className="mb-8">
          <Text className="text-lg font-lufga-bold mb-2">10. Contact Us</Text>
          <Text className="text-base text-gray-700 leading-6">
            Questions about these terms? Reach out to us at
            support@juicefast.com
          </Text>
        </View>

        {/* Footer */}
        <View className="border-t border-gray-200 pt-6 mb-6">
          <Text className="text-sm text-gray-500 text-center">
            Respect, privacy, and good vibes only ✨
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
