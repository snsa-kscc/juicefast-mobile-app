import { Linking } from "react-native";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function CitationsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-amber-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-4 px-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-lg">← Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-lufga-bold">
          Citations for Health Info and Metrics
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Last Updated: 20.11.2025
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Introduction */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">Introduction</Text>
          <Text className="text-base text-gray-800 leading-6">
            Our app provides health and wellness calculations and
            recommendations based on established scientific guidelines and
            reputable health organizations. All medical information, formulas,
            and recommendations used in our app are sourced from authoritative
            institutions and peer-reviewed research.
          </Text>
          <Text className="text-base text-gray-800 leading-6 mt-2">
            Below are the primary sources for the health metrics and
            calculations featured in our app, ensuring transparency and accuracy
            of the information provided to our users.
          </Text>
        </View>

        {/* BMI Formula */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">BMI Formula</Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            <Text className="font-lufga-bold">Source:</Text> World Health
            Organization (WHO)
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index"
              )
            }
            className="mb-2"
          >
            <Text className="text-base text-gray-700 leading-6">
              <Text className="font-lufga-bold">Link:</Text>{" "}
              <Text className="text-blue-600 underline">
                https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index
              </Text>
            </Text>
          </TouchableOpacity>
          <Text className="text-base text-gray-700 leading-6">
            The Body Mass Index (BMI) calculation and classification standards
            used in our app follow the WHO's official guidelines and BMI
            calculation tools.
          </Text>
        </View>

        {/* Calorie Recommendations */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Calorie Recommendations
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            <Text className="font-lufga-bold">Source:</Text> European Food
            Safety Authority (EFSA)
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.efsa.europa.eu/en/topics/topic/nutrition"
              )
            }
            className="mb-2"
          >
            <Text className="text-base text-gray-700 leading-6">
              <Text className="font-lufga-bold">Link:</Text>{" "}
              <Text className="text-blue-600 underline">
                https://www.efsa.europa.eu/en/topics/topic/nutrition
              </Text>
            </Text>
          </TouchableOpacity>
          <Text className="text-base text-gray-700 leading-6">
            Daily calorie intake recommendations are based on EFSA's scientific
            opinions on dietary reference values for energy and nutrition.
          </Text>
        </View>

        {/* Water Intake */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">Water Intake</Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            <Text className="font-lufga-bold">Source:</Text> European Food
            Safety Authority (EFSA)
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.efsa.europa.eu/en/efsajournal/pub/1459"
              )
            }
            className="mb-2"
          >
            <Text className="text-base text-gray-700 leading-6">
              <Text className="font-lufga-bold">Link:</Text>{" "}
              <Text className="text-blue-600 underline">
                https://www.efsa.europa.eu/en/efsajournal/pub/1459
              </Text>
            </Text>
          </TouchableOpacity>
          <Text className="text-base text-gray-700 leading-6">
            Hydration recommendations and adequate water intake guidelines are
            derived from EFSA's scientific advice on water requirements for
            different population groups.
          </Text>
        </View>

        {/* Activity Level Definitions */}
        <View className="mb-6">
          <Text className="text-lg font-lufga-bold mb-2">
            Activity Level Definitions
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            <Text className="font-lufga-bold">Source:</Text> National Institutes
            of Health (NIH)
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.nhlbi.nih.gov/")}
            className="mb-2"
          >
            <Text className="text-base text-gray-700 leading-6">
              <Text className="font-lufga-bold">Link:</Text>{" "}
              <Text className="text-blue-600 underline">
                https://www.nhlbi.nih.gov/
              </Text>
            </Text>
          </TouchableOpacity>
          <Text className="text-base text-gray-700 leading-6">
            Physical activity level classifications and definitions are based on
            NIH guidelines and the National Heart, Lung, and Blood Institute's
            recommendations for assessing activity levels.
          </Text>
        </View>

        {/* Additional Information */}
        <View className="mb-8">
          <Text className="text-lg font-lufga-bold mb-2">
            Additional Information
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-2">
            <Text className="font-lufga-bold">Medical Disclaimer:</Text> The
            information provided is for educational purposes only and should not
            be considered medical advice. Always consult with healthcare
            professionals for personalized medical guidance.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            <Text className="font-lufga-bold">Updates:</Text> We regularly
            review and update our calculations and recommendations to reflect
            the most current scientific evidence and guidelines from these
            authoritative sources.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mt-2">
            <Text className="font-lufga-bold">Questions:</Text> If you have
            questions about our sources or calculations, please contact us at
            support@juicefast.com.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
