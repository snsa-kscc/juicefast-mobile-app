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
        <Text className="text-2xl font-lufga-bold">
          End User License Agreement
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Last Updated: 19.11.2025
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Introduction */}
        <View className="mb-6">
          <Text className="text-base text-gray-800 leading-6">
            This End User License Agreement (&quot;Agreement&quot;) is a binding
            legal contract between you (&quot;User&quot;, &quot;you&quot;) and
            Juicefast d.o.o., Cesta Prvih Borcev 11, 8250 Brežice, Slovenia
            (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;,
            &quot;our&quot;).
          </Text>
          <Text className="text-base text-gray-800 leading-6 mt-2">
            This Agreement governs your use of the Juicefast mobile application
            (&quot;App&quot;), our website, and all related digital services
            (collectively, the &quot;Services&quot;).
          </Text>
          <Text className="text-base text-gray-800 leading-6 mt-2">
            By downloading, installing, accessing, or using the App, you
            acknowledge that you have read, understood, and agreed to be bound
            by this Agreement. If you do not agree, you must not use the App.
          </Text>
        </View>

        {/* License Grant */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">License Grant</Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            We grant you a revocable, limited, non-exclusive, non-transferable
            license to use the App strictly in accordance with this Agreement.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            You may not:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • redistribute, sublicense, or commercially exploit the App{"\n"}•
            modify, copy, or reverse-engineer the App{"\n"}• access the App in
            order to build a competing product{"\n"}• disrupt, hack, or
            interfere with the App&apos;s normal functioning{"\n"}• use the App
            for unlawful, abusive, or harmful purposes
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            All rights not expressly granted to you remain our exclusive
            property.
          </Text>
        </View>

        {/* Subscription & Billing */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Subscription & Billing
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            The App offers auto-renewable subscription plans.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            By subscribing, you agree to:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            <Text className="font-lufga-bold">Automatic Renewal</Text>
            {"\n"}Subscriptions renew automatically unless canceled at least 24
            hours prior to the end of the current period.
            {"\n\n"}
            <Text className="font-lufga-bold">Payment</Text>
            {"\n"}All payments are charged to your Apple ID upon confirmation of
            purchase.
            {"\n\n"}
            <Text className="font-lufga-bold">Management</Text>
            {"\n"}You may modify or cancel your subscription in:
            {"\n"}Settings → Apple ID → Subscriptions
            {"\n\n"}
            <Text className="font-lufga-bold">Refunds</Text>
            {"\n"}We do not issue refunds for partially used subscription
            periods, unless required by law.
          </Text>
        </View>

        {/* Health Disclaimer */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Health, Nutrition & Wellness Disclaimer
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            The App provides nutrition, hydration, weight-tracking and wellness
            insights for informational purposes only.
          </Text>
          <Text className="text-base text-gray-700 leading-6 font-lufga-bold mb-2">
            WE DO NOT PROVIDE MEDICAL ADVICE.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            The App does not:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • diagnose medical conditions{"\n"}• replace professional medical
            guidance{"\n"}• provide emergency assistance
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            Always consult a physician before making significant dietary or
            lifestyle changes, especially if pregnant, nursing, or having health
            conditions.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            Your use of the App is entirely at your own risk.
          </Text>
        </View>

        {/* Citations & Scientific References */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Citations & Scientific References
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            Where applicable, the App provides access to citations, source
            materials, and public scientific guidelines for:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • BMI calculations{"\n"}• caloric needs{"\n"}• hydration
            recommendations{"\n"}• activity definitions
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            These may appear within the App or on our website.
          </Text>
        </View>

        {/* User Obligations */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">User Obligations</Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            You agree to:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • provide truthful, accurate personal information{"\n"}• use the App
            responsibly{"\n"}• refrain from harassment, misuse, or system
            tampering{"\n"}• comply with local laws and regulations
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            Violation of these terms may lead to account limitations or
            termination.
          </Text>
        </View>

        {/* Intellectual Property */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Intellectual Property
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            All text, images, AI-generated content, software, trademarks,
            branding, and other materials within the App remain the exclusive
            property of Juicefast d.o.o.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            You receive a license to use, not ownership.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            Any reproduction, distribution, modification, or commercial use is
            prohibited without our written approval.
          </Text>
        </View>

        {/* AI-Generated Content */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            AI-Generated Content
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            Certain features include artificial intelligence functionalities.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            You acknowledge that:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • AI outputs may not always be fully accurate{"\n"}• AI results must
            not be used as medical advice{"\n"}• you are responsible for your
            interpretations and use of AI recommendations
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            We may modify or update AI functionality at any time.
          </Text>
        </View>

        {/* Privacy & Data Protection */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Privacy & Data Protection
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            Your information is handled according to our Privacy Policy, which
            complies with GDPR and other applicable regulations.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            By using the App, you consent to data practices described in the
            Privacy Policy.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            Privacy Policy: https://juicefast.com/privacy-and-security/
          </Text>
        </View>

        {/* Termination */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">Termination</Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            We may terminate or suspend your access without notice if:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • you violate this Agreement{"\n"}• fraudulent behavior is detected
            {"\n"}• legally required
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            You may terminate by deleting the App.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            Termination does not automatically cancel subscriptions.
          </Text>
        </View>

        {/* Disclaimer of Warranties */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Disclaimer of Warranties
          </Text>
          <Text className="text-base text-gray-700 leading-6 font-lufga-bold mb-2">
            THE APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot;
            WITHOUT WARRANTIES OF ANY KIND.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            We do not guarantee:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • error-free performance{"\n"}• uninterrupted service{"\n"}•
            accuracy of recommendations{"\n"}• continued availability of
            features
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            You use the App at your own discretion and risk.
          </Text>
        </View>

        {/* Limitation of Liability */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Limitation of Liability
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            To the fullest extent permitted by law, Juicefast d.o.o. is not
            liable for:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • indirect or consequential damages{"\n"}• loss of profits or data
            {"\n"}• injuries or outcomes resulting from use of the App{"\n"}•
            reliance on health or nutrition information{"\n"}• outages or
            interruptions beyond our control
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            Our total liability is limited to the subscription fees paid in the
            last 12 months.
          </Text>
        </View>

        {/* Governing Law & Jurisdiction */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Governing Law & Jurisdiction
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            This Agreement is governed by the laws of Slovenia.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            Any disputes shall be resolved exclusively before the competent
            courts in Brežice or Ljubljana, Slovenia.
          </Text>
        </View>

        {/* Contact Information */}
        <View className="mb-8">
          <Text className="text-lg font-lufga-bold mb-2">
            Contact Information
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            For support or legal inquiries:
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            Juicefast d.o.o.
            {"\n"}Cesta Prvih Borcev 11
            {"\n"}8250 Brežice, Slovenia
            {"\n"}Email: support@juicefast.com
            {"\n"}Website: https://juicefast.com
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
