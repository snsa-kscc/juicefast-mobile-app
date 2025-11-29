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
        <Text className="text-2xl font-lufga-bold">Privacy and Security</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Last Updated: 19.11.2025
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Introduction */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">Introduction</Text>
          <Text className="text-base text-gray-800 leading-6">
            We understand that you care about how we use and disclose personal
            data, and we are committed to complying with applicable data
            protection and privacy laws. This Privacy Policy informs you about
            the ways we protect your privacy and the personal data we process
            about you.
          </Text>
          <Text className="text-base text-gray-800 leading-6 mt-2">
            Juicefast d.o.o. and its affiliated companies
            (&quot;Juicefast,&quot; &quot;we,&quot; &quot;us,&quot;
            &quot;our&quot;) are committed to protecting and respecting your
            privacy. This Privacy Policy (together with our Terms of Use and
            other referenced documents) applies to juicefast.com
            (&quot;website&quot;) and other services and products provided by
            Juicefast (hereinafter referred to as the &quot;Service&quot;) to
            help you better understand how we collect your personal data or how
            you submit it, what rights you have, and how the data will be used,
            stored, and disclosed by us, whether you are a user of our Service
            (&quot;Registered User&quot;) or just a visitor to our website.
          </Text>
          <Text className="text-base text-gray-800 leading-6 mt-2">
            In this Privacy Policy, the term &quot;personal data&quot; refers to
            information relating to an identified or identifiable natural
            person. &quot;Sensitive personal data&quot; refers to personal data
            revealing racial or ethnic origin, political opinions, religious or
            philosophical beliefs, trade union membership, genetic data,
            biometric data, and processing of health, sex life or sexual
            orientation data.
          </Text>
          <Text className="text-base text-gray-800 leading-6 mt-2">
            Please note that this Privacy Policy applies to personal data we
            process when you use the Service. It does not apply to links to
            third-party websites and/or services, such as third-party apps you
            may interact with while using the Service. We encourage you to read
            the privacy policies applicable to third-party websites and/or
            services carefully. Please note we are not responsible for
            third-party privacy practices.
          </Text>
          <Text className="text-base text-gray-800 leading-6 mt-2">
            By using the Service, you agree to the terms of this Privacy Policy
            and to the collection, use, and transfer of your personal data for
            processing within and outside the EU, in accordance with the privacy
            practices described herein. Where necessary, for sensitive personal
            data, we will request your explicit consent as described in this
            Privacy Policy.
          </Text>
        </View>

        {/* Information We Collect */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Information We Collect from You
          </Text>
          <Text className="text-base text-gray-700 leading-6 font-lufga-bold mb-2">
            i) Data You Provide to the Service
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            We collect the information necessary for the use and proper
            execution of the Service. The following information is collected
            from our users in connection with registration or their use of the
            Service (each such user being a &quot;Registered User&quot;). This
            information may, in certain circumstances, constitute personal data:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • Email address{"\n"}• First/last name{"\n"}• Date of birth{"\n"}•
            Weight{"\n"}• Company{"\n"}• Address{"\n"}• Phone number{"\n"}•
            Delivery method{"\n"}• Ordered products{"\n"}• Discount information
            {"\n"}• Payment method{"\n"}• Billing address{"\n"}• Payment details
            {"\n"}• Password
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            Additionally, if you contact us or participate in a survey, contest,
            or promotion, we collect the information you provide, such as your
            name, contact information, and message.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            If you use Facebook Connect to log in, we collect the information
            you have made available in your public profile, as well as your
            email address and friend list.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2 mb-2">
            Health-related information, such as dietary habits, may constitute
            sensitive personal data. We process sensitive personal data to
            provide the Service and only to the extent necessary or appropriate
            to comply with relevant legal or contractual obligations. If the
            data we collect includes health or other special category data under
            the EU General Data Protection Regulation, we will request your
            explicit consent to process such data. Explicit consent is also
            requested separately when you take actions that result in receiving
            such data, for example, when using a menstrual calendar feature. You
            are not required to give explicit consent, but if you choose not to,
            certain features of the Service may not function properly or may be
            entirely unavailable. You can withdraw your consent at any time
            through your account settings.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            By using the Service and voluntarily providing personal data,
            including sensitive data, you agree to the processing of such
            personal data in accordance with this Privacy Policy. If you provide
            personal data to the Service, you acknowledge and agree that such
            data may be transferred to servers of authorized third-party
            partners mentioned in this Policy, located inside and outside the
            EU.
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            If you purchase our products on our website, you provide your
            payment information, including your name, credit or debit card
            number, card expiration date, CVV code, and billing address. We do
            not store this payment information. We store your shipping address
            to fulfill your order. Note that third-party payment processors may
            retain this information in accordance with their own privacy
            policies and terms.
          </Text>

          <Text className="text-base text-gray-700 leading-6 font-lufga-bold mb-2 mt-4">
            ii) Automatically Collected Data
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            The Service may automatically collect the following information
            about you, which may in some circumstances constitute personal data:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • Usage event data such as links or buttons you clicked and pages
            you viewed{"\n"}• Purchase transaction data{"\n"}• Type of device
            you use{"\n"}• Unique mobile device ID, such as Apple IDFA{"\n"}• IP
            address used to access the Service{"\n"}• Depending on your device
            settings, location data{"\n"}• Device OS name and version{"\n"}• Log
            technology that automatically collects the referring and exit page
            URLs
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2 mb-2">
            We may place a &quot;cookie&quot; on the hard drive of the device
            you use to access the Service. Cookies are text files stored on your
            device&apos;s hard drive via your browser, allowing us to recognize
            your browser for purposes such as saving your preferences and
            targeting relevant content. Most current browsers allow you to
            manage cookies. Please note that disabling cookies may result in
            limited functionality of the Service. In all cases where we use
            cookies, we will not collect personal data without your permission.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            Google Analytics, a web analytics service provided by Google Inc.,
            is used on the website. Using cookies, Google Analytics collects and
            stores data such as visit time, viewed pages, time spent on each
            page, IP address, and device OS. You can opt out of Google Analytics
            by using the Google Analytics Opt-Out add-on. For more information,
            visit https://policies.google.com/technologies/partner-sites.
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            We also use Facebook Audience Insights, an analysis tool provided by
            Facebook Inc. Facebook Insights analyzes, monitors, and distributes
            data collected through the Service&apos;s Facebook pages for
            analytics and marketing. For more information, visit
            https://www.facebook.com/business/learn/facebook-audience-insights.
          </Text>
        </View>

        {/* Purposes for Using Data */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Purposes for Using Data
          </Text>
          <Text className="text-base text-gray-700 leading-6 font-lufga-bold mb-2">
            We use the data you provide for the following purposes:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • Setting up and maintaining your registration in the Service{"\n"}•
            Communicating with you{"\n"}• Preventing and investigating fraud and
            misuse{"\n"}• Protecting our rights and/or property{"\n"}• Operating
            and improving our products and services{"\n"}• Managing the Service
            {"\n"}• Providing available features within the Service{"\n"}•
            Developing, enhancing, and securing the Service{"\n"}• Market
            research{"\n"}• Auditing and analyzing the Service{"\n"}• Ensuring
            technical functionality and security
          </Text>

          <Text className="text-base text-gray-700 leading-6 font-lufga-bold mb-2 mt-4">
            We use automatically collected data for the following purposes:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4">
            • Improving customer service{"\n"}• Personalizing the user
            experience{"\n"}• Running promotions, contests, surveys, or other
            features{"\n"}• Managing the Service{"\n"}• Providing available
            features in the Service{"\n"}• Personalizing the Service{"\n"}•
            Developing, enhancing, and securing the Service{"\n"}• Market
            research{"\n"}• Auditing and analyzing the Service{"\n"}• Ensuring
            technical functionality and security
          </Text>
        </View>

        {/* How We Disclose Data */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            How We Disclose Data
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            We do not sell, rent, or otherwise disclose personal data to third
            parties except as described at the time of consent or below.
          </Text>
          <Text className="text-base text-gray-700 leading-6 font-lufga-bold mb-2">
            a) Personal data you provide:
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            We may disclose such data to:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4 mb-2">
            • Service providers, such as payment processors and data storage
            providers, enabling us to provide the Service{"\n"}• Public
            authorities, such as law enforcement or authorized third parties, if
            legally required or necessary to protect our or third-party rights
            {"\n"}• Our affiliates, partners, future owners or operators of the
            Service and their advisors in connection with corporate mergers,
            restructurings, sales of shares/assets, bankruptcy, or other
            reorganizations
          </Text>

          <Text className="text-base text-gray-700 leading-6 font-lufga-bold mb-2">
            b) Automatically collected data:
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            May be disclosed to:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4 mb-2">
            • Service providers, such as analytics and marketing companies{"\n"}
            • Public authorities if legally required or to protect rights{"\n"}•
            Our affiliates, partners, future owners or operators, and their
            advisors under corporate transactions
          </Text>

          <Text className="text-base text-gray-700 leading-6">
            We may also disclose data to third parties in an aggregated form
            that does not constitute personal data or directly identify
            individuals.
          </Text>
        </View>

        {/* Your Choices for Sharing Data */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Your Choices for Sharing Data
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            You may choose to share your personal data from the Service with
            friends, family, or health professionals. You can also instruct us
            to share your data with third parties. For example, you may
            authorize us to connect your Bellabeat account with a third-party
            app, post updates on your social media, or share data with other
            third parties at your request. Once data is shared, its use by third
            parties is not governed by this Privacy Policy.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            You may use the Service (e.g., browse the site) without providing
            personal data. However, not providing data may limit your ability to
            use certain features.
          </Text>
        </View>

        {/* Do Not Track */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            &quot;Do Not Track&quot; Notice
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            Your browser may allow you to send a &quot;Do Not Track&quot; signal
            to websites. Websites are not required to respond to such signals.
            Currently, the website does not recognize or respond to Do Not Track
            signals.
          </Text>
        </View>

        {/* Your Rights */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">Your Rights</Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            You have the following rights regarding your personal data:
          </Text>
          <Text className="text-base text-gray-700 leading-6 ml-4 mb-2">
            <Text className="font-lufga-bold">Right to know</Text> what personal
            data we hold about you: Contact us at hi@juicefast.com.
            {"\n\n"}
            <Text className="font-lufga-bold">
              Right to correct, delete, or update
            </Text>{" "}
            incomplete, inaccurate, outdated, or unnecessary data: Log into your
            account or contact us.
            {"\n\n"}
            <Text className="font-lufga-bold">
              Right to opt out of direct marketing communications:
            </Text>{" "}
            Unsubscribe via any marketing email or SMS, or contact us directly.
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            If you live in the EEA, you have additional GDPR rights, such as the
            right to object to data processing or to restrict processing in
            certain circumstances. You also have the right to file a complaint
            with your local data protection authority.
          </Text>
        </View>

        {/* Data Retention and Security */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Data Retention and Security
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            We retain your account data while your account exists and as needed
            to provide the Service and meet legal obligations. Other data, like
            device sync info, is retained unless deleted via your account
            settings.
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            We take reasonable measures to protect personal data from
            unauthorized access, misuse, or loss, using technical,
            administrative, and physical safeguards. However, no method is 100%
            secure, and we cannot guarantee the complete safety of your data.
          </Text>
        </View>

        {/* International Data Transfers */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            International Data Transfers
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            Some parts of the Service may be hosted on servers outside your
            country, including the EU. By registering, you agree to the transfer
            of your personal data across borders.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            If you&apos;re located in the EEA, you have rights under the GDPR.
            Contact us at hi@juicefast.com to exercise them.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            Juicefast has committed to resolving complaints regarding your
            personal data. If unresolved, you may contact JAMS at
            https://www.jamsadr.com/eu-us-privacy-shield.
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            Juicefast also commits to cooperating with the EU Data Protection
            Authorities (DPAs) for unresolved HR-related complaints. If needed,
            you may contact the DPAs. Services are provided at no cost. Under
            certain conditions, you may request binding arbitration.
          </Text>
        </View>

        {/* Children's Privacy */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Children&apos;s Privacy
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            The Service is not intended for children under 13. We do not
            knowingly collect data from children under 13. Parents who believe
            their child has submitted data may contact us at hi@juicefast.com to
            have it removed.
          </Text>
        </View>

        {/* Changes to Policy */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Changes to This Privacy Policy
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            We may update this Policy to reflect changes in our practices or for
            legal reasons. Changes will be posted on the Service and noted at
            the top of this page. Significant changes will be communicated via
            email.
          </Text>
        </View>

        {/* Questions or Concerns */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Questions or Concerns?
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            If you have questions about this Privacy Policy or data practices,
            contact us at hi@juicefast.com or by mail at Juicefast,
            Wickerhauserova 14, 10000 Zagreb, Croatia (for EU residents).
          </Text>
        </View>

        {/* Credit/Debit Card Payment Security */}
        <View className="mb-8">
          <Text className="text-lg font-lufga-bold mb-2">
            Credit/Debit Card Payment Security
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            Your data is protected via SSL encryption. Online payment pages use
            Secure Socket Layer (SSL) with 128-bit encryption. Data is encrypted
            to prevent unauthorized access during transmission. Payment services
            and financial institutions exchange data over a Virtual Private
            Network (VPN). The payment service is PCI DSS Level 1 certified and
            uses 3-D Secure, requiring identity verification for extra
            protection. Card numbers are never stored by the merchant.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
